// Spoke-length formula (direct port from the design spreadsheet):
//   L = sqrt( (fd/2 * sin(2π * X / (N/2)))²
//           + (ERD/2 - (fd/2 * cos(2π * X / (N/2))))²
//           + ftc² ) - shd/2
// fd = flange diameter, X = crossings, N = spoke count, ftc = flange-to-center

export type WheelSide = "front" | "rear";

/** Fields from rim catalog used by spoke math */
export interface RimForCalc {
  erd: number;
  asym?: number;
}

/** Fields from hub catalog used by spoke math */
export interface HubForCalc {
  fdL: number;
  ftcL: number;
  ftcR: number;
  fdR: number;
  shd?: number;
}

export interface CalcSpokesInput {
  rim: RimForCalc | null | undefined;
  hub: HubForCalc | null | undefined;
  holes: number | null | undefined;
  crossings: number | null | undefined;
  wheelSide: WheelSide;
}

function computeSide(
  fd: number,
  ftc: number,
  erd: number,
  X: number,
  N: number,
  shd: number
): number {
  const halfN = N / 2;
  const angle = (2 * Math.PI * X) / halfN;
  const a = (fd / 2) * Math.sin(angle);
  const b = erd / 2 - (fd / 2) * Math.cos(angle);
  return Math.sqrt(a * a + b * b + ftc * ftc) - shd / 2;
}

// Asymmetric rim offset moves the spoke bed toward the non-drive/non-disc side,
// lengthening the drive/disc-side effective FTC and shortening the other.
export function calcSpokes({
  rim,
  hub,
  holes,
  crossings,
  wheelSide,
}: CalcSpokesInput): { left: number; right: number } | null {
  if (!rim || !hub || !holes || crossings == null) return null;
  const erd = rim.erd;
  const asym = rim.asym || 0;
  const shd = hub.shd || 2.6;

  let ftcL, ftcR;
  if (wheelSide === "front") {
    ftcL = hub.ftcL + asym;
    ftcR = hub.ftcR - asym;
  } else {
    ftcL = hub.ftcL - asym;
    ftcR = hub.ftcR + asym;
  }

  const left = computeSide(hub.fdL, ftcL, erd, crossings, holes, shd);
  const right = computeSide(hub.fdR, ftcR, erd, crossings, holes, shd);
  return { left, right };
}

// Round to nearest even mm using spreadsheet convention: (raw - 0.6) → ceil to even
export function roundSpoke(raw: number | null | undefined): number | null {
  if (raw == null || !Number.isFinite(raw)) return null;
  const adjusted = raw - 0.6;
  return Math.ceil(adjusted / 2) * 2;
}
