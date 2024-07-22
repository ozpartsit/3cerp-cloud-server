

const dataRanges = [
    { _id: '$thisYear' },
    { _id: '$lastYear' },
    { _id: '$thisMonth' },
    { _id: '$lastMonth' },
    { _id: '$thisQuarter' },
    { _id: '$lastQuarter' },

];
export default dataRanges;
export function getDataRanges(query: any) { return dataRanges }
