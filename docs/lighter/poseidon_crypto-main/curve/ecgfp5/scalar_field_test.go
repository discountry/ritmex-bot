package ecgfp5

import (
	"testing"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
)

func TestSerdes(t *testing.T) {
	scalar := ECgFp5Scalar{
		6950590877883398434,
		17178336263794770543,
		11012823478139181320,
		16445091359523510936,
		5882925226143600273,
	}

	leBytes := scalar.ToLittleEndianBytes()
	result := ScalarElementFromLittleEndianBytes(leBytes)

	if !scalar.Equals(&result) {
		t.Fatalf("Expected %v, but got %v", scalar, result)
	}
}

func TestSplitTo4LimbBits(t *testing.T) {
	scalar := ECgFp5Scalar{
		6950590877883398434,
		17178336263794770543,
		11012823478139181320,
		16445091359523510936,
		5882925226143600273,
	}

	limbs := scalar.SplitTo4BitLimbs()

	expectedValues := map[int]uint8{
		0: 2, 1: 2, 2: 9, 3: 7, 4: 15, 5: 4, 6: 15, 7: 13,
		8: 3, 9: 9, 10: 5, 11: 7, 12: 5, 13: 7, 14: 0, 15: 6,
		16: 15, 17: 6, 18: 2, 19: 12, 20: 2, 21: 11, 22: 3, 23: 3,
		24: 1, 25: 13, 26: 5, 27: 11, 28: 5, 29: 6, 30: 14, 31: 14,
		32: 8, 33: 0, 34: 9, 35: 5, 36: 1, 37: 9, 38: 12, 39: 13,
		40: 10, 41: 9, 42: 8, 43: 6, 44: 5, 45: 13, 46: 8, 47: 9,
		48: 8, 49: 9, 50: 10, 51: 9, 52: 14, 53: 3, 54: 15, 55: 2,
		56: 6, 57: 7, 58: 3, 59: 11, 60: 8, 61: 3, 62: 4, 63: 14,
		64: 1, 65: 9, 66: 14, 67: 4, 68: 9, 69: 7, 70: 8, 71: 15,
		72: 2, 73: 5, 74: 9, 75: 5, 76: 4, 77: 10, 78: 1, 79: 5,
	}

	for i, expected := range expectedValues {
		if limbs[i] != expected {
			t.Fatalf("Expected limbs[%d] to be %d, but got %d", i, expected, limbs[i])
		}
	}
}

func TestAddInner(t *testing.T) {
	scalar1 := ECgFp5Scalar{
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}

	scalar2 := ECgFp5Scalar{
		0xFFFFFFFFFeeFFF,
		12312321312,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFacdFFFFF,
		0xbcaFFFFFFFFFFFFF,
	}

	result := scalar1.AddInner(scalar2)
	expectedValues := ECgFp5Scalar{
		0xfffffffffeeffe,
		0x2dddf1d20,
		0xffffffffffffffff,
		0xffffffacdfffff,
		0xbcafffffffffffff,
	}

	for i := 0; i < 5; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected %v but got %v at index %d", expectedValues[i], result[i], i)
		}
	}
}

func TestSubInner(t *testing.T) {
	scalar1 := ECgFp5Scalar{0, 0, 0, 0, 0}
	scalar2 := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}

	result, carry := scalar1.SubInner(&scalar2)
	expectedValues := ECgFp5Scalar{1, 0, 0, 0, 0}
	expectedCarry := uint64(18446744073709551615)

	for i := 0; i < 5; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, expectedValues[i], result[i])
		}
	}
	if carry != expectedCarry {
		t.Fatalf("Expected carry to be %d, but got %d", expectedCarry, carry)
	}
}

func TestAddScalar(t *testing.T) {
	scalar1 := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}
	scalar2 := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}

	result := scalar1.AddInner(scalar2)
	expectedValues := ECgFp5Scalar{0xFFFFFFFFFFFFFFFE, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}

	for i := 0; i < 5; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected %v but got %v at index %d", expectedValues[i], result[i], i)
		}
	}
}

func TestSub(t *testing.T) {
	scalar1 := ECgFp5Scalar{1, 2, 0, 0, 0}
	scalar2 := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}

	result := scalar1.Sub(scalar2)
	expectedValues := ECgFp5Scalar{0xe80fd996948bffe3, 0xe8885c39d724a09e, 0x7fffffe6cfb80639, 0x7ffffff100000016, 0x7ffffffd80000007}

	for i := 0; i < 5; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, expectedValues[i], result[i])
		}
	}
}

