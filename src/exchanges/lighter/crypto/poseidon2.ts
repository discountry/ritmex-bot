import { Fp } from "./goldilocks";
import { Fp5 } from "./goldilocks-fp5";

const WIDTH = 12;
const RATE = 8;
const ROUNDS_F = 8;
const ROUNDS_F_HALF = 4;
const ROUNDS_P = 22;

const EXTERNAL_CONSTANTS: Fp[][] = [
  [
    new Fp(15492826721047263190n),
    new Fp(11728330187201910315n),
    new Fp(8836021247773420868n),
    new Fp(16777404051263952451n),
    new Fp(5510875212538051896n),
    new Fp(6173089941271892285n),
    new Fp(2927757366422211339n),
    new Fp(10340958981325008808n),
    new Fp(8541987352684552425n),
    new Fp(9739599543776434497n),
    new Fp(15073950188101532019n),
    new Fp(12084856431752384512n),
  ],
  [
    new Fp(4584713381960671270n),
    new Fp(8807052963476652830n),
    new Fp(54136601502601741n),
    new Fp(4872702333905478703n),
    new Fp(5551030319979516287n),
    new Fp(12889366755535460989n),
    new Fp(16329242193178844328n),
    new Fp(412018088475211848n),
    new Fp(10505784623379650541n),
    new Fp(9758812378619434837n),
    new Fp(7421979329386275117n),
    new Fp(375240370024755551n),
  ],
  [
    new Fp(3331431125640721931n),
    new Fp(15684937309956309981n),
    new Fp(578521833432107983n),
    new Fp(14379242000670861838n),
    new Fp(17922409828154900976n),
    new Fp(8153494278429192257n),
    new Fp(15904673920630731971n),
    new Fp(11217863998460634216n),
    new Fp(3301540195510742136n),
    new Fp(9937973023749922003n),
    new Fp(3059102938155026419n),
    new Fp(1895288289490976132n),
  ],
  [
    new Fp(5580912693628927540n),
    new Fp(10064804080494788323n),
    new Fp(9582481583369602410n),
    new Fp(10186259561546797986n),
    new Fp(247426333829703916n),
    new Fp(13193193905461376067n),
    new Fp(6386232593701758044n),
    new Fp(17954717245501896472n),
    new Fp(1531720443376282699n),
    new Fp(2455761864255501970n),
    new Fp(11234429217864304495n),
    new Fp(4746959618548874102n),
  ],
  [
    new Fp(13571697342473846203n),
    new Fp(17477857865056504753n),
    new Fp(15963032953523553760n),
    new Fp(16033593225279635898n),
    new Fp(14252634232868282405n),
    new Fp(8219748254835277737n),
    new Fp(7459165569491914711n),
    new Fp(15855939513193752003n),
    new Fp(16788866461340278896n),
    new Fp(7102224659693946577n),
    new Fp(3024718005636976471n),
    new Fp(13695468978618890430n),
  ],
  [
    new Fp(8214202050877825436n),
    new Fp(2670727992739346204n),
    new Fp(16259532062589659211n),
    new Fp(11869922396257088411n),
    new Fp(3179482916972760137n),
    new Fp(13525476046633427808n),
    new Fp(3217337278042947412n),
    new Fp(14494689598654046340n),
    new Fp(15837379330312175383n),
    new Fp(8029037639801151344n),
    new Fp(2153456285263517937n),
    new Fp(8301106462311849241n),
  ],
  [
    new Fp(13294194396455217955n),
    new Fp(17394768489610594315n),
    new Fp(12847609130464867455n),
    new Fp(14015739446356528640n),
    new Fp(5879251655839607853n),
    new Fp(9747000124977436185n),
    new Fp(8950393546890284269n),
    new Fp(10765765936405694368n),
    new Fp(14695323910334139959n),
    new Fp(16366254691123000864n),
    new Fp(15292774414889043182n),
    new Fp(10910394433429313384n),
  ],
  [
    new Fp(17253424460214596184n),
    new Fp(3442854447664030446n),
    new Fp(3005570425335613727n),
    new Fp(10859158614900201063n),
    new Fp(9763230642109343539n),
    new Fp(6647722546511515039n),
    new Fp(909012944955815706n),
    new Fp(18101204076790399111n),
    new Fp(11588128829349125809n),
    new Fp(15863878496612806566n),
    new Fp(5201119062417750399n),
    new Fp(176665553780565743n),
  ],
];

const INTERNAL_CONSTANTS: Fp[] = [
  new Fp(11921381764981422944n),
  new Fp(10318423381711320787n),
  new Fp(8291411502347000766n),
  new Fp(229948027109387563n),
  new Fp(9152521390190983261n),
  new Fp(7129306032690285515n),
  new Fp(15395989607365232011n),
  new Fp(8641397269074305925n),
  new Fp(17256848792241043600n),
  new Fp(6046475228902245682n),
  new Fp(12041608676381094092n),
  new Fp(12785542378683951657n),
  new Fp(14546032085337914034n),
  new Fp(3304199118235116851n),
  new Fp(16499627707072547655n),
  new Fp(10386478025625759321n),
  new Fp(13475579315436919170n),
  new Fp(16042710511297532028n),
  new Fp(1411266850385657080n),
  new Fp(9024840976168649958n),
  new Fp(14047056970978379368n),
  new Fp(838728605080212101n),
];

