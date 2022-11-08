/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 165:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.App3CERP = void 0;
const express_1 = __importDefault(__webpack_require__(860));
const dotenv = __importStar(__webpack_require__(142));
const cors_1 = __importDefault(__webpack_require__(582));
const database_1 = __importDefault(__webpack_require__(991));
const core_1 = __importDefault(__webpack_require__(585));
const maintenance_1 = __importDefault(__webpack_require__(802));
const emitEvents_1 = __importDefault(__webpack_require__(321));
const error_handler_1 = __webpack_require__(868);
const storage_1 = __importDefault(__webpack_require__(91));
// Custom ENVIRONMENT Veriables
dotenv.config({ path: `./.env.${"production"}` });
class App3CERP {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = process.env.PORT || 8080;
        this.db = new database_1.default();
        this.routesCore = new core_1.default();
        this.routesMaintenance = new maintenance_1.default();
        this.emitEvents = new emitEvents_1.default();
        this.storage = new storage_1.default();
        process.title = "3CERP";
        console.log("NODE_ENV", "production");
        this.config();
        this.dbConnect();
        this.mountRoutes();
        this.storage.init();
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        //this.app.use(helmet());
        // serving static files
        this.app.use(express_1.default.static("public"));
        this.app.use(error_handler_1.errorHandler);
    }
    mountRoutes() {
        this.routesCore.start(this.app);
        this.routesMaintenance.start(this.app, this);
        this.emitEvents.start(this.app);
    }
    dbConnect() {
        this.db.connect();
    }
    stopServer() {
        if (this.server) {
            console.log("The server will be shut down for maintenance");
            this.server.close((err) => {
                console.log("Process terminated");
                //process.exit(err ? 1 : 0);
            });
        }
        else
            console.log("The Application Server is not running");
    }
    startServer() {
        this.server = this.app.listen(this.PORT, () => {
            console.log(`App running ${this.PORT}! (env: ${"production"} )`);
        });
    }
}
exports.App3CERP = App3CERP;
new App3CERP().startServer();


/***/ }),

