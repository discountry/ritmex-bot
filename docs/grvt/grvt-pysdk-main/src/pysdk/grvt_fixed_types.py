from dataclasses import dataclass

from .grvt_raw_types import Signature, TransferType


@dataclass
class Transfer:
    # The account to transfer from
    from_account_id: str
    # The subaccount to transfer from (0 if transferring from main account)
    from_sub_account_id: str
    # The account to deposit into
    to_account_id: str
    # The subaccount to transfer to (0 if transferring to main account)
    to_sub_account_id: str
    # The token currency to transfer
    currency: str
    # The number of tokens to transfer
    num_tokens: str
    # The signature of the transfer
    signature: Signature
    # The type of transfer
    transfer_type: TransferType
    # The metadata of the transfer
    transfer_metadata: str