func TestSelect(t *testing.T) {
	a0 := ECgFp5Scalar{1, 2, 3, 4, 5}
	a1 := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFE, 0xFFFFFFFFFFFFFFFD, 0xFFFFFFFFFFFFFFFC, 0xFFFFFFFFFFFFFFFB}

	result := Select(uint64(0), &a0, &a1)
	for i := 0; i < 5; i++ {
		if result[i] != a0[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, a0[i], result[i])
		}
	}

	result = Select(uint64(0xFFFFFFFFFFFFFFFF), &a0, &a1)
	for i := 0; i < 5; i++ {
		if result[i] != a1[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, a1[i], result[i])
		}
	}
}

func TestMontyMul(t *testing.T) {
	scalar1 := ECgFp5Scalar{1, 2, 3, 4, 5}
	scalar2 := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}

	result := scalar1.MontyMul(&scalar2)
	expectedValues := ECgFp5Scalar{10974894505036100890, 7458803775930281466, 744239893213209819, 3396127080529349464, 5979369289905897562}

	for i := 0; i < 5; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, expectedValues[i], result[i])
		}
	}
}

func TestMul(t *testing.T) {
	scalar := ECgFp5Scalar{0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF}

	result := scalar.Mul(&scalar)
	expectedValues := ECgFp5Scalar{471447996674510360, 3520142298321118626, 17240611161823899731, 5610669884293437850, 1193611606749909414}

	for i := 0; i < 5; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, expectedValues[i], result[i])
		}
	}
}

func TestRecodeSigned(t *testing.T) {
	var ss [50]int32
	scalar := ECgFp5Scalar{
		g.Modulus() - 1,
		g.Modulus() - 2,
		g.Modulus() - 3,
		0xFFFFFFFFFFFFFFFF,
		g.Modulus() - 5,
	}

	scalar.RecodeSigned(ss[:], 5)

	expectedValues := map[int]int32{
		6:  -4,
		19: -2,
		25: -8,
		32: -1,
	}

	for i, elem := range ss {
		if expected, exists := expectedValues[i]; exists {
			if elem != expected {
				t.Fatalf("Expected ss[%d] to be %d, but got %d", i, expected, elem)
			}
		} else if elem != 0 {
			t.Fatalf("Expected ss[%d] to be 0, but got %d", i, elem)
		}
	}
}

func TestFromQuinticExtension(t *testing.T) {
	scalar := FromGfp5(gFp5.Element{*g.NegOne(), *g.NegOne(), *g.NegOne(), *g.NegOne(), *g.NegOne()})

	expectedValues := ECgFp5Scalar{
		3449841778703204414,
		3382000508875488967,
		212073444237,
		124554051540,
		17179869170,
	}

	for i := 0; i < 5; i++ {
		if scalar[i] != expectedValues[i] {
			t.Fatalf("Expected scalar[%d] to be %d, but got %d", i, expectedValues[i], scalar[i])
		}
	}
}