const MATRIX_DIAG: Fp[] = [
  new Fp(0xc3b6c08e23ba9300n),
  new Fp(0xd84b5de94a324fb6n),
  new Fp(0x0d0c371c5b35b84fn),
  new Fp(0x7964f570e7188037n),
  new Fp(0x5daf18bbd996604bn),
  new Fp(0x6743bc47b9595257n),
  new Fp(0x5528b9362c59bb70n),
  new Fp(0xac45e25b7127b68bn),
  new Fp(0xa2077d7dfbb606b5n),
  new Fp(0xf3faac6faee378aen),
  new Fp(0x0c6388b51545e883n),
  new Fp(0xd27dbb6944917b60n),
];

export function hashToFp5(values: Fp[]): Fp5 {
  const result = hashNToMNoPad(values, 5);
  const [c0, c1, c2, c3, c4] = result as [Fp, Fp, Fp, Fp, Fp];
  return new Fp5([c0, c1, c2, c3, c4]);
}

export function hashTwoToOne(a: Fp[], b: Fp[]): Fp[] {
  return hashNToMNoPad([...a, ...b], 4);
}

export function hashNToMNoPad(input: Fp[], outputCount: number): Fp[] {
  const state: Fp[] = Array.from({ length: WIDTH }, () => Fp.ZERO);
  for (let offset = 0; offset < input.length; offset += RATE) {
    for (let j = 0; j < RATE && offset + j < input.length; j++) {
      const current = state[j]!;
      const value = input[offset + j];
      if (value === undefined) throw new Error("poseidon input missing element");
      state[j] = current.add(value);
    }
    permute(state);
  }

  const outputs: Fp[] = [];
  while (outputs.length < outputCount) {
    for (let i = 0; i < RATE && outputs.length < outputCount; i++) {
      outputs.push(state[i]!);
    }
    if (outputs.length < outputCount) {
      permute(state);
    }
  }
  return outputs;
}

function permute(state: Fp[]): void {
  externalLinearLayer(state);
  fullRounds(state, 0);
  partialRounds(state);
  fullRounds(state, ROUNDS_F_HALF);
}

function fullRounds(state: Fp[], startRound: number): void {
  for (let r = startRound; r < startRound + ROUNDS_F_HALF; r++) {
    addRoundConstants(state, r);
    sbox(state);
    externalLinearLayer(state);
  }
}

function partialRounds(state: Fp[]): void {
  for (let r = 0; r < ROUNDS_P; r++) {
    addInternalConstant(state, r);
    sboxP(state, 0);
    internalLinearLayer(state);
  }
}

function addRoundConstants(state: Fp[], round: number): void {
  const constants = EXTERNAL_CONSTANTS[round];
  if (!constants) {
    throw new Error(`poseidon round constant missing for round ${round}`);
  }
  for (let i = 0; i < WIDTH; i++) {
    state[i] = state[i]!.add(constants[i]!);
  }
}

function addInternalConstant(state: Fp[], round: number): void {
  const constant = INTERNAL_CONSTANTS[round];
  if (!constant) {
    throw new Error(`poseidon internal constant missing for round ${round}`);
  }
  state[0] = state[0]!.add(constant);
}

function sbox(state: Fp[]): void {
  for (let i = 0; i < WIDTH; i++) {
    sboxP(state, i);
  }
}

function sboxP(state: Fp[], index: number): void {
  const x = state[index];
  if (!x) throw new Error(`poseidon state missing at index ${index}`);
  const x2 = x.square();
  const x3 = x2.mul(x);
  const x6 = x3.square();
  state[index] = x6.mul(x);
}

function externalLinearLayer(state: Fp[]): void {
  for (let block = 0; block < 3; block++) {
    const base = block * 4;
    const s0 = state[base]!;
    const s1 = state[base + 1]!;
    const s2 = state[base + 2]!;
    const s3 = state[base + 3]!;

    const t0 = s0.add(s1);
    const t1 = s2.add(s3);
    const t2 = t0.add(t1);
    const t3 = t2.add(s1);
    const t4 = t2.add(s3);
    const t5 = s0.double();
    const t6 = s2.double();

    state[base] = t3.add(t0);
    state[base + 1] = t6.add(t3);
    state[base + 2] = t1.add(t4);
    state[base + 3] = t5.add(t4);
  }

  const sums: Fp[] = [Fp.ZERO, Fp.ZERO, Fp.ZERO, Fp.ZERO];
  for (let k = 0; k < 4; k++) {
    for (let j = 0; j < WIDTH; j += 4) {
      const currentSum = sums[k];
      if (currentSum === undefined) throw new Error("poseidon sums missing value");
      sums[k] = currentSum.add(state[j + k]!);
    }
  }
  for (let i = 0; i < WIDTH; i++) {
    state[i] = state[i]!.add(sums[i % 4]!);
  }
}

function internalLinearLayer(state: Fp[]): void {
  let sum = state[0]!;
  for (let i = 1; i < WIDTH; i++) {
    sum = sum.add(state[i]!);
  }
  for (let i = 0; i < WIDTH; i++) {
    state[i] = state[i]!.mul(MATRIX_DIAG[i]!).add(sum);
  }
}

export function hashToQuinticExtension(preimage: Fp[]): Fp5 {
  return hashToFp5(preimage);
}

export function hashFp5Pair(a: Fp5, b: Fp5): Fp5 {
  const inputs: Fp[] = [...a.toTuple(), ...b.toTuple()];
  return hashToQuinticExtension(inputs);
}

export function mergeFp5WithHash(fp5Values: Fp5[]): Fp5 {
  if (fp5Values.length === 0) return Fp5.ZERO;
  const first = fp5Values[0];
  if (!first) throw new Error("mergeFp5WithHash received empty array");
  let acc = first;
  for (let i = 1; i < fp5Values.length; i++) {
    const next = fp5Values[i];
    if (!next) throw new Error("mergeFp5WithHash encountered undefined value");
    acc = hashFp5Pair(acc, next);
  }
  return acc;
}
