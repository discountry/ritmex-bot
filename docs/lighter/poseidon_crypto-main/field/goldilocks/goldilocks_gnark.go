package goldilocks

// Partially wraps and extends the functionality of the goldilocks field package.

import (
	"fmt"

	g "github.com/consensys/gnark-crypto/field/goldilocks"
)

type Element = g.Element

const Bytes = 8

func NewElement(value uint64) Element {
	return g.NewElement(value)
}

func reverseBytes(b []byte) []byte {
	res := make([]byte, len(b))
	for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
		res[i], res[j] = b[j], b[i]
	}
	return res
}

func ArrayFromCanonicalLittleEndianBytes(in []byte) ([]Element, error) {
	missing := 8 - len(in)%8
	if missing == 8 {
		missing = 0
	}

	ret := make([]Element, 0)
	for i := 0; i < len(in); {
		nextStart := i + 8

		if nextStart > len(in) {
			nextStart = len(in)
		}

		slice := make([]byte, 8)
		copy(slice[:], in[i:nextStart])
		if len(slice) < 8 {
			slice = append(slice, make([]byte, missing)...)
		}

		elem, err := FromCanonicalLittleEndianBytes(slice)
		if err != nil {
			return nil, fmt.Errorf("failed to convert bytes to field element. bytes: %v, error: %w", slice, err)
		}
		ret = append(ret, *elem)
		i = nextStart
	}
	return ret, nil
}

func ToLittleEndianBytes(e ...Element) []byte {
	res := make([]byte, 0)
	for _, elem := range e {
		bytes := elem.Bytes()
		res = append(res, reverseBytes(bytes[:])...)
	}
	return res
}

func FromCanonicalLittleEndianBytes(in []byte) (*Element, error) {
	elem := g.NewElement(0)
	err := elem.SetBytesCanonical(reverseBytes(in))
	if err != nil {
		return nil, fmt.Errorf("failed to convert bytes to field element: %w", err)
	}
	return &elem, nil
}

func ArrayToLittleEndianBytes(e []Element) []byte {
	res := make([]byte, 0)
	for _, elem := range e {
		res = append(res, ToLittleEndianBytes(elem)...)
	}
	return res
}

func ToString(e ...Element) string {
	res := ""
	for _, elem := range e {
		res += elem.String() + " "
	}
	return res
}

func FromBool(value bool) Element {
	if value {
		return One()
	}
	return Zero()
}

func FromInt64Abs(value int64) Element {
	return FromUint64(uint64(value & 0x7FFFFFFFFFFFFFFF))
}

func FromInt64(value int64) Element {
	elem := g.NewElement(0)
	elem.SetInt64(value)
	return elem
}

func FromUint64(value uint64) Element {
	elem := g.NewElement(0)
	elem.SetUint64(value)
	return elem
}

func FromUint32(value uint32) Element {
	return FromUint64(uint64(value))
}

func Equals(a, b *Element) bool {
	return a.Equal(b)
}

func Modulus() uint64 {
	return g.Modulus().Uint64()
}

func Zero() Element {
	return g.NewElement(0)
}

func One() Element {
	return g.NewElement(1)
}

func Neg(e Element) Element {
	res := g.NewElement(0)
	res.Neg(&e)
	return res
}

func NegOne() *Element {
	res := Neg(One())
	return &res
}

func Sample() Element {
	elem := g.NewElement(0)
	elem.SetRandom()
	return elem
}

func RandArray(count int) []Element {
	ret := make([]Element, count)
	for i := 0; i < count; i++ {
		ret[i] = Sample()
	}
	return ret
}

func Add(elems ...Element) Element {
	res := g.NewElement(0)
	for _, elem := range elems {
		res.Add(&res, &elem)
	}
	return res
}

func Sub(a, b *Element) Element {
	res := g.NewElement(0)
	res.Sub(a, b)
	return res
}

func Mul(elems ...*Element) Element {
	res := g.NewElement(1)
	for _, elem := range elems {
		res.Mul(&res, elem)
	}
	return res
}

func Sqrt(elem *Element) *Element {
	elemCopy := DeepCopy(elem)
	return elemCopy.Sqrt(&elemCopy)
}

// Powers starting from 1
func Powers(e *Element, count int) []Element {
	ret := make([]Element, count)
	ret[0] = g.One()
	for i := 1; i < int(count); i++ {
		ret[i].Mul(&ret[i-1], e)
	}
	return ret
}

func DeepCopy(source *Element) Element {
	return Element{source[0]}
}
