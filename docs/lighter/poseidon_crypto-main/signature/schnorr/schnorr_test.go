package signature

import (
	"testing"

	curve "github.com/elliottech/poseidon_crypto/curve/ecgfp5"
	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	gFp5 "github.com/elliottech/poseidon_crypto/field/goldilocks_quintic_extension"
	p2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
)

func TestSchnorrSignAndVerify(t *testing.T) {
	sk := curve.SampleScalarCrypto() // Sample a secret key
	msg := g.RandArray(244)
	hashedMsg := p2.HashToQuinticExtension(msg)
	k := curve.SampleScalarCrypto()

	sig := SchnorrSignHashedMessage2(hashedMsg, sk, k)
	pk := SchnorrPkFromSk(sk)
	if !IsSchnorrSignatureValid(&pk, &hashedMsg, sig) {
		t.Fatalf("Signature is invalid")
	}
}

func TestComparativeSchnorrSignAndVerify(t *testing.T) {
	sks := []curve.ECgFp5Scalar{
		curve.ECgFp5Scalar{
			12235002942052073545,
			1175977464658719998,
			8536934969147463310,
			6524687619313720391,
			2922072024880609112,
		},
		curve.ECgFp5Scalar{
			14609471659974493146,
			15558617123161593410,
			853367204868339037,
			17594253198278631904,
			368396584122947478,
		},
		curve.ECgFp5Scalar{
			846395111423676945, 1354180063821346280, 5751371120309175011, 4898038106472090654, 1076345918732914302,
		},
	}
	hashedMessages := []gFp5.Element{
		gFp5.Element{
			g.FromUint64(8398652514106806347),
			g.FromUint64(11069112711939986896),
			g.FromUint64(9732488227085561369),
			g.FromUint64(18076754337204438535),
			g.FromUint64(17155407358725346236),
		},
		gFp5.Element{
			g.FromUint64(14569490467507212064),
			g.FromUint64(2707063505563578676),
			g.FromUint64(7506743487465742335),
			g.FromUint64(12569771346154554175),
			g.FromUint64(4305083698940175790),
		},
		gFp5.Element{
			g.FromUint64(17529153479246803593),
			g.FromUint64(1743712677205511695),
			g.FromUint64(4834285972617397460),
			g.FromUint64(5486672566342530358),
			g.FromUint64(7254989001695704129),
		},
	}
	ks := []curve.ECgFp5Scalar{
		curve.ECgFp5Scalar{
			5245666847777449560,
			15178169970799106939,
			4403065012435293749,
			15306540389399388999,
			8935555081913173844,
		},
		curve.ECgFp5Scalar{
			1980123857560067020,
			10696795398834097509,
			3211831869376171671,
			6194822139276031840,
			3482023782412490864,
		},
		curve.ECgFp5Scalar{
			10299597990997564957, 8547298489021408803, 12250978550108858722, 5282281975236198197, 5328603554431393061,
		},
	}
	expectedSs := [][5]uint64{
		[5]uint64{
			6950590877883398434,
			17178336263794770543,
			11012823478139181320,
			16445091359523510936,
			5882925226143600273,
		},
		[5]uint64{
			15189311883262425203,
			16924634885527914505,
			11098200095411565797,
			11441434601417451505,
			2245797172600273048,
		},
		[5]uint64{
			1747989245728027396, 18083435619737379521, 18276259610811995786, 15101757397705334408, 5007814817019340642,
		},
	}
	expectedEs := [][5]uint64{
		[5]uint64{
			4544744459434870309,
			4180764085957612004,
			3024669018778978615,
			15433417688859446606,
			6775027260348937828,
		},
		[5]uint64{
			4905460437060282008,
			9275377852059362729,
			10383772785796962929,
			6858067464918579610,
			7078247668913970626,
		},
		[5]uint64{
			4911725746357568132, 12205663641120664338, 16433506899074513700, 14763562571101437023, 2547950465160283358,
		},
	}

	for i := 0; i < len(sks); i++ {
		sig := SchnorrSignHashedMessage2(hashedMessages[i], sks[i], ks[i])
		for j := 0; j < 5; j++ {
			if sig.S[j] != expectedSs[i][j] {
				t.Fatalf("sig.S[%d]: Expected %d, but got %d", j, expectedSs[i][j], sig.S[j])
			}
			if sig.E[j] != expectedEs[i][j] {
				t.Fatalf("sig.E[%d]: Expected %d, but got %d", j, expectedEs[i][j], sig.E[j])
			}
		}

		pk := SchnorrPkFromSk(sks[i])
		if !IsSchnorrSignatureValid(&pk, &hashedMessages[i], sig) {
			t.Fatalf("Signature is invalid")
		}
	}
}

func TestBytes(t *testing.T) {
	sk := curve.SampleScalarCrypto() // Sample a secret key
	msg := g.RandArray(244)          // Random message of 244 field elements (big)
	hashedMsg := p2.HashToQuinticExtension(msg)

	sig := SchnorrSignHashedMessage(hashedMsg, sk)
	sig2, _ := SigFromBytes(sig.ToBytes())
	if !sig2.S.Equals(&sig.S) || !sig2.E.Equals(&sig.E) {
		t.Fatalf("bytes do not match")
	}

	pk, _ := gFp5.FromCanonicalLittleEndianBytes(SchnorrPkFromSk(sk).ToLittleEndianBytes())

	if err := Validate(pk.ToLittleEndianBytes(), hashedMsg.ToLittleEndianBytes(), sig2.ToBytes()); err != nil {
		t.Fatalf("Signature is invalid")
	}
}
