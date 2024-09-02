

const triggers = [
    { _id: 'contact' },
    { _id: 'registration' },
    { _id: 'registration_confirmed' },
    { _id: 'newsletter' },
    { _id: 'reset_password' },
    { _id: 'new_order' },
];
export default triggers;
export function getTriggers(query: any) { return triggers }
