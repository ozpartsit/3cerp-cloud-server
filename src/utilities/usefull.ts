import fs from "fs";
// Round a Number to n Decimal Places
// examples: roundToPrecision(1.005,2) result=1.01
// examples: roundToPrecision(1.004,2) result=1.00
export function roundToPrecision(val: number, n: number = 2) {
  let _val = Number(val);
  if (isNaN(_val)) {
    throw new Error("Price: " + val + " is not a number");
  }
  const d = Math.pow(10, n);
  return Math.round((_val + Number.EPSILON) * d) / d;
}

export function getFileSize(filename: string) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
