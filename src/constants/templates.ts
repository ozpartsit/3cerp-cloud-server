const templates = [
    { _id: 'default', name: "Default" },
    { _id: 'tacko', name: "Tacko (Automotive)" },
    { _id: 'tacko2', name: "Tacko (CMS)" },
]
export default templates;
export function getTemplates(query: any) { return templates }