// Function to clean and sanitize XML element names
function cleanXMLName(name: string): string {
     name = name.replace(/[^A-Za-z0-9_.-]+/g, "_");

     name = name.replace(/^_+|_+$/g, "");

     if (name[0] && /\d/.test(name[0])) {
          name = "_" + name;
     }

     if (name === "") {
          name = "_default";
     }
     return name;
}

// Function to format value to XML
const formatValueOfElement = (value: any): string => {
     if (typeof value !== "string") {
          value = String(value);
     }
     return value
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
};

// Function to format element of XML
const formatElementXML = (key: string, value: any): string => {
     const cleanKey = cleanXMLName(key);
     return `<${cleanKey}>${formatValueOfElement(value)}</${cleanKey}>`;
};

// Function to create element of XML
const createElementXML = async (data: any): Promise<string> => {
     if (data === null || data === undefined) {
          return "";
     }

     if (Array.isArray(data)) {
          let xml = "";
          for (const item of data) {
               const itemXML = await createElementXML(item);
               xml += `<item>${itemXML}</item>`;
          }
          return xml;
     }

     if (typeof data === "object" && data !== null) {
          let xml = "";
          const keys = Object.keys(data);
          for (const key of keys) {
               const value = data[key];

               if (Array.isArray(value)) {
                    xml += `<${cleanXMLName(key)}>`;
                    for (const item of value) {
                         const itemXML = await createElementXML(item);
                         xml += `<item>${itemXML}</item>`;
                    }
                    xml += `</${cleanXMLName(key)}>`;
               } else if (typeof value === "object" && value !== null) {
                    const nestedXML = await createElementXML(value);
                    xml += `<${cleanXMLName(key)}>${nestedXML}</${cleanXMLName(
                         key
                    )}>`;
               } else {
                    xml += formatElementXML(key, value);
               }
          }
          return xml;
     }

     return String(data);
};

// Function to generate XML
const generateXML = async (
     data: any,
     fileName: string = "main",
     arrayContainerName: string = "items"
): Promise<string> => {
     let XML = `<?xml version="1.0" encoding="UTF-8"?>\n<${cleanXMLName(
          fileName
     )}>`;

     if (Array.isArray(data)) {
          XML += `<${cleanXMLName(arrayContainerName)}>`;

          for (const element of data) {
               const elementXML = await createElementXML(element);
               XML += `<item>${elementXML}</item>`;
          }

          XML += `</${cleanXMLName(arrayContainerName)}>`;
     } else {
          const elementXML = await createElementXML(data);
          XML += elementXML;
     }

     XML += `</${cleanXMLName(fileName)}>`;

     return XML;
};

export default generateXML;
