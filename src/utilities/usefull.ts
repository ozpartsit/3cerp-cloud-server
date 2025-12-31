import { promises as fs } from "fs";
import axios, { AxiosError } from "axios";

/**
 * Zaokrągla liczbę do podanej liczby miejsc po przecinku.
 * @param {number} val - Liczba do zaokrąglenia.
 * @param {number} [n=2] - Liczba miejsc po przecinku.
 * @returns {number} Zaokrąglona liczba.
 * @example
 * roundToPrecision(1.005, 2) // => 1.01
 * roundToPrecision(1.004, 2) // => 1.00
 */
export function roundToPrecision(val: number, n: number = 2): number {
  if (isNaN(val)) {
    // Chociaż TypeScript powinien to wyłapać na etapie kompilacji,
    // to zabezpieczenie jest przydatne w przypadku dynamicznego kodu.
    throw new Error(`Wartość "${val}" nie jest prawidłową liczbą.`);
  }
  const d = Math.pow(10, n);
  return Math.round((val + Number.EPSILON) * d) / d;
}

/**
 * Asynchronicznie pobiera rozmiar pliku w bajtach.
 * @param {string} filename - Ścieżka do pliku.
 * @returns {Promise<number>} Rozmiar pliku w bajtach.
 */
export async function getFileSize(filename:string): Promise<number> {
  const stats = await fs.stat(filename);
  return stats.size;
}

/**
 * Tworzy przyjazny dla URL slug z podanego tekstu.
 * Konwertuje tekst na małe litery, usuwa znaki diakrytyczne,
 * zamienia spacje na myślniki i usuwa niedozwolone znaki.
 * @param {string} text - Tekst do przekonwertowania.
 * @returns {string} Wygenerowany slug.
 * @example
 * encodeURIComponentFn("Jakiś Ładny Tytuł!") // => "jakis-ladny-tytul"
 */
export function encodeURIComponentFn(text: string): string {
  if (!text) return "";
  
  return text
    .toString()
    .normalize('NFD') // Rozkłada znaki diakrytyczne na podstawowe litery i znaki diakrytyczne
    .replace(/[\u0300-\u036f]/g, '') // Usuwa znaki diakrytyczne
    .toLowerCase() // Konwertuje na małe litery
    .trim() // Usuwa białe znaki z początku i końca
    .replace(/\s+/g, '-') // Zamienia spacje na myślniki
    .replace(/[^\w-]+/g, '') // Usuwa wszystkie znaki, które nie są słowami ani myślnikami
    .replace(/--+/g, '-'); // Zamienia wielokrotne myślniki na pojedynczy
}

/**
 * Interfejs dla współrzędnych geograficznych.
 */
interface ICoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Pobiera współrzędne geograficzne dla podanego adresu przy użyciu Google Geocoding API.
 * @param {string} address - Adres do geokodowania.
 * @returns {Promise<ICoordinates | null>} Obiekt z szerokością i długością geograficzną lub null w przypadku błędu.
 */
export async function geocode(address: string): Promise<ICoordinates | null> {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Brak klucza GOOGLE_API_KEY w zmiennych środowiskowych.");
    return null;
  }

  if (!address) {
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_API_KEY}`
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      console.warn(`Geokodowanie nie powiodło się dla adresu: "${address}". Status: ${response.data.status}`);
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Błąd podczas geokodowania adresu: "${address}".`, axiosError.message);
    return null;
  }
}