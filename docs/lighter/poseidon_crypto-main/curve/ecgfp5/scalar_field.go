package ecgfp5

import (
	cryptorand "crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"math/big"
	"math/rand"

	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
)

// ECgFp5Scalar represents the scalar field of the ECgFP5 elliptic curve where
// p = 1067993516717146951041484916571792702745057740581727230159139685185762082554198619328292418486241
type ECgFp5Scalar [5]uint64

func (s *ECgFp5Scalar) DeepCopy() ECgFp5Scalar {
	return ECgFp5Scalar{s[0], s[1], s[2], s[3], s[4]}
}

func (s ECgFp5Scalar) ToLittleEndianBytes() []byte {
	var result [40]byte
	for i := 0; i < 5; i++ {
		binary.LittleEndian.PutUint64(result[i*8:], s[i])
	}
	return result[:]
}

func ScalarElementFromLittleEndianBytes(data []byte) ECgFp5Scalar {
	if len(data) != 40 {
		panic("invalid length")
	}

	var value ECgFp5Scalar
	for i := 0; i < 5; i++ {
		value[i] = binary.LittleEndian.Uint64(data[i*8:])
	}
	return value
}

func (s ECgFp5Scalar) SplitTo4BitLimbs() [80]uint8 {
	limbs := s[:]
	var result [80]uint8
	for i := 0; i < 5; i++ {
		for j := 0; j < 16; j++ {
			result[i*16+j] = uint8((limbs[i] >> uint(j*4)) & 0xF)
		}
	}
	return result
}

func SampleScalarCrypto() ECgFp5Scalar {
	rng, err := cryptorand.Int(cryptorand.Reader, ORDER)
	if err != nil {
		panic("failed to read random bytes into buffer")
	}
	return FromNonCanonicalBigInt(rng)
}

func SampleScalar(seed *string) ECgFp5Scalar {
	var rng *rand.Rand
	if seed == nil {
		return SampleScalarCrypto()
	}

	hash := sha256.Sum256([]byte(*seed))
	var intSeed int64
	for _, b := range hash[:8] {
		intSeed = (intSeed << 8) | int64(b)
	}
	rng = rand.New(rand.NewSource(intSeed))

	return FromNonCanonicalBigInt(new(big.Int).Rand(rng, ORDER))
}

var (
	ORDER, _ = new(big.Int).SetString("1067993516717146951041484916571792702745057740581727230159139685185762082554198619328292418486241", 10)
	ZERO     = ECgFp5Scalar{}
	ONE      = ECgFp5Scalar{1, 0, 0, 0, 0}
	TWO      = ECgFp5Scalar{2, 0, 0, 0, 0}
	NEG_ONE  = ECgFp5Scalar{
		0xE80FD996948BFFE0,
		0xE8885C39D724A09C,
		0x7FFFFFE6CFB80639,
		0x7FFFFFF100000016,
		0x7FFFFFFD80000007,
	}
)

func (s ECgFp5Scalar) Order() *big.Int {
	return ORDER
}

var (
	// Group order n is slightly below 2^319. We store values over five
	// 64-bit limbs. We use Montgomery multiplication to perform
	// computations; however, we keep the limbs in normal
	// (non-Montgomery) representation, so that operations that do not
	// require any multiplication of scalars, just encoding and
	// decoding, are fastest.

	// The modulus itself, stored in a Scalar structure (which
	// contravenes to the rules of a Scalar; this constant MUST NOT leak
	// outside the API).
	N = ECgFp5Scalar{
		0xE80FD996948BFFE1,
		0xE8885C39D724A09C,
		0x7FFFFFE6CFB80639,
		0x7FFFFFF100000016,
		0x7FFFFFFD80000007,
	}
	// -1/N[0] mod 2^64
	N0I = uint64(0xD78BEF72057B7BDF)
	// 2^640 mod n
	R2 = ECgFp5Scalar{
		0xA01001DCE33DC739,
		0x6C3228D33F62ACCF,
		0xD1D796CC91CF8525,
		0xAADFFF5D1574C1D8,
		0x4ACA13B28CA251F5,
	}
	// 2^632 mod n
	T632 = ECgFp5Scalar{
		0x2B0266F317CA91B3,
		0xEC1D26528E984773,
		0x8651D7865E12DB94,
		0xDA2ADFF5941574D0,
		0x53CACA12110CA256,
	}
)

