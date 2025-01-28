interface Column {
     name: string;
     field: string;
}

interface DataItem {
     [key: string]: any;
}

interface SortedItem {
     [key: string]: any;
}

const sequence: Column[] = [
     { name: "firstName", field: "name" },
     { name: "age", field: "years" },
];

const dataItem: DataItem = {
     name: "John",
     years: 30,
};

// Function to bubble sort data
const bubbleSortData = (
     data: DataItem[],
     sequence: Column[]
): Promise<SortedItem[]> => {
     return new Promise((resolve, reject) => {
          try {
               if (data.length === 0 || sequence.length === 0) {
                    throw new Error("No data or headings");
               }

               const sortedData: SortedItem[] = [];

               for (let i = 0; i < data.length; i++) {
                    const dataItem = data[i];

                    let sortedItem: SortedItem = {};

                    for (let j = 0; j < sequence.length; j++) {
                         const column = sequence[j];

                         sortedItem[column.name] = dataItem[column.field];
                    }

                    sortedData.push(sortedItem);
               }

               resolve(sortedData);
          } catch (error: unknown) {
               if (error instanceof Error) {
                    reject(error);
               } else {
                    reject(new Error("An unknown error occurred"));
               }
          }
     });
};

export default bubbleSortData;
