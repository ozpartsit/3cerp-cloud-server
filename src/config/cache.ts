import NodeCache from "node-cache";

// Ustawienie czasu życia cache (w sekundach)
const cache = new NodeCache({ stdTTL: 60 * 20, checkperiod: 120 * 20 });

export default cache;