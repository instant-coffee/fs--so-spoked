# spokeCalc.xlsx — Calculation Extraction

Source file: `/Users/lachnobl/Documents/ReDesign/spokeCalc.xlsx` (14 sheets).
This document is the canonical reference for every formula in the workbook, restated for a TypeScript implementation.

---

## 1. Sheet inventory

| Sheet                                                                                | Role                                                                       |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `Front Calculator`                                                                   | Single front-wheel calculator (user-facing)                                |
| `Rear Calculator`                                                                    | Single rear-wheel calculator (user-facing)                                 |
| `Common Calc (MTN)`                                                                  | Batch calculator: one rim across 17 hub options                            |
| `Rim Data`                                                                           | Lookup table — ERD, asym, typical lacing/holes per rim                     |
| `Front Hub Data`                                                                     | Lookup table — flange dims per front hub                                   |
| `Rear Hub Data`                                                                      | Lookup table — flange dims per rear hub                                    |
| `Lacing Pattern Data`                                                                | Lookup — lacing name → crossings (number, decimals allowed)                |
| `Hole Count Data`                                                                    | Lookup — "32h" → 32                                                        |
| `Nipple Data`                                                                        | Lookup — nipple type → ERD adjustment (mm)                                 |
| `EthosSR Lengths`, `BERD MTN Exacts`, `BERD MTN`, `BERD Rounded`, `BERD ROAD Exacts` | Reference data: pre-computed spoke length tables for specific spoke brands |

The user-facing math lives in `Front Calculator`, `Rear Calculator`, and `Common Calc (MTN)`. The five reference sheets are derived outputs, not new logic.

---

## 2. The core spoke-length formula

The single non-trivial formula in the workbook, repeated dozens of times:

```
L = sqrt( (fd/2 · sin(2π · X / (N/2)))²
        + (ERDe/2 − fd/2 · cos(2π · X / (N/2)))²
        + ftce² )
    − shd/2
```

| Symbol | Meaning                                       | Spreadsheet source              |
| ------ | --------------------------------------------- | ------------------------------- |
| `L`    | Raw spoke length (mm), one side               | Front Calc `B16`/`B17`          |
| `fd`   | Flange diameter (left or right)               | Hub data, col B or E            |
| `X`    | Crossings (number, decimals allowed)          | Lacing Pattern Data, col B      |
| `N`    | Spoke / hole count                            | Hole Count Data, col B          |
| `ERDe` | **Effective** ERD = `rim.erd + nipple.erdAdj` | Front Calc `G11 = C5 + C11`     |
| `ftce` | **Effective** flange-to-center (see §3)       | Front Calc `G13`, `G14`         |
| `shd`  | Spoke-hole diameter on the flange             | Hub data, col F (typically 2.6) |

Excel literal example (`Front Calculator!B16`, disc/left side):

```
=SQRT( (C$2/2 * SIN(2*PI()*C7/(C$9/2)))^2
     + (G$11/2 - (C$2/2 * COS(2*PI()*C7/(C$9/2))))^2
     + G$13^2)
- G$2/2
```

---

## 3. Effective values (the pre-calc pipeline)

Before plugging into the formula, three adjustments are applied:

### 3a. Effective ERD — **nipple adjustment**

```
ERDe = rim.erd + nipple.erdAdj
```

- Source: `Front/Rear Calculator!G11 = C5 + C11`, where `C5` is the rim ERD VLOOKUP and `C11` is the nipple-adjustment VLOOKUP.
- `Common Calc (MTN)!B45 = VLOOKUP(...,'Rim Data'!...,2,FALSE) + 3` is a hard-coded `+3` because that sheet assumes double-square-head nipples. **The general case uses the Nipple Data table.**

### 3b. Effective flange-to-center — **asymmetric rim offset**

| Wheel | Left (non-drive / disc)          | Right (drive / non-disc)         |
| ----- | -------------------------------- | -------------------------------- |
| Front | `ftcL_eff = hub.ftcL + rim.asym` | `ftcR_eff = hub.ftcR − rim.asym` |
| Rear  | `ftcL_eff = hub.ftcL − rim.asym` | `ftcR_eff = hub.ftcR + rim.asym` |

Source: `Front Calc!G13/G14`, `Rear Calc!G13/G14`, also `Common Calc!B28/B29/B34/B35/B40/B41`.

This matches your current [src/utils/calc.ts:62](src/utils/calc.ts:62) implementation exactly.

