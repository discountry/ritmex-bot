package poseidon2_plonky2

import (
	"bytes"
	"math"
	"testing"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
)

func TestPermute(t *testing.T) {
	inp := [WIDTH]g.GoldilocksField{
		5417613058500526590,
		2481548824842427254,
		6473243198879784792,
		1720313757066167274,
		2806320291675974571,
		7407976414706455446,
		1105257841424046885,
		7613435757403328049,
		3376066686066811538,
		5888575799323675710,
		6689309723188675948,
		2468250420241012720,
	}

	Permute(&inp)

	expected := [WIDTH]g.GoldilocksField{
		5364184781011389007,
		15309475861242939136,
		5983386513087443499,
		886942118604446276,
		14903657885227062600,
		7742650891575941298,
		1962182278500985790,
		10213480816595178755,
		3510799061817443836,
		4610029967627506430,
		7566382334276534836,
		2288460879362380348,
	}

	for i := 0; i < WIDTH; i++ {
		if inp[i] != expected[i] {
			t.Logf("Expected: %d, got: %d\n", expected[i], inp[i])
			t.Fail()
		}
	}
}

func TestHashNToMNoPad(t *testing.T) {
	inp := [WIDTH]g.GoldilocksField{
		2963773914414780088,
		8389525300242074234,
		3700959901615818008,
		6116199383751757212,
		3418607418699599889,
		8793277256263635044,
		448623437464918480,
		1857310021116627925,
		6145634616307237342,
		1548353948794474539,
		2318110128254703527,
		8347759953730634762,
	}

	res := HashNToMNoPad(inp[:], 12)

	expected := [WIDTH]g.GoldilocksField{
		3627923032009111551,
		1460752551327577353,
		1084214837491058067,
		1841622875286057462,
		3996252440506437984,
		1276718204392552803,
		8564515621134952155,
		9252927025993202701,
		1147435538714642916,
		16407277821156164797,
		11997661877740155273,
		12485021000320141292,
	}

	for i := 0; i < 12; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestDigest(t *testing.T) {
	hFunc := NewPoseidon2()

	inputs := make([][]byte, 2)
	inputs[0] = make([]byte, 8)
	inputs[0][0] = 1
	inputs[0][1] = 2
	inputs[0][2] = 3
	inputs[0][3] = 4
	inputs[0][4] = 5
	inputs[0][5] = 6
	inputs[0][6] = 7
	inputs[0][7] = 0
	inputs[1] = make([]byte, 8)
	inputs[1][0] = 7
	inputs[1][1] = 6
	inputs[1][2] = 5
	inputs[1][3] = 4
	inputs[1][4] = 3
	inputs[1][5] = 2
	inputs[1][6] = 1
	inputs[1][7] = 0

	g1 := g.FromCanonicalLittleEndianBytesF(inputs[0]) // 289077004332300282
	g2 := g.FromCanonicalLittleEndianBytesF(inputs[1]) // 289644378102298614

	hFunc.Write(inputs[0])
	hFunc.Write(inputs[1])

	hash := hFunc.Sum(nil)

	hash2Elems := HashNoPad([]g.GoldilocksField{g1, g2})
	hash2 := hash2Elems.ToLittleEndianBytes()

	if !bytes.Equal(hash, hash2) {
		t.Logf("Expected: %v, got: %v\n", hash2, hash)
		t.Fail()
	}

	reconstructed, err := HashOutFromLittleEndianBytes(hash)
	if err != nil {
		t.Logf("Error: %v\n", err)
		t.FailNow()
	}

	for i := 0; i < 4; i++ {
		if hash2Elems[i] != reconstructed[i] {
			t.Logf("Expected: %d, got: %d\n", hash2Elems[i], reconstructed[i])
			t.Fail()
		}
	}
}

func TestHashNToHashNoPad(t *testing.T) {
	res := HashNToHashNoPad([]g.GoldilocksField{
		11295517158488612626,
		10669470463693797151,
		17232114065640264171,
		4175927072186299193,
		13985285184240204531,
		7901017084268693144,
		4326299618263946178,
		14787024750292535041,
		894520636503353046,
		12556655399058578835,
		3097737892474696200,
		7515335668060050861,
	})

	expected := HashOut{
		15396602476382546759,
		12422280135166335470,
		8165681190607828974,
		3475588160239961712,
	}

	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestHashNToHashNoPadLarge(t *testing.T) {
	res := HashNToHashNoPad([]g.GoldilocksField{
		g.GoldilocksField(g.ORDER + 1),
		g.GoldilocksField(g.ORDER + 2),
		g.GoldilocksField(g.ORDER + 3),
		g.GoldilocksField(math.MaxUint64),
		g.GoldilocksField(math.MaxUint64 - 1),
	})

	expected := HashOut{
		14216040864787980138,
		17275303675000904868,
		11831395338463193314,
		281267649235863375,
	}

	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Logf("Expected: %v, got: %v\n", expected, res)
			t.FailNow()
		}
	}
}

func TestHashTwoToOne(t *testing.T) {
	input1 := HashOut{
		3777312593917610528,
		6858608920877200812,
		5269611035257552853,
		10607733449481270434,
	}

	input2 := HashOut{
		10355703322562521155,
		1039917189921776884,
		10844249567941924238,
		14291130953945924124,
	}

	expected := HashOut{
		1453933811752520343,
		16186418140372484281,
		9207215809524681813,
		10182182911172027974,
	}

	res := HashTwoToOne(input1, input2)
	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestHashNToOne(t *testing.T) {
	hashIns := []HashOut{HashNToHashNoPad([]g.GoldilocksField{
		18231458557829081414,
		16449039301999856654,
		14758090268883299362,
		10271725147130672875,
		6253304685402495037,
		16079709420464120062,
		10838593640248082543,
		2974225335734585509,
		6365466669981419503,
		12964544245312854826,
		3161534615047618958,
		15109271288782125222,
	})}
	for i := 1; i < 12; i++ {
		hashIns = append(hashIns, HashTwoToOne(hashIns[i-1], hashIns[i-1]))
	}

	res := HashNToOne(hashIns)
	expected := HashOut{
		3346041518891302234,
		10181430332820953144,
		14852547783810217847,
		17043509806476508794,
	}
	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestHashToQuinticExtension(t *testing.T) {
	result := HashToQuinticExtension([]g.GoldilocksField{
		3451004116618606032,
		11263134342958518251,
		10957204882857370932,
		5369763041201481933,
		7695734348563036858,
		1393419330378128434,
		7387917082382606332,
	})
	expected := [5]uint64{
		17992684813643984528,
		5243896189906434327,
		7705560276311184368,
		2785244775876017560,
		14449776097783372302,
	}
	for i := 0; i < 5; i++ {
		if result[i] != g.FromUint64(expected[i]) {
			t.Logf("Expected limb %d to be %x, but got %x", i, expected[i], result[i])
			t.Fail()
		}
	}
}
