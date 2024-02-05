const countries = [
    { _id: '$eq' },
    { _id: '$ne' },
    { _id: '$gt' },
    { _id: '$gte' },
    { _id: '$lt' },
    { _id: '$lte' },
    { _id: '$in' },
    { _id: '$nin' },

];
export default countries;
export function getCountries(query: any) { return countries }
