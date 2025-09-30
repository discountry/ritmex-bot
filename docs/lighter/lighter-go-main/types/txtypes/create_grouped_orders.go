package txtypes

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

var _ TxInfo = (*L2CreateGroupedOrdersTxInfo)(nil)

// !!! Ensure that if primary order is reduce only, all child orders are also reduce only
// !!! Otherwise CancelPositionTiedAccountOrders flow breaks
type L2CreateGroupedOrdersTxInfo struct {
	AccountIndex int64
	ApiKeyIndex  uint8
	GroupingType uint8

	Orders []*OrderInfo

	ExpiredAt  int64
	Nonce      int64
	Sig        []byte
	SignedHash string `json:"-"`
}

func (txInfo *L2CreateGroupedOrdersTxInfo) GetTxType() uint8 {
	return TxTypeL2CreateGroupedOrders
}

func (txInfo *L2CreateGroupedOrdersTxInfo) GetTxInfo() (string, error) {
	return getTxInfo(txInfo)
}

func (txInfo *L2CreateGroupedOrdersTxInfo) GetTxHash() string {
	return txInfo.SignedHash
}

func (txInfo *L2CreateGroupedOrdersTxInfo) Validate() error {
	// AccountIndex
	if txInfo.AccountIndex < MinAccountIndex {
		return ErrAccountIndexTooLow
	}
	if txInfo.AccountIndex > MaxAccountIndex {
		return ErrAccountIndexTooHigh
	}
	// ApiKeyIndex
	if txInfo.ApiKeyIndex < MinApiKeyIndex {
		return ErrApiKeyIndexTooLow
	}
	if txInfo.ApiKeyIndex > MaxApiKeyIndex {
		return ErrApiKeyIndexTooHigh
	}

	if len(txInfo.Orders) == 0 || len(txInfo.Orders) > int(MaxGroupedOrderCount) {
		return ErrOrderGroupSizeInvalid
	}

	// MarketIndex for first order
	if txInfo.Orders[0].MarketIndex < MinMarketIndex {
		return ErrMarketIndexTooLow
	}
	if txInfo.Orders[0].MarketIndex > MaxMarketIndex {
		return ErrMarketIndexTooHigh
	}

	// Perform range checks for all orders
	for _, order := range txInfo.Orders {
		// MarketIndex
		if order.MarketIndex != txInfo.Orders[0].MarketIndex {
			return ErrMarketIndexMismatch
		}

		// ClientOrderIndex
		if order.ClientOrderIndex != NilClientOrderIndex {
			return ErrClientOrderIndexNotNil
		}

		// BaseAmount
		if order.ReduceOnly != 1 && order.BaseAmount == NilOrderBaseAmount {
			return ErrBaseAmountTooLow
		}
		if order.BaseAmount != NilOrderBaseAmount && order.BaseAmount < MinOrderBaseAmount {
			return ErrBaseAmountTooLow
		}
		if order.BaseAmount > MaxOrderBaseAmount {
			return ErrBaseAmountTooHigh
		}

		// Price
		if order.Price < MinOrderPrice {
			return ErrPriceTooLow
		}
		if order.Price > MaxOrderPrice {
			return ErrPriceTooHigh
		}

		// IsAsk
		if order.IsAsk != 0 && order.IsAsk != 1 {
			return ErrIsAskInvalid
		}

		// TimeInForce
		if order.TimeInForce != ImmediateOrCancel && order.TimeInForce != GoodTillTime && order.TimeInForce != PostOnly {
			return ErrOrderTimeInForceInvalid
		}

		// ReduceOnly
		if order.ReduceOnly != 0 && order.ReduceOnly != 1 {
			return ErrOrderReduceOnlyInvalid
		}

		// OrderExpiry
		if (order.OrderExpiry < MinOrderExpiry || order.OrderExpiry > MaxOrderExpiry) && order.OrderExpiry != NilOrderExpiry {
			return ErrOrderExpiryInvalid
		}

		// TriggerPrice
		if (order.TriggerPrice < MinOrderTriggerPrice || order.TriggerPrice > MaxOrderTriggerPrice) && order.TriggerPrice != NilOrderTriggerPrice {
			return ErrOrderTriggerPriceInvalid
		}
	}

	// Nonce
	if txInfo.Nonce < MinNonce {
		return ErrNonceTooLow
	}

	if txInfo.ExpiredAt < 0 || txInfo.ExpiredAt > MaxTimestamp {
		return ErrExpiredAtInvalid
	}

	switch txInfo.GroupingType {
	case GroupingType_OneCancelsTheOther:
		return txInfo.ValidateOCO()
	case GroupingType_OneTriggersTheOther:
		return txInfo.ValidateOTO()
	case GroupingType_OneTriggersAOneCancelsTheOther:
		return txInfo.ValidateOTOCO()
	default:
		return ErrGroupingTypeInvalid
	}
}

