import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import Static from "../utilities/static.js";
import Methods from "../utilities/methods.js";
mongoose.plugin(mongoosePaginate);
mongoose.plugin(Methods);
mongoose.plugin(Static);

//import { password, server, database } from "./credentials";
export default class Database {
  private database: string;
  private password: string;
  private server: string;
  constructor() {
    this.database = process.env.DB_NAME || "";
    this.password = process.env.DB_PASSWORD || "";
    this.server = process.env.DB_SERVER || "";
  }
  public connect() {
    const db2 = mongoose.createConnection(`mongodb://mo1069_backup:Test1!@${this.server}/mo1069_backup`,
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        autoIndex: true // false for production
      });
    mongoose
      .connect(
        `mongodb://${this.database}:${this.password}@${this.server}/${this.database}`,
        {
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
          autoIndex: true // false for production
        }
      )
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err: any) => {
        console.error("Database connection error");
      });

    //mongoose.set('debug', true);

  }

}
