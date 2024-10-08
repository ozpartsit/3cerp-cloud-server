import NodeCache from "node-cache";

// Ustawienie czasu życia cache (w sekundach)
const cache = new NodeCache({ useClones: false, stdTTL: 60 * 60, checkperiod: 120 * 60 });

export default cache;