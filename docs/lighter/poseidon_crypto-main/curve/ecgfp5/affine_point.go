package ecgfp5

import (
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
)

// A curve point in affine (x,u) coordinates. This is used internally
// to make "windows" that speed up point multiplications.
type AffinePoint struct {
	x, u gFp5.Element
}

var AFFINE_NEUTRAL = AffinePoint{
	x: gFp5.FP5_ZERO,
	u: gFp5.FP5_ZERO,
}

func (p AffinePoint) ToPoint() ECgFp5Point {
	return ECgFp5Point{
		x: p.x,
		z: gFp5.FP5_ONE,
		u: p.u,
		t: gFp5.FP5_ONE,
	}
}

func (p *AffinePoint) SetNeg() {
	p.u = gFp5.Neg(p.u)
}

// Lookup a point in a window. The win[] slice must contain values
// i*P for i = 1 to n (win[0] contains P, win[1] contains 2*P, and
// so on). Index value k is an integer in the -n to n range; returned
// point is k*P.
func (p *AffinePoint) SetLookup(win []AffinePoint, k int32) {
	// sign = 0xFFFFFFFF if k < 0, 0x00000000 otherwise
	sign := uint32(k >> 31)
	// ka = abs(k)
	ka := (uint32(k) ^ sign) - sign
	// km1 = ka - 1
	km1 := ka - 1

	x := gFp5.FP5_ZERO
	u := gFp5.FP5_ZERO
	for i := 0; i < len(win); i++ {
		m := km1 - uint32(i)
		c_1 := (m | (^m + 1)) >> 31
		c := uint64(c_1) - 1
		if c != 0 {
			x = win[i].x
			u = win[i].u
		}

	}

	// If k < 0, then we must negate the point.
	c := uint64(sign) | (uint64(sign) << 32)
	p.x = x
	p.u = u

	if c != 0 {
		p.u = gFp5.Neg(p.u)
	}
}

func Lookup(win []AffinePoint, k int32) AffinePoint {
	r := AFFINE_NEUTRAL
	r.SetLookup(win, k)
	return r
}

// Same as lookup(), except this implementation is variable-time.
func LookupVarTime(win []AffinePoint, k int32) AffinePoint {
	if k == 0 {
		return AFFINE_NEUTRAL
	} else if k > 0 {
		return win[k-1]
	} else {
		res := win[-k-1]
		res.SetNeg()
		return res
	}
}
