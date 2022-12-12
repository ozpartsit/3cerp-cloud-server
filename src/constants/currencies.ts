// class Currencies {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "PLN", name: "PLN", symbol: "zł" },
//       { _id: "EUR", name: "EUR", symbol: "€" },
//       { _id: "GBP", name: "GBP", symbol: "£" },
//       { _id: "USD", name: "USD", symbol: "$" },
//       { _id: "AUD", name: "AUD", symbol: "$" },
//       { _id: "JPY", name: "JPY", symbol: "¥" },
//       { _id: "CNY", name: "CNY", symbol: "CN¥" },
//       { _id: "CHF", name: "CHF", symbol: "CHF" },
//       { _id: "RUB", name: "RUB", symbol: "₽." },
//       { _id: "UAH", name: "UAH", symbol: "₴" },
//       { _id: "QAR", name: "QAR", symbol: "ر.ق." },
//       { _id: "NGN", name: "NGN", symbol: "₦" }
//     ];
//   }
//   public getEnum(): any[] {
//     return this.elements.map((element: any) => element._id);
//   }
//   public getProperties(_id: String): Object {
//     return this.elements.find((element: any) => element._id === _id) || {};
//   }
//   public getName(_id: String): String {
//     let element = this.elements.find((element: any) => element._id === _id);
//     return element ? element.name : "";
//   }
// }

const currencies = ["PLN", "EUR"];
export default currencies;
export function getCurrencies(query: any) { return currencies }
