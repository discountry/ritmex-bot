package poseidon_bn254

import (
	"math/big"

	"github.com/consensys/gnark-crypto/ecc/bn254/fr"
	"github.com/elliottech/poseidon_crypto/hash/poseidon_bn254/constants"
)

// Number of full rounds
const rf = 8

var alpha = big.NewInt(5)

// Number of partial rounds rounded up to nearest integer that divides by t in [2, 13]
var rp = []int{56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68}

// Round constants and matrices
var (
	c, s [][]*fr.Element
	m, p [][][]*fr.Element
)

func toElement(value string) *fr.Element {
	n, success := new(big.Int).SetString(value, 16)
	if !success {
		panic("Error parsing hex number")
	}
	e := fr.Element{0, 0, 0, 0}
	e.SetBigInt(n)
	return &e
}

func init() {
	var size = len(rp)
	c = make([][]*fr.Element, size)
	s = make([][]*fr.Element, size)
	m = make([][][]*fr.Element, size)
	p = make([][][]*fr.Element, size)

	for i := 0; i < size; i++ {
		// initialize round constants and matrices
		c[i] = make([]*fr.Element, len(constants.CStr[i]))
		s[i] = make([]*fr.Element, len(constants.SStr[i]))
		m[i] = make([][]*fr.Element, len(constants.MStr[i]))
		p[i] = make([][]*fr.Element, len(constants.PStr[i]))

		for j := 0; j < len(c[i]); j++ {
			c[i][j] = toElement(constants.CStr[i][j])
		}
		for j := 0; j < len(s[i]); j++ {
			s[i][j] = toElement(constants.SStr[i][j])
		}
		for j := 0; j < len(m[i]); j++ {
			m[i][j] = make([]*fr.Element, len(constants.MStr[i][j]))
			for k := 0; k < len(m[i][j]); k++ {
				m[i][j][k] = toElement(constants.MStr[i][j][k])
			}
		}
		for j := 0; j < len(p[i]); j++ {
			p[i][j] = make([]*fr.Element, len(constants.PStr[i][j]))
			for k := 0; k < len(p[i][j]); k++ {
				p[i][j][k] = toElement(constants.PStr[i][j][k])
			}
		}
	}
}
