type AnyObject = { [key: string]: any };

// Function to set specific preferences when flattening data
const setCustomValue = (key: string, value: any) => {
     // Set only name of object if object includes key name
     if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          return value.name ? value.name : null;
     }

     return null;
};

// Function to flattening eatch object in array
const flatteningData = (
     item: AnyObject,
     name: string | null = null
): AnyObject => {
     let flattenedValue: AnyObject = {};

     for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
               const element = item[key];
               const newKey = name ? `${name}.${key}` : key;

               // Set custom preferences
               const customData = setCustomValue(key, element);
               if (customData) {
                    flattenedValue = Object.assign({
                         ...flattenedValue,
                         [key]: customData,
                    });

                    continue;
               }

               // Default flattening
               if (
                    typeof element === "object" &&
                    element !== null &&
                    !Array.isArray(element)
               ) {
                    // Set recursion if data is nested
                    const nestedData = flatteningData(element, newKey);

                    flattenedValue = { ...flattenedValue, ...nestedData };

                    continue;
               } else {
                    // If value is array
                    if (Array.isArray(element)) {
                         // Join values
                         flattenedValue[newKey] = element.join(",");

                         continue;
                    }

                    // Default set key and value
                    flattenedValue[newKey] = element;
               }
          }
     }

     return flattenedValue;
};

// Function to flatten the data from the API
const dataFlatteing = (data: Array<object>) => {
     return new Promise((resolve, rejects) => {
          try {
               // Check that the date is an array
               if (!Array.isArray(data))
                    throw new Error(
                         "Incorrect data format. Required: data: Array<object>"
                    );

               // Check data exist
               if (data.length === 0) throw new Error("No data");

               // Create new array
               const flattendData: Array<object> = [];

               for (let i = 0; i < data.length; i++) {
                    const item = data[i];

                    // Flattening data
                    const flattendItem = flatteningData(item, null);
                    flattendData.push(flattendItem);
               }

               resolve(flattendData);
          } catch (error: any) {
               rejects(error);
          }
     });
};
export default dataFlatteing;