func (txInfo *L2CreateGroupedOrdersTxInfo) ValidateParentOrder(order *OrderInfo) error {
	switch order.Type {
	case MarketOrder:
		if order.TimeInForce != ImmediateOrCancel {
			return ErrOrderTimeInForceInvalid
		} else if order.OrderExpiry != NilOrderExpiry {
			return ErrOrderExpiryInvalid
		} else if order.TriggerPrice != NilOrderTriggerPrice {
			return ErrOrderTriggerPriceInvalid
		}
	case LimitOrder:
		if order.TriggerPrice != NilOrderTriggerPrice {
			return ErrOrderTriggerPriceInvalid
		} else if order.TimeInForce == ImmediateOrCancel && order.OrderExpiry != NilOrderExpiry {
			return ErrOrderExpiryInvalid
		} else if order.TimeInForce != ImmediateOrCancel && order.OrderExpiry == NilOrderExpiry {
			return ErrOrderExpiryInvalid
		}
	default:
		return ErrOrderTypeInvalid
	}
	return nil
}

func (txInfo *L2CreateGroupedOrdersTxInfo) ValidateChildOrder(order *OrderInfo) error {
	switch order.Type {
	case StopLossOrder, TakeProfitOrder:
		if order.TimeInForce != ImmediateOrCancel {
			return ErrOrderTimeInForceInvalid
		} else if order.TriggerPrice == NilOrderTriggerPrice {
			return ErrOrderTriggerPriceInvalid
		} else if order.OrderExpiry == NilOrderExpiry {
			return ErrOrderExpiryInvalid
		}
	case StopLossLimitOrder, TakeProfitLimitOrder:
		if order.TriggerPrice == NilOrderTriggerPrice {
			return ErrOrderTriggerPriceInvalid
		} else if order.OrderExpiry == NilOrderExpiry {
			return ErrOrderExpiryInvalid
		}
	default:
		return ErrOrderTypeInvalid
	}
	return nil
}

func (txInfo *L2CreateGroupedOrdersTxInfo) ValidateSiblingOrders(orders []*OrderInfo) error {
	if len(orders) != 2 {
		return ErrOrderGroupSizeInvalid
	}
	slFlag := false
	tpFlag := false
	for _, order := range orders {
		err := txInfo.ValidateChildOrder(order)
		if err != nil {
			return err
		}
		if order.Type == StopLossOrder || order.Type == StopLossLimitOrder {
			slFlag = true
		} else if order.Type == TakeProfitOrder || order.Type == TakeProfitLimitOrder {
			tpFlag = true
		}
	}
	if !slFlag || !tpFlag {
		return ErrOrderTypeInvalid
	}
	return nil
}

func (txInfo *L2CreateGroupedOrdersTxInfo) ValidateOCO() error {
	if len(txInfo.Orders) != 2 {
		return ErrOrderGroupSizeInvalid
	}

	// Ensure both orders base sizes are same
	if txInfo.Orders[0].BaseAmount != txInfo.Orders[1].BaseAmount {
		return ErrBaseAmountsNotEqual
	}

	// Orders should be in the same direction
	if txInfo.Orders[0].IsAsk != txInfo.Orders[1].IsAsk {
		return ErrIsAskInvalid
	}

	// Ensure both orders are reduce only
	if txInfo.Orders[0].ReduceOnly != 1 || txInfo.Orders[1].ReduceOnly != 1 {
		return ErrOrderReduceOnlyInvalid
	}

	// Ensure both orders have the same non-nil expiry
	if txInfo.Orders[0].OrderExpiry != txInfo.Orders[1].OrderExpiry {
		return ErrOrderExpiryInvalid
	}

	return txInfo.ValidateSiblingOrders(txInfo.Orders)
}

