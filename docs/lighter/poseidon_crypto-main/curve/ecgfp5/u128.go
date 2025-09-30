package ecgfp5

import (
	"math/bits"
)

type U128 struct{ Hi, Lo uint64 }

func U128From64(v uint64) U128 { return U128{Lo: v} }

func (u U128) Add64(n uint64) (v U128) {
	var carry uint64
	v.Lo, carry = bits.Add64(u.Lo, n, 0)
	v.Hi = u.Hi + carry
	return v
}

func (u U128) Sub64(n uint64) (v U128) {
	var borrowed uint64
	v.Lo, borrowed = bits.Sub64(u.Lo, n, 0)
	v.Hi = u.Hi - borrowed
	return v
}

func (u U128) Mul64(n uint64) (dest U128) {
	dest.Hi, dest.Lo = bits.Mul64(u.Lo, n)
	dest.Hi += u.Hi * n
	return dest
}
