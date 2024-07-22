

const intervals = [
    { _id: '$yearly' },
    { _id: '$quartly' },
    { _id: '$weekly' },
    { _id: '$mounthly' },

];
export default intervals;
export function getIntervals(query: any) { return intervals }