func (txInfo *L2CreateGroupedOrdersTxInfo) ValidateOTO() error {
	if len(txInfo.Orders) != 2 {
		return ErrOrderGroupSizeInvalid
	}

	// Ensure child order base size is 0
	if txInfo.Orders[1].BaseAmount != NilOrderBaseAmount {
		return ErrBaseAmountNotNil
	}

	// Orders should be in the opposite direction
	if txInfo.Orders[0].IsAsk == txInfo.Orders[1].IsAsk {
		return ErrIsAskInvalid
	}

	// Ensure if expiries are not nil, they are the same
	if txInfo.Orders[0].OrderExpiry != NilOrderExpiry &&
		txInfo.Orders[0].OrderExpiry != txInfo.Orders[1].OrderExpiry {
		return ErrOrderExpiryInvalid
	}

	err := txInfo.ValidateParentOrder(txInfo.Orders[0])
	if err != nil {
		return err
	}

	return txInfo.ValidateChildOrder(txInfo.Orders[1])
}

func (txInfo *L2CreateGroupedOrdersTxInfo) ValidateOTOCO() error {
	if len(txInfo.Orders) != 3 {
		return ErrOrderGroupSizeInvalid
	}

	// Ensure child orders base size is 0
	if txInfo.Orders[1].BaseAmount != NilOrderBaseAmount || txInfo.Orders[2].BaseAmount != NilOrderBaseAmount {
		return ErrBaseAmountNotNil
	}

	// Primary and child orders should be in the oppsite direction
	if txInfo.Orders[0].IsAsk == txInfo.Orders[1].IsAsk || txInfo.Orders[0].IsAsk == txInfo.Orders[2].IsAsk {
		return ErrIsAskInvalid
	}

	// Ensure child orders has the same expiry
	if txInfo.Orders[1].OrderExpiry != txInfo.Orders[2].OrderExpiry {
		return ErrOrderExpiryInvalid
	}

	// Ensure if expiries are not nil, they are the same
	if txInfo.Orders[0].OrderExpiry != NilOrderExpiry &&
		txInfo.Orders[0].OrderExpiry != txInfo.Orders[1].OrderExpiry {
		return ErrOrderExpiryInvalid
	}

	err := txInfo.ValidateParentOrder(txInfo.Orders[0])
	if err != nil {
		return err
	}
	return txInfo.ValidateSiblingOrders(txInfo.Orders[1:])
}

func (txInfo *L2CreateGroupedOrdersTxInfo) Hash(lighterChainId uint32, extra ...g.Element) (msgHash []byte, err error) {
	elems := make([]g.Element, 0, 11)
	elems = append(elems, g.FromUint32(lighterChainId))
	elems = append(elems, g.FromUint32(TxTypeL2CreateGroupedOrders))
	elems = append(elems, g.FromInt64(txInfo.Nonce))
	elems = append(elems, g.FromInt64(txInfo.ExpiredAt))

	elems = append(elems, g.FromInt64(txInfo.AccountIndex))
	elems = append(elems, g.FromUint32(uint32(txInfo.ApiKeyIndex)))
	elems = append(elems, g.FromUint32(uint32(txInfo.GroupingType)))

	aggregatedOrderHash := p2.EmptyHashOut()
	for index, order := range txInfo.Orders {
		orderHash := p2.HashNoPad([]g.Element{
			g.FromUint32(uint32(order.MarketIndex)),
			g.FromInt64(order.ClientOrderIndex),
			g.FromInt64(order.BaseAmount),
			g.FromUint32(order.Price),
			g.FromUint32(uint32(order.IsAsk)),
			g.FromUint32(uint32(order.Type)),
			g.FromUint32(uint32(order.TimeInForce)),
			g.FromUint32(uint32(order.ReduceOnly)),
			g.FromUint32(order.TriggerPrice),
			g.FromInt64(order.OrderExpiry),
		})
		if index == 0 {
			aggregatedOrderHash = orderHash
		} else {
			aggregatedOrderHash = p2.HashNToOne([]p2.HashOut{aggregatedOrderHash, orderHash})
		}
	}
	elems = append(elems, aggregatedOrderHash[:]...)

	return p2.HashToQuinticExtension(elems).ToLittleEndianBytes(), nil
}
