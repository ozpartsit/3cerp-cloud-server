import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { MongooseError } from "mongoose"; // Importuj MongooseError
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
      .catch((err: MongooseError) => {
        console.error("Database connection error", err);
        process.exit(1); // Zakończ proces, jeśli połączenie z bazą danych się nie powiedzie
      });

    //mongoose.set('debug', true);

  }

}