### 3c. Side mapping

| Side label                               | Front wheel   | Rear wheel     |
| ---------------------------------------- | ------------- | -------------- |
| "Left" (formula uses `fdL`, `ftcL_eff`)  | Disc side     | Non-drive side |
| "Right" (formula uses `fdR`, `ftcR_eff`) | Non-disc side | Drive side     |

Use this when labeling UI; the math is the same on both wheel types.

---

## 4. Rounding rules

The spreadsheet produces three numbers per side:

1. **Accurate** — raw `L` to full float precision.
2. **Odd** — `=ODD(L − offset)` — rounds away-from-zero to the next odd integer.
3. **Even** — `=EVEN(L − offset)` — rounds away-from-zero to the next even integer.

Excel's `ODD(x)` and `EVEN(x)` round **up to the next odd/even integer** (away from zero, so 12.0 → 12, 12.01 → 14 for `EVEN`; 13.0 → 13, 13.01 → 15 for `ODD`).

### Offset inconsistency in source

| Location                                                                             | Offset    |
| ------------------------------------------------------------------------------------ | --------- |
| `Front Calc!C19:C23`, `Rear Calc!C19:C23` (the "lacing pattern defined above" panel) | `L − 0.6` |
| `Front Calc!C30:C45`, `Rear Calc!C31:C46` (the 2X / 3X reference panels)             | `L − 0.4` |
| `Common Calc (MTN)!B8:B11` etc.                                                      | `L − 0.6` |

The note in `D19` reads:

> _"subtracts 0.4 off the actual length, so the rounding formula will always round up if the number is 266.41mm for example but if the number is 266.40 it will round down."_

Despite the note saying 0.4, the cell itself uses 0.6. **Treat 0.6 as the canonical offset** — the `−0.4` cells in the lacing-reference panels look like a copy-paste oversight.

Your current `roundSpoke` in [src/utils/calc.ts:76](src/utils/calc.ts:76) implements even rounding with `−0.6`, which is correct. Adding odd rounding would be a small extension.

---

## 5. Lookup tables (verbatim)

### 5a. `Lacing Pattern Data`

| Description               | Crossings |
| ------------------------- | --------- |
| 0-Cross                   | 0         |
| 1-Cross                   | 1         |
| 2-Cross                   | 2         |
| 3-Cross                   | 3         |
| 4-Cross                   | 4         |
| 24 paired spokes laced 2x | 2.25      |
| 24 paired spokes laced 1x | 1.25      |
| 20 paired spokes laced 2x | 2.29      |
| 20 paired spokes laced 1x | 1.29      |
| 16 paired spokes laced 1x | 1.33      |

Note the fractional crossings for paired-spoke patterns — the math accepts any real number for `X`.

### 5b. `Hole Count Data`

| Label | Count |
| ----- | ----- |
| 16h   | 16    |
| 18h   | 18    |
| 20h   | 20    |
| 24h   | 24    |
| 28h   | 28    |
| 32h   | 32    |
| 36h   | 36    |

### 5c. `Nipple Data` — ERD adjustment (mm)

| Nipple type                | Adj  |
| -------------------------- | ---- |
| Double Square Head, 16mm   | +3.0 |
| DT Squorx, 16mm            | +3.0 |
| Hex Head, 14mm             | +2.0 |
| Regular head, 12mm         | +1.0 |
| Regular head, 14mm         | +1.0 |
| Regular head, 16mm         | 0.0  |
| Internal (adds 8mm to ERD) | +8.0 |

**This table is missing from your current `calc.ts`.** See §7.

### 5d. `Rim Data` schema

Columns A–E (1095 rows):
| A | B | C | D | E |
|---|---|---|---|---|
| Rim name | ERD (mm) | Asymmetric Offset (mm) | Typical Lacing | Typical Hole Count |

D and E are defaults to pre-fill the dropdowns when a rim is chosen.

### 5e. `Front Hub Data` / `Rear Hub Data` schema

Columns A–G:
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Hub name | Flange Diameter Left | Flange to Center Left | Flange to Center Right | Flange Diameter Right | Spoke Hole Diameter | Weight (g) |

---

## 6. TypeScript reference implementation

This is the complete, drop-in implementation including the missing nipple adjustment and odd-rounding option.