/***/ 991:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(185));
//import { password, server, database } from "./credentials";
class Database {
    constructor() {
        this.database = process.env.DB_NAME || "";
        this.password = process.env.DB_PASSWORD || "";
        this.server = process.env.DB_SERVER || "";
    }
    connect() {
        mongoose_1.default
            .connect(`mongodb://${this.database}:${this.password}@${this.server}/${this.database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        })
            .then(() => {
            console.log("Database connection successful");
        })
            .catch((err) => {
            console.error("Database connection error");
        });
    }
}
exports["default"] = Database;


/***/ }),

/***/ 593:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Countries {
    constructor() {
        this.elements = [
            { _id: "PL", name: "Poland", currency: "PLN", flag: "🇵🇱" },
            { _id: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" }
        ];
    }
    getEnum() {
        return this.elements.map((element) => element._id);
    }
    getProperties(_id) {
        return this.elements.find((element) => element._id === _id) || {};
    }
    getName(_id) {
        let element = this.elements.find((element) => element._id === _id);
        return element ? element.name : "";
    }
}
exports["default"] = new Countries();


/***/ }),

/***/ 131:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Currencies {
    constructor() {
        this.elements = [
            { _id: "PLN", name: "PLN", symbol: "zł" },
            { _id: "EUR", name: "EUR", symbol: "€" },
            { _id: "GBP", name: "GBP", symbol: "£" },
            { _id: "USD", name: "USD", symbol: "$" },
            { _id: "AUD", name: "AUD", symbol: "$" },
            { _id: "JPY", name: "JPY", symbol: "¥" },
            { _id: "CNY", name: "CNY", symbol: "CN¥" },
            { _id: "CHF", name: "CHF", symbol: "CHF" },
            { _id: "RUB", name: "RUB", symbol: "₽." },
            { _id: "UAH", name: "UAH", symbol: "₴" },
            { _id: "QAR", name: "QAR", symbol: "ر.ق." },
            { _id: "NGN", name: "NGN", symbol: "₦" }
        ];
    }
    getEnum() {
        return this.elements.map((element) => element._id);
    }
    getProperties(_id) {
        return this.elements.find((element) => element._id === _id) || {};
    }
    getName(_id) {
        let element = this.elements.find((element) => element._id === _id);
        return element ? element.name : "";
    }
}
exports["default"] = new Currencies();


/***/ }),

/***/ 82:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ItemTypes {
    constructor() {
        this.elements = [
            { _id: "InvItem", name: "Invenory Item" },
            { _id: "KitItem", name: "Kit Item" },
            { _id: "Service", name: "Service" }
        ];
    }
    getEnum() {
        return this.elements.map((element) => element._id);
    }
    getProperties(_id) {
        return this.elements.find((element) => element._id === _id) || {};
    }
    getName(_id) {
        let element = this.elements.find((element) => element._id === _id);
        return element ? element.name : "";
    }
}
exports["default"] = new ItemTypes();


/***/ }),

/***/ 3:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class TranTypes {
    constructor() {
        this.elements = [
            { _id: "SalesOrder", name: "Sales Order" },
            { _id: "Invoice", name: "Invoice" }
        ];
    }
    getEnum() {
        return this.elements.map((element) => element._id);
    }
    getProperties(_id) {
        return this.elements.find((element) => element._id === _id) || {};
    }
    getName(_id) {
        let element = this.elements.find((element) => element._id === _id);
        return element ? element.name : "";
    }
}
exports["default"] = new TranTypes();


/***/ }),

/***/ 67:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const entity_model_1 = __importStar(__webpack_require__(104));
class controller {
    add(req, res, next) {
        let Model = entity_model_1.EntityTypes[req.params.recordtype] || entity_model_1.default;
        let doc = new Model(req.body);
        doc.save((err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    find(req, res, next) {
        (entity_model_1.EntityTypes[req.params.recordtype] || entity_model_1.default)
            .find({})
            .limit(50)
            // .skip(parseInt(req.query.skip as string))
            // .select(req.query.select)
            // .sort(req.query.sort)
            .exec((err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    get(req, res, next) {
        (entity_model_1.EntityTypes[req.params.recordtype] || entity_model_1.default).findById(req.params.id, (err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    update(req, res, next) {
        (entity_model_1.EntityTypes[req.params.recordtype] || entity_model_1.default).findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
    delete(req, res, next) {
        (entity_model_1.EntityTypes[req.params.recordtype] || entity_model_1.default).remove({ _id: req.params.id }, (err) => {
            if (err) {
                next(err);
            }
            res.json({ message: "Successfully deleted contact!" });
        });
    }
}
exports["default"] = controller;


/***/ }),

/***/ 199:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const item_model_1 = __importStar(__webpack_require__(377));
class controller {
    add(req, res, next) {
        let Model = item_model_1.ItemTypes[req.params.recordtype] || item_model_1.default;
        let doc = new Model(req.body);
        doc.save((err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    find(req, res, next) {
        (item_model_1.ItemTypes[req.params.recordtype] || item_model_1.default)
            .find({})
            .limit(50)
            // .skip(parseInt(req.query.skip as string))
            // .select(req.query.select)
            // .sort(req.query.sort)
            .exec((err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    get(req, res, next) {
        (item_model_1.ItemTypes[req.params.recordtype] || item_model_1.default).findById(req.params.id, (err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    update(req, res, next) {
        (item_model_1.ItemTypes[req.params.recordtype] || item_model_1.default).findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    delete(req, res, next) {
        (item_model_1.ItemTypes[req.params.recordtype] || item_model_1.default).remove({ _id: req.params.id }, (err) => {
            if (err) {
                next(err);
            }
            res.json({ message: "Successfully deleted contact!" });
        });
    }
}
exports["default"] = controller;


/***/ }),

/***/ 69:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const transaction_model_1 = __importStar(__webpack_require__(397));
const ejs_1 = __importDefault(__webpack_require__(632));
const path_1 = __importDefault(__webpack_require__(17));
class controller {
    add(req, res) {
        let Model = transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default;
        let doc = new Model(req.body);
        doc.save((err, result, next) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    find(req, res, next) {
        res.json((transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default).getFields((transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default).schema, (transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default).modelName));
        // (TransactionTypes[req.params.recordtype] || Transaction)
        //   .find({})
        //   //.lean()
        //   .limit(50)
        //   // .populate([
        //   //   { path: "user", select: "name" },
        //   //   { path: "items.item", select: "name" }
        //   // ])
        //   // .populate({ path: "items.item", select: "name" })
        //   // .skip(parseInt(req.query.skip as string))
        //   .select(req.query.select || { name: 1, "user.name": 1 })
        //   // .sort(req.query.sort)
        //   .exec((err: any, result: any) => {
        //     if (err) {
        //       next(err);
        //     }
        //     res.json(result);
        //   });
    }
    get(req, res, next) {
        var views = path_1.default.join("/sandbox/src", "views");
        var filepath = path_1.default.join(views, "example" + ".ejs");
        (transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default)
            .findOne({ _id: req.params.id, type: req.params.recordtype })
            // .populate({ path: "user", select: "name" })
            // .populate({ path: "items.item", select: "name" })
            .exec((err, result) => __awaiter(this, void 0, void 0, function* () {
            // if (err) {
            //   res.send(err);
            // }
            // Transaction.find({ "items._id": "60defac933ca3801212dd3b6" }, { items: 1 }).exec((err: any, result: any) => {
            //   if (err) {
            //     res.send(err);
            //   }
            //   console.log(JSON.stringify(result));
            // });
            // result._id = null;
            // let trn = new Transaction(JSON.parse(JSON.stringify(result)));
            // let tmp = await trn.save();
            //console.log(result.billingAddress.country);
            // let item = trn.items.id("60defac033ca3801212dd3b3");
            // console.log(item);
            // trn.items.push({ item: "Demo Item" });
            //trn.save();
            //next(new Error("BROKEN!"));
            //result.save().catch((err: Error) => next(err));
            //let error = result.validateSync();
            //console.log(error);
            ejs_1.default.renderFile(filepath, { data: result }, (err, result) => {
                res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                res.end(result);
            });
        }));
    }
    update(req, res, next) {
        (transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default).findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    delete(req, res, next) {
        (transaction_model_1.TransactionTypes[req.params.recordtype] || transaction_model_1.default).remove({ _id: req.params.id }, (err) => {
            if (err) {
                next(err);
            }
            res.json({ message: "Successfully deleted contact!" });
        });
    }
}
exports["default"] = controller;


/***/ }),

/***/ 422:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsonwebtoken_1 = __importDefault(__webpack_require__(344));
class Auth {
    jwt(req, res, next) {
        const token = req.header("x-authtoken");
        if (token) {
            try {
                res.user = jsonwebtoken_1.default.verify(token, "abc123");
                next();
            }
            catch (ex) {
                res.status(400).send("Invalid token");
            }
        }
        else {
            next();
            //res.status(401).send("Access denied. No token provided");
        }
    }
}
exports["default"] = Auth;


/***/ }),

/***/ 868:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    //if (err instanceof CustomError) res.status(err.statusCode).send({ errors: err.serializeErrors() });
    // if (error instanceof ValidationError) {
    //   let errors = {};
    //   Object.keys(error.errors).forEach((key) => {
    //     errors[key] = error.errors[key].message;
    //   });
    //   return res.status(400).send(errors);
    // }
    console.log("error handler", error.name, error);
    res.status(error.status || 500).send({
        message: error.message
    });
};
exports.errorHandler = errorHandler;


/***/ }),

/***/ 91:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
//requiring path and fs modules
const path_1 = __importDefault(__webpack_require__(17));
const fs_1 = __importDefault(__webpack_require__(147));
const mime_types_1 = __importDefault(__webpack_require__(514));
const file_model_1 = __importDefault(__webpack_require__(630));
class StorageStructure {
    constructor() {
        //resolve storage path of directory
        this.publicPath = path_1.default.resolve("public");
        this.storagePath = path_1.default.resolve("public", "storage");
        this.importPath = path_1.default.resolve("public", "storage", "import");
        this.exportPath = path_1.default.resolve("public", "storage", "export");
        if (!fs_1.default.existsSync(this.publicPath))
            fs_1.default.mkdirSync(this.publicPath);
        if (!fs_1.default.existsSync(this.storagePath))
            fs_1.default.mkdirSync(this.storagePath);
        if (!fs_1.default.existsSync(this.importPath))
            fs_1.default.mkdirSync(this.importPath);
        if (!fs_1.default.existsSync(this.exportPath))
            fs_1.default.mkdirSync(this.exportPath);
    }
    init() {
        console.log("Init Storage", this.storagePath);
        this.mapFiles(this.storagePath);
    }
    makeDir(path) {
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.mkdirSync(path);
        }
    }
    delDir(path) {
        try {
            fs_1.default.rmdirSync(path, { recursive: true });
            console.log(`${path} is deleted!`);
        }
        catch (err) {
            console.error(`Error while deleting ${path}.`);
        }
    }
    mapFiles(dirPath, parentPath = "root") {
        fs_1.default.readdir(dirPath, (err, files) => {
            files.forEach((file) => {
                let doc = {
                    name: file,
                    type: mime_types_1.default.lookup(file),
                    path: dirPath,
                    parentPath: parentPath
                };
                if (fs_1.default.lstatSync(path_1.default.join(dirPath, file)).isDirectory()) {
                    doc.type = "directory";
                    this.mapFiles(path_1.default.join(dirPath, file), dirPath);
                }
                file_model_1.default.updateOrInsert(doc);
            });
        });
    }
}
exports["default"] = StorageStructure;


/***/ }),

/***/ 492:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const TransactionNumbers = new mongoose_1.Schema({
    type: { type: String, required: true },
    prefix: { type: String, input: "text" },
    sufix: { type: String, input: "text" },
    initNumber: { type: Number, required: true, default: 1, input: "integer" },
    currentNumber: { type: Number, required: true, default: 1, input: "integer" }
});
const options = { discriminatorKey: "entities", collection: "entities" };
const schema = new mongoose_1.Schema({ transactionNumbers: { type: [TransactionNumbers] } }, options);
schema.method("incNumber", function (type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.type !== "company")
            throw new Error("Only Company Record can inc transaction numbers");
        let format = this.transactionNumbers.find((transaction) => transaction.type === type);
        if (format && format.currentNumber)
            format.currentNumber++;
        this.save();
    });
});
exports["default"] = schema;


/***/ }),

/***/ 937:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const currencies_1 = __importDefault(__webpack_require__(131));
const Balances = new mongoose_1.Schema({
    currency: {
        type: String,
        get: (v) => currencies_1.default.getName(v),
        required: true,
        input: "select"
    },
    balance: { type: Number, required: true, default: 0, input: "currency" }
});
const options = { discriminatorKey: "entities", collection: "entities" };
const schema = new mongoose_1.Schema({
    balances: {
        type: [Balances]
    }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 713:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Address = void 0;
const mongoose_1 = __webpack_require__(185);
const countries_1 = __importDefault(__webpack_require__(593));
const utils_1 = __webpack_require__(78);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const Contacts = new mongoose_1.Schema({
    firstName: { type: String, input: "text" },
    lastName: { type: String, input: "text" },
    email: { type: String, input: "text" },
    phone: { type: String, input: "text" },
    jobTitle: { type: String, input: "text" }
});
exports.Address = new mongoose_1.Schema({
    addressee: { type: String, input: "text" },
    address: { type: String, required: true, input: "text" },
    address2: { type: String, input: "text" },
    city: { type: String, required: true, input: "text" },
    zip: { type: String, required: true, input: "text" },
    country: {
        type: String,
        get: (v) => countries_1.default.getName(v),
        enum: countries_1.default.getEnum(),
        required: true,
        input: "select"
    },
    phone: { type: String, input: "text" }
});
const options = { discriminatorKey: "entities", collection: "entities" };
const schema = new mongoose_1.Schema({
    email: { type: String, input: "text" },
    name: {
        type: String,
        required: true,
        min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "text"
    },
    firstName: { type: String, input: "text" },
    lastName: { type: String, input: "text" },
    type: {
        type: String,
        required: true,
        enum: ["company", "lead", "customer", "vendor"],
        default: "lead",
        input: "select"
    },
    billingAddress: {
        type: exports.Address,
        get: (v) => `${v.addressee}\n${v.address},${v.address}\n${v.zip} ${v.city}\n${v.country}`
    },
    shippingAddress: {
        type: exports.Address,
        get: (v) => `${v.addressee}\n${v.address},${v.address}\n${v.zip} ${v.city}\n${v.country}`
    },
    contacts: { type: [Contacts] }
}, options);
schema.index({ name: 1 });
// Load Class
schema.loadClass(utils_1.Utilis);
exports["default"] = schema;


/***/ }),

/***/ 456:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const options = { discriminatorKey: "entities", collection: "entities" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


/***/ }),

/***/ 897:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const options = { discriminatorKey: "entities", collection: "entities" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


/***/ }),

/***/ 104:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityTypes = void 0;
const mongoose_1 = __webpack_require__(185);
const entity_schema_1 = __importDefault(__webpack_require__(713));
const company_schema_1 = __importDefault(__webpack_require__(492));
const lead_schema_1 = __importDefault(__webpack_require__(456));
const customer_schema_1 = __importDefault(__webpack_require__(937));
const vendor_schema_1 = __importDefault(__webpack_require__(897));
const Entity = (0, mongoose_1.model)("Entity", entity_schema_1.default);
exports["default"] = Entity;
exports.EntityTypes = {
    comapany: Entity.discriminator("Company", company_schema_1.default),
    customer: Entity.discriminator("Customer", customer_schema_1.default),
    lead: Entity.discriminator("Lead", lead_schema_1.default),
    vendor: Entity.discriminator("Vendor", vendor_schema_1.default)
};


/***/ }),

/***/ 630:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const fileSchema = new mongoose_1.Schema({
    name: { type: String, required: true, input: "text" },
    type: { type: String, required: true, input: "text" },
    path: { type: String, required: true, input: "text" },
    parentPath: { type: String, required: true, input: "text" },
    url: { type: String, input: "text" }
});
fileSchema.statics.updateOrInsert = function (doc) {
    return this.updateOne({ name: doc.name, path: doc.path }, doc, { upsert: true }, (err, result) => {
        if (err)
            throw err;
        return result;
    });
};
const File = (0, mongoose_1.model)("File", fileSchema);
//const File = model("File", fileSchema);
exports["default"] = File;


/***/ }),

/***/ 377:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypes = void 0;
const mongoose_1 = __webpack_require__(185);
const item_schema_1 = __importDefault(__webpack_require__(545));
const invitem_schema_1 = __importDefault(__webpack_require__(853));
const kititem_schema_1 = __importDefault(__webpack_require__(460));
const service_schema_1 = __importDefault(__webpack_require__(564));
const Item = (0, mongoose_1.model)("Item", item_schema_1.default);
exports["default"] = Item;
exports.ItemTypes = {
    invitem: Item.discriminator("InvItem", invitem_schema_1.default),
    kititem: Item.discriminator("KitItem", kititem_schema_1.default),
    service: Item.discriminator("Service", service_schema_1.default)
};


/***/ }),

/***/ 853:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const currencies_1 = __importDefault(__webpack_require__(131));
const options = { discriminatorKey: "type", collection: "items" };
const Warehouses = new mongoose_1.Schema({
    warehouse: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true,
        autopopulate: true
    },
    quantityOnHand: { type: Number, default: 0 },
    quantityAvailable: { type: Number, default: 0 }
});
const Locations = new mongoose_1.Schema({
    warehouse: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true,
        autopopulate: true
    },
    quantityOnHand: { type: Number, default: 0 },
    quantityAvailable: { type: Number, default: 0 },
    location: { type: String, required: true, input: "text" },
    preferred: { type: Boolean, required: true, input: "boolean" }
});
const Vendors = new mongoose_1.Schema({
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        required: true,
        autopopulate: true
    },
    price: { type: Number, default: 0, required: true, input: "currency" },
    moq: { type: Number, default: 1, required: true, input: "integer" },
    currency: {
        type: String,
        get: (v) => currencies_1.default.getName(v),
        required: true,
        input: "select"
    },
    mpn: { type: String, input: "text" },
    preferred: { type: Boolean, required: true, input: "boolean" }
});
const schema = new mongoose_1.Schema({
    vendors: {
        type: [Vendors],
        validate: [
            {
                validator: (lines) => lines.length < 50,
                msg: "Must have maximum 50 vendors"
            }
        ]
    },
    warehouses: {
        type: [Warehouses],
        validate: [
            {
                validator: (lines) => lines.length < 10,
                msg: "Must have maximum 10 warehouses"
            }
        ]
    },
    locations: {
        type: [Locations],
        validate: [
            {
                validator: (lines) => lines.length < 10,
                msg: "Must have maximum 10 locations"
            }
        ]
    }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 545:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const utils_1 = __webpack_require__(78);
const item_types_1 = __importDefault(__webpack_require__(82));
const currencies_1 = __importDefault(__webpack_require__(131));
// Schemas ////////////////////////////////////////////////////////////////////////////////
const Prices = new mongoose_1.Schema({
    price: { type: Number, default: 0, required: true, input: "currency" },
    moq: { type: Number, default: 1, required: true, input: "integer" },
    currency: {
        type: String,
        get: (v) => currencies_1.default.getName(v),
        required: true,
        input: "select"
    }
});
const options = { discriminatorKey: "type", collection: "items" };
const schema = new mongoose_1.Schema({
    name: { type: String, required: true, input: "text" },
    description: { type: String, input: "text" },
    type: {
        type: String,
        required: true,
        get: (v) => item_types_1.default.getName(v),
        enum: item_types_1.default.getEnum(),
        input: "select"
    },
    prices: {
        type: [Prices],
        validate: [
            {
                validator: (lines) => lines.length < 10,
                msg: "Must have maximum 100 prices"
            }
        ]
    }
}, options);
// Load Class
schema.loadClass(utils_1.Utilis);
exports["default"] = schema;


/***/ }),

/***/ 460:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const options = { discriminatorKey: "type", collection: "items" };
const Components = new mongoose_1.Schema({
    item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        autopopulate: true
    },
    quantity: { type: Number, required: true, default: 1, input: "integer" }
});
const schema = new mongoose_1.Schema({
    components: {
        type: [Components],
        validate: [
            {
                validator: (lines) => lines.length < 10,
                msg: "Must have maximum 10 components"
            }
        ]
    }
}, options);
// Components Advanced Validators
schema.path("components").validate(function (value) {
    if (this.type === "kitItem")
        return value.length > 0;
}, "Must have minimum one component");
schema.path("components").validate(function (value) {
    if (this.type !== "kitItem")
        return !value.length;
}, "Only Kit Items have components");
exports["default"] = schema;


/***/ }),

/***/ 564:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const options = { discriminatorKey: "type", collection: "items" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


/***/ }),

/***/ 397:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionTypes = void 0;
const mongoose_1 = __webpack_require__(185);
const transaction_schema_1 = __importDefault(__webpack_require__(23));
const salesorder_schema_1 = __importDefault(__webpack_require__(2));
const invoice_schema_1 = __importDefault(__webpack_require__(938));
const Transaction = (0, mongoose_1.model)("Transaction", transaction_schema_1.default);
exports["default"] = Transaction;
exports.TransactionTypes = {
    salesorder: Transaction.discriminator("SalesOrder", salesorder_schema_1.default),
    invoice: Transaction.discriminator("Invoice", invoice_schema_1.default)
};


/***/ }),

/***/ 938:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


/***/ }),

/***/ 2:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({
    test: { type: String, input: "text" }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 23:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(185);
const entity_schema_1 = __webpack_require__(713);
const mongoose_autopopulate_1 = __importDefault(__webpack_require__(314));
const currencies_1 = __importDefault(__webpack_require__(131));
const transaction_types_1 = __importDefault(__webpack_require__(3));
const utils_1 = __webpack_require__(78);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const ItemsSchema = {
    item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        autopopulate: true,
        input: "autocomplete"
    },
    price: { type: Number, default: 0, input: "currency" },
    quantity: { type: Number, default: 1, input: "integer" },
    amount: { type: Number, default: 0, input: "currency" },
    taxamount: { type: Number, default: 0, input: "currency" },
    grossamount: { type: Number, default: 0, input: "currency" },
    weight: { type: Number, default: 0, input: "number" }
};
const Items = new mongoose_1.Schema(ItemsSchema);
const TransactionSchema = {
    name: { type: String, input: "text" },
    date: { type: Date, input: "date" },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        required: true,
        autopopulate: true,
        input: "autocomplete"
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        required: true,
        autopopulate: true,
        input: "autocomplete"
    },
    number: { type: Number, input: "number" },
    quantity: { type: Number, default: 0, input: "integer" },
    amount: { type: Number, default: 0, input: "currency" },
    taxamount: { type: Number, default: 0, input: "currency" },
    grossamount: { type: Number, default: 0, input: "currency" },
    weight: { type: Number, default: 0, input: "number" },
    exchangeRate: {
        type: Number,
        required: true,
        default: 1,
        input: "number",
        precision: 4
    },
    billingAddress: {
        type: entity_schema_1.Address,
        get: (v) => `${v.addressee}\n${v.address},${v.address}\n${v.zip} ${v.city}\n${v.country}`
    },
    shippingAddress: {
        type: entity_schema_1.Address,
        get: (v) => `${v.addressee}\n${v.address},${v.address}\n${v.zip} ${v.city}\n${v.country}`
    },
    currency: {
        type: String,
        required: true,
        get: (v) => currencies_1.default.getName(v),
        enum: currencies_1.default.getEnum(),
        default: "PLN",
        input: "select"
    },
    type: {
        type: String,
        required: true,
        get: (v) => transaction_types_1.default.getName(v),
        enum: transaction_types_1.default.getEnum()
    },
    items: {
        type: [Items],
        validate: [
            {
                validator: (lines) => lines.length > 0,
                msg: "Must have minimum one line"
            },
            {
                validator: (lines) => lines.length < 500,
                msg: "Must have maximum 500 lines"
            }
        ]
    }
};
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema(TransactionSchema, options);
schema.method("autoName", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // set new transaction name (prefix+number+sufix)
        if (!this.number) {
            yield this.populate("company").execPopulate();
            let format = this.company.transactionNumbers.find((transaction) => transaction.type === this.type);
            if (format) {
                this.number = format.currentNumber;
                this.name = `${format.prefix || ""}${format.currentNumber}${format.sufix || ""}`;
                this.company.incNumber(this.type);
            }
            else
                throw new mongoose_1.Error("Record Type is undefined in Company record");
        }
    });
});
schema.method("sumTotal", function () {
    if (this.items && this.items.length) {
        this.items.forEach((line) => {
            this.quantity += line.quantity;
            this.amount += line.amount;
            this.grossamount += line.grossamount;
            this.taxamount += line.taxamount;
        });
    }
});
schema.pre("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.autoName();
        this.sumTotal();
    });
});
// Load Class
schema.loadClass(utils_1.Utilis);
schema.post("init", function (doc) {
    this.sumTotal();
});
schema.plugin(mongoose_autopopulate_1.default, {
    // Apply this plugin to below functions
    functions: ["save", "findOne"]
});
exports["default"] = schema;


/***/ }),

/***/ 78:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utilis = void 0;
class Utilis {
    static getFields(schema, type) {
        let fields = [];
        let modelSchema = schema.discriminators && schema.discriminators[type]
            ? schema.discriminators[type]
            : schema;
        modelSchema.eachPath((pathname, schematype) => {
            if (schematype.options.input ||
                ["Embedded", "Array"].includes(schematype.instance)) {
                if (["Embedded", "Array"].includes(schematype.instance)) {
                    this.getFields(schematype.schema, type).forEach((field) => fields.push(Object.assign({ path: pathname }, field)));
                }
                else {
                    fields.push({
                        name: pathname,
                        required: schematype.isRequired,
                        ref: schematype.options.ref,
                        //instance: schematype.instance,
                        input: schematype.options.input
                    });
                }
            }
        });
        return fields;
    }
    static getForm() {
        let form = {
            type: "transation",
            tabs: ["Overview"],
            fields: [{ field: "name", tab: "Overview" }]
        };
        return form;
    }
}
exports.Utilis = Utilis;


/***/ }),

/***/ 585:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const auth_1 = __importDefault(__webpack_require__(422));
const express_1 = __importDefault(__webpack_require__(860));
const entities_1 = __importDefault(__webpack_require__(67));
const transactions_1 = __importDefault(__webpack_require__(69));
const items_1 = __importDefault(__webpack_require__(199));
class Routes {
    constructor() {
        this.Router = express_1.default.Router();
        this.Auth = new auth_1.default();
        this.entityController = new entities_1.default();
        this.transactionController = new transactions_1.default();
        this.itemController = new items_1.default();
    }
    start(app) {
        console.log("Start Routing");
        this.routeTransactions();
        this.routeItems();
        this.routeUsers();
        app.use("/core", this.Router);
    }
    routeTransactions() {
        // Transactions
        this.Router.route("/transactions/:recordtype").get(this.Auth.jwt, this.transactionController.find);
        this.Router.route("/transactions/:recordtype").post(this.transactionController.add);
        this.Router.route("/transactions/:recordtype/:id")
            .get(this.transactionController.get)
            .put(this.transactionController.update)
            .delete(this.transactionController.delete);
    }
    routeItems() {
        //Items
        this.Router.route("/items/:recordtype").get(this.Auth.jwt, this.itemController.find);
        this.Router.route("/items/:recordtype").post(this.itemController.add);
        this.Router.route("/items/:recordtype/:id")
            .get(this.itemController.get)
            .put(this.itemController.update)
            .delete(this.transactionController.delete);
    }
    routeUsers() {
        // Users
        this.Router.route("/entities/:recordtype").get(this.Auth.jwt, this.entityController.find);
        this.Router.route("/entities/:recordtype").post(this.entityController.add);
        this.Router.route("/entities/:id")
            .get(this.entityController.get)
            .put(this.entityController.update)
            .delete(this.entityController.delete);
    }
}
exports["default"] = Routes;


/***/ }),

/***/ 802:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(860));
const path_1 = __importDefault(__webpack_require__(17));
const child_process_1 = __webpack_require__(81);
class Routes {
    constructor() {
        this.Router = express_1.default.Router();
    }
    start(app, App3CERP) {
        console.log("Start Maintenance Routing");
        this.stop(App3CERP);
        this.restart(App3CERP);
        app.use("/maintenance", this.Router);
    }
    stop(App3CERP) {
        this.Router.route("/stop").get(() => {
            console.log("stop");
            App3CERP.stopServer();
        });
    }
    restart(App3CERP) {
        this.Router.route("/restart").get(() => {
            console.log("restart");
            var packagePath = path_1.default.resolve();
            console.log(packagePath);
            App3CERP.stopServer();
            // Restart process ...
            setTimeout(() => {
                (0, child_process_1.execSync)("npm run start", { stdio: "inherit", cwd: packagePath });
            }, 5000);
        });
    }
}
exports["default"] = Routes;


/***/ }),

/***/ 321:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const auth_1 = __importDefault(__webpack_require__(422));
class EmitEvents {
    constructor() {
        this.Auth = new auth_1.default();
        this.Path = "/events";
        this.ContentType = "text/event-stream";
        this.CacheControl = "no-cache";
        this.Connection = "keep-alive";
        this.Origin = "*";
    }
    start(app) {
        console.log(`Start Emit Events, ${this.Path}`);
        app.get(this.Path, (req, res) => {
            res.writeHead(200, {
                "Content-Type": this.ContentType,
                "Cache-Control": this.CacheControl,
                Connection: this.Connection,
                "Access-Control-Allow-Origin": this.Origin
            });
            res.flushHeaders();
            let i = 0;
            setInterval(() => {
                res.write(`id: ${i}\n`);
                res.write(`event: event1\n`);
                res.write(`data: Message -- ${Date.now()}`);
                res.write(`\n\n`);
                i++;
            }, 5000);
        });
    }
}
exports["default"] = EmitEvents;


/***/ }),

/***/ 582:
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 632:
/***/ ((module) => {

module.exports = require("ejs");

/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 514:
/***/ ((module) => {

module.exports = require("mime-types");

/***/ }),

/***/ 185:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 314:
/***/ ((module) => {

module.exports = require("mongoose-autopopulate");

/***/ }),

/***/ 81:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(165);
/******/ 	
/******/ })()
;