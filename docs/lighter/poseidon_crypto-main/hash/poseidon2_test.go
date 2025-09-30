package hash

import (
	"bufio"
	"crypto/sha256"
	"fmt"
	"math/rand/v2"
	"os"
	"runtime"
	"strconv"
	"strings"
	"testing"
	"time"

	g "github.com/elliottech/poseidon_crypto/field/goldilocks"
	poseidon2_gnark "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks"
	poseidon2_plonky2 "github.com/elliottech/poseidon_crypto/hash/poseidon2_goldilocks_plonky2"
)

func TestLongRunningCompare(t *testing.T) {
	run := os.Getenv("LONG_RUNNING_TESTS")
	if run != "true" {
		t.Skip("Skipping long running test")
	}

	file := os.Getenv("LONG_RUNNING_TESTS_FILE")

	// Generate random 12 inputs
	for j := 0; j < 1_000_000_000; j++ {
		inputs := make([]uint64, 12)
		for i := 0; i < 12; i++ {
			inputs[i] = rand.Uint64N(g.ORDER)
		}

		// Convert to GoldilocksField
		gInputs := make([]g.GoldilocksField, 0, 12)
		for _, input := range inputs {
			gInputs = append(gInputs, g.GoldilocksField(input))
		}
		gOutputs := poseidon2_plonky2.HashNToMNoPad(gInputs, 12)

		// Convert to Element
		eInputs := make([]g.Element, 0, 12)
		for _, input := range inputs {
			eInputs = append(eInputs, g.NewElement(input))
		}
		eOutputs := poseidon2_gnark.HashNToMNoPad(eInputs, 12)

		// Compare
		for i := 0; i < 12; i++ {
			if gOutputs[i].ToCanonicalUint64() != eOutputs[i].Uint64() {
				if file != "" {
					f, err := os.OpenFile(file, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
					if err != nil {
						t.Logf("Error: %v\n", err)
						t.FailNow()
					}
					defer f.Close()

					_, err = f.WriteString("<--- Mismatch --->\n")
					if err != nil {
						t.Logf("Error: %v\n", err)
						t.FailNow()
					}
					_, err = f.WriteString(fmt.Sprintf("Inputs: %v; %v; [%v]\n", inputs, gInputs, g.ToString(eInputs...)))
					if err != nil {
						t.Logf("Error: %v\n", err)
						t.FailNow()
					}
					_, err = f.WriteString(fmt.Sprintf("Outputs: %v; [%v]\n\n", gOutputs, g.ToString(eOutputs...)))
					if err != nil {
						t.Logf("Error: %v\n", err)
						t.FailNow()
					}
					f.Close()
				} else {
					t.Log("<--- Mismatch --->")
					t.Logf("Inputs: %v; %v; [%v]", inputs, gInputs, g.ToString(eInputs...))
					t.Logf("Outputs: %v; [%v]", gOutputs, g.ToString(eOutputs...))
					t.FailNow()
				}
				break
			}
		}
	}

	t.Log("Completed long-running comparison.")
}

func TestPoseidon2Bench(t *testing.T) {
	inputs, err := readBenchInputs("bench_vector")
	totalInputs := len(inputs)
	if err != nil {
		t.Logf("Error: %v\n", err)
		t.FailNow()
	}

	for i := 0; i < 10; i++ {
		PrintMemUsage()

		results := make([]g.GoldilocksField, 0, 4*len(inputs))
		start := time.Now()
		for _, input := range inputs {
			res := poseidon2_plonky2.HashNToHashNoPad(input)
			results = append(results, res[:]...)
		}
		duration := time.Since(start)
		t.Logf("HashNToHashNoPad plonky2 took %s for %d inputs", duration, totalInputs)

		sha2 := sha256.New()
		for _, res := range results {
			sha2.Write(g.ToLittleEndianBytesF(res))
		}
		t.Logf("Hash: %x\n", sha2.Sum(nil))
	}
}

func TestPoseidon2HasherBench(t *testing.T) {
	inputs, err := readBenchInputsBytes("bench_vector")
	totalInputs := len(inputs)
	if err != nil {
		t.Logf("Error: %v\n", err)
		t.FailNow()
	}

	hasher := poseidon2_plonky2.NewPoseidon2()
	start1 := time.Now()

	for i := 0; i < 10; i++ {
		PrintMemUsage()

		results := make([]byte, 0, 4*8*len(inputs))
		start := time.Now()
		for _, input := range inputs {
			for _, b := range input {
				hasher.Write(b)
			}
			res := hasher.Sum(nil)
			hasher.Reset()
			results = append(results, res...)
		}
		duration := time.Since(start)
		t.Logf("Hasher plonky2 took %s for %d inputs", duration, totalInputs)

		sha2 := sha256.New()
		sha2.Write(results)
		t.Logf("Hash: %x\n", sha2.Sum(nil))
	}

	duration := time.Since(start1)
	t.Logf("===> Hasher plonky2 took %s", duration)
}

func TestPoseidon2BenchOld(t *testing.T) {
	inputs, err := readBenchInputsOld("bench_vector")
	totalInputs := len(inputs)
	if err != nil {
		t.Logf("Error: %v\n", err)
		t.FailNow()
	}

	results := make([]g.Element, 0, 4*len(inputs))
	start := time.Now()
	for _, input := range inputs {
		res := poseidon2_gnark.HashNToHashNoPad(input)
		results = append(results, res[:]...)
	}
	duration := time.Since(start)
	t.Logf("HashNToHashNoPadPure gnark took %s for %d inputs", duration, totalInputs)

	sha2 := sha256.New()
	for _, res := range results {
		sha2.Write(g.ToLittleEndianBytes(res))
	}
	hash := sha2.Sum(nil)
	t.Logf("Hash: %x\n", hash)
}

func readBenchInputs(filename string) ([][]g.GoldilocksField, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var inputs [][]g.GoldilocksField

	for scanner.Scan() {
		line := scanner.Text()
		strVals := strings.Split(line, ",")
		var input []g.GoldilocksField
		for _, strVal := range strVals {
			val, err := strconv.ParseUint(strVal, 10, 64)
			if err != nil {
				return nil, fmt.Errorf("failed to parse uint64: %v", err)
			}
			input = append(input, g.GoldilocksField(val))
		}
		inputs = append(inputs, input)
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	return inputs, nil
}

func readBenchInputsBytes(filename string) ([][][]byte, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var inputs [][][]byte

	for scanner.Scan() {
		line := scanner.Text()
		strVals := strings.Split(line, ",")
		var input [][]byte
		for _, strVal := range strVals {
			val, err := strconv.ParseUint(strVal, 10, 64)
			if err != nil {
				return nil, fmt.Errorf("failed to parse uint64: %v", err)
			}
			input = append(input, g.ToLittleEndianBytesF(g.GoldilocksField(val)))
		}
		inputs = append(inputs, input)
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	return inputs, nil
}

func readBenchInputsOld(filename string) ([][]g.Element, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var inputs [][]g.Element

	for scanner.Scan() {
		line := scanner.Text()
		strVals := strings.Split(line, ",")
		var input []g.Element
		for _, strVal := range strVals {
			val, err := strconv.ParseUint(strVal, 10, 64)
			if err != nil {
				return nil, fmt.Errorf("failed to parse uint64: %v", err)
			}
			input = append(input, g.NewElement(val))
		}
		inputs = append(inputs, input)
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	return inputs, nil
}

func PrintMemUsage() {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	// For info on each, see: https://golang.org/pkg/runtime/#MemStats
	fmt.Printf("Alloc = %v Bytes", m.Alloc)
	fmt.Printf("\tTotalAlloc = %v Bytes", m.TotalAlloc)
	fmt.Printf("\tSys = %v Bytes", m.Sys)
	fmt.Printf("\tNumGC = %v\n", m.NumGC)
}
