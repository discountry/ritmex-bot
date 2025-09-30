package ecgfp5

import (
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
)

// A curve point in short Weirstrass form (x, y). This is used by the in-circuit representation
type WeierstrassPoint struct {
	X     gFp5.Element
	Y     gFp5.Element
	IsInf bool
}

var (
	GENERATOR_WEIERSTRASS = WeierstrassPoint{
		X: gFp5.Element{
			g.FromUint64(11712523173042564207),
			g.FromUint64(14090224426659529053),
			g.FromUint64(13197813503519687414),
			g.FromUint64(16280770174934269299),
			g.FromUint64(15998333998318935536),
		},
		Y: gFp5.Element{
			g.FromUint64(14639054205878357578),
			g.FromUint64(17426078571020221072),
			g.FromUint64(2548978194165003307),
			g.FromUint64(8663895577921260088),
			g.FromUint64(9793640284382595140),
		},
		IsInf: false,
	}

	A_WEIERSTRASS = gFp5.Element{
		g.FromUint64(6148914689804861439),
		g.FromUint64(263),
		g.FromUint64(0),
		g.FromUint64(0),
		g.FromUint64(0),
	}

	NEUTRAL_WEIERSTRASS = WeierstrassPoint{
		X:     gFp5.FP5_ZERO,
		Y:     gFp5.FP5_ZERO,
		IsInf: true,
	}
)

func (p WeierstrassPoint) Equals(q WeierstrassPoint) bool {
	if p.IsInf && q.IsInf {
		return true
	}
	return gFp5.Equals(p.X, q.X) && gFp5.Equals(p.Y, q.Y)
}

func (p WeierstrassPoint) Encode() gFp5.Element {
	return gFp5.Div(p.Y, gFp5.Sub(gFp5.Div(A_ECgFp5Point, gFp5.FromUint64(3)), p.X))
}

func DecodeFp5AsWeierstrass(w gFp5.Element) (WeierstrassPoint, bool) {
	e := gFp5.Sub(gFp5.Square(w), A_ECgFp5Point)
	delta := gFp5.Sub(gFp5.Square(e), B_MUL4_ECgFp5Point)
	r, success := gFp5.CanonicalSqrt(delta)
	if !success {
		r = gFp5.FP5_ZERO
	}

	x1 := gFp5.Div(gFp5.Add(e, r), gFp5.FP5_TWO)
	x2 := gFp5.Div(gFp5.Sub(e, r), gFp5.FP5_TWO)

	x := x1
	x1Legendre := gFp5.Legendre(x1)
	if !x1Legendre.IsOne() {
		x = x2
	}

	y := gFp5.Neg(gFp5.Mul(w, x))
	if success {
		x = gFp5.Add(x, gFp5.Div(A_ECgFp5Point, gFp5.FromUint64(3)))
	} else {
		x = gFp5.FP5_ZERO
	}

	isInf := !success

	// If w == 0 then this is in fact a success.
	if success || gFp5.IsZero(w) {
		return WeierstrassPoint{X: x, Y: y, IsInf: isInf}, true
	}
	return WeierstrassPoint{}, false
}

func (p WeierstrassPoint) Add(q WeierstrassPoint) WeierstrassPoint {
	if p.IsInf {
		return q
	}
	if q.IsInf {
		return p
	}

	x1, y1 := p.X, p.Y
	x2, y2 := q.X, q.Y

	// note: paper has a typo. sx == 1 when x1 != x2, not when x1 == x2
	xSame := gFp5.Equals(x1, x2)
	yDiff := !gFp5.Equals(y1, y2)

	var lambda0, lambda1 gFp5.Element
	if xSame {
		lambda0 = gFp5.Add(gFp5.Triple(gFp5.Square(x1)), A_WEIERSTRASS)
		lambda1 = gFp5.Double(y1)
	} else {
		lambda0 = gFp5.Sub(y2, y1)
		lambda1 = gFp5.Sub(x2, x1)
	}
	lambda := gFp5.Div(lambda0, lambda1)

	x3 := gFp5.Sub(gFp5.Sub(gFp5.Square(lambda), x1), x2)
	y3 := gFp5.Sub(gFp5.Mul(lambda, gFp5.Sub(x1, x3)), y1)

	return WeierstrassPoint{X: x3, Y: y3, IsInf: xSame && yDiff}
}

func (p WeierstrassPoint) Double() WeierstrassPoint {
	x := p.X
	y := p.Y
	is_inf := p.IsInf

	if is_inf {
		return p
	}

	lambda0 := gFp5.Square(x)
	lambda0 = gFp5.Triple(lambda0)
	lambda0 = gFp5.Add(lambda0, A_WEIERSTRASS)

	lambda1 := gFp5.Double(y)

	lambda := gFp5.Div(lambda0, lambda1)

	x2 := gFp5.Square(lambda)
	two_x := gFp5.Double(x)
	x2 = gFp5.Sub(x2, two_x)

	y2 := gFp5.Sub(x, x2)
	y2 = gFp5.Mul(lambda, y2)
	y2 = gFp5.Sub(y2, y)

	return WeierstrassPoint{X: x2, Y: y2, IsInf: is_inf}
}

func (p WeierstrassPoint) PrecomputeWindow(windowBits uint32) []WeierstrassPoint {
	if windowBits < 2 {
		panic("windowBits in PrecomputeWindow for WeierstrassPoint must be at least 2")
	}
	multiples := []WeierstrassPoint{NEUTRAL_WEIERSTRASS, p, p.Double()}
	for i := 3; i < 1<<windowBits; i++ {
		multiples = append(multiples, p.Add(multiples[len(multiples)-1]))
	}
	return multiples
}

func MulAdd2(a, b WeierstrassPoint, scalarA, scalarB ECgFp5Scalar) WeierstrassPoint {
	aWindow := a.PrecomputeWindow(4)
	aFourBitLimbs := scalarA.SplitTo4BitLimbs()

	bWindow := b.PrecomputeWindow(4)
	bFourBitLimbs := scalarB.SplitTo4BitLimbs()

	numLimbs := len(aFourBitLimbs)

	res := aWindow[aFourBitLimbs[numLimbs-1]].Add(bWindow[bFourBitLimbs[numLimbs-1]])
	for i := numLimbs - 2; i >= 0; i-- {
		for j := 0; j < 4; j++ {
			res = res.Double()
		}
		res = res.Add(aWindow[aFourBitLimbs[i]].Add(bWindow[bFourBitLimbs[i]]))
	}
	return res
}
