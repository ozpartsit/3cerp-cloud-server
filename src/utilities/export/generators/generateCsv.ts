// Functon to generate csv structure
const generateCSV = async (data: any): Promise<string> => {
     return new Promise((resolve, reject) => {
          try {
               let csvRows: string[] = [];
               const columns = Object.keys(data[0]);
               const separator = ",";

               // Create headers
               csvRows.push(columns.join(separator));

               // Create values
               for (const obj of data) {
                    const values = columns.map((column) => {
                         let value = obj[column];

                         if (typeof value === "string") {
                              if (value.search(/("|,|\n)/g) >= 0) {
                                   value = `"${value}"`;
                              }
                         }

                         return value;
                    });

                    // Create values
                    csvRows.push(values.join(separator));
               }

               const csvString = csvRows.join("\n");
               resolve(csvString);
          } catch (error) {
               reject(error);
          }
     });
};

export default generateCSV;
