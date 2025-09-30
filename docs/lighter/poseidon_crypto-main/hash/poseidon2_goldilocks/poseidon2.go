package poseidon2

import (
	"fmt"
	"hash"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
)

type HashOut [4]g.Element

type NumericalHashOut [4]uint64

func (h HashOut) ToLittleEndianBytes() []byte {
	return g.ArrayToLittleEndianBytes([]g.Element{h[0], h[1], h[2], h[3]})
}

func (h HashOut) ToUint64Array() [4]uint64 {
	return [4]uint64{h[0].Uint64(), h[1].Uint64(), h[2].Uint64(), h[3].Uint64()}
}

func HashToQuinticExtension(m []g.Element) gFp5.Element {
	res := HashNToMNoPad(m, 5)
	return gFp5.Element(res[:])
}

func HashOutFromUint64Array(arr [4]uint64) HashOut {
	return HashOut{g.FromUint64(arr[0]), g.FromUint64(arr[1]), g.FromUint64(arr[2]), g.FromUint64(arr[3])}
}

func HashOutFromLittleEndianBytes(b []byte) (HashOut, error) {
	if len(b) != 4*g.Bytes {
		return HashOut{}, fmt.Errorf("input bytes len should be 32 but is %d", len(b))
	}

	gArr, err := g.ArrayFromCanonicalLittleEndianBytes(b)
	if err != nil {
		return HashOut{}, fmt.Errorf("failed to convert bytes to field element. bytes: %v, error: %w", b, err)
	}

	return HashOut{gArr[0], gArr[1], gArr[2], gArr[3]}, nil
}

func EmptyHashOut() HashOut {
	return HashOut{g.Zero(), g.Zero(), g.Zero(), g.Zero()}
}

type Poseidon2 struct{}

func HashNoPad(input []g.Element) HashOut {
	return HashNToHashNoPad(input)
}

func HashNToOne(input []HashOut) HashOut {
	if len(input) == 1 {
		return input[0]
	}

	res := HashTwoToOne(input[0], input[1])
	for i := 2; i < len(input); i++ {
		res = HashTwoToOne(res, input[i])
	}

	return res
}

func HashTwoToOne(input1, input2 HashOut) HashOut {
	return HashNToHashNoPad([]g.Element{input1[0], input1[1], input1[2], input1[3], input2[0], input2[1], input2[2], input2[3]})
}

func HashNToHashNoPad(input []g.Element) HashOut {
	res := HashNToMNoPad(input, 4)
	return HashOut{res[0], res[1], res[2], res[3]}
}

func HashNToMNoPad(input []g.Element, numOutputs int) []g.Element {
	var perm [WIDTH]g.Element
	for i := 0; i < len(input); i += RATE {
		for j := 0; j < RATE && i+j < len(input); j++ {
			perm[j].Set(&input[i+j])
		}
		Permute(&perm)
	}

	outputs := make([]g.Element, 0, numOutputs)
	for {
		for i := 0; i < RATE; i++ {
			outputs = append(outputs, perm[i])
			if len(outputs) == numOutputs {
				return outputs
			}
		}
		Permute(&perm)
	}
}

func Permute(input *[WIDTH]g.Element) {
	externalLinearLayer(input)
	fullRounds(input, 0)
	partialRounds(input)
	fullRounds(input, ROUNDS_F_HALF)
}

func fullRounds(state *[WIDTH]g.Element, start int) {
	for r := start; r < start+ROUNDS_F_HALF; r++ {
		addRC(state, r)
		sbox(state)
		externalLinearLayer(state)
	}
}

func partialRounds(state *[WIDTH]g.Element) {
	for r := 0; r < ROUNDS_P; r++ {
		addRCI(state, r)
		sboxP(0, state)
		internalLinearLayer(state)
	}
}

func externalLinearLayer(s *[WIDTH]g.Element) {
	for i := 0; i < 3; i++ { // 4 size window
		var t0, t1, t2, t3, t4, t5, t6 g.Element
		t0.Add(&s[4*i], &s[4*i+1])   // s0+s1
		t1.Add(&s[4*i+2], &s[4*i+3]) // s2+s3
		t2.Add(&t0, &t1)             // t0+t1 = s0+s1+s2+s3
		t3.Add(&t2, &s[4*i+1])       // t2+s1 = s0+2s1+s2+s3
		t4.Add(&t2, &s[4*i+3])       // t2+s3 = s0+s1+s2+2s3
		t5.Double(&s[4*i])           // 2s0
		t6.Double(&s[4*i+2])         // 2s2
		s[4*i].Add(&t3, &t0)
		s[4*i+1].Add(&t6, &t3)
		s[4*i+2].Add(&t1, &t4)
		s[4*i+3].Add(&t5, &t4)
	}

	sums := [4]g.Element{}
	for k := 0; k < 4; k++ {
		for j := 0; j < WIDTH; j += 4 {
			sums[k].Add(&sums[k], &s[j+k])
		}
	}
	for i := 0; i < WIDTH; i++ {
		s[i].Add(&s[i], &sums[i%4])
	}
}

func internalLinearLayer(state *[WIDTH]g.Element) {
	var sum g.Element
	sum.Set(&state[0])
	for i := 1; i < WIDTH; i++ {
		sum.Add(&sum, &state[i])
	}
	for i := 0; i < WIDTH; i++ {
		state[i].Mul(&state[i], &MATRIX_DIAG_12_U64[i]).
			Add(&state[i], &sum)
	}
}

func addRC(state *[WIDTH]g.Element, externalRound int) {
	for i := 0; i < WIDTH; i++ {
		state[i].Add(&state[i], &EXTERNAL_CONSTANTS[externalRound][i])
	}
}

func addRCI(state *[WIDTH]g.Element, round int) {
	state[0].Add(&state[0], &INTERNAL_CONSTANTS[round])
}

func sbox(state *[WIDTH]g.Element) {
	for i := range state {
		sboxP(i, state)
	}
}

func sboxP(index int, state *[WIDTH]g.Element) {
	var tmp g.Element
	tmp.Set(&state[index])

	var tmpSquare g.Element
	tmpSquare.Square(&tmp)

	var tmpSixth g.Element
	tmpSixth.Mul(&tmpSquare, &tmp)
	tmpSixth.Square(&tmpSixth)

	state[index].Mul(&tmpSixth, &tmp)
}

const BlockSize = g.Bytes // BlockSize size that poseidon consumes

type digest struct {
	data []g.Element
}

func NewPoseidon2() hash.Hash {
	d := new(digest)
	d.Reset()
	return d
}

// Reset resets the Hash to its initial state.
func (d *digest) Reset() {
	d.data = nil
}

// Get element by element.
func (d *digest) Write(p []byte) (n int, err error) {
	if len(p)%g.Bytes != 0 {
		return 0, fmt.Errorf("input bytes len should be multiple of 8 but is %d", len(p))
	}

	gArr, err := g.ArrayFromCanonicalLittleEndianBytes(p)
	if err != nil {
		return 0, fmt.Errorf("failed to convert bytes to field element. bytes: %v, error: %w", p, err)
	}

	d.data = append(d.data, gArr...)
	return len(p), nil
}

func (d *digest) Size() int {
	return BlockSize
}

// BlockSize returns the number of bytes Sum will return.
func (d *digest) BlockSize() int {
	return BlockSize
}

// Sum appends the current hash to b and returns the resulting slice.
// It does not change the underlying hash state.
func (d *digest) Sum(b []byte) []byte {
	b = append(b, HashNToHashNoPad(d.data).ToLittleEndianBytes()...)
	d.data = nil
	return b
}
