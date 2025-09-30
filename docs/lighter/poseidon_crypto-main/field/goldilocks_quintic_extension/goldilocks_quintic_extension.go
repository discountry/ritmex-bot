package goldilocks_quintic_extension

import (
	"fmt"
	"math/big"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
)

type Element [5]g.Element

type NumericalElement [5]uint64

const Bytes = g.Bytes * 5

var (
	FP5_D = 5

	FP5_ZERO = Element{g.Zero(), g.Zero(), g.Zero(), g.Zero(), g.Zero()}
	FP5_ONE  = Element{g.One(), g.Zero(), g.Zero(), g.Zero(), g.Zero()}
	FP5_TWO  = FromF(g.FromUint64(2))

	FP5_W        = g.FromUint64(3)
	FP5_DTH_ROOT = g.FromUint64(1041288259238279555)
)

func (e *Element) ToString() string {
	return fmt.Sprintf("%d,%d,%d,%d,%d", e[0].Uint64(), e[1].Uint64(), e[2].Uint64(), e[3].Uint64(), e[4].Uint64())
}

func (e Element) ToUint64Array() [5]uint64 {
	return [5]uint64{e[0].Uint64(), e[1].Uint64(), e[2].Uint64(), e[3].Uint64(), e[4].Uint64()}
}

func gFp5FromUint64Array(arr [5]uint64) Element {
	return Element{g.FromUint64(arr[0]), g.FromUint64(arr[1]), g.FromUint64(arr[2]), g.FromUint64(arr[3]), g.FromUint64(arr[4])}
}

func (e Element) ToBasefieldArray() [5]g.Element {
	return [5]g.Element{e[0], e[1], e[2], e[3], e[4]}
}

func gFp5FromBasefieldArray(arr [5]g.Element) Element {
	return Element{arr[0], arr[1], arr[2], arr[3], arr[4]}
}

func (e Element) ToLittleEndianBytes() []byte {
	elemBytes := [Bytes]byte{}
	for i, limb := range e {
		copy(elemBytes[i*g.Bytes:], g.ToLittleEndianBytes(limb))
	}
	return elemBytes[:]
}

func FromCanonicalLittleEndianBytes(in []byte) (Element, error) {
	if len(in) != Bytes {
		return Element{}, fmt.Errorf("input bytes len should be 40 but is %d", len(in))
	}

	elemBytesLittleEndian := [5][]byte{
		{in[0], in[1], in[2], in[3], in[4], in[5], in[6], in[7]},
		{in[8], in[9], in[10], in[11], in[12], in[13], in[14], in[15]},
		{in[16], in[17], in[18], in[19], in[20], in[21], in[22], in[23]},
		{in[24], in[25], in[26], in[27], in[28], in[29], in[30], in[31]},
		{in[32], in[33], in[34], in[35], in[36], in[37], in[38], in[39]},
	}

	e1, err := g.FromCanonicalLittleEndianBytes(elemBytesLittleEndian[0])
	if err != nil {
		return Element{}, fmt.Errorf("failed to convert bytes to field element: %w", err)
	}
	e2, err := g.FromCanonicalLittleEndianBytes(elemBytesLittleEndian[1])
	if err != nil {
		return Element{}, fmt.Errorf("failed to convert bytes to field element: %w", err)
	}
	e3, err := g.FromCanonicalLittleEndianBytes(elemBytesLittleEndian[2])
	if err != nil {
		return Element{}, fmt.Errorf("failed to convert bytes to field element: %w", err)
	}
	e4, err := g.FromCanonicalLittleEndianBytes(elemBytesLittleEndian[3])
	if err != nil {
		return Element{}, fmt.Errorf("failed to convert bytes to field element: %w", err)
	}
	e5, err := g.FromCanonicalLittleEndianBytes(elemBytesLittleEndian[4])
	if err != nil {
		return Element{}, fmt.Errorf("failed to convert bytes to field element: %w", err)
	}

	return Element{*e1, *e2, *e3, *e4, *e5}, nil
}

func Sample() Element {
	arr := g.RandArray(5)
	return Element{arr[0], arr[1], arr[2], arr[3], arr[4]}
}

func Equals(a, b Element) bool {
	return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3] && a[4] == b[4]
}

func IsZero(e Element) bool {
	return e[0].IsZero() && e[1].IsZero() && e[2].IsZero() && e[3].IsZero() && e[4].IsZero()
}

func FromF(elem g.Element) Element {
	return Element{elem, g.Zero(), g.Zero(), g.Zero(), g.Zero()}
}

func FromUint64(a uint64) Element {
	return Element{g.FromUint64(a), g.Zero(), g.Zero(), g.Zero(), g.Zero()}
}

func FromUint64Array(elems [5]uint64) Element {
	return Element{
		g.FromUint64(elems[0]),
		g.FromUint64(elems[1]),
		g.FromUint64(elems[2]),
		g.FromUint64(elems[3]),
		g.FromUint64(elems[4]),
	}
}

