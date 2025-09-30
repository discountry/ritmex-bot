package poseidon2

import (
	"math"
	"testing"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
)

func TestPermute(t *testing.T) {
	inp := [WIDTH]g.Element{
		g.FromUint64(5417613058500526590),
		g.FromUint64(2481548824842427254),
		g.FromUint64(6473243198879784792),
		g.FromUint64(1720313757066167274),
		g.FromUint64(2806320291675974571),
		g.FromUint64(7407976414706455446),
		g.FromUint64(1105257841424046885),
		g.FromUint64(7613435757403328049),
		g.FromUint64(3376066686066811538),
		g.FromUint64(5888575799323675710),
		g.FromUint64(6689309723188675948),
		g.FromUint64(2468250420241012720),
	}

	Permute(&inp)

	expected := [WIDTH]g.Element{
		g.FromUint64(5364184781011389007),
		g.FromUint64(15309475861242939136),
		g.FromUint64(5983386513087443499),
		g.FromUint64(886942118604446276),
		g.FromUint64(14903657885227062600),
		g.FromUint64(7742650891575941298),
		g.FromUint64(1962182278500985790),
		g.FromUint64(10213480816595178755),
		g.FromUint64(3510799061817443836),
		g.FromUint64(4610029967627506430),
		g.FromUint64(7566382334276534836),
		g.FromUint64(2288460879362380348),
	}

	for i := 0; i < WIDTH; i++ {
		if inp[i] != expected[i] {
			t.Logf("Expected: %d, got: %d\n", expected[i], inp[i])
			t.Fail()
		}
	}
}

func TestHashNToMNoPad(t *testing.T) {
	inp := [WIDTH]g.Element{
		g.FromUint64(2963773914414780088),
		g.FromUint64(8389525300242074234),
		g.FromUint64(3700959901615818008),
		g.FromUint64(6116199383751757212),
		g.FromUint64(3418607418699599889),
		g.FromUint64(8793277256263635044),
		g.FromUint64(448623437464918480),
		g.FromUint64(1857310021116627925),
		g.FromUint64(6145634616307237342),
		g.FromUint64(1548353948794474539),
		g.FromUint64(2318110128254703527),
		g.FromUint64(8347759953730634762),
	}

	res := HashNToMNoPad(inp[:], 12)

	expected := [WIDTH]g.Element{
		g.FromUint64(3627923032009111551),
		g.FromUint64(1460752551327577353),
		g.FromUint64(1084214837491058067),
		g.FromUint64(1841622875286057462),
		g.FromUint64(3996252440506437984),
		g.FromUint64(1276718204392552803),
		g.FromUint64(8564515621134952155),
		g.FromUint64(9252927025993202701),
		g.FromUint64(1147435538714642916),
		g.FromUint64(16407277821156164797),
		g.FromUint64(11997661877740155273),
		g.FromUint64(12485021000320141292),
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

	g1, _ := g.FromCanonicalLittleEndianBytes(inputs[0]) // 289077004332300282
	g2, _ := g.FromCanonicalLittleEndianBytes(inputs[1]) // 289644378102298614

	hFunc.Write(inputs[0])
	hFunc.Write(inputs[1])

	hash := hFunc.Sum(nil)

	hash2Elems := HashNoPad([]g.Element{*g1, *g2})
	hash2 := hash2Elems.ToLittleEndianBytes()

	for i := 0; i < len(hash); i++ {
		if hash[i] != hash2[i] {
			t.Fail()
		}
	}

	reconstructed, _ := HashOutFromLittleEndianBytes(hash)
	for i := 0; i < 4; i++ {
		if hash2Elems[i] != reconstructed[i] {
			t.Fail()
		}
	}
}

func TestHashNToHashNoPad(t *testing.T) {
	res := HashNToHashNoPad([]g.Element{
		g.FromUint64(11295517158488612626),
		g.FromUint64(10669470463693797151),
		g.FromUint64(17232114065640264171),
		g.FromUint64(4175927072186299193),
		g.FromUint64(13985285184240204531),
		g.FromUint64(7901017084268693144),
		g.FromUint64(4326299618263946178),
		g.FromUint64(14787024750292535041),
		g.FromUint64(894520636503353046),
		g.FromUint64(12556655399058578835),
		g.FromUint64(3097737892474696200),
		g.FromUint64(7515335668060050861),
	})

	expected := HashOut{
		g.FromUint64(15396602476382546759),
		g.FromUint64(12422280135166335470),
		g.FromUint64(8165681190607828974),
		g.FromUint64(3475588160239961712),
	}

	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestHashNToHashNoPadLarge(t *testing.T) {
	res := HashNToHashNoPad([]g.Element{
		g.FromUint64(g.ORDER + 1),
		g.FromUint64(g.ORDER + 2),
		g.FromUint64(g.ORDER + 3),
		g.FromUint64(math.MaxUint64),
		g.FromUint64(math.MaxUint64 - 1),
	})

	expected := HashOut{
		g.FromUint64(14216040864787980138),
		g.FromUint64(17275303675000904868),
		g.FromUint64(11831395338463193314),
		g.FromUint64(281267649235863375),
	}

	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Logf("Expected: [%v], got: [%v]\n", g.ToString(expected[:]...), g.ToString(res[:]...))
			t.FailNow()
		}
	}
}

func TestHashTwoToOne(t *testing.T) {
	input1 := HashOut{
		g.FromUint64(3777312593917610528),
		g.FromUint64(6858608920877200812),
		g.FromUint64(5269611035257552853),
		g.FromUint64(10607733449481270434),
	}

	input2 := HashOut{
		g.FromUint64(10355703322562521155),
		g.FromUint64(1039917189921776884),
		g.FromUint64(10844249567941924238),
		g.FromUint64(14291130953945924124),
	}

	expected := HashOut{
		g.FromUint64(1453933811752520343),
		g.FromUint64(16186418140372484281),
		g.FromUint64(9207215809524681813),
		g.FromUint64(10182182911172027974),
	}

	res := HashTwoToOne(input1, input2)
	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestHashNToOne(t *testing.T) {
	hashIns := []HashOut{HashNToHashNoPad([]g.Element{
		g.FromUint64(18231458557829081414),
		g.FromUint64(16449039301999856654),
		g.FromUint64(14758090268883299362),
		g.FromUint64(10271725147130672875),
		g.FromUint64(6253304685402495037),
		g.FromUint64(16079709420464120062),
		g.FromUint64(10838593640248082543),
		g.FromUint64(2974225335734585509),
		g.FromUint64(6365466669981419503),
		g.FromUint64(12964544245312854826),
		g.FromUint64(3161534615047618958),
		g.FromUint64(15109271288782125222),
	})}
	for i := 1; i < 12; i++ {
		hashIns = append(hashIns, HashTwoToOne(hashIns[i-1], hashIns[i-1]))
	}

	res := HashNToOne(hashIns)
	expected := HashOut{
		g.FromUint64(3346041518891302234),
		g.FromUint64(10181430332820953144),
		g.FromUint64(14852547783810217847),
		g.FromUint64(17043509806476508794),
	}
	for i := 0; i < 4; i++ {
		if res[i] != expected[i] {
			t.Fail()
		}
	}
}

func TestHashToQuinticExtension(t *testing.T) {
	result := HashToQuinticExtension([]g.Element{
		g.FromUint64(3451004116618606032),
		g.FromUint64(11263134342958518251),
		g.FromUint64(10957204882857370932),
		g.FromUint64(5369763041201481933),
		g.FromUint64(7695734348563036858),
		g.FromUint64(1393419330378128434),
		g.FromUint64(7387917082382606332),
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
