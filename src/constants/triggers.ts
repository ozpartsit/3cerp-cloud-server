

const triggers = [
    { _id: 'contact', type: 'marketing' },
    { _id: 'registration', type: 'account' },
    { _id: 'registration_confirmed', type: 'account' },
    { _id: 'newsletter', type: 'marketing' },
    { _id: 'reset_password', type: 'account' },
    { _id: 'new_order', type: 'orders' },
];
export default triggers;
export function getTriggers(query: any) { return triggers }
