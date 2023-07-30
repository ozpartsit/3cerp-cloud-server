import cache from "../config/cache";
const states = {
    PL: ["PL_DS", "PL_KP", "PL_LU", "PL_LB", "PL_MZ", "PL_MA", "PL_OP", "PL_PK", "PL_PD", "PL_PM", "PL_WN", "PL_WP", "PL_ZP", "PL_LD", "PL_SL", "PL_SK"],
    GB: ["GB_NIR", "GB_ENG", "GB_SCT", "GB_WLS"]

};
export default states;

export async function getStates(query: any) {
    if (query.country) {
        return states[query.country];
    }
    if (query.id) {
        let document = cache.get<any>(query.id);
        if (document) {
            if (query.field == 'billingState')
                return states[document["billingCountry"]]||[];
            else return states[document["shippingCountry"]]||[];
        } else {
            return Object.values(states).reduce((total, s) => { total.push(...s); return total }, [])
        }
    }
};
