import fs from "fs";
import path from "path";

import generateCSV from "./generators/generateCsv";
import generateXML from "./generators/generateXml";
import generateXLSX from "./generators/generateXlsx";

const __dirname = path.resolve();
const PATH_DATA_DIRECTORY = path.join(__dirname, "data");

const generateFileName = (format: string): string => {
     const randomId = Math.random().toString(36).substring(2, 10);

     return `${randomId}.${format}`;
};

// Function to check exist directory, if not create
const mkdir = async () => {
     try {
          const isExist = fs.existsSync(PATH_DATA_DIRECTORY);
          if (isExist) return true;

          await fs.promises.mkdir(PATH_DATA_DIRECTORY);
          return true;
     } catch (error) {
          throw error;
     }
};

// Function to create file
const writeFile = async (fileName: string, data: string) => {
     try {
          // Generate url file
          const urlFile = PATH_DATA_DIRECTORY + "/" + fileName;

          // Create file
          await fs.promises.writeFile(urlFile, data);
          const file = fs.readFileSync(urlFile);
          return file
     } catch (error) {
          throw error;
     }
};

// Function to create file
const createFile = async (
     format: string,
     data: Array<object>
): Promise<object> => {
     // Check folder exist
     const isDirectory = await mkdir();
     if (!isDirectory) throw new Error("Not created directory. Try again");

     // Create file name
     const fileName: string = generateFileName(format);
     if (!fileName) throw new Error("Not created file name. Try again");

     let urlFile;

     // Select format
     switch (format) {
          case "json":
               const jsonData = JSON.stringify(data);

               urlFile = await writeFile(fileName, jsonData);

               return { urlFile, fileName };

          case "csv":
               const csvData = await generateCSV(data);

               urlFile = await writeFile(fileName, csvData);

               return { urlFile, fileName };

          case "xml":
               const xmlData = await generateXML(data);

               urlFile = await writeFile(fileName, xmlData);

               return { urlFile, fileName };

          case "xlsx":
               const xlsx: any = generateXLSX(data);

               urlFile = await writeFile(fileName, xlsx);

               return { urlFile, fileName };

          default:
               return {};
     }
};

export default createFile;