func Neg(e Element) Element {
	return Element{g.Neg(e[0]), g.Neg(e[1]), g.Neg(e[2]), g.Neg(e[3]), g.Neg(e[4])}
}

func Add(a, b Element) Element {
	return Element{
		g.Add(a[0], b[0]),
		g.Add(a[1], b[1]),
		g.Add(a[2], b[2]),
		g.Add(a[3], b[3]),
		g.Add(a[4], b[4]),
	}
}

func Sub(a, b Element) Element {
	return Element{
		g.Sub(&a[0], &b[0]),
		g.Sub(&a[1], &b[1]),
		g.Sub(&a[2], &b[2]),
		g.Sub(&a[3], &b[3]),
		g.Sub(&a[4], &b[4]),
	}
}

func Mul(a, b Element) Element {
	w := FP5_W

	a0b0 := g.Mul(&a[0], &b[0])
	a1b4 := g.Mul(&a[1], &b[4])
	a2b3 := g.Mul(&a[2], &b[3])
	a3b2 := g.Mul(&a[3], &b[2])
	a4b1 := g.Mul(&a[4], &b[1])
	added := g.Add(a1b4, a2b3, a3b2, a4b1)
	muld := g.Mul(&w, &added)
	c0 := g.Add(a0b0, muld)

	a0b1 := g.Mul(&a[0], &b[1])
	a1b0 := g.Mul(&a[1], &b[0])
	a2b4 := g.Mul(&a[2], &b[4])
	a3b3 := g.Mul(&a[3], &b[3])
	a4b2 := g.Mul(&a[4], &b[2])
	added = g.Add(a2b4, a3b3, a4b2)
	muld = g.Mul(&w, &added)
	c1 := g.Add(a0b1, a1b0, muld)

	a0b2 := g.Mul(&a[0], &b[2])
	a1b1 := g.Mul(&a[1], &b[1])
	a2b0 := g.Mul(&a[2], &b[0])
	a3b4 := g.Mul(&a[3], &b[4])
	a4b3 := g.Mul(&a[4], &b[3])
	added = g.Add(a3b4, a4b3)
	muld = g.Mul(&w, &added)
	c2 := g.Add(a0b2, a1b1, a2b0, muld)

	a0b3 := g.Mul(&a[0], &b[3])
	a1b2 := g.Mul(&a[1], &b[2])
	a2b1 := g.Mul(&a[2], &b[1])
	a3b0 := g.Mul(&a[3], &b[0])
	a4b4 := g.Mul(&a[4], &b[4])
	muld = g.Mul(&w, &a4b4)
	c3 := g.Add(a0b3, a1b2, a2b1, a3b0, muld)

	a0b4 := g.Mul(&a[0], &b[4])
	a1b3 := g.Mul(&a[1], &b[3])
	a2b2 := g.Mul(&a[2], &b[2])
	a3b1 := g.Mul(&a[3], &b[1])
	a4b0 := g.Mul(&a[4], &b[0])
	c4 := g.Add(a0b4, a1b3, a2b2, a3b1, a4b0)

	return Element{c0, c1, c2, c3, c4}
}

func Div(a, b Element) Element {
	bInv := InverseOrZero(b)
	if IsZero(bInv) {
		panic("division by zero")
	}
	return Mul(a, bInv)
}

func ExpPowerOf2(x Element, power int) Element {
	res := Element{x[0], x[1], x[2], x[3], x[4]}
	for i := 0; i < power; i++ {
		res = Square(res)
	}
	return res
}

func Square(a Element) Element {
	w := FP5_W
	double_w := g.Add(w, w)

	a0s := g.Mul(&a[0], &a[0])
	a1a4 := g.Mul(&a[1], &a[4])
	a2a3 := g.Mul(&a[2], &a[3])
	added := g.Add(a1a4, a2a3)
	muld := g.Mul(&double_w, &added)
	c0 := g.Add(a0s, muld)

	a0Double := g.Add(a[0], a[0])
	a0Doublea1 := g.Mul(&a0Double, &a[1])
	a2a4DoubleW := g.Mul(&a[2], &a[4], &double_w)
	a3a3w := g.Mul(&a[3], &a[3], &w)
	c1 := g.Add(a0Doublea1, a2a4DoubleW, a3a3w)

	a0Doublea2 := g.Mul(&a0Double, &a[2])
	a1Square := g.Mul(&a[1], &a[1])
	a4a3DoubleW := g.Mul(&a[4], &a[3], &double_w)
	c2 := g.Add(a0Doublea2, a1Square, a4a3DoubleW)

	a1Double := g.Add(a[1], a[1])
	a0Doublea3 := g.Mul(&a0Double, &a[3])
	a1Doublea2 := g.Mul(&a1Double, &a[2])
	a4SquareW := g.Mul(&a[4], &a[4], &w)
	c3 := g.Add(a0Doublea3, a1Doublea2, a4SquareW)

	a0Doublea4 := g.Mul(&a0Double, &a[4])
	a1Doublea3 := g.Mul(&a1Double, &a[3])
	a2Square := g.Mul(&a[2], &a[2])
	c4 := g.Add(a0Doublea4, a1Doublea3, a2Square)

	return Element{c0, c1, c2, c3, c4}
}

