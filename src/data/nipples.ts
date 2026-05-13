// ERD adjustments come from the spokeCalc.xlsx "Nipple Data" sheet.
// erdAdj is added to the rim's ERD before computing spoke length.

export const NIPPLES = [
  {
    id: "dsh-16",
    label: "Double Square Head, 16mm",
    erdAdj: 3.0,
  },
  {
    id: "dt-squorx-16",
    label: "DT Squorx, 16mm",
    erdAdj: 3.0,
  },
  {
    id: "hex-14",
    label: "Hex Head, 14mm",
    erdAdj: 2.0,
  },
  {
    id: "reg-12",
    label: "Regular head, 12mm",
    erdAdj: 1.0,
  },
  {
    id: "reg-14",
    label: "Regular head, 14mm",
    erdAdj: 1.0,
  },
  {
    id: "reg-16",
    label: "Regular head, 16mm",
    erdAdj: 0.0,
  },
  {
    id: "internal",
    label: "Internal (adds 8mm to ERD)",
    erdAdj: 8.0,
  },
];

export const DEFAULT_NIPPLE_ID = "dsh-16";