func (s *ECgFp5Scalar) IsZero() bool {
	for i := 0; i < 5; i++ {
		if s[i] != 0 {
			return false
		}
	}
	return true
}

func (s *ECgFp5Scalar) Equals(rhs *ECgFp5Scalar) bool {
	for i := 0; i < 5; i++ {
		if s[i] != rhs[i] {
			return false
		}
	}
	return true
}

// raw addition (no reduction)
func (s ECgFp5Scalar) AddInner(a ECgFp5Scalar) ECgFp5Scalar {
	var r ECgFp5Scalar
	var c uint64 = 0
	for i := 0; i < 5; i++ {
		z := U128From64(s[i]).Add64(a[i]).Add64(c)

		r[i] = z.Lo
		c = z.Hi
	}
	return r
}

// raw subtraction (no reduction)
// Final borrow is returned (0xFFFFFFFFFFFFFFFF if borrow, 0 otherwise).
func (s *ECgFp5Scalar) SubInner(a *ECgFp5Scalar) (*ECgFp5Scalar, uint64) {
	r := new(ECgFp5Scalar)
	c := uint64(0)

	for i := 0; i < 5; i++ {
		z := U128From64(s[i]).Sub64(a[i]).Sub64(c)
		r[i] = z.Lo
		c = z.Hi & 1
	}

	if c != 0 {
		return r, 0xFFFFFFFFFFFFFFFF
	}
	return r, 0
}

// If c == 0, return a0.
// If c == 0xFFFFFFFFFFFFFFFF, return a1.
// c MUST be equal to 0 or 0xFFFFFFFFFFFFFFFF.
func Select(c uint64, a0, a1 *ECgFp5Scalar) *ECgFp5Scalar {
	return &ECgFp5Scalar{
		a0[0] ^ (c & (a0[0] ^ a1[0])),
		a0[1] ^ (c & (a0[1] ^ a1[1])),
		a0[2] ^ (c & (a0[2] ^ a1[2])),
		a0[3] ^ (c & (a0[3] ^ a1[3])),
		a0[4] ^ (c & (a0[4] ^ a1[4])),
	}
}

func (s ECgFp5Scalar) Add(rhs ECgFp5Scalar) ECgFp5Scalar {
	r0 := s.AddInner(rhs)
	r1, c := r0.SubInner(&N)
	return *Select(c, r1, &r0)
}

func (s ECgFp5Scalar) Sub(rhs ECgFp5Scalar) ECgFp5Scalar {
	r0, c := s.SubInner(&rhs)
	r1 := r0.AddInner(N)
	return *Select(c, r0, &r1)
}

func (s ECgFp5Scalar) Neg() ECgFp5Scalar {
	return ZERO.Sub(s)
}

func (s *ECgFp5Scalar) Mul(rhs *ECgFp5Scalar) *ECgFp5Scalar {
	res := s.MontyMul(&R2).MontyMul(rhs)
	return res
}

func (s *ECgFp5Scalar) Square() *ECgFp5Scalar {
	return s.Mul(s)
}

