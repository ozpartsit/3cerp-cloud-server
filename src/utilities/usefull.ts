import fs from "fs";
import axios from "axios";
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

export function encodeURIComponentFn(tekst) {
  // Usuwanie diakrytyków i innych znaków specjalnych
  let zakodowanyTekst = tekst.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Zamiana spacji na '-'
  zakodowanyTekst = zakodowanyTekst.replace(/ /g, '-');

  // Kodowanie URI
  return encodeURIComponent(zakodowanyTekst);
}

export async function geocode(geoCodeHint: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(geoCodeHint)}&key=${process.env.GOOGLE_API_KEY}`
    );
    return {
      latitude: response.data.results[0].geometry.location.lat,
      longitude: response.data.results[0].geometry.location.lng
    };
  } catch (err) {
    return {};
  }
}