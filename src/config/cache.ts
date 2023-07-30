import NodeCache from "node-cache";

// Ustawienie czasu życia cache (w sekundach)
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export default cache;