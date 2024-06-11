const templates = [
    { _id: 'default', name: "Default" },
    { _id: 'tacko', name: "Tacko" },
]
export default templates;
export function getTemplates(query: any) { return templates }