func TestAddShiftedSmall161(t *testing.T) {
	scalar := Signed161{

		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}

	scalar.AddShiftedSmall([]uint64{1, 0xFFFFFFFFFFFFDDBB, 0xFFFFAACFFFFFDDBB}, 1231233)
	expectedValues := [3]uint64{
		1,
		18446744073709534070,
		18446556744415951735,
	}

	for i, elem := range scalar {
		if elem != expectedValues[i] {
			t.Fatalf("Expected scalar[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestAdd161(t *testing.T) {
	scalar := Signed161{

		0x10FFFFabcdFF1213,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}

	scalar.Add([]uint64{0x10FFFFabcdFF1213, 0xFFFFFFFFFFFFDDBB, 0xFFFFAACFFFFFDDBB})

	expectedValues := [3]uint64{
		2449957474057200678,
		18446744073709542842,
		18446650409062751675,
	}

	for i, elem := range scalar {
		if elem != expectedValues[i] {
			t.Fatalf("Expected scalar[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestAddShifted161(t *testing.T) {
	scalar1 := Signed161{

		0x10FFFFabcdFF1213,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}
	scalar2 := Signed161{
		0xabcdabcdabcdabcd,
		0xdef0def0def0def0,
		0x1234123412341234,
	}
	scalar1.AddShifted(&scalar2, 21423423)

	expectedValues := [3]uint64{
		1224978737028600339,
		18446744073709551615,
		18446744073709551615,
	}
	for i, elem := range scalar1 {
		if elem != expectedValues[i] {
			t.Fatalf("Expected scalar1[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestRecodeSigned5_161(t *testing.T) {
	scalar1 := Signed161{
		0x1234567890abcdef,
		0xfedcba0987654321,
		0x0fedcba987654321,
	}

	expectedValues := [33]int32{
		15, 15, -13, -8, 11, 8, 2, 15, -10, 3, 13, 4, -15, -15, 13, 8, 5, -5, 2, -13, 1, -3, -13, -4, -1, 16, 8, 6, -12, -13, -2, -15, 0,
	}
	for i, elem := range scalar1.RecodeSigned5() {
		if elem != expectedValues[i] {
			t.Fatalf("Expected ss[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestSub161(t *testing.T) {
	scalar := Signed161{

		0x1010111112121313,
		0x10FFFFabcdFF1213,
		0xabcdef12345abcde,
	}

	scalar.Sub([]uint64{0xFFFFFFFFFFFFFFFF, 0x10FFFFabcdFF1213, 0xFFFFFFFFFFFFFFFF})

	expectedValues := [3]uint64{
		1157443869249508116,
		18446744073709551615,
		12379813812178173150,
	}

	for i, elem := range scalar {
		if elem != expectedValues[i] {
			t.Fatalf("Expected scalar[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestSubShiftedSmall161(t *testing.T) {
	scalar := Signed161{

		0x1010111112121313,
		0x10FFFFabcdFF1213,
		0xabcdef12345abcde,
	}

	scalar.SubShiftedSmall([]uint64{0xFFFFFFFFFFFFFFFF, 0x10FFFFabcdFF1213, 0xFFFFFFFFFFFFFFFF}, 5123142)

	expectedValues := [3]uint64{
		1157443869249508179,
		15060059935745936659,
		12379813812178173209,
	}

	for i, elem := range scalar {
		if elem != expectedValues[i] {
			t.Fatalf("Expected scalar[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestSubShifted161(t *testing.T) {
	scalar1 := Signed161{

		0x1010111112121313,
		0x10FFFFabcdFF1213,
		0xabcdef12345abcde,
	}

	scalar2 := Signed161{

		0xabcdabcdabcdabcd,
		0xdef0def0def0def0,
		0x1234123412341234,
	}

	scalar1.SubShifted(&scalar2, 12315523)

	expectedValues := [3]uint64{
		1157443869249508115,
		1224978737028600339,
		12379813812178173150,
	}

	for i, elem := range scalar1 {
		if elem != expectedValues[i] {
			t.Fatalf("Expected scalar1[%d] to be %d, but got %d", i, expectedValues[i], elem)
		}
	}
}

func TestFromNsquared(t *testing.T) {
	expected := Signed640{
		10262430419493848001,
		781583365610726095,
		1685487855950207164,
		0x90465B4214B27B1C,
		0xD308FECCB1878B88,
		0x3CC55EB2EAC07502,
		0x59F038FB784335CE,
		0xBFFFFE954FB808EA,
		13835057829796380825,
		4611686007689969677,
	}

	for i, limb := range FromNsquared() {
		if limb != expected[i] {
			t.Fatalf("Expected limb %d to be %x, but got %x", i, expected[i], limb)
		}
	}
}

func TestFromMulScalars(t *testing.T) {
	a := ECgFp5Scalar{
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}
	b := ECgFp5Scalar{
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}
	result := FromMulScalars(&a, &b)

	expectedValues := [10]uint64{
		1,
		0,
		0,
		0,
		0,
		18446744073709551614,
		18446744073709551615,
		18446744073709551615,
		18446744073709551615,
		18446744073709551615,
	}
	for i := 0; i < 10; i++ {
		if result[i] != expectedValues[i] {
			t.Fatalf("Expected result[%d] to be %d, but got %d", i, expectedValues[i], result[i])
		}
	}
}
func TestAdd1_640(t *testing.T) {
	a := Signed640{

		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
	}

	a.Add1()

	expected := Signed640{
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	}

	for i, limb := range a {
		if limb != expected[i] {
			t.Fatalf("Test case 2: Expected limb %d to be %x, but got %x", i, expected[i], limb)
		}
	}
}

func TestIsNonnegative640(t *testing.T) {
	nonnegativeTest := Signed640{

		0, 0, 0, 0, 0, 0, 0, 0, 0, 0x7FFFFFFFFFFFFFFF,
	}

	if !nonnegativeTest.IsNonnegative() {
		t.Fatalf("Expected nonnegativeTest to be nonnegative, but it is not")
	}
}

func TestLtUnsigned640(t *testing.T) {
	ltTest1 := Signed640{
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	}
	ltTest2 := Signed640{
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	}

	if !ltTest1.LtUnsigned(&ltTest2) {
		t.Fatalf("Expected ltTest1 to be less than ltTest2, but it is not")
	}
	if ltTest2.LtUnsigned(&ltTest1) {
		t.Fatalf("Expected ltTest2 to be greater than ltTest1, but it is not")
	}
}

func TestBitlength(t *testing.T) {
	bitlengthTest := Signed640{

		0, 0, 0, 0, 0, 0, 0, 0, 0, 0x8000000000000000,
	}

	bitlength := bitlengthTest.Bitlength()

	expectedBitlength := int32(639)
	if bitlength != expectedBitlength {
		t.Fatalf("Expected bit length to be %d, but got %d", expectedBitlength, bitlength)
	}

	bitlengthTest = Signed640{

		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
		0xFFFFFFFFFFFFFaFF,
	}

	bitlength = bitlengthTest.Bitlength()

	expectedBitlength = int32(587)
	if bitlength != expectedBitlength {
		t.Fatalf("Expected bit length to be %d, but got %d", expectedBitlength, bitlength)
	}
}

func TestAdd640(t *testing.T) {
	a := Signed640{

		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFaaaF,
	}

	b := Signed640{

		0xFFFFFabcdFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFF1234FFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFF1234FFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFF1234FFFFF,
		0xFFFFFFFFFFFFFFFF,
	}

	a.AddShifted(&b, 5543242)

	expected := Signed640{

		18446744073709551615,
		0,
		18446744073709551615,
		0,
		18446744073709551615,
		0,
		18446744073709551615,
		0,
		18446744073709551615,
		18446744073709529775,
	}

	for i, limb := range a {
		if limb != expected[i] {
			t.Fatalf("Expected limb %d to be %x, but got %x", i, expected[i], limb)
		}
	}

	a.AddShifted(&b, 63)

	expected = Signed640{

		9223372036854775807,
		18446741180780642304,
		18446744073709551614,
		0,
		9223372004938743807,
		9223372036854775809,
		18446744073709551614,
		18446744041793519616,
		18446744073709551614,
		18446744041793497775,
	}

	for i, limb := range a {
		if limb != expected[i] {
			t.Fatalf("Expected limb %d to be %x, but got %x", i, expected[i], limb)
		}
	}

	a.AddShifted(&b, 0)

	expected = Signed640{

		9223366250996957182,
		18446741180780642304,
		18446744073709551614,
		18446744009877487616,
		9223372004938743807,
		9223372036854775808,
		18446744009877487614,
		18446744041793519616,
		18446744009877487614,
		18446744041793497775,
	}

	for i, limb := range a {
		if limb != expected[i] {
			t.Fatalf("Expected limb %d to be %x, but got %x", i, expected[i], limb)
		}
	}
}

func TestSubShifted640(t *testing.T) {
	// Create two Signed640 instances for the test
	a := Signed640{

		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFaaaF,
	}

	b := Signed640{

		0xFFFFFabcdFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFF1234FFFFF,
		0,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFF1234FFFFF,
		0xFFFFFFFFFFFFFFFF,
		0xFFFFFFF1234FFFFF,
		0xFFFFFFFFFFFFFFFF,
	}

	a.SubShifted(&b, 313)
	expectedLargeShift := Signed640{

		18446744073709551615,
		0,
		18446744073709551615,
		0,
		18446744073709551615,
		144115188075855872,
		18446744073709551615,
		498688000,
		18446744073709551615,
		498666159,
	}

	for i, limb := range a {
		if limb != expectedLargeShift[i] {
			t.Fatalf("sub_shifted (large shift): Expected limb %d to be %x, but got %x", i, expectedLargeShift[i], limb)
		}
	}

	a.SubShifted(&b, 63)
	expectedSmallShift := Signed640{

		9223372036854775807,
		2892928909313,
		18446744073709551615,
		0,
		9223372068770807807,
		9367487224930631680,
		18446744073709551615,
		32414720000,
		18446744073709551615,
		32414698159,
	}

	for i, limb := range a {
		if limb != expectedSmallShift[i] {
			t.Fatalf("sub_shifted (small shift): Expected limb %d to be %x, but got %x", i, expectedSmallShift[i], limb)
		}
	}

	a.SubShifted(&b, 0)
	expectedZeroShift := Signed640{

		9223377822712594432,
		2892928909313,
		18446744073709551615,
		63832064000,
		9223372068770807806,
		9367487224930631681,
		63832063999,
		32414720001,
		63832063999,
		32414698160,
	}

	for i, limb := range a {
		if limb != expectedZeroShift[i] {
			t.Fatalf("sub: Expected limb %d to be %x, but got %x", i, expectedZeroShift[i], limb)
		}
	}
}