```ts
// types
export interface Rim {
  erd: number;
  asym: number;
}
export interface Hub {
  fdL: number;
  ftcL: number;
  ftcR: number;
  fdR: number;
  shd?: number;
}
export interface Nipple {
  erdAdj: number;
}

export type WheelSide = "front" | "rear";
export type Rounding = "raw" | "even" | "odd";

// effective values
export function effectiveErd(rim: Rim, nipple: Nipple): number {
  return rim.erd + nipple.erdAdj;
}

export function effectiveFtc(hub: Hub, rim: Rim, wheel: WheelSide) {
  const sign = wheel === "front" ? 1 : -1;
  return {
    left: hub.ftcL + sign * rim.asym,
    right: hub.ftcR - sign * rim.asym,
  };
}

// core formula
function spokeSide(
  fd: number,
  ftc: number,
  erde: number,
  X: number,
  N: number,
  shd: number
) {
  const angle = (2 * Math.PI * X) / (N / 2);
  const a = (fd / 2) * Math.sin(angle);
  const b = erde / 2 - (fd / 2) * Math.cos(angle);
  return Math.sqrt(a * a + b * b + ftc * ftc) - shd / 2;
}

export function calcSpokes(input: {
  rim: Rim;
  hub: Hub;
  nipple: Nipple;
  holes: number;
  crossings: number;
  wheel: WheelSide;
}): { left: number; right: number } {
  const erde = effectiveErd(input.rim, input.nipple);
  const { left: ftcL, right: ftcR } = effectiveFtc(
    input.hub,
    input.rim,
    input.wheel
  );
  const shd = input.hub.shd ?? 2.6;
  return {
    left: spokeSide(
      input.hub.fdL,
      ftcL,
      erde,
      input.crossings,
      input.holes,
      shd
    ),
    right: spokeSide(
      input.hub.fdR,
      ftcR,
      erde,
      input.crossings,
      input.holes,
      shd
    ),
  };
}

// Excel ODD/EVEN: round away from zero to next odd/even integer.
const excelEven = (x: number) => {
  const s = Math.sign(x) || 1;
  return s * 2 * Math.ceil(Math.abs(x) / 2);
};
const excelOdd = (x: number) => {
  const s = Math.sign(x) || 1;
  const n = Math.ceil((Math.abs(x) - 1) / 2);
  return s * (2 * n + 1);
};

const OFFSET = 0.6; // canonical pre-rounding offset

export function roundSpoke(raw: number, mode: Rounding): number {
  if (mode === "raw") return raw;
  const adjusted = raw - OFFSET;
  return mode === "even" ? excelEven(adjusted) : excelOdd(adjusted);
}
```

---

## 7. Gaps between this spreadsheet and your current `calc.ts`

1. **Nipple ERD adjustment is not implemented.** Your code uses `rim.erd` directly; the spreadsheet uses `rim.erd + nipple.erdAdj`. For double-square-head nipples (the most common, +3 mm) this means every spoke length your app currently outputs is **3 mm short** of what the spreadsheet would produce. Fix: add `nipple` to `calcSpokes` input as shown in §6.

2. **Only even rounding is exposed.** The spreadsheet shows both odd and even rounded results side-by-side. Add a `mode: "even" | "odd"` param to `roundSpoke` (also shown in §6).

Everything else — the formula, the asym sign convention, the `−0.6` rounding offset, the data table shapes — matches the spreadsheet exactly.

---

## 8. Data table sizes (for migration planning)

| Sheet               | Rows                     | Cols | Notes                                                          |
| ------------------- | ------------------------ | ---- | -------------------------------------------------------------- |
| Rim Data            | 1095                     | 5    | ~1000 rim entries                                              |
| Front Hub Data      | 147 used (1047 capacity) | 7    |                                                                |
| Rear Hub Data       | 155 used                 | 7    |                                                                |
| Nipple Data         | 7                        | 2    |                                                                |
| Lacing Pattern Data | 10                       | 2    |                                                                |
| Hole Count Data     | 7                        | 2    |                                                                |
| EthosSR Lengths     | 1001                     | 29   | pre-computed reference — likely not needed if you compute live |
| BERD MTN Exacts     | 1138                     | 28   | same                                                           |
| BERD ROAD Exacts    | 1092                     | 27   | same                                                           |
| BERD Rounded        | 33                       | 9    | small summary table                                            |

The five "reference" sheets (BERD/Ethos length tables) are pre-computed outputs of the same formula for specific spoke product lines — you can regenerate them on demand instead of shipping them as data. Skip importing them unless you have a UX reason (e.g. "BERD recommended length").