func Triple(a Element) Element {
	three := g.FromUint64(3)
	return Element{
		g.Mul(&a[0], &three),
		g.Mul(&a[1], &three),
		g.Mul(&a[2], &three),
		g.Mul(&a[3], &three),
		g.Mul(&a[4], &three),
	}
}

func Sqrt(x Element) (Element, bool) {
	v := ExpPowerOf2(x, 31)
	d := Mul(Mul(x, ExpPowerOf2(v, 32)), InverseOrZero(v))
	e := Frobenius(Mul(d, RepeatedFrobenius(d, 2)))
	_f := Square(e)

	x1f4 := g.Mul(&x[1], &_f[4])
	x2f3 := g.Mul(&x[2], &_f[3])
	x3f2 := g.Mul(&x[3], &_f[2])
	x4f1 := g.Mul(&x[4], &_f[1])
	added := g.Add(x1f4, x2f3, x3f2, x4f1)
	three := g.FromUint64(3)
	muld := g.Mul(&three, &added)
	x0f0 := g.Mul(&x[0], &_f[0])
	_g := g.Add(x0f0, muld)
	s := g.Sqrt(&_g)
	if s == nil {
		return Element{}, false
	}

	eInv := InverseOrZero(e)
	sFp5 := FromF(*s)

	return Mul(sFp5, eInv), true
}

func Sgn0(x Element) bool {
	sign := false
	zero := true
	for _, limb := range x {
		sign_i := (limb.Uint64() & 1) == 0
		zero_i := limb.IsZero()
		sign = sign || (zero && sign_i)
		zero = zero && zero_i
	}
	return sign
}

func CanonicalSqrt(x Element) (Element, bool) {
	sqrtX, exists := Sqrt(x)
	if !exists {
		return Element{}, false
	}

	if Sgn0(sqrtX) {
		return Neg(sqrtX), true
	}
	return sqrtX, true
}

func ScalarMul(a Element, scalar g.Element) Element {
	return Element{
		g.Mul(&a[0], &scalar),
		g.Mul(&a[1], &scalar),
		g.Mul(&a[2], &scalar),
		g.Mul(&a[3], &scalar),
		g.Mul(&a[4], &scalar),
	}
}

func Double(a Element) Element {
	return Add(a, a)
}

func InverseOrZero(a Element) Element {
	if IsZero(a) {
		return FP5_ZERO
	}

	d := Frobenius(a)
	e := Mul(d, Frobenius(d))
	f := Mul(e, RepeatedFrobenius(e, 2))

	a0b0 := g.Mul(&a[0], &f[0])
	a1b4 := g.Mul(&a[1], &f[4])
	a2b3 := g.Mul(&a[2], &f[3])
	a3b2 := g.Mul(&a[3], &f[2])
	a4b1 := g.Mul(&a[4], &f[1])
	added := g.Add(a1b4, a2b3, a3b2, a4b1)
	muld := g.Mul(&FP5_W, &added)
	g := g.Add(a0b0, muld)

	return ScalarMul(f, *g.Inverse(&g))
}

func Frobenius(x Element) Element {
	return RepeatedFrobenius(x, 1)
}

func RepeatedFrobenius(x Element, count int) Element {
	if count == 0 {
		return x
	} else if count >= FP5_D {
		return RepeatedFrobenius(x, count%FP5_D)
	}

	z0 := FP5_DTH_ROOT
	for i := 1; i < count; i++ {
		z0 = g.Mul(&FP5_DTH_ROOT, &z0)
	}

	res := Element{}
	for i, z := range g.Powers(&z0, FP5_D) {
		res[i] = g.Mul(&x[i], &z)
	}
	return res
}

func Legendre(x Element) g.Element {
	frob1 := Frobenius(x)
	frob2 := Frobenius(frob1)

	frob1TimesFrob2 := Mul(frob1, frob2)
	frob2Frob1TimesFrob2 := RepeatedFrobenius(frob1TimesFrob2, 2)

	xrExt := Mul(Mul(x, frob1TimesFrob2), frob2Frob1TimesFrob2)
	xr := g.FromUint64(xrExt[0].Uint64())

	xr31 := xr.Exp(xr, new(big.Int).SetUint64(1<<31))
	xr31InvOrZero := g.FromUint64(0)
	xr31InvOrZero = *xr31InvOrZero.Inverse(xr31)

	xr63 := xr31.Exp(*xr31, new(big.Int).SetUint64(1<<32))

	return g.Mul(xr63, &xr31InvOrZero)
}

func FromPlonky2GoldilocksField(f []g.GoldilocksField) Element {
	return Element{
		g.NewElement(uint64(f[0])),
		g.NewElement(uint64(f[1])),
		g.NewElement(uint64(f[2])),
		g.NewElement(uint64(f[3])),
		g.NewElement(uint64(f[4])),
	}
}