// Montgomery multiplication.
// Returns (self*rhs)/2^320 mod n.
// 'self' MUST be less than n (the other operand can be up to 2^320-1).
func (s *ECgFp5Scalar) MontyMul(rhs *ECgFp5Scalar) *ECgFp5Scalar {
	r := new(ECgFp5Scalar)
	for i := 0; i < 5; i++ {
		// Iteration i computes r <- (r + self*rhs_i + f*n)/2^64.
		// Factor f is at most 2^64-1 and set so that the division
		// is exact.
		// On input:
		//    r <= 2^320 - 1
		//    self <= n - 1
		//    rhs_i <= 2^64 - 1
		//    f <= 2^64 - 1
		// Therefore:
		//    r + self*rhs_i + f*n <= 2^320-1 + (2^64 - 1) * (n - 1)
		//                            + (2^64 - 1) * n
		//                         < 2^384
		// Thus, the new r fits on 320 bits.
		m := rhs[i]
		f := (s[0]*m + r[0]) * N0I

		cc1, cc2 := uint64(0), uint64(0)
		for j := 0; j < 5; j++ {
			z := U128From64(s[j]).Mul64(m).Add64(r[j]).Add64(cc1)
			cc1 = z.Hi
			z = U128From64(f).Mul64(N[j]).Add64(z.Lo).Add64(cc2)
			cc2 = z.Hi
			if j > 0 {
				r[j-1] = z.Lo
			}
		}
		// No overflow here since the new r fits on 320 bits.
		r[4] = cc1 + cc2
	}
	// We computed (self*rhs + ff*n) / 2^320, with:
	//    self < n
	//    rhs < 2^320
	//    ff < 2^320
	// Thus, the value we obtained is lower than 2*n. Subtracting n
	// once (conditionally) is sufficient to achieve full reduction.
	r2, c := r.SubInner(&N)
	return Select(c, r2, r)
}

func (s ECgFp5Scalar) expPowerOf2(exp int) ECgFp5Scalar {
	result := s
	for i := 0; i < exp; i++ {
		result = *result.Square()
	}
	return result
}

func FromGfp5(fp5 gFp5.Element) ECgFp5Scalar {
	return FromNonCanonicalBigInt(BigIntFromArray([5]uint64{
		fp5[0].Uint64(), fp5[1].Uint64(), fp5[2].Uint64(), fp5[3].Uint64(), fp5[4].Uint64(),
	}))
}

func BigIntFromArray(arr [5]uint64) *big.Int {
	result := new(big.Int)
	for i := 4; i >= 0; i-- {
		result.Lsh(result, 64)
		result.Or(result, new(big.Int).SetUint64(arr[i]))
	}
	return result
}

func FromNonCanonicalBigInt(val *big.Int) ECgFp5Scalar {
	limbs := new(big.Int).Mod(val, ORDER).Bits()
	if len(limbs) < 5 {
		limbs = append(limbs, 0)
	}
	return ECgFp5Scalar{uint64(limbs[0]), uint64(limbs[1]), uint64(limbs[2]), uint64(limbs[3]), uint64(limbs[4])}
}

func (s ECgFp5Scalar) ToCanonicalBigInt() *big.Int {
	result := BigIntFromArray(s)

	order := ORDER
	if result.Cmp(order) >= 0 {
		result.Sub(result, order)
	}

	return result
}

// Recode a scalar into signed integers. For a window width of w
// bits, returned integers are in the -(2^w-1) to +2^w range. The
// provided slice is filled; if w*len(ss) >= 320, then the output
// encodes the complete scalar value, and the top (last) signed
// integer is nonnegative.
// Window width MUST be between 2 and 10.
func (s ECgFp5Scalar) RecodeSigned(ss []int32, w int32) {
	RecodeSignedFromLimbs(s[:], ss, w)
}

func RecodeSignedFromLimbs(limbs []uint64, ss []int32, w int32) {
	var acc uint64 = 0
	var accLen int32 = 0
	var j int = 0
	mw := (uint32(1) << w) - 1
	hw := uint32(1) << (w - 1)
	var cc uint32 = 0
	for i := 0; i < len(ss); i++ {
		// Get next w-bit chunk in bb.
		var bb uint32
		if accLen < w {
			if j < len(limbs) {
				nl := limbs[j]
				j++
				bb = (uint32(acc | (nl << accLen))) & mw
				acc = nl >> (w - accLen)
			} else {
				bb = uint32(acc) & mw
				acc = 0
			}
			accLen += 64 - w
		} else {
			bb = uint32(acc) & mw
			accLen -= w
			acc >>= w
		}

		// If bb is greater than 2^(w-1), subtract 2^w and propagate a carry.
		bb += cc

		cc = (hw - bb) >> 31
		ss[i] = int32(bb) - int32(cc<<w)
	}
}
