import * as XLSX from "xlsx";

// flattenObject function
const flattenObject = (
     obj: any,
     parentKey: string = "",
     separator: string = "_"
): Record<string, any> => {
     let flatObject: Record<string, any> = {};
     for (let key of Object.keys(obj)) {
          if (obj.hasOwnProperty(key)) {
               key = key.replace(/ /g, "_");
               const newKey = parentKey ? parentKey + separator + key : key;
               if (Array.isArray(obj[key])) {
                    flatObject[newKey] = obj[key].join(", ");
               } else if (typeof obj[key] === "object" && obj[key] !== null) {
                    Object.assign(
                         flatObject,
                         flattenObject(obj[key], newKey, separator)
                    );
               } else if (
                    typeof obj[key] === "string" &&
                    obj[key].match(
                         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
                    )
               ) {
                    try {
                         flatObject[newKey] = new Date(obj[key]);
                    } catch (e) {
                         flatObject[newKey] = obj[key];
                    }
               } else {
                    flatObject[newKey] = obj[key];
               }
          }
     }
     return flatObject;
};

// Function to generate xlsx
const generateXLSX = (
     data: any,
     options: { fileName?: string; sheetName?: string; flatten?: boolean } = {}
): Buffer => {
     const {
          fileName = "output.xlsx",
          sheetName = "Sheet1",
          flatten = true,
     } = options;
     const workbook = XLSX.utils.book_new();
     let flattenedData: any[];

     if (Array.isArray(data)) {
          flattenedData = data.map((item) => flattenObject(item));
     } else if (typeof data === "object" && data !== null) {
          flattenedData = [flattenObject(data)];
     } else {
          flattenedData = [[data]];
     }

     const worksheet = XLSX.utils.json_to_sheet(flattenedData);
     XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

     return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};

export default generateXLSX;
