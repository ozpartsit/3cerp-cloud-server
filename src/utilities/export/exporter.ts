import dataFlatteing from "./dataFlattening";
import bubbleSortData from "./bubbleSortData";
import createFile from "./createFile";

type DataType = Array<Object>;

const useExporter = async (data: DataType, headers: any, format: string) => {
     try {
          if (!["csv", "json", "xml", "xlsx"].includes(format)) throw 'wrong format' // do porawy

          // Flattend data
          const flattendData: any = await dataFlatteing(data);

          // Bubble sort data
          const sortedData = await bubbleSortData(flattendData, headers);

          // Create file
          const file: any = await createFile(
               format,
               sortedData
          );


          return file

     } catch (error: any) {
          throw error
     }

};

export default useExporter;
