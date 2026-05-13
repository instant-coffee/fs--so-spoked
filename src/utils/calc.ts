// Spoke-length formula from spokeCalc.xlsx, simplified via the law of cosines:
//   L = sqrt( (fd/2)² + (ERDe/2)² − 2·(fd/2)·(ERDe/2)·cos(θ) + ftce² ) − shd/2
// where θ = 4π·X/N. This is mathematically identical to the original
//   sqrt((fd/2·sinθ)² + (ERDe/2 − fd/2·cosθ)² + ftce²) − shd/2
// but drops the sin() call and lets cos(θ) be reused across both sides.
//
// fd  = flange diameter           ERDe = effective ERD (rim.erd + nipple.erdAdj)
// X   = crossings                 N    = hole count
// ftc = flange-to-center          ftce = effective ftc (with asym applied)
// shd = spoke-hole diameter on the flange

export type WheelSide = "front" | "rear";
export type Rounding = "raw" | "even" | "odd";

export interface RimForCalc {
  erd: number;
  asym?: number;
}

export interface HubForCalc {
  fdL: number;
  ftcL: number;
  ftcR: number;
  fdR: number;
  shd?: number;
}

export interface NippleForCalc {
  erdAdj: number;
}

export interface CalcSpokesInput {
  rim: RimForCalc | null | undefined;
  hub: HubForCalc | null | undefined;
  nipple?: NippleForCalc | null;
  holes: number | null | undefined;
  crossings: number | null | undefined;
  wheelSide: WheelSide;
}

function sideLength(
  fd: number,
  ftc: number,
  erdeHalf: number,
  erdeHalfSq: number,
  cosAngle: number,
  shd: number
): number {
  const fdHalf = fd / 2;
  const d2 = fdHalf * fdHalf + erdeHalfSq - 2 * fdHalf * erdeHalf * cosAngle;
  return Math.sqrt(d2 + ftc * ftc) - shd / 2;
}

// Asymmetric rim offset shifts the spoke bed toward the non-drive/non-disc side,
// lengthening the drive/disc-side effective ftc and shortening the other.
export function calcSpokes({
  rim,
  hub,
  nipple,
  holes,
  crossings,
  wheelSide,
}: CalcSpokesInput): { left: number; right: number } | null {
  if (!rim || !hub || !holes || crossings == null) return null;

  const erde = rim.erd + (nipple?.erdAdj ?? 0);
  const erdeHalf = erde / 2;
  const erdeHalfSq = erdeHalf * erdeHalf;
  const angle = (4 * Math.PI * crossings) / holes;
  const cosAngle = Math.cos(angle);
  const shd = hub.shd ?? 2.6;

  const asym = rim.asym ?? 0;
  const sign = wheelSide === "front" ? 1 : -1;
  const ftcL = hub.ftcL + sign * asym;
  const ftcR = hub.ftcR - sign * asym;

  return {
    left: sideLength(hub.fdL, ftcL, erdeHalf, erdeHalfSq, cosAngle, shd),
    right: sideLength(hub.fdR, ftcR, erdeHalf, erdeHalfSq, cosAngle, shd),
  };
}

// Excel ODD()/EVEN(): round away from zero to the next odd/even integer.
function excelEven(x: number): number {
  const s = x < 0 ? -1 : 1;
  return s * 2 * Math.ceil(Math.abs(x) / 2);
}

function excelOdd(x: number): number {
  const s = x < 0 ? -1 : 1;
  return s * (2 * Math.ceil((Math.abs(x) - 1) / 2) + 1);
}

// The spreadsheet shifts the raw length by 0.6 mm before rounding so that values
// like 266.40 round down while 266.41 rounds up (note in Front Calculator!D19).
const ROUND_OFFSET = 0.6;

export function roundSpoke(
  raw: number | null | undefined,
  mode: Rounding = "even"
): number | null {
  if (raw == null || !Number.isFinite(raw)) return null;
  if (mode === "raw") return raw;
  const adjusted = raw - ROUND_OFFSET;
  return mode === "even" ? excelEven(adjusted) : excelOdd(adjusted);
}
