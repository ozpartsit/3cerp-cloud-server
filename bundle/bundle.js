/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3165:
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
exports.App3CERP = exports.email = void 0;
const express_1 = __importDefault(__webpack_require__(6860));
const express_fileupload_1 = __importDefault(__webpack_require__(6674));
const dotenv = __importStar(__webpack_require__(5142));
const cors_1 = __importDefault(__webpack_require__(3582));
const compression_1 = __importDefault(__webpack_require__(7455));
const database_1 = __importDefault(__webpack_require__(991));
const i18n_1 = __importDefault(__webpack_require__(6734));
const statusMonitor_1 = __importDefault(__webpack_require__(4882));
const core_1 = __importDefault(__webpack_require__(6585));
const maintenance_1 = __importDefault(__webpack_require__(6802));
const public_1 = __importDefault(__webpack_require__(93));
const emitEvents_1 = __importDefault(__webpack_require__(1321));
const email_1 = __importDefault(__webpack_require__(3097));
const error_handler_1 = __webpack_require__(9868);
const storage_1 = __importDefault(__webpack_require__(2402));
//import Cache from "./middleware/cache";
const limiter_1 = __importDefault(__webpack_require__(3545));
const path_1 = __importDefault(__webpack_require__(1017));
// Custom ENVIRONMENT Veriables
let env = dotenv.config({
    path: path_1.default.resolve(`.env.${"production"}`)
});
//export const cache = new Cache();
exports.email = new email_1.default();
class App3CERP {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = process.env.PORT || 8080;
        this.db = new database_1.default();
        this.routesCore = new core_1.default();
        this.routesMaintenance = new maintenance_1.default();
        this.routesPublic = new public_1.default();
        this.emitEvents = new emitEvents_1.default();
        this.storage = new storage_1.default();
        process.title = "3CERP";
        console.log("NODE_ENV", "production");
        console.log("NODE_PORT", process.env.PORT);
        this.config();
        this.dbConnect();
        this.mountRoutes();
        this.storage.init();
        //this.hosting.init();
    }
    config() {
        this.app.use((0, compression_1.default)()); // compress all responses
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        // enable files upload
        this.app.use((0, express_fileupload_1.default)({
            createParentPath: true
        }));
        //this.app.use(helmet());
        // serving static files
        this.app.use('/storage', express_1.default.static("storage")); // Storage files
        this.app.use("/public", express_1.default.static("public"));
        this.app.use('/hosting', express_1.default.static("hosting"));
        // Apply the rate limiting middleware to API calls only
        this.app.use('/api', limiter_1.default);
        this.app.use(statusMonitor_1.default);
        this.app.use(i18n_1.default.init);
    }
    mountRoutes() {
        this.routesCore.start(this.app);
        this.routesMaintenance.start(this.app, this);
        this.routesPublic.start(this.app);
        this.emitEvents.start(this.app);
        this.app.use(error_handler_1.errorHandler);
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

/***/ 7429:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_cache_1 = __importDefault(__webpack_require__(4580));
// Ustawienie czasu życia cache (w sekundach)
const cache = new node_cache_1.default({ stdTTL: 60 * 20, checkperiod: 120 * 20 });
exports["default"] = cache;


/***/ }),

/***/ 991:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(1185));
const mongoose_paginate_v2_1 = __importDefault(__webpack_require__(8037));
const static_1 = __importDefault(__webpack_require__(5833));
const methods_1 = __importDefault(__webpack_require__(4934));
mongoose_1.default.plugin(mongoose_paginate_v2_1.default);
mongoose_1.default.plugin(methods_1.default);
mongoose_1.default.plugin(static_1.default);
//import { password, server, database } from "./credentials";
class Database {
    constructor() {
        this.database = process.env.DB_NAME || "";
        this.password = process.env.DB_PASSWORD || "";
        this.server = process.env.DB_SERVER || "";
    }
    connect() {
        const db2 = mongoose_1.default.createConnection(`mongodb://mo1069_backup:Test1!@${this.server}/mo1069_backup`, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            autoIndex: true // false for production
        });
        mongoose_1.default
            .connect(`mongodb://${this.database}:${this.password}@${this.server}/${this.database}`, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            autoIndex: true // false for production
        })
            .then(() => {
            console.log("Database connection successful");
        })
            .catch((err) => {
            console.error("Database connection error");
        });
        //mongoose.set('debug', true);
    }
}
exports["default"] = Database;


/***/ }),

/***/ 6734:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const i18n_1 = __importDefault(__webpack_require__(2425));
const path_1 = __importDefault(__webpack_require__(1017));
i18n_1.default.configure({
    locales: ["en", "pl"],
    directory: path_1.default.resolve(__dirname, "../constants/locales"),
    defaultLocale: "en",
    register: global
});
exports["default"] = i18n_1.default;


/***/ }),

/***/ 4882:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = __webpack_require__(3222)({
    title: '3C Cloud Status',
    theme: 'default.css',
    path: '/status',
    socketPath: '/socket.io',
    spans: [{
            interval: 1,
            retention: 60 // Keep 60 datapoints in memory
        }, {
            interval: 5,
            retention: 60
        }, {
            interval: 15,
            retention: 60
        }],
    chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        eventLoop: true,
        heap: true,
        responseTime: true,
        rps: true,
        statusCodes: true
    },
    healthChecks: [{
            protocol: 'http',
            host: 'localhost',
            path: '/admin/health/ex1',
            port: '3000'
        }, {
            protocol: 'http',
            host: 'localhost',
            path: '/admin/health/ex2',
            port: '3000'
        }],
    ignoreStartsWith: '/admin'
});


/***/ }),

/***/ 2402:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
//requiring path and fs modules
const path_1 = __importDefault(__webpack_require__(1017));
const fs_1 = __importDefault(__webpack_require__(7147));
const schema_1 = __importDefault(__webpack_require__(9106));
class StorageStructure {
    constructor() {
        //resolve storage path of directory
        this.storagePath = path_1.default.resolve("storage");
        this.importPath = path_1.default.resolve("storage", "import");
        this.exportPath = path_1.default.resolve("storage", "export");
        this.uploadsPath = path_1.default.resolve("storage", "uploads");
        if (!fs_1.default.existsSync(this.storagePath))
            fs_1.default.mkdirSync(this.storagePath);
        if (!fs_1.default.existsSync(this.importPath))
            fs_1.default.mkdirSync(this.importPath);
        if (!fs_1.default.existsSync(this.exportPath))
            fs_1.default.mkdirSync(this.exportPath);
        if (!fs_1.default.existsSync(this.uploadsPath))
            fs_1.default.mkdirSync(this.uploadsPath);
    }
    init() {
        console.log("Init Storage", this.storagePath);
        this.mapFiles(this.storagePath, null);
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
    mapFiles(dirPath, 
    //parentPath: string = "root",
    parent) {
        fs_1.default.readdir(dirPath, (err, files) => {
            files.forEach((file) => {
                let folder = parent ? parent.path : encodeURI("storage");
                let doc = new schema_1.default({
                    name: file,
                    type: 'File',
                    path: path_1.default.join(folder, encodeURI(file)),
                    urlcomponent: path_1.default.join(folder, encodeURI(file)),
                });
                if (fs_1.default.lstatSync(path_1.default.join(dirPath, file)).isDirectory()) {
                    doc.type = "Folder";
                    this.mapFiles(path_1.default.join(dirPath, file), doc);
                }
                doc.save();
            });
        });
    }
}
exports["default"] = StorageStructure;


/***/ }),

/***/ 5593:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCountries = void 0;
// class Countries {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "PL", name: "Poland", currency: "PLN", flag: "🇵🇱" },
//       { _id: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" }
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
const countries = ["PL", "GB"];
exports["default"] = countries;
function getCountries(query) { return countries; }
exports.getCountries = getCountries;


/***/ }),

/***/ 7131:
/***/ ((__unused_webpack_module, exports) => {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrencies = void 0;
const currencies = ["PLN", "EUR"];
exports["default"] = currencies;
function getCurrencies(query) { return currencies; }
exports.getCurrencies = getCurrencies;


/***/ }),

/***/ 3587:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCustomerStatus = void 0;
const status = ["lead", "customer", "inactive"];
exports["default"] = status;
function getCustomerStatus(query) { return status; }
exports.getCustomerStatus = getCustomerStatus;


/***/ }),

/***/ 3082:
/***/ ((__unused_webpack_module, exports) => {


// class ItemTypes {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "InvItem", name: "Invenory Item" },
//       { _id: "KitItem", name: "Kit Item" },
//       { _id: "Service", name: "Service" },
//       { _id: "ShippingItem", name: "Shipping Method" }
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
// export default new ItemTypes();
exports["default"] = ["InvItem", "KitItem", "Service", "ShippingItem"];


/***/ }),

/***/ 6118:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPriceBasis = void 0;
const priceBasis = ["BasePrice", "PurchasePrice", "CustomPrice"];
exports["default"] = priceBasis;
function getPriceBasis(query) { return priceBasis; }
exports.getPriceBasis = getPriceBasis;


/***/ }),

/***/ 4448:
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
exports.getStates = void 0;
const cache_1 = __importDefault(__webpack_require__(7429));
const states = {
    PL: ["PL_DS", "PL_KP", "PL_LU", "PL_LB", "PL_MZ", "PL_MA", "PL_OP", "PL_PK", "PL_PD", "PL_PM", "PL_WN", "PL_WP", "PL_ZP", "PL_LD", "PL_SL", "PL_SK"],
    GB: ["GB_NIR", "GB_ENG", "GB_SCT", "GB_WLS"]
};
exports["default"] = states;
function getStates(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query.country) {
            return states[query.country];
        }
        if (query.id) {
            let document = cache_1.default.get(query.id);
            if (document) {
                if (query.field == 'billingState')
                    return states[document["billingCountry"]] || [];
                else
                    return states[document["shippingCountry"]] || [];
            }
            else {
                return Object.values(states).reduce((total, s) => { total.push(...s); return total; }, []);
            }
        }
    });
}
exports.getStates = getStates;
;


/***/ }),

/***/ 998:
/***/ ((__unused_webpack_module, exports) => {


// class TranLineTypes {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "Items", name: "Items" },
//       { _id: "ShippingItem", name: "Shipping Item" },
//       { _id: "KitComponent", name: "Kit Component" }
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
// export default new TranLineTypes();
exports["default"] = ["Items", "ShippingItem", "KitComponent"];


/***/ }),

/***/ 5969:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStatus = void 0;
const status = ["pendingapproval", "open"];
exports["default"] = status;
function getStatus(query) { return status; }
exports.getStatus = getStatus;


/***/ }),

/***/ 2110:
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
const path_1 = __importDefault(__webpack_require__(1017));
const i18n_1 = __importDefault(__webpack_require__(6734));
const countries_1 = __webpack_require__(5593);
const states_1 = __webpack_require__(4448);
const currencies_1 = __webpack_require__(7131);
const price_basis_1 = __webpack_require__(6118);
const transaction_status_1 = __webpack_require__(5969);
const customer_status_1 = __webpack_require__(3587);
const constants = { countries: countries_1.getCountries, states: states_1.getStates, currencies: currencies_1.getCurrencies, pricebasis: price_basis_1.getPriceBasis, status: transaction_status_1.getStatus, customerstatus: customer_status_1.getCustomerStatus };
class controller {
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // i18n
            i18n_1.default.configure({
                directory: path_1.default.resolve(__dirname, "../constants/locales")
            });
            try {
                let values = [];
                if (constants[req.params.recordtype])
                    values = yield constants[req.params.recordtype](req.query);
                let result = values.map(value => {
                    return { _id: value, name: res.__(value) };
                });
                res.json(result);
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    }
}
exports["default"] = controller;


/***/ }),

/***/ 4267:
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
const email_model_1 = __importDefault(__webpack_require__(8499));
const genericController_1 = __importDefault(__webpack_require__(2893));
const child_process_1 = __webpack_require__(2081);
class EmailControllerr extends genericController_1.default {
    constructor(model) {
        super(model);
    }
    save(req, res, next) {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.save.call(this, req, res, next);
            this.syncEmails();
        });
    }
    syncEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('mapEmails');
            let emails = yield email_model_1.default.find();
            for (let email of emails) {
                try {
                    // Test email alias
                    let adres_docelowy = 'notification@3cerp.cloud';
                    let adres_zrodlowy = email.name;
                    let domain = adres_zrodlowy.split("@")[1];
                    (0, child_process_1.exec)(`devil mail alias add ${adres_zrodlowy} ${adres_docelowy}`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                    // DKIM
                    (0, child_process_1.exec)(`devil mail dkim sign ${domain}`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                    // Domena dodana
                    (0, child_process_1.exec)(`devil mail dkim dns ${domain}`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                    // Domena zewnętrzna
                    (0, child_process_1.exec)(`devil mail dkim dns ${domain} --print`, (error, stdout, stderr) => {
                        // fill DKIM field
                        email_model_1.default.findByIdAndUpdate(email._id, { $set: { dkim: stdout } }).then(res => console.log(stdout));
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    }
}
exports["default"] = EmailControllerr;


/***/ }),

/***/ 4758:
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
const schema_1 = __importDefault(__webpack_require__(7662));
const genericController_1 = __importDefault(__webpack_require__(2893));
const path_1 = __importDefault(__webpack_require__(1017));
class FileController extends genericController_1.default {
    constructor(model) {
        super(model);
        this.storagePath = path_1.default.resolve("storage");
    }
    upload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo
            try {
                if (!req.files) {
                    res.send({
                        error: {
                            code: "no_file",
                            message: req.__('no_file')
                        }
                    });
                }
                else {
                    let files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
                    let uploaded = [];
                    for (let file of files) {
                        let dirPath = "uploads";
                        file.mv(path_1.default.join(this.storagePath, dirPath, file.name));
                        let doc = new schema_1.default({
                            name: file.name,
                            type: "File",
                            path: path_1.default.join("storage", encodeURI(dirPath), encodeURI(file.name)),
                            urlcomponent: path_1.default.join("storage", encodeURI(dirPath), encodeURI(file.name)),
                        });
                        //Storage.updateOrInsert(doc)
                        let newFile = yield doc.save();
                        uploaded.push(newFile);
                        //send response
                    }
                    res.send(uploaded);
                }
            }
            catch (err) {
                res.status(500).send(err);
            }
        });
    }
}
exports["default"] = FileController;


/***/ }),

/***/ 2893:
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
const email_1 = __importDefault(__webpack_require__(3097));
const changelog_model_1 = __importDefault(__webpack_require__(7617));
// Uniwersalny kontroler generyczny
class GenericController {
    constructor(model) {
        this.model = model;
    }
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mode } = req.params;
            try {
                //req.body.ownerAccount = req.headers.owneraccount; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
                let { document, msg, saved } = yield this.model.addDocument(mode, req.body);
                //populate response document
                yield document.autoPopulate();
                document = document.constantTranslate(req.locale);
                res.json({ document, msg, saved });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id, mode } = req.params;
            try {
                let document = yield this.model.getDocument(id, mode);
                if (!document)
                    res.status(404).json({
                        error: {
                            code: "doc_not_found",
                            message: req.__('doc_not_found')
                        }
                    });
                else {
                    //populate response document
                    yield document.autoPopulate();
                    let docObject = document.constantTranslate(req.locale);
                    res.json({ document: docObject, mode: mode === "advanced" ? mode : "simple" });
                }
            }
            catch (error) {
                return next(error);
            }
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            try {
                let { document_id, saved } = yield this.model.saveDocument(id);
                if (!document_id) {
                    res.status(404).json({
                        error: {
                            code: "doc_not_found",
                            message: req.__('doc_not_found')
                        }
                    });
                }
                else {
                    res.json({ document_id, saved });
                }
            }
            catch (error) {
                return next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, mode, id } = req.params;
            try {
                // let document = null;
                // if (Array.isArray(req.body)) { // to do - może upateDocument zmienić by przyjomwał cały obiek body?
                //     for (let update of req.body) {
                //         let { list, subrecord, field, value, save } = update;
                //         document = await model.updateDocument(id, update);
                //     }
                // } else {
                //     let { list, subrecord, field, value, save } = req.body;
                //     document = await model.updateDocument(id, list, subrecord, field, value, save);
                // }
                let update = req.body;
                let { document, msg, saved } = yield this.model.updateDocument(id, mode, update);
                if (!document) {
                    res.status(404).json({
                        error: {
                            code: "doc_not_found",
                            message: req.__('doc_not_found')
                        }
                    });
                }
                else {
                    //populate response document
                    yield document.autoPopulate();
                    document = document.constantTranslate(req.locale);
                    res.json({ document, msg, saved });
                }
            }
            catch (error) {
                return next(error);
            }
        });
    }
    delete(req, res, next) {
        let { recordtype, id } = req.params;
        try { // to do - do poprawy
            let document = this.model.deleteDocument(id);
            res.json(document);
        }
        catch (error) {
            return next(error);
        }
    }
    send(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            let config = req.body;
            try {
                let email = new email_1.default();
                let status = yield email.send(config);
                res.json(status);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    fields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype } = req.params;
            try {
                let fields = yield this.model.getFields(req.locale);
                res.json(fields);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    form(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype } = req.params;
            try {
                let form = yield this.model.getForm(req.locale);
                if (form) {
                    let fields = yield this.model.getFields(req.locale);
                    form.sections.forEach((section) => {
                        if (section.table) {
                            section.table = fields.find((f) => f.field == section.table) || null;
                        }
                        section.cols.forEach((col) => {
                            if (col.rows)
                                col.rows.forEach((row) => {
                                    if (row)
                                        row.forEach((field, index) => {
                                            row[index] = fields.find((f) => f.field == field) || null;
                                            if (row[index]) {
                                                if (row[index].type != "EmbeddedField")
                                                    delete row[index].fields;
                                                delete row[index].selects;
                                                delete row[index].ref;
                                            }
                                        });
                                });
                        });
                    });
                }
                res.json(form);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    logs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            try {
                let query = { document: id };
                let results = yield changelog_model_1.default.find(query)
                    .populate({ path: 'newValue', select: 'name' })
                    .populate({ path: 'oldValue', select: 'name' })
                    .exec();
                // parse to plain result
                let changelogs = results.map((line) => {
                    return {
                        newValue: line.newValue && line.newValue.name ? line.newValue.name : line.newValue,
                        oldValue: line.oldValue && line.oldValue.name ? line.oldValue.name : line.oldValue,
                        date: new Date(line.createdAt).toISOString().substr(0, 10),
                        field: line.field,
                        list: line.list
                    };
                });
                res.json(changelogs);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = {};
                let options = { select: { name: 1, type: 1, resource: 1, link: 1 }, sort: {}, limit: 50, skip: 0 };
                let filters = (req.query.filters || "").toString();
                if (filters) {
                    query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
                }
                //query.ownerAccount = req.headers.owneraccount; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
                let select = (req.query.select || req.query.fields || "").toString();
                if (select) {
                    options.select = select.split(",").reduce((o, f) => { o[f] = 1; return o; }, { name: 1, type: 1, resource: 1, link: 1 });
                }
                else {
                    // add default field to select
                    this.model.getFields(req.locale).forEach(field => {
                        if (field.select)
                            options.select[field.field] = 1;
                    });
                }
                // Sort
                let sort = (req.query.sort || "").toString();
                if (sort) {
                    options.sort = sort.split(",").reduce((o, f) => {
                        // -date = desc sort per date field
                        if (f[0] == "-") {
                            f = f.substring(1);
                            o[f] = 1;
                        }
                        else {
                            o[f] = 1;
                        }
                        return o;
                    }, {});
                }
                // search by keyword
                let search = (req.query.search || "").toString();
                if (search) {
                    query['name'] = { $regex: `,*${req.query.search}.*` };
                }
                // loop per query params
                for (const [key, value] of Object.entries(req.query)) {
                    if (["filters", "select", "fields", "search", "sort", "page", "limit"].includes(key))
                        query[key] = { $eq: value };
                    // add verify field exists
                }
                options.limit = parseInt((req.query.limit || 50).toString());
                options.skip = parseInt((req.query.skip || ((Number(req.query.page || 1) - 1) * options.limit) || 0).toString());
                let result = yield this.model.findDocuments(query, options);
                let total = yield this.model.count(query);
                // get fields
                let fields = this.model.getFields(req.locale).filter((field) => options.select[field.field]);
                for (let index in result) {
                    result[index] = yield result[index].constantTranslate(req.locale);
                }
                //to do - test przypisania do source.field
                // result = result.map(line => {
                //     let row = {};
                //     for (const [key, value] of Object.entries(options.select)) {
                //         console.log(key, value,line[key])
                //         row[key] = line[key];
                //     }
                //     return row;
                // })
                // console.log(result)
                const data = {
                    fields: fields,
                    docs: result,
                    totalDocs: total,
                    limit: options.limit,
                    page: options.skip,
                    totalPages: Math.ceil(total / options.limit)
                };
                res.json(data);
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports["default"] = GenericController;


/***/ }),

/***/ 2101:
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
const fs_1 = __importDefault(__webpack_require__(7147));
const ejs_1 = __importDefault(__webpack_require__(9632));
const path_1 = __importDefault(__webpack_require__(1017));
const i18n_1 = __importDefault(__webpack_require__(6734));
const model_1 = __importDefault(__webpack_require__(7849));
const shop_model_1 = __importDefault(__webpack_require__(1725));
class controller {
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            i18n_1.default.setLocale(req.locale);
            let hostingPath = path_1.default.resolve("hosting");
            let views = path_1.default.resolve(hostingPath, req.body.pointer || req.subdomains[0]);
            // check if exists shop - to do (customize template)
            let shop = yield shop_model_1.default.findOne({ subdomain: req.body.pointer || req.subdomains[0] });
            if (shop)
                views = path_1.default.resolve("templates", shop.template);
            // Static files/assets
            let tmp = req.url.toString().split("/");
            let filePath = path_1.default.resolve(hostingPath, req.body.pointer || req.subdomains[0], ...tmp);
            // if does not exist on main dir check templates folder
            if (shop && !fs_1.default.existsSync(filePath))
                filePath = path_1.default.resolve("templates", shop.template, ...tmp);
            if (fs_1.default.existsSync(filePath) && !fs_1.default.lstatSync(filePath).isDirectory()) {
                res.sendFile(filePath);
            }
            else {
                let filepath = path_1.default.join(views, "index" + ".ejs");
                let data;
                // if view params exists
                if (req.params.view) {
                    let viewpath = path_1.default.join(views, "pages", req.params.view + ".ejs");
                    if (fs_1.default.existsSync(viewpath)) {
                        data = { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 1 };
                        if (["search", "products"].includes(req.params.view)) {
                            let query = {};
                            if (req.query.keyword) {
                                query['name'] = { $regex: `.*${req.query.keyword}.*` };
                            }
                            ;
                            let filters = (req.query.filters || "").toString();
                            if (filters) {
                                query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
                            }
                            let options = { sort: {}, limit: 0, skip: 0 };
                            let sort = (req.query.sort || "").toString();
                            if (sort) {
                                options.sort = sort.split(",").reduce((o, f) => {
                                    // -date = desc sort per date field
                                    if (f[0] == "-") {
                                        f = f.substring(1);
                                        o[f] = -1;
                                    }
                                    else
                                        o[f] = 1;
                                    return o;
                                }, {});
                            }
                            options.limit = parseInt((req.query.limit || 9).toString());
                            options.skip = parseInt((req.query.page || 0 * options.limit).toString());
                            let result = yield model_1.default.findDocuments(query, options);
                            let total = yield model_1.default.count(query);
                            for (let line of result) {
                                line = yield line.constantTranslate(req.locale);
                            }
                            // Pagination url halper
                            var q = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
                            q.searchParams.delete('page');
                            q.searchParams.set('page', '');
                            data.url = q.pathname + "?" + q.searchParams.toString();
                            // search queries
                            data.docs = result;
                            data.totalDocs = total;
                            data.limit = options.limit;
                            data.page = options.skip;
                            data.totalPages = total / options.limit;
                        }
                        if (["item", "product"].includes(req.params.view)) {
                            let result = yield model_1.default.getDocument('60df047fec2924769a00834d', 'view');
                            data.item = result;
                        }
                    }
                    else {
                        // set 404 page
                        req.params.view = "404";
                    }
                }
                // i18n
                i18n_1.default.configure({
                    directory: path_1.default.join(views, "/locales")
                });
                try {
                    ejs_1.default.renderFile(filepath, { data: data, view: req.params.view }, (err, result) => {
                        console.log(err, !!result);
                        res.setHeader('content-type', 'text/html');
                        res.writeHead(200, 'Ok');
                        res.write(result);
                        res.end();
                    });
                }
                catch (error) {
                    console.log(error);
                    return next(error);
                }
            }
        });
    }
}
exports["default"] = controller;


/***/ }),

/***/ 2069:
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
const genericController_1 = __importDefault(__webpack_require__(2893));
class TransactionController extends genericController_1.default {
    constructor(model) {
        super(model);
    }
    pdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            let document = yield this.model.getDocument(id, 'view');
            if (document) {
                let pdf = yield document.pdf();
                res.contentType('application/pdf;charset=UTF-8');
                res.send(pdf);
            }
            else {
                res.status(404).json({
                    error: {
                        code: "doc_not_found",
                        message: req.__('doc_not_found')
                    }
                });
            }
        });
    }
}
exports["default"] = TransactionController;


/***/ }),

/***/ 718:
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
const shop_model_1 = __importDefault(__webpack_require__(1725));
const genericController_1 = __importDefault(__webpack_require__(2893));
const child_process_1 = __webpack_require__(2081);
const path_1 = __importDefault(__webpack_require__(1017));
const fs_1 = __importDefault(__webpack_require__(7147));
class WebsiteController extends genericController_1.default {
    constructor(model) {
        super(model);
    }
    save(req, res, next) {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.save.call(this, req, res, next);
            this.syncSites();
        });
    }
    syncSites() {
        return __awaiter(this, void 0, void 0, function* () {
            let shops = yield shop_model_1.default.find();
            for (let site of shops) {
                let sitePath = path_1.default.resolve("hosting", site.subdomain);
                let siteTemplatesPath = path_1.default.resolve("hosting", site.subdomain, "templates");
                //let siteTemplatePath = path.resolve("hosting", site.subdomain, "templates", site.template);
                if (!fs_1.default.existsSync(sitePath))
                    fs_1.default.mkdirSync(sitePath);
                if (!fs_1.default.existsSync(siteTemplatesPath))
                    fs_1.default.mkdirSync(siteTemplatesPath);
                // if (!fs.existsSync(siteTemplatePath)) {
                //     fs.mkdirSync(siteTemplatePath);
                //     // copy template source if was modified
                //     //fs.cp()
                // }
                try {
                    // add custom domain
                    if (site.domain)
                        (0, child_process_1.exec)(`devil dns add ${site.domain}`, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });
                    // add pointer
                    if (site.domain)
                        (0, child_process_1.exec)(`devil www add ${site.domain} pointer 3cerp.cloud`, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });
                    //add SSL
                    if (site.subdomain)
                        (0, child_process_1.exec)(`devil ssl www add 128.204.218.180 le le ${site.subdomain}.3cerp.cloud`, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });
                    if (site.domain)
                        (0, child_process_1.exec)(`devil ssl www add 128.204.218.180 le le ${site.domain}`, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    }
}
exports["default"] = WebsiteController;


/***/ }),

/***/ 9422:
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
const jsonwebtoken_1 = __importDefault(__webpack_require__(9344));
const access_model_1 = __importDefault(__webpack_require__(6402));
const user_model_1 = __importDefault(__webpack_require__(8653));
const email_1 = __importDefault(__webpack_require__(3097));
class Auth {
    constructor() {
        this.tokenSecret = process.env.TOKEN_SECRET || "";
    }
    //Weryfikuje czy token istnieje i jest aktywny 
    authenticate(req, res, next) {
        const tokenParts = (req.headers.authorization || "").split(" ");
        const token = tokenParts[1];
        if (token) {
            try {
                jsonwebtoken_1.default.verify(token, this.tokenSecret, (err, value) => {
                    if (err) {
                        // token wygasł lub jest niepoprawny
                        res.status(500).json({ status: "error", error: { code: "auth.failed_auth_token", message: req.__('auth.failed_auth_token') } });
                    }
                    else {
                        if (value) {
                            req.headers.user = value.user;
                            req.headers.role = value.role;
                            // aktualizacja daty ostatniego authenticate
                            user_model_1.default.findByIdAndUpdate(value.user, { $set: { lastAuthDate: new Date() } }).exec();
                        }
                        next();
                    }
                });
            }
            catch (err) {
                // token wygasł lub jest niepoprawny
                res.status(400).json({ status: "error", error: { code: "auth.invalid_token", message: req.__('auth.invalid_token') } });
            }
        }
        else {
            // Brak tokena
            res.status(401).json({ status: "error", error: { code: "auth.no_token", message: req.__("auth.no_token") } });
        }
    }
    // weryfikuje uprawnienia do danego zasobu
    authorization(level) {
        return (req, res, next) => {
            //to do - dodać weryfikacje 
            if (level < 2 || true)
                next();
            else
                {}
        };
    }
    // potwierdzenie przyznania dostępu
    accessGranted(req, res, next) {
        res.status(200).json({ status: "error", error: { code: "auth.access_granted", message: req.__("auth.access_granted") } });
    }
    // metoda logowania użytkownika
    // na podstawie pary email + hasło nadaje token
    // opcjonalnie rola
    login(req, res, next) {
        access_model_1.default.findOne({ email: req.body.email }).then((access) => __awaiter(this, void 0, void 0, function* () {
            if (access) {
                const valide = yield access.validatePassword(req.body.password);
                if (valide) {
                    user_model_1.default.findOne({ _id: access.user }).then((user) => __awaiter(this, void 0, void 0, function* () {
                        if (user) {
                            if (!(user.roles || []).includes(req.body.role || user.role)) {
                                // użytkownik nie ma uprawnień do tej roli
                                res.status(403).json({ status: "error", error: { code: "auth.wrong_role", message: req.__("auth.wrong_role") } });
                            }
                            // aktualizacja daty ostatniego logowania
                            user_model_1.default.findByIdAndUpdate(user._id, { $set: { lastLoginDate: new Date(), lastAuthDate: new Date() } }).exec();
                            const tokens = createTokenPair(user._id.toString(), req.body.role || user.role, this.tokenSecret);
                            // zwraca parę tokenów
                            res.status(200).json(tokens);
                        }
                        else {
                            // Użytkownik nie istnieje
                            res.status(404).json({ status: "error", error: { code: "auth.user_not_found", message: req.__("auth.user_not_found") } });
                        }
                    }));
                }
                else {
                    // hasło nie pasuje do emaila
                    res.status(403).json({ status: "error", error: { code: "auth.wrong_password", message: req.__("auth.wrong_password") } });
                }
            }
            else {
                // nie istnieje dostęp dla użytkownika o podanym emailu
                res.status(404).json({ status: "error", error: { code: "auth.user_not_exist", message: req.__("auth.user_not_exist") } });
            }
        }));
    }
    // zwraca nową parę tkenów na postawie refreshToken
    refreshToken(req, res, next) {
        if (req.body.refreshToken) {
            try {
                jsonwebtoken_1.default.verify(req.body.refreshToken, this.tokenSecret, (err, value) => {
                    if (err) {
                        // refreshToken wygasł lub jest błędny
                        res.status(500).json({ status: "error", error: { code: "auth.failed_auth_token", message: req.__('auth.failed_auth_token') } });
                    }
                    else {
                        const tokens = createTokenPair(value.user, value.role, this.tokenSecret);
                        res.status(200).json(tokens);
                    }
                });
            }
            catch (err) {
                // refreshToken wygasł lub jest błędny
                res.status(400).json({ status: "error", error: { code: "auth.invalid_token", message: req.__('auth.invalid_token') } });
            }
        }
        else {
            // brak tokena w body
            res.status(401).json({ status: "error", error: { code: "auth.no_token", message: req.__("auth.no_token") } });
        }
    }
    // zwraca dane zalogowanego użytkownika
    getUser(req, res, next) {
        const tokenParts = (req.headers.authorization || "").split(" ");
        const token = tokenParts[1];
        if (token) {
            try {
                jsonwebtoken_1.default.verify(token, this.tokenSecret, (err, value) => {
                    if (err) {
                        // token nieważny lub nieprawidłowy
                        res.status(500).json({ status: "error", error: { code: "auth.failed_auth_token", message: req.__('auth.failed_auth_token') } });
                    }
                    else {
                        if (value && value.user) {
                            user_model_1.default.findOne({ _id: value.user }).then((user) => __awaiter(this, void 0, void 0, function* () {
                                if (user) {
                                    yield user.populate("avatar", "name path");
                                    let userLoged = {
                                        _id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        initials: user.initials,
                                        jobTitle: user.jobTitle,
                                        department: user.department,
                                        company: "3C ERP Sp. z o. o.",
                                        lastLoginDate: user.lastLoginDate,
                                        lastAuthDate: user.lastAuthDate,
                                        locale: user.locale,
                                        avatar: user.avatar,
                                        resource: user.resource,
                                        type: user.type
                                        // role: { _id: "admin", name: "Admin" },
                                        // roles: [{ _id: "admin", name: "Admin" }, { _id: "accounts", name: "Accounts" }],
                                    };
                                    res.status(200).json({ user: userLoged, token: token, role: value.role, account: "3cerpcloud" });
                                }
                                else {
                                    // user nie istnieje
                                    res.status(404).json({ status: "error", error: { code: "auth.user_not_found", message: req.__('auth.user_not_found') } });
                                }
                            }));
                        }
                    }
                });
            }
            catch (err) {
                // token nieważny lub nieprawidłowy
                res.status(400).json({ status: "error", error: { code: "auth.invalid_token", message: req.__('auth.invalid_token') } });
            }
        }
        else {
            // brak Tokena
            res.status(401).json({ status: "error", error: { code: "auth.no_token", message: req.__("auth.no_token") } });
        }
    }
    resetPassword(req, res, next) {
        access_model_1.default.findOne({ email: req.body.email }).then((access) => __awaiter(this, void 0, void 0, function* () {
            if (access) {
                const resetToken = jsonwebtoken_1.default.sign({ _id: access._id }, this.tokenSecret, {
                    expiresIn: "1h"
                });
                let email = new email_1.default();
                let template = {
                    to: req.body.email,
                    subject: '3C ERP Cloud | Reset Password',
                    html: `<a href="https://3cerp.cloud/auth/reset_password?resetToken=${resetToken}">Reset Password</a>`
                };
                yield email.send(template);
                res.status(200).json({ status: "success" });
            }
            else {
                // access nie istnieje
                res.status(404).json({ status: "error", error: { code: "auth.user_not_found", message: req.__('auth.user_not_found') } });
            }
        }));
    }
    setPassword(req, res, next) {
        jsonwebtoken_1.default.verify(req.body.resetToken, this.tokenSecret, (err, value) => {
            if (err) {
                // resetToken wygasł lub jest błędny
                res.status(500).json({ status: "error", error: { code: "auth.failed_auth_token", message: req.__('auth.failed_auth_token') } });
            }
            else {
                access_model_1.default.findOne({ _id: value._id }).then((access) => __awaiter(this, void 0, void 0, function* () {
                    if (access) {
                        access.password = req.body.password;
                        access.save();
                        res.status(200).json({ status: "success" });
                    }
                    else {
                        // access nie istnieje
                        res.status(404).json({ status: "error", error: { code: "auth.user_not_found", message: req.__('auth.user_not_found') } });
                    }
                }));
            }
        });
    }
}
exports["default"] = Auth;
function createTokenPair(user, role, tokenSecret) {
    const token = jsonwebtoken_1.default.sign({ user: user, role: role }, tokenSecret, {
        expiresIn: "1h"
    });
    const refreshToken = jsonwebtoken_1.default.sign({ user: user, role: role }, tokenSecret, {
        expiresIn: "12h"
    });
    const expires = Math.floor(addHours(new Date(), 1).getTime() / 1000);
    return { status: "success", type: "Bearer", token, expires, refreshToken };
}
function addHours(date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
}


/***/ }),

/***/ 9868:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.log('ErrorHandler', error);
    //let errors: ResponseError[] = [];
    let status = 500;
    // let message = "Error";
    // if (!Array.isArray(error)) {
    //   status = error.status || 500;
    //   message = error.message;
    //   errors = [error];
    // }
    // else errors = error;
    //errors.forEach((error: ResponseError) => {
    //if (err instanceof CustomError) res.status(err.statusCode).send({ errors: err.serializeErrors() });
    // if (error instanceof Error.ValidatorError || Error.ValidationError) {
    //   let errors = {};
    //   if (error.errors) {
    //     Object.keys(error.errors).forEach((key) => {
    //       errors[key] = {
    //         list: error.errors[key].list,
    //         _id: error.errors[key]._id,
    //         kind: error.errors[key].kind,
    //         message: error.errors[key].message
    //       };
    //     });
    //   }
    // }
    //})
    return res.status(status).send({ error: error });
};
exports.errorHandler = errorHandler;


/***/ }),

/***/ 3545:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_rate_limit_1 = __importDefault(__webpack_require__(6985));
exports["default"] = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


/***/ }),

/***/ 6402:
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
const mongoose_1 = __webpack_require__(1185);
const bcryptjs_1 = __importDefault(__webpack_require__(8432));
const SALT_WORK_FACTOR = 10;
const options = {
    collection: "accesses",
    type: "access"
};
const schema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    password: { type: String, input: "PasswordField", required: true },
    email: { type: String, input: "TextField", required: true },
    active: { type: Boolean, input: "SwitchField" },
    temporary: { type: Boolean, input: "SwitchField" },
}, options);
// Methods
schema.methods.hashPassword = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(SALT_WORK_FACTOR);
        return yield bcryptjs_1.default.hash(this.password, salt);
    });
};
schema.method("validatePassword", function (newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(newPassword, this.password);
    });
});
schema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        else
            this.password = yield this.hashPassword();
        next();
    });
});
const Access = (0, mongoose_1.model)("Access", schema);
exports["default"] = Access;


/***/ }),

/***/ 9173:
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
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const axios_1 = __importDefault(__webpack_require__(2167));
const options = {
    collection: "addresses",
    type: "address"
};
exports.schema = new mongoose_1.Schema({
    entity: { type: mongoose_1.Schema.Types.ObjectId, input: "SelectField" },
    name: { type: String, input: "TextField" },
    addressee: { type: String, input: "TextField" },
    address: { type: String, required: true, input: "TextField" },
    address2: { type: String, input: "TextField" },
    city: { type: String, required: true, input: "TextField" },
    zip: { type: String, required: true, input: "TextField" },
    country: {
        type: String,
        required: true,
        constant: "countries"
    },
    phone: { type: String, input: "TextField" },
    geoCodeHint: {
        type: String,
        get: (v) => v ? `${v.address}, ${v.address2}, ${v.zip} ${v.city} ${v.country}` : '',
        input: "TextField"
    },
    latitude: { type: String, input: "TextField" },
    longitude: { type: String, input: "TextField" }
}, options);
exports.schema.method("geoCode", function (geoCodeHint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${geoCodeHint}&key=${process.env.GOOGLE_API_KEY}`);
            return {
                latitude: response.data.results[0].geometry.location.lat,
                longitude: response.data.results[0].geometry.location.lng
            };
        }
        catch (err) {
            return {};
        }
    });
});
exports.schema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("geoCodeHint"))
            return next();
        else {
            const coordinate = yield this.geoCode(this.geoCodeHint || "");
            this.latitude = coordinate.latitude;
            this.longitude = coordinate.longitude;
        }
        next();
    });
});
const Address = (0, mongoose_1.model)("Address", exports.schema);
exports["default"] = Address;


/***/ }),

/***/ 7617:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
exports.schema = new mongoose_1.Schema({
    document: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
        default: "Changelog"
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    field: {
        type: String,
        required: true,
    },
    list: {
        type: String,
    },
    record: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    newValue: {
        refPath: 'ref',
        autopopulate: true,
        type: mongoose_1.Schema.Types.Mixed,
    },
    oldValue: {
        refPath: 'ref',
        autopopulate: true,
        type: mongoose_1.Schema.Types.Mixed,
    },
    ref: {
        type: String,
    },
}, {
    collection: "changelogs",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});
exports.schema.index({ name: 1 });
exports.schema.index({ document: 1 });
const Changelog = (0, mongoose_1.model)("Changelog", exports.schema);
Changelog.init().then(function (Event) {
    console.log('Changelog Builded');
});
exports["default"] = Changelog;


/***/ }),

/***/ 791:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = {
    collection: "contacts",
    type: "contact"
};
const schema = new mongoose_1.Schema({
    entity: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: String, input: "TextField" },
    firstName: { type: String, input: "TextField" },
    lastName: { type: String, input: "TextField" },
    email: { type: String, input: "TextField" },
    phone: { type: String, input: "TextField" },
    jobTitle: { type: String, input: "TextField" },
    description: { type: String, input: "TextField" }
}, options);
const Contact = (0, mongoose_1.model)("Contact", schema);
exports["default"] = Contact;


/***/ }),

/***/ 8499:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "text"
    },
    type: {
        type: String,
        required: true,
        default: "email"
    },
    description: {
        type: String,
        input: "text"
    },
    domain: {
        type: String,
        input: "text"
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        autopopulate: true,
        input: "select"
    },
    dkim: {
        type: String,
        input: "text"
    },
}, {
    collection: "emails",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.schema.index({ name: 1 });
const Email = (0, mongoose_1.model)("Email", exports.schema);
exports["default"] = Email;


/***/ }),

/***/ 9692:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(9793));
const options = { discriminatorKey: "type", collection: "entities" };
const schema = new mongoose_1.Schema({
    status: {
        type: String,
        input: "select",
        resource: 'constants',
        constant: 'customerstatus'
    },
    //statistics
    firstSalesDate: { type: Date },
    lastSalesDate: { type: Date },
    firstOrderDate: { type: Date },
    lastOrderDate: { type: Date },
    //classsifictaions
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Group",
        autopopulate: true,
        input: "SelectField"
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        autopopulate: true,
        input: "SelectField"
    },
    //accounting
    terms: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Terms",
        autopopulate: true,
        input: "SelectField"
    },
    paymentMethod: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PaymentMethod",
        autopopulate: true,
        input: "SelectField"
    },
}, options);
const Customer = schema_1.default.discriminator("Customer", schema);
exports["default"] = Customer;


/***/ }),

/***/ 8702:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(9793));
const schema_2 = __importDefault(__webpack_require__(9692));
exports["default"] = schema_1.default;
exports.EntityTypes = {
    customer: schema_2.default
};


/***/ }),

/***/ 9793:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const contact_model_1 = __importDefault(__webpack_require__(791));
const address_model_1 = __importDefault(__webpack_require__(9173));
const options = {
    discriminatorKey: "type", collection: "entities", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    email: { type: String, input: "TextField" },
    name: {
        type: String,
        required: true,
        input: "TextField"
    },
    type: {
        type: String,
        required: true
    },
    locale: { type: String, default: "en" },
    currency: {
        type: String,
        required: true,
        input: "SelectField",
        constant: 'currencies'
    },
    taxNumber: { type: String, input: "TextField" },
    tax: {
        type: Number,
        default: 0,
        input: "PercentField"
    }
}, options);
schema.virtual("addresses", {
    ref: "Address",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: address_model_1.default
});
schema.virtual("contacts", {
    ref: "Contact",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: contact_model_1.default
});
schema.index({ name: 1 });
const Entity = (0, mongoose_1.model)("Entity", schema);
Entity.init().then(function (Event) {
    console.log('Entity Builded');
});
exports["default"] = Entity;


/***/ }),

/***/ 10:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(4305));
const options = { discriminatorKey: "type", collection: "items" };
const schema = new mongoose_1.Schema({
    //statistics
    firstReceiptDate: { type: Date },
    lastReceiptDate: { type: Date },
    firstOrderDate: { type: Date },
    lastOrderDate: { type: Date },
    firstPurchaseDate: { type: Date },
    lastPurchaseDate: { type: Date },
    // vendors: {
    //   type: [Vendors],
    //   validate: [
    //     {
    //       validator: (lines: any[]) => lines.length < 50,
    //       msg: "Must have maximum 50 vendors"
    //     }
    //   ]
    // },
    // warehouses: {
    //   type: [Warehouses],
    //   validate: [
    //     {
    //       validator: (lines: any[]) => lines.length < 10,
    //       msg: "Must have maximum 10 warehouses"
    //     }
    //   ]
    // },
    // locations: {
    //   type: [Locations],
    //   validate: [
    //     {
    //       validator: (lines: any[]) => lines.length < 10,
    //       msg: "Must have maximum 10 locations"
    //     }
    //   ]
    // }
}, options);
const InvItem = schema_1.default.discriminator("InvItem", schema);
exports["default"] = InvItem;


/***/ }),

/***/ 531:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = {
    discriminatorKey: "item",
    collection: "items.components"
};
const schema = new mongoose_1.Schema({
    item: { type: mongoose_1.Schema.Types.ObjectId },
    component: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        autopopulate: { select: "name displayname type _id" },
        input: "autocomplete"
    },
    description: {
        type: String,
        default: ""
    },
    quantity: { type: Number, required: true, default: 1, input: "integer" }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 342:
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
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(4305));
const components_schema_1 = __importDefault(__webpack_require__(531));
const componentModel = (0, mongoose_1.model)("Component", components_schema_1.default);
const options = { discriminatorKey: "type", collection: "items" };
const schema = new mongoose_1.Schema({}, options);
schema.virtual("components", {
    ref: "Component",
    localField: "_id",
    foreignField: "item",
    justOne: false,
    autopopulate: true,
    model: componentModel
});
// schema.method("getComponents", async function (kitline: any) {
//   await this.populate("components");
//   const components = this.components.map((component: IComponent) => {
//     return {
//       item: component.component,
//       quantity: component.quantity,
//       description: component.description,
//       type: "KitComponent",
//       kit: kitline
//     };
//   });
//   await this.depopulate("components");
//   return components;
// });
schema.method("syncComponents", function (line) {
    return __awaiter(this, void 0, void 0, function* () {
        let exists = false;
        line.parent.lines.forEach((existline) => {
            if (existline.kit && existline.kit._id.toString() === line._id.toString()) {
                existline.quantity = existline.multiplyquantity * line.quantity;
                exists = true;
            }
        });
        if (!exists) {
            yield this.populate("components");
            for (const [subindex, component] of this.components.entries()) {
                let newline = {
                    item: component.component,
                    quantity: component.quantity,
                    description: component.description,
                    multiplyquantity: component.quantity,
                    type: "KitComponent",
                    kit: line._id
                };
                if (line.parent.lines) {
                    line.parent.addToVirtuals("lines", newline, line.index + 1 + subindex);
                }
            }
            yield this.depopulate("components");
        }
    });
});
const KitItem = schema_1.default.discriminator("KitItem", schema);
exports["default"] = KitItem;


/***/ }),

/***/ 7849:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(4305));
const schema_2 = __importDefault(__webpack_require__(10));
const schema_3 = __importDefault(__webpack_require__(342));
const schema_4 = __importDefault(__webpack_require__(2557));
exports["default"] = schema_1.default;
exports.ItemTypes = {
    invitem: schema_2.default,
    kititem: schema_3.default,
    service: schema_4.default
};


/***/ }),

/***/ 4365:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const currencies_1 = __importDefault(__webpack_require__(7131));
const options = { discriminatorKey: "type", foreignField: "item", collection: "items.price" };
const schema = new mongoose_1.Schema({
    item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item"
    },
    price: { type: Number, default: 0, required: true },
    moq: { type: Number, default: 1, required: true },
    currency: {
        type: String,
        enum: currencies_1.default,
        required: true,
        resource: 'constants',
        constant: 'currencies'
    },
    priceLevel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classification",
        autopopulate: true,
        required: false,
    }
}, options);
const Price = (0, mongoose_1.model)("Price", schema);
exports["default"] = Price;


/***/ }),

/***/ 4305:
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
const mongoose_1 = __webpack_require__(1185);
const item_types_1 = __importDefault(__webpack_require__(3082));
const price_schema_1 = __importDefault(__webpack_require__(4365));
// Schemas ////////////////////////////////////////////////////////////////////////////////
const options = {
    discriminatorKey: "type",
    collection: "items",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    name: { type: String, required: true, input: "TextField" },
    description: { type: String, input: "TextField", default: "" },
    type: {
        type: String,
        required: true,
        enum: item_types_1.default,
        input: "SelectField"
    },
    priceGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classification",
        autopopulate: true,
        required: false,
        input: "SelectField"
    },
    images: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Storage",
        autopopulate: true,
        input: "FileField"
    },
    coo: {
        type: String,
        input: "SelectField"
    },
    barcode: {
        type: String,
        input: "TextField"
    },
    weight: {
        type: Number,
        input: "NumberField"
    },
    status: {
        type: String,
    },
    manufacturer: {
        type: String,
        input: "TextField"
    },
    firstSalesDate: { type: Date, input: "DateField" },
    lastSalesDate: { type: Date, input: "DateField" },
}, options);
schema.virtual("prices", {
    ref: "Price",
    localField: "_id",
    foreignField: "item",
    justOne: false,
    autopopulate: true,
    model: price_schema_1.default
});
schema.method("getPrice", function (line) {
    return __awaiter(this, void 0, void 0, function* () {
        if (line.type === "Kit Component")
            return 0;
        else
            return 1.99;
    });
});
const Item = (0, mongoose_1.model)("Item", schema);
exports["default"] = Item;


/***/ }),

/***/ 2557:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "items" };
const schema = new mongoose_1.Schema({}, options);
const Service = (0, mongoose_1.model)("Service", schema);
exports["default"] = Service;


/***/ }),

/***/ 1725:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "text"
    },
    subdomain: {
        type: String,
        required: true,
        min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "text"
    },
    type: {
        type: String,
        required: true,
        enum: ["webshop"],
        default: "webshop"
    },
    template: {
        type: String,
        required: true,
        default: "default",
        input: "text"
    },
    status: {
        type: String,
        required: true,
        enum: ["online", "offline"],
        default: "offline"
    },
    domain: {
        type: String,
        input: "text"
    }
}, {
    collection: "websites",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.schema.virtual('url').get(function () {
    return `https://${this.subdomain}.3cerp.cloud`;
});
exports.schema.index({ name: 1 });
const Shop = (0, mongoose_1.model)("Shop", exports.schema);
exports["default"] = Shop;


/***/ }),

/***/ 7662:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(9106));
const mime_types_1 = __importDefault(__webpack_require__(9514));
const options = { discriminatorKey: "type", collection: "storages", };
const schema = new mongoose_1.Schema({
    //size: { type: Number, set: (v: any) => getFileSize(this.path) },
    mime: { type: String, set: (v) => mime_types_1.default.lookup(v).toString() },
}, options);
const File = schema_1.default.discriminator("File", schema);
exports["default"] = File;


/***/ }),

/***/ 7559:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(9106));
const options = { discriminatorKey: "type", collection: "storages" };
const schema = new mongoose_1.Schema({}, options);
const Folder = schema_1.default.discriminator("Folder", schema);
exports["default"] = Folder;


/***/ }),

/***/ 248:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorageTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(9106));
const schema_2 = __importDefault(__webpack_require__(7559));
const schema_3 = __importDefault(__webpack_require__(7662));
exports["default"] = schema_1.default;
exports.StorageTypes = {
    folder: schema_2.default,
    file: schema_3.default
};


/***/ }),

/***/ 9106:
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
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const fs_1 = __importDefault(__webpack_require__(7147));
const mime_types_1 = __importDefault(__webpack_require__(9514));
const options = {
    collection: "storages",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
exports.schema = new mongoose_1.Schema({
    name: { type: String, required: true, },
    type: { type: String, required: true },
    path: { type: String, required: true, },
    url: { type: String, },
    urlcomponent: { type: String, },
}, options);
exports.schema.statics.updateOrInsert = function (doc) {
    return this.updateOne({ name: doc.name, path: doc.path }, doc, { upsert: true }, (err, result) => {
        if (err)
            throw err;
        return result;
    });
};
exports.schema.method("rename", function (path) {
    return __awaiter(this, void 0, void 0, function* () {
        this.path = path;
        let doc = this;
        fs_1.default.rename(this.path, path, function (err) {
            let name = path.split("/").pop();
            if (err)
                throw err;
            doc.name = name || "";
            doc.save();
            console.log("Successfully renamed - AKA moved!");
        });
    });
});
exports.schema.static("deleteFile", function (path) {
    return __awaiter(this, void 0, void 0, function* () {
        let model = this;
        fs_1.default.unlink(path, function (err) {
            if (err)
                throw err;
            model.deleteOne({ path: path });
            console.log("Successfully removed!");
        });
    });
});
exports.schema.static("addFile", function (files, path) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let file of files) {
            let name = file.name;
            file.mv(path, function (err) {
                if (err)
                    throw err;
            });
            let doc = new this({
                name: name,
                type: mime_types_1.default.lookup(name).toString(),
                path: path,
                urlcomponent: encodeURI(`${path}/${name}`)
            });
            doc.save();
        }
    });
});
const Storage = (0, mongoose_1.model)("Storage", exports.schema);
exports["default"] = Storage;


/***/ }),

/***/ 7571:
/***/ (function(__unused_webpack_module, exports) {


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
exports.setQuantity = exports.setItem = void 0;
function setItem(line) {
    return __awaiter(this, void 0, void 0, function* () {
        if (line.item) {
            yield line.populate("item");
            //fill fields
            line.description = line.item.description || "";
            line.price = yield line.item.getPrice(line);
            // kitItem
            if (line.item && line.item.type === "KitItem") {
                yield line.item.syncComponents(line);
            }
            line.depopulate("item");
        }
    });
}
exports.setItem = setItem;
function setQuantity(line) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("setVaule_quantity");
        if (line.item && line.item.type === "KitItem") {
            yield line.item.syncComponents(line);
        }
    });
}
exports.setQuantity = setQuantity;


/***/ }),

/***/ 2801:
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
const mongoose_1 = __webpack_require__(1185);
const transaction_lines_types_1 = __importDefault(__webpack_require__(998));
const usefull_1 = __webpack_require__(6491);
const line_actions_1 = __webpack_require__(7571);
const options = {
    discriminatorKey: "parentType",
    collection: "transactions.lines",
    foreignField: "transaction",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    index: {
        type: Number
    },
    transaction: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    kit: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Line"
    },
    entity: { type: mongoose_1.Schema.Types.ObjectId, copy: "transaction" },
    type: {
        type: String,
        //required: true,
        //get: (v: any) => TranLineTypes.getName(v),
        enum: transaction_lines_types_1.default
    },
    item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        autopopulate: { select: "name displayname type _id" },
        input: "SelectField"
    },
    description: {
        type: String,
        set: (v) => v.toLowerCase(),
        input: "TextField"
    },
    price: {
        type: Number,
        default: 0,
        input: "CurrencyField",
        set: (v) => (0, usefull_1.roundToPrecision)(v, 2)
    },
    quantity: {
        type: Number,
        default: 1,
        input: "IntField"
    },
    multiplyquantity: {
        type: Number,
        default: 1,
        input: "IntField"
    },
    amount: { type: Number, default: 0, input: "CurrencyField" },
    taxAmount: { type: Number, default: 0, input: "CurrencyField" },
    grossAmount: { type: Number, default: 0, input: "CurrencyField" },
    weight: { type: Number, default: 0, input: "NumberField" },
    deleted: { type: Boolean, default: false }
}, options);
schema.method("components", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.populate("item");
        if (this.item && this.item.type === "KitItem")
            this.item.getComponents();
    });
});
schema.method("actions", function (trigger) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${trigger.type}_${trigger.field}`);
        switch (`${trigger.type}_${trigger.field}`) {
            case 'setValue_item':
                yield (0, line_actions_1.setItem)(this);
                break;
            case 'setValue_quantity':
                yield (0, line_actions_1.setQuantity)(this);
                break;
            default:
                console.log(`Sorry, trigger dose nto exist ${trigger.type}_${trigger.field}.`);
        }
    });
});
schema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pre valide transaction line");
        //if (this.deleted) throw new Error.ValidationError();
        // calc and set amount fields
        this.amount = (0, usefull_1.roundToPrecision)(this.quantity * this.price, 2);
        // tmp tax rate
        this.taxRate = 0.23;
        this.taxAmount = (0, usefull_1.roundToPrecision)(this.amount * this.taxRate, 2);
        this.grossAmount = (0, usefull_1.roundToPrecision)(this.amount + this.taxAmount, 2);
        next();
    });
});
schema.index({ transaction: 1 });
const Line = (0, mongoose_1.model)("Line", schema);
exports["default"] = Line;


/***/ }),

/***/ 235:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(5740));
const schema_2 = __importDefault(__webpack_require__(8982));
// import Invoice, { IInvoiceModel } from "./invoice/schema";
// import ItemFulfillment, { IItemFulfillmentModel } from "./itemFulfillment/schema";
// import ItemReceipt, { IItemReceiptModel } from "./itemReceipt/schema";
// import InventoryAdjustment, { IInventoryAdjustmentModel } from "./inventoryAdjustment/schema";
// import PurchaseOrder, { IPurchaseOrderModel } from "./purchaseOrder/schema";
exports["default"] = schema_1.default;
exports.TransactionTypes = {
    salesorder: schema_2.default,
    // invoice: Invoice,
    // itemfulfillment: ItemFulfillment,
    // itemreceipt: ItemReceipt,
    // inventoryadjustment: InventoryAdjustment,
    // purchaseorder: PurchaseOrder
};


/***/ }),

/***/ 1874:
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
const mongoose_1 = __webpack_require__(1185);
const options = {
    collection: "transactions.lines",
    foreignField: "transaction",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    eta: { type: Date },
    etaMemo: { type: String },
}, options);
schema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pre valide line SO");
        next();
    });
});
exports["default"] = schema;


/***/ }),

/***/ 8982:
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
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(5740));
const line_schema_1 = __importDefault(__webpack_require__(1874));
const lineModel = mongoose_1.models.Line.discriminator("LineSalesOrder", line_schema_1.default);
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({
    shippingCost: { type: Number, default: 0, input: "CurrencyField" },
    terms: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Terms",
        autopopulate: true,
        input: "SelectField"
    },
    paymentMethod: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PaymentMethod",
        autopopulate: true,
        input: "SelectField"
    },
}, options);
schema.virtual("lines", {
    ref: "LineSalesOrder",
    localField: "_id",
    foreignField: "transaction",
    justOne: false,
    autopopulate: true,
    model: lineModel,
    copyFields: ["entity"]
});
schema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("salesorder pre valide");
        next();
    });
});
const SalesOrder = schema_1.default.discriminator("SalesOrder", schema);
exports["default"] = SalesOrder;


/***/ }),

/***/ 5740:
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
const mongoose_1 = __webpack_require__(1185);
const pdf_1 = __importDefault(__webpack_require__(180));
const address_model_1 = __webpack_require__(9173);
const line_schema_1 = __importDefault(__webpack_require__(2801));
// Schemas ////////////////////////////////////////////////////////////////////////////////
const TransactionSchema = {
    name: { type: String, input: "TextField", set: (v) => v.toLowerCase(), select: true },
    date: { type: Date, input: "DateField", required: true, select: true },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Company",
        required: false,
        autopopulate: true,
        input: "SelectField"
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        required: true,
        autopopulate: true,
        input: "SelectField",
        select: true
    },
    number: { type: Number, input: "IntField" },
    quantity: {
        type: Number,
        default: 0,
        input: "IntField",
        total: "lines"
    },
    amount: { type: Number, default: 0, input: "CurrencyField", total: "lines", select: true },
    taxAmount: { type: Number, default: 0, input: "CurrencyField", total: "lines", select: true },
    grossAmount: { type: Number, default: 0, input: "CurrencyField", total: "lines", select: true },
    weight: { type: Number, default: 0, input: "NumberField" },
    tax: {
        type: Number,
        default: 0,
        input: "PercentField"
    },
    exchangeRate: {
        type: Number,
        required: true,
        default: 1,
        input: "NumberField",
        precision: 4
    },
    currency: {
        type: String,
        required: true,
        default: "PLN",
        input: "SelectField",
        constant: 'currencies',
    },
    memo: {
        type: String,
        input: "TextareaField"
    },
    billingAddress: address_model_1.schema,
    shippingAddress: address_model_1.schema,
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pendingapproval",
        constant: 'statuses',
    },
    taxNumber: { type: String, input: "TextField" },
    referenceNumber: { type: String, input: "TextField" },
};
const options = {
    discriminatorKey: "type",
    collection: "transactions",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema(TransactionSchema, options);
schema.virtual("lines", {
    ref: "Line",
    localField: "_id",
    foreignField: "transaction",
    justOne: false,
    autopopulate: true,
    model: line_schema_1.default,
    copyFields: ["entity"],
    options: { sort: { index: 1 } },
});
schema.method("pdf", function () {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, pdf_1.default)();
    });
});
schema.method("autoName", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // set new transaction name (prefix+number+sufix)
        if (!this.number) {
            //console.log(this);
            let temp = yield this.populate("company");
            //console.log(temp);
            //console.log(temp.company, temp.company.name, temp.company.tmp);
            // let format = this.company.transactionNumbers.find(
            //   (transaction: any) => transaction.type === this.type
            // );
            // if (format) {
            //   this.number = format.currentNumber;
            //   this.name = `${format.prefix || ""}${format.currentNumber}${
            //     format.sufix || ""
            //   }`;
            //   this.company.incNumber(this.type);
            // } else throw new Error("Record Type is undefined in Company record");
            this.number = 7;
            this.name = "SO#7";
        }
    });
});
schema.method("findRelations", function () {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, mongoose_1.model)("Transaction").find({ type: this.type }, (err, transactions) => {
        });
    });
});
schema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("transaction pre valide");
        next();
    });
});
schema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.autoName();
    });
});
const Transaction = (0, mongoose_1.model)("Transaction", schema);
exports["default"] = Transaction;


/***/ }),

/***/ 8653:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const access_model_1 = __importDefault(__webpack_require__(6402));
const options = {
    discriminatorKey: "type", collection: "users", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    email: { type: String, input: "TextField" },
    name: {
        type: String,
        required: true,
        input: "TextField"
    },
    firstName: {
        type: String,
        input: "TextField"
    },
    lastName: {
        type: String,
        input: "TextField"
    },
    jobTitle: {
        type: String,
        input: "TextField"
    },
    avatar: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Storage",
        autopopulate: true,
        input: "FileField"
    },
    department: {
        type: String,
        input: "TextField"
    },
    lastLoginDate: {
        type: Date
    },
    lastAuthDate: {
        type: Date
    },
    type: {
        type: String,
        required: true
    },
    locale: { type: String, default: "en", input: "SelectField" },
    role: { type: String, required: true, input: "TextField" },
    roles: { type: [String], input: "SelectField" },
}, options);
schema.virtual('initials').get(function () {
    if (this.firstName && this.lastName)
        return `${this.firstName[0]}${this.lastName[0]}`;
    else
        return "";
});
schema.virtual("accessess", {
    ref: "Access",
    localField: "_id",
    foreignField: "User",
    justOne: false,
    autopopulate: true,
    model: access_model_1.default
});
schema.index({ name: 1 });
const User = (0, mongoose_1.model)("User", schema);
exports["default"] = User;


/***/ }),

/***/ 6585:
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
//import subdomain from "express-subdomain";
const auth_1 = __importDefault(__webpack_require__(9422));
const express_1 = __importDefault(__webpack_require__(6860));
const genericController_1 = __importDefault(__webpack_require__(2893));
const transactions_1 = __importDefault(__webpack_require__(2069));
const websites_1 = __importDefault(__webpack_require__(718));
const constants_1 = __importDefault(__webpack_require__(2110));
const files_1 = __importDefault(__webpack_require__(4758));
const hosting_1 = __importDefault(__webpack_require__(2101));
const emails_1 = __importDefault(__webpack_require__(4267));
const user_model_1 = __importDefault(__webpack_require__(8653));
const shop_model_1 = __importDefault(__webpack_require__(1725));
const model_1 = __webpack_require__(248);
const model_2 = __webpack_require__(235);
const model_3 = __webpack_require__(7849);
const model_4 = __webpack_require__(8702);
const email_model_1 = __importDefault(__webpack_require__(8499));
const shop_model_2 = __importDefault(__webpack_require__(1725));
class Routes {
    constructor() {
        this.Router = express_1.default.Router();
        this.RouterHosting = express_1.default.Router();
        this.RouterFiles = express_1.default.Router();
        this.Auth = new auth_1.default();
        this.websiteController = new websites_1.default(shop_model_2.default);
        this.constantController = new constants_1.default();
        this.hostingController = new hosting_1.default();
        this.emailController = new emails_1.default(email_model_1.default);
    }
    start(app) {
        console.log("Start Routing");
        //Users
        this.routeUniversal("users", new genericController_1.default(user_model_1.default));
        //Storage
        Object.values(model_1.StorageTypes).forEach(storage => {
            this.routeFiles(new files_1.default(storage));
        });
        //Transactions
        Object.values(model_2.TransactionTypes).forEach(transaction => {
            this.routeUniversal("transactions", new transactions_1.default(transaction));
        });
        //Items
        Object.values(model_3.ItemTypes).forEach(item => {
            this.routeUniversal("items", new genericController_1.default(item));
        });
        //Entities
        Object.values(model_4.EntityTypes).forEach(entity => {
            this.routeUniversal("entities", new genericController_1.default(entity));
        });
        this.routeUniversal("emails", this.emailController);
        this.routeUniversal("websites", this.websiteController);
        this.routeConstants();
        this.routeAuth();
        this.routeHosting();
        app.use(subdomain("*", this.RouterHosting));
        app.use("/api/core", this.Router);
    }
    routeUniversal(collection, controller) {
        this.Router.route(`/${collection}/:recordtype/fields`).get(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.fields.bind(controller));
        this.Router.route(`/${collection}/:recordtype/form`).get(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.form.bind(controller));
        this.Router.route(`/${collection}/:recordtype`).get(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.find.bind(controller));
        this.Router.route(`/${collection}/:recordtype/new/:mode?`).post(this.Auth.authorization(3).bind(this.Auth), controller.add.bind(controller));
        if (controller.pdf)
            this.Router.route(`/${collection}/:recordtype/:id/pdf`).get(this.Auth.authorization(3).bind(this.Auth), controller.pdf.bind(controller));
        this.Router.route(`/${collection}/:recordtype/:id/logs`).get(this.Auth.authorization(3).bind(this.Auth), controller.logs.bind(controller));
        this.Router.route(`/${collection}/:recordtype/:id/:mode?`)
            .get(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.get.bind(controller))
            .patch(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.update.bind(controller))
            .put(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.save.bind(controller))
            .delete(this.Auth.authenticate.bind(this.Auth), this.Auth.authorization(3).bind(this.Auth), controller.delete.bind(controller));
    }
    routeConstants() {
        // Constants
        this.Router.route("/constants/:recordtype").get(this.constantController.get);
    }
    routeAuth() {
        // Auth
        this.Router.route("/auth/login").post(this.Auth.login.bind(this.Auth));
        this.Router.route("/auth/token").post(this.Auth.login.bind(this.Auth));
        this.Router.route("/auth/refresh").post(this.Auth.refreshToken.bind(this.Auth));
        this.Router.route("/auth/user").get(this.Auth.authenticate.bind(this.Auth), this.Auth.getUser.bind(this.Auth));
        this.Router.route("/auth/user").get(this.Auth.authenticate.bind(this.Auth), this.Auth.getUser.bind(this.Auth));
        this.Router.route("/auth/verify").get(this.Auth.authenticate.bind(this.Auth), this.Auth.accessGranted.bind(this.Auth));
        this.Router.route("/auth/reset_password")
            .post(this.Auth.resetPassword.bind(this.Auth))
            .patch(this.Auth.setPassword.bind(this.Auth));
    }
    routeFiles(controller) {
        // Files
        this.Router.route("/files/upload/:path*?").post(this.Auth.authenticate.bind(this.Auth), controller.upload.bind(controller));
        this.Router.route("/files/:path*?").get(controller.find.bind(controller));
    }
    routeHosting() {
        // Hosting
        this.RouterHosting.route("/:view?/:param?").get(this.hostingController.get);
        this.RouterHosting.route("*").get(this.hostingController.get);
    }
}
exports["default"] = Routes;
function subdomain(subdomain, fn) {
    if (!subdomain || typeof subdomain !== "string") {
        throw new Error("The first parameter must be a string representing the subdomain");
    }
    //check fn handles three params..
    if (!fn || typeof fn !== "function" || fn.length < 3) {
        throw new Error("The second parameter must be a function that handles fn(req, res, next) params.");
    }
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // domain pointer redirect to hosting
            let website = yield shop_model_1.default.findOne({ domain: req.hostname });
            if (website) {
                req.body.pointer = website.subdomain;
            }
            req._subdomainLevel = req._subdomainLevel || 0;
            var subdomainSplit = subdomain.split('.');
            var len = subdomainSplit.length;
            var match = true;
            //url - v2.api.example.dom
            //subdomains == ['api', 'v2']
            //subdomainSplit = ['v2', 'api']
            for (var i = 0; i < len; i++) {
                var expected = subdomainSplit[len - (i + 1)];
                var actual = req.subdomains[i + req._subdomainLevel];
                if (actual === "www")
                    actual = false;
                if (expected === '*') {
                    continue;
                }
                if (actual !== expected) {
                    match = false;
                    break;
                }
            }
            if ((actual || req.body.pointer) && match) {
                req._subdomainLevel++; //enables chaining
                return fn(req, res, next);
            }
            else {
                if (actual)
                    res.send("ok");
                else
                    next();
            }
        });
    };
}


/***/ }),

/***/ 6802:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(6860));
const path_1 = __importDefault(__webpack_require__(1017));
const child_process_1 = __webpack_require__(2081);
class Routes {
    constructor() {
        this.Router = express_1.default.Router();
    }
    start(app, App3CERP) {
        console.log("Start Maintenance Routing");
        this.stop(App3CERP);
        this.restart(App3CERP);
        app.use("/maintenance", this.Router);
        // exec("devil dns add 3c-erp.eu", (error, stdout, stderr) => {
        //   if (error) {
        //     console.log(`error: ${error.message}`);
        //     return;
        //   }
        //   if (stderr) {
        //     console.log(`stderr: ${stderr}`);
        //     return;
        //   }
        //   console.log(`stdout: ${stdout}`);
        // })
        // exec("devil www add 3c-erp.eu pointer 3cerp.cloud", (error, stdout, stderr) => {
        //   if (error) {
        //     console.log(`error: ${error.message}`);
        //     return;
        //   }
        //   if (stderr) {
        //     console.log(`stderr: ${stderr}`);
        //     return;
        //   }
        //   console.log(`stdout: ${stdout}`);
        // })
        //devil ssl www add 128.204.218.180 le le website.3cerp.cloud
    }
    stop(App3CERP) {
        this.Router.route("/stop").get(() => {
            console.log("stop");
            App3CERP.stopServer();
        });
    }
    restart(App3CERP) {
        this.Router.route("/restart/:domain").get((req) => {
            console.log("restart", req.params.domain);
            if (req.params.domain) {
                var packagePath = path_1.default.resolve();
                console.log(packagePath);
                App3CERP.stopServer();
                // Restart process ...
                setTimeout(() => {
                    //execSync("npm run start", { stdio: "inherit", cwd: packagePath });
                    (0, child_process_1.execSync)(`devil www restart ${req.params.domain}`, { stdio: "inherit", cwd: packagePath });
                }, 5000);
            }
        });
    }
}
exports["default"] = Routes;


/***/ }),

/***/ 93:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(6860));
const path_1 = __importDefault(__webpack_require__(1017));
class Routes {
    constructor() {
        this.Router = express_1.default.Router();
    }
    start(app) {
        console.log("Start Public Routing");
        let publicePath = path_1.default.resolve("public");
        this.Router.route("/*").get((req, res) => {
            console.log("client.html");
            res.sendFile(path_1.default.resolve(publicePath, 'client.html'));
        });
        app.use("/*", this.Router);
    }
}
exports["default"] = Routes;


/***/ }),

/***/ 3097:
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
const nodemailer_1 = __importDefault(__webpack_require__(5184));
class Email {
    constructor() {
        this.host = "mail0.small.pl";
        this.port = 465;
        this.secure = true;
        this.user = "notification@3c-erp.eu";
        this.pass = "Test1!";
        this.transporter = nodemailer_1.default.createTransport({
            pool: true,
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: {
                user: this.user,
                pass: this.pass
            }
        });
        // this.email = {
        //   from: 'test@ozparts.eu',
        //   to: 'it@ozparts.eu',
        //   subject: 'test',
        //   html: 'test'
        // }
    }
    send(email = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transporter.sendMail(email);
            //   , (error: any, info: any) => {
            //   if (error) {
            //     throw error;
            //   } else {
            //     console.log('Message sent: %s', info.messageId);
            //     return info.messageId;
            //   }
            // });
        });
    }
}
exports["default"] = Email;


/***/ }),

/***/ 1321:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const auth_1 = __importDefault(__webpack_require__(9422));
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

/***/ 4934:
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
const setValue_1 = __importDefault(__webpack_require__(7296));
const changeLogs_1 = __importDefault(__webpack_require__(2573));
const virtualPopulate_1 = __importDefault(__webpack_require__(7650));
const autoPopulate_1 = __importDefault(__webpack_require__(5363));
const constantTranslate_1 = __importDefault(__webpack_require__(7442));
const validateVirtuals_1 = __importDefault(__webpack_require__(4002));
const totalVirtuals_1 = __importDefault(__webpack_require__(4649));
const addToVirtuals_1 = __importDefault(__webpack_require__(2329));
const cache_1 = __importDefault(__webpack_require__(7429));
function customMethodsPlugin(schema) {
    // apply method to pre
    function recalcDocument() {
        console.log("default recalc Record");
    }
    schema.method('setValue', setValue_1.default);
    schema.method('changeLogs', changeLogs_1.default);
    schema.method('virtualPopulate', virtualPopulate_1.default);
    schema.method('autoPopulate', autoPopulate_1.default);
    schema.method('constantTranslate', constantTranslate_1.default);
    schema.method('validateVirtuals', validateVirtuals_1.default);
    schema.method('totalVirtuals', totalVirtuals_1.default);
    schema.method('addToVirtuals', addToVirtuals_1.default);
    schema.method('recalcDocument', recalcDocument);
    schema.method('validateDocument', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("validateDocument");
            let errors = [];
            let err = this.validateSync();
            if (err)
                errors.push(err);
            let virtualmsg = yield this.validateVirtuals(false);
            if (virtualmsg && virtualmsg.length)
                errors.push(...virtualmsg);
            return errors;
        });
    });
    schema.method('saveDocument', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("save document");
            this.recalcDocument();
            yield this.validateVirtuals(true);
            yield this.changeLogs();
            let document = yield this.save();
            cache_1.default.del(document._id.toString());
            return document;
        });
    });
    //triggers loop
    // async function actions(this: T, next: any) {
    //   console.log("post valide ")
    //   if (this.$locals.triggers) {
    //     let triggers: any = this.$locals.triggers;
    //     for (let trigger of triggers) {
    //         await actions(trigger);
    //       // remove trigger
    //       triggers.shift();
    //       await this.validate()
    //     }
    //   }
    // }
    // add resource
    schema.virtual('resource').get(function () {
        let resources = this.collection.name.split(".");
        return resources[0];
    });
    //add locals
    function initLocal() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$locals["oldValue"] = {};
            this.$locals["triggers"] = [];
        });
    }
    schema.pre("init", initLocal);
    // add Owner ID
    // schema.add({
    //   ownerAccount: {
    //     type: String,//Schema.Types.ObjectId,
    //     required: true,
    //   },
    // });
    // owner restriction
    //schema.pre('find', function (this:any) {
    //mongoose.connection.useDb('mo1069_backup');
    //console.log(mongoose.connection)
    // const currentUser = "test";
    // this.where({ ownerAccount: currentUser });
    //console.log(next, req,test)
    //let tmp = req();
    //console.log( this)
    //next();
    //});
}
exports["default"] = customMethodsPlugin;


/***/ }),

/***/ 2329:
/***/ (function(__unused_webpack_module, exports) {


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
function addToVirtuals(virtual, newline, index) {
    return __awaiter(this, void 0, void 0, function* () {
        let list = this.schema.virtuals[virtual];
        newline = new list.options.model(newline);
        newline.initLocal();
        newline.index = index;
        newline.parent = this;
        // copy field value from parten document
        (list.options.copyFields || []).forEach((field) => {
            newline[field] = this[field] ? this[field]._id : this[field];
        });
        this[virtual].splice(index, 0, newline);
        yield this.validateVirtuals(false);
    });
}
exports["default"] = addToVirtuals;


/***/ }),

/***/ 5363:
/***/ (function(__unused_webpack_module, exports) {


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
function autoPopulate(local) {
    return __awaiter(this, void 0, void 0, function* () {
        let paths = [];
        this.schema.eachPath(function process(pathname, schemaType) {
            if (pathname === "_id")
                return;
            if (schemaType.options.ref && schemaType.options.autopopulate) {
                paths.push({
                    field: pathname,
                    select: schemaType.options.autopopulate.select || "name displayname type _id resource path "
                });
            }
        });
        let Promises = [];
        for (let path of paths) {
            if (this[path.field] && !this[path.field].type) // to do - poprawić
                Promises.push(yield this.populate(path.field, path.select));
        }
        yield Promise.all(Promises);
        let doc = this.toObject();
        // Virtuals
        const virtuals = Object.values(this.schema.virtuals);
        for (let list of virtuals) {
            if (list.options.ref && list.options.autopopulate) {
                if (Array.isArray(this[list.path])) {
                    for (let index in doc[list.path]) {
                        doc[list.path][index] = this[list.path][index].autoPopulate();
                    }
                    doc[list.path] = yield Promise.all(doc[list.path]);
                }
            }
        }
        return doc;
    });
}
exports["default"] = autoPopulate;


/***/ }),

/***/ 2573:
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
const changelog_model_1 = __importDefault(__webpack_require__(7617));
const mongoose_1 = __webpack_require__(1185);
function changeLogs(document, list) {
    return __awaiter(this, void 0, void 0, function* () {
        //zmodyfikować by przed zapisaniem pobierało oryginalny obiekt i zapisywalo zmiany
        if (this.isModified()) {
            let selects = this.directModifiedPaths();
            //get original document if exists (only changed fields)
            //console.log(this.type, this.constructor,selects)
            let originalDoc = yield mongoose_1.models[this.type].findById(this.id, selects);
            if (originalDoc) {
                selects.forEach((field) => {
                    let ref = this[field] && this[field].type ? this[field].constructor.modelName : null;
                    this.depopulate();
                    if ((this[field]).toString() !== (originalDoc[field]).toString()) {
                        let changeLog = new changelog_model_1.default({
                            document: document || this.id,
                            field: field,
                            list: list,
                            record: list ? this.id : null,
                            newValue: this[field],
                            oldValue: originalDoc[field],
                            ref: ref
                        });
                        changeLog.save();
                    }
                    else {
                        this.unmarkModified(field);
                    }
                });
            }
        }
    });
}
exports["default"] = changeLogs;


/***/ }),

/***/ 7442:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const i18n_1 = __importDefault(__webpack_require__(6734));
function constantTranslate(local) {
    let doc = this.toObject();
    // Virtuals
    const virtuals = Object.values(this.schema.virtuals);
    for (let list of virtuals) {
        if (list.options.ref && list.options.autopopulate) {
            if (Array.isArray(this[list.path])) {
                for (let index in doc[list.path]) {
                    doc[list.path][index] = this[list.path][index].constantTranslate(local);
                }
            }
        }
    }
    this.schema.eachPath(function process(pathname, schemaType) {
        i18n_1.default.setLocale(local || "en");
        //constats
        if (schemaType.options.constant && doc[pathname]) {
            doc[pathname] = { _id: doc[pathname], name: i18n_1.default.__(doc[pathname]) };
        }
    });
    return doc;
}
exports["default"] = constantTranslate;


/***/ }),

/***/ 7296:
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
const mongoose_1 = __webpack_require__(1185);
function setValue(field, value, list, subrecord) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let document;
            if (list) {
                document = this[list].find((element) => {
                    return element._id.toString() === subrecord;
                });
                if (!document) {
                    let virtual = this.schema.virtuals[list];
                    document = yield new mongoose_1.models[virtual.options.ref]();
                    document.initLocal();
                    this[list].push(document);
                    this.validateVirtuals(false);
                }
            }
            else {
                document = this;
            }
            // document.$locals.oldValue[field] = document[field];
            // document.$locals.triggers.push({ type: "setValue", field: field, oldValue: document.$locals.oldValue[field] });
            // to do - zmienić na metode setLocalTriggers()
            document[field] = value;
            //populate new field value
            yield document.populate(field, "name displayname type _id");
            yield document.validate();
        }
        catch (err) {
            return err;
        }
    });
}
exports["default"] = setValue;


/***/ }),

/***/ 4649:
/***/ (function(__unused_webpack_module, exports) {


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
function totalVirtuals() {
    return __awaiter(this, void 0, void 0, function* () {
        // Sum selected fields
        this.schema.eachPath((pathname, schematype) => {
            if (schematype.options.total && this[schematype.options.total]) {
                this[pathname] = 0;
                this[schematype.options.total].forEach((line) => {
                    if (!line.deleted)
                        this[pathname] += line[pathname] || 0;
                });
            }
        });
    });
}
exports["default"] = totalVirtuals;


/***/ }),

/***/ 4002:
/***/ (function(__unused_webpack_module, exports) {


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
function validateVirtuals(save) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("validateVirtuals");
        let errors = [];
        const virtuals = Object.values(this.schema.virtuals);
        for (let list of virtuals) {
            if (list.options.ref && !list.options.justOne) {
                if (this[list.path] && this[list.path].length) {
                    // sort items before for loop
                    if (list.options.options) {
                        if (list.options.options.sort)
                            this[list.path].sort((a, b) => a.index - b.index);
                    }
                    for (const [index, value] of this[list.path].entries()) {
                        let line = value;
                        // set index - useful to sort
                        line.index = index;
                        // if line is new init new document
                        if (!line.schema)
                            line = new list.options.model(line);
                        // assign foreignField to documents from virtual field
                        line[list.options.foreignField] = this[list.options.localField];
                        // assign temporarily this to parent key
                        line.parent = this;
                        // copy field value from parten document
                        (list.options.copyFields || []).forEach((field) => {
                            line[field] = this[field] ? this[field]._id : this[field];
                        });
                        // Validate or validate and save
                        try {
                            if (save) {
                                // before save validate is automatic
                                if (this.deleted)
                                    line.deleted = true;
                                yield line.changeLogs(this.id, list.path);
                                if (line.deleted)
                                    yield line.remove();
                                else
                                    yield line.save();
                            }
                            else {
                                // Catch errors from validate all virtual list
                                //await line.validate();
                            }
                        }
                        catch (err) {
                            err._id = line._id;
                            err.list = list.path;
                            errors.push(err);
                        }
                        this[list.path][index] = line;
                    }
                }
                else {
                    this[list.path] = [];
                }
            }
            // run summary values from virtuals to main document
            this.totalVirtuals();
        }
        if (errors.length > 0) {
            if (save)
                throw errors;
            else
                return errors;
        }
    });
}
exports["default"] = validateVirtuals;


/***/ }),

/***/ 7650:
/***/ (function(__unused_webpack_module, exports) {


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
function virtualPopulate() {
    return __awaiter(this, void 0, void 0, function* () {
        const virtuals = Object.values(this.schema.virtuals);
        for (let list of virtuals) {
            if (list.options.ref && list.options.autopopulate) {
                yield this.populate({ path: list.path, options: list.options.options });
            }
        }
    });
}
exports["default"] = virtualPopulate;


/***/ }),

/***/ 1290:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const pdfjs_1 = __importDefault(__webpack_require__(6684));
const logo = new pdfjs_1.default.Image(
// await fetch('/logo.pdf').then((res) => res.arrayBuffer())
Buffer.from('JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAGFlk2OZScMheesgnFLTbABA+OsIKMsoKSoI72K1Kr9S/nMvfBetSrK7PpcjP+ObX7GP+LPKKVKbLmmljW+Rxm1JesHeRwkp2wR0c+/ft+64RF//HrZn9/iP5y1+Hf87fcPiW8fSLPnqbnyNSyPWfw2rTZLafHjjSuKhZbn8adxgftzIe7PhXyvadblULG4BXcBcZ9+D399u6KsvaSmLY6SihYPtImmPFuUbMms+U1NMIL6LKl2RVZLJaOkqUiQVjU1ol9ixNXWRhJCuQBp1tMUi2OkMge/b1ncUh9L44KC4o7IcKMmLWmf8QtIRFLl/pdThivV7x5GPDVWSiHTfaOCXW55mfK4hm5E6qjIM7aZrBLcLxl5i7ta4bVaMtTK6NQIZpRS1ldX6d1WtaqNlVftpIKASKwpBV0BLQhiHKg099bj2XoHoXIbe961q2eEOWcLd2bdSKdUFkVy6tpXhsZMXTTOmog1Ss+aJpQdkqZNZIqpdd5yoHwdqo9O+fYJylnGiFNSH8L/W5bcqH/1pB5IJbVWrjtaKUG0L6pgpiTukGKp97Z0vPwr45IGOp6P3rHsDLmYYg0O0H+4BBd7kA2olKQ0BqYPVEfCDQBop7SGdsKA2piGA/zZwPLXLxzwbZ/pmNSoRkgwXTrBDoLVAnf5sXSoEqxTqUmbuL+9GqeAFNsT/3oZNA9aWFzJ3qZvwK+hNEaQzzMZU+how3+Pdclhm3GV+0SG1PTZuUKoqaKKWXiAH8yAVOflLU05aAQZOVUZzrZOk2c/ZTSZUaRBAZdJCt68sQ/AjzkZTE8InWJuu5PdNsPVYMgUWG033CoIZnSU02DWKiOtRnOuYvUm7R4Hb2E32Kdx+H8NZnQI1I9KfF5lH9FO+qZhQ4R8Q/G0E3FfegehwTa2Fd/j1WAh099VCbkuA7lQZT6fICY2KMyrUheNy6RfhGQdiL5ncBcYckPFaupWvD4QbFKzgxQf6RDk7QnVIgmyQWGixZl7M9FTQbaxtW9A0MvXmnLhgfDqLtFuh5VBSItOT92NhUpf4fq1PwziMEteMGURYJ3huc8psyBn4ihESKYoyI2EZxwbigprrDDylVnIZoP12wkfDMvcQSDfdutgvkzrYivJeMb1Drmyz1tfmrtgj9iZI8o8eIJh0OCzel9wdx15xINoY42RvQNU2o7Vp9xDW/VWn2nd5tjIvl9W1o9fB3t85auH0CoMYbX7SDWalv0QDnZy+2An+TjC8AvWMw03iPRgPnwrc6EwjaxZDRvYEW2Z7egUtXjuOPaPpYO8HS/Dwdz32Ugcy++Z1EWghlf6Of3shwsUVAZ68cE+wAdhXT6xeDCeOywvBpq31a37FbYj96G2lmJrz2y8YC+FOF5/hR3OrMfaOXpgAvyPGUVjXqufR8D91ZVK5sCT7Xu7HlxOD3qMmZh4Gj0x9/TGeKfBIuXx8HC1V/FH+HyPj6Z/AQOIHQwKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjExMDMKZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAzIDAgUiAvUmVzb3VyY2VzIDYgMCBSIC9Db250ZW50cyA0IDAgUiAvTWVkaWFCb3ggWzAgMCAxODQ2IDUwNV0KPj4KZW5kb2JqCjYgMCBvYmoKPDwgL1Byb2NTZXQgWyAvUERGIF0gL0NvbG9yU3BhY2UgPDwgL0NzMSA3IDAgUiA+PiA+PgplbmRvYmoKOCAwIG9iago8PCAvTGVuZ3RoIDkgMCBSIC9OIDMgL0FsdGVybmF0ZSAvRGV2aWNlUkdCIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlID4+CnN0cmVhbQp4AZ2Wd1RT2RaHz703vdASIiAl9Bp6CSDSO0gVBFGJSYBQAoaEJnZEBUYUESlWZFTAAUeHImNFFAuDgmLXCfIQUMbBUURF5d2MawnvrTXz3pr9x1nf2ee319ln733XugBQ/IIEwnRYAYA0oVgU7uvBXBITy8T3AhgQAQ5YAcDhZmYER/hEAtT8vT2ZmahIxrP27i6AZLvbLL9QJnPW/3+RIjdDJAYACkXVNjx+JhflApRTs8UZMv8EyvSVKTKGMTIWoQmirCLjxK9s9qfmK7vJmJcm5KEaWc4ZvDSejLtQ3pol4aOMBKFcmCXgZ6N8B2W9VEmaAOX3KNPT+JxMADAUmV/M5yahbIkyRRQZ7onyAgAIlMQ5vHIOi/k5aJ4AeKZn5IoEiUliphHXmGnl6Mhm+vGzU/liMSuUw03hiHhMz/S0DI4wF4Cvb5ZFASVZbZloke2tHO3tWdbmaPm/2d8eflP9Pch6+1XxJuzPnkGMnlnfbOysL70WAPYkWpsds76VVQC0bQZA5eGsT+8gAPIFALTenPMehmxeksTiDCcLi+zsbHMBn2suK+g3+5+Cb8q/hjn3mcvu+1Y7phc/gSNJFTNlReWmp6ZLRMzMDA6Xz2T99xD/48A5ac3Jwyycn8AX8YXoVVHolAmEiWi7hTyBWJAuZAqEf9Xhfxg2JwcZfp1rFGh1XwB9hTlQuEkHyG89AEMjAyRuP3oCfetbEDEKyL68aK2Rr3OPMnr+5/ofC1yKbuFMQSJT5vYMj2RyJaIsGaPfhGzBAhKQB3SgCjSBLjACLGANHIAzcAPeIACEgEgQA5YDLkgCaUAEskE+2AAKQTHYAXaDanAA1IF60AROgjZwBlwEV8ANcAsMgEdACobBSzAB3oFpCILwEBWiQaqQFqQPmULWEBtaCHlDQVA4FAPFQ4mQEJJA+dAmqBgqg6qhQ1A99CN0GroIXYP6oAfQIDQG/QF9hBGYAtNhDdgAtoDZsDscCEfCy+BEeBWcBxfA2+FKuBY+DrfCF+Eb8AAshV/CkwhAyAgD0UZYCBvxREKQWCQBESFrkSKkAqlFmpAOpBu5jUiRceQDBoehYZgYFsYZ44dZjOFiVmHWYkow1ZhjmFZMF+Y2ZhAzgfmCpWLVsaZYJ6w/dgk2EZuNLcRWYI9gW7CXsQPYYew7HA7HwBniHHB+uBhcMm41rgS3D9eMu4Drww3hJvF4vCreFO+CD8Fz8GJ8Ib4Kfxx/Ht+PH8a/J5AJWgRrgg8hliAkbCRUEBoI5wj9hBHCNFGBqE90IoYQecRcYimxjthBvEkcJk6TFEmGJBdSJCmZtIFUSWoiXSY9Jr0hk8k6ZEdyGFlAXk+uJJ8gXyUPkj9QlCgmFE9KHEVC2U45SrlAeUB5Q6VSDahu1FiqmLqdWk+9RH1KfS9HkzOX85fjya2Tq5FrleuXeyVPlNeXd5dfLp8nXyF/Sv6m/LgCUcFAwVOBo7BWoUbhtMI9hUlFmqKVYohimmKJYoPiNcVRJbySgZK3Ek+pQOmw0iWlIRpC06V50ri0TbQ62mXaMB1HN6T705PpxfQf6L30CWUlZVvlKOUc5Rrls8pSBsIwYPgzUhmljJOMu4yP8zTmuc/jz9s2r2le/7wplfkqbip8lSKVZpUBlY+qTFVv1RTVnaptqk/UMGomamFq2Wr71S6rjc+nz3eez51fNP/k/IfqsLqJerj6avXD6j3qkxqaGr4aGRpVGpc0xjUZmm6ayZrlmuc0x7RoWgu1BFrlWue1XjCVme7MVGYls4s5oa2u7act0T6k3as9rWOos1hno06zzhNdki5bN0G3XLdTd0JPSy9YL1+vUe+hPlGfrZ+kv0e/W3/KwNAg2mCLQZvBqKGKob9hnmGj4WMjqpGr0SqjWqM7xjhjtnGK8T7jWyawiZ1JkkmNyU1T2NTeVGC6z7TPDGvmaCY0qzW7x6Kw3FlZrEbWoDnDPMh8o3mb+SsLPYtYi50W3RZfLO0sUy3rLB9ZKVkFWG206rD6w9rEmmtdY33HhmrjY7POpt3mta2pLd92v+19O5pdsN0Wu067z/YO9iL7JvsxBz2HeIe9DvfYdHYou4R91RHr6OG4zvGM4wcneyex00mn351ZzinODc6jCwwX8BfULRhy0XHhuBxykS5kLoxfeHCh1FXbleNa6/rMTdeN53bEbcTd2D3Z/bj7Kw9LD5FHi8eUp5PnGs8LXoiXr1eRV6+3kvdi72rvpz46Pok+jT4Tvna+q30v+GH9Av12+t3z1/Dn+tf7TwQ4BKwJ6AqkBEYEVgc+CzIJEgV1BMPBAcG7gh8v0l8kXNQWAkL8Q3aFPAk1DF0V+nMYLiw0rCbsebhVeH54dwQtYkVEQ8S7SI/I0shHi40WSxZ3RslHxUXVR01Fe0WXRUuXWCxZs+RGjFqMIKY9Fh8bFXskdnKp99LdS4fj7OIK4+4uM1yWs+zacrXlqcvPrpBfwVlxKh4bHx3fEP+JE8Kp5Uyu9F+5d+UE15O7h/uS58Yr543xXfhl/JEEl4SyhNFEl8RdiWNJrkkVSeMCT0G14HWyX/KB5KmUkJSjKTOp0anNaYS0+LTTQiVhirArXTM9J70vwzSjMEO6ymnV7lUTokDRkUwoc1lmu5iO/kz1SIwkmyWDWQuzarLeZ0dln8pRzBHm9OSa5G7LHcnzyft+NWY1d3Vnvnb+hvzBNe5rDq2F1q5c27lOd13BuuH1vuuPbSBtSNnwy0bLjWUb326K3tRRoFGwvmBos+/mxkK5QlHhvS3OWw5sxWwVbO3dZrOtatuXIl7R9WLL4oriTyXckuvfWX1X+d3M9oTtvaX2pft34HYId9zd6brzWJliWV7Z0K7gXa3lzPKi8re7V+y+VmFbcWAPaY9kj7QyqLK9Sq9qR9Wn6qTqgRqPmua96nu37Z3ax9vXv99tf9MBjQPFBz4eFBy8f8j3UGutQW3FYdzhrMPP66Lqur9nf19/RO1I8ZHPR4VHpcfCj3XVO9TXN6g3lDbCjZLGseNxx2/94PVDexOr6VAzo7n4BDghOfHix/gf754MPNl5in2q6Sf9n/a20FqKWqHW3NaJtqQ2aXtMe9/pgNOdHc4dLT+b/3z0jPaZmrPKZ0vPkc4VnJs5n3d+8kLGhfGLiReHOld0Prq05NKdrrCu3suBl69e8blyqdu9+/xVl6tnrjldO32dfb3thv2N1h67npZf7H5p6bXvbb3pcLP9luOtjr4Ffef6Xfsv3va6feWO/50bA4sG+u4uvnv/Xtw96X3e/dEHqQ9eP8x6OP1o/WPs46InCk8qnqo/rf3V+Ndmqb307KDXYM+ziGePhrhDL/+V+a9PwwXPqc8rRrRG6ketR8+M+YzderH0xfDLjJfT44W/Kf6295XRq59+d/u9Z2LJxPBr0euZP0reqL45+tb2bedk6OTTd2nvpqeK3qu+P/aB/aH7Y/THkensT/hPlZ+NP3d8CfzyeCZtZubf94Tz+wplbmRzdHJlYW0KZW5kb2JqCjkgMCBvYmoKMjYxMgplbmRvYmoKNyAwIG9iagpbIC9JQ0NCYXNlZCA4IDAgUiBdCmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvTWVkaWFCb3ggWzAgMCAxODQ2IDUwNV0gL0NvdW50IDEgL0tpZHMgWyAyIDAgUiBdID4+CmVuZG9iagoxMCAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMyAwIFIgPj4KZW5kb2JqCjExIDAgb2JqCihNYWMgT1MgWCAxMC4xMCBRdWFydHogUERGQ29udGV4dCkKZW5kb2JqCjEyIDAgb2JqCihEOjIwMTQwODA4MTgzMjEzWjAwJzAwJykKZW5kb2JqCjEgMCBvYmoKPDwgL1Byb2R1Y2VyIDExIDAgUiAvQ3JlYXRpb25EYXRlIDEyIDAgUiAvTW9kRGF0ZSAxMiAwIFIgPj4KZW5kb2JqCnhyZWYKMCAxMwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDQzODcgMDAwMDAgbiAKMDAwMDAwMTIxOSAwMDAwMCBuIAowMDAwMDA0MTYwIDAwMDAwIG4gCjAwMDAwMDAwMjIgMDAwMDAgbiAKMDAwMDAwMTE5OSAwMDAwMCBuIAowMDAwMDAxMzI0IDAwMDAwIG4gCjAwMDAwMDQxMjUgMDAwMDAgbiAKMDAwMDAwMTM5MiAwMDAwMCBuIAowMDAwMDA0MTA1IDAwMDAwIG4gCjAwMDAwMDQyNDQgMDAwMDAgbiAKMDAwMDAwNDI5NCAwMDAwMCBuIAowMDAwMDA0MzQ1IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgMTMgL1Jvb3QgMTAgMCBSIC9JbmZvIDEgMCBSIC9JRCBbIDxlODU0N2M5ZmI4NDZlMjU4Yjk0MDgyYWQwNWFhYmZiMT4KPGU4NTQ3YzlmYjg0NmUyNThiOTQwODJhZDA1YWFiZmIxPiBdID4+CnN0YXJ0eHJlZgo0NDYyCiUlRU9GCg==', 'base64'));
exports["default"] = logo;


/***/ }),

/***/ 180:
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
const pdfjs_1 = __importDefault(__webpack_require__(6684));
const path_1 = __importDefault(__webpack_require__(1017));
const logo_1 = __importDefault(__webpack_require__(1290));
const fontsPath = path_1.default.resolve(__dirname);
// const fonts:any = {
//   default: OpenSans,
//   bold: OpenSansBold,
//   code128: code128,
//   code39: code39
// }
function render() {
    return __awaiter(this, void 0, void 0, function* () {
        const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum id fugiunt, re eadem quae Peripatetici, verba. Tenesne igitur, inquam, Hieronymus Rhodius quid dicat esse summum bonum, quo putet omnia referri oportere? Quia nec honesto quic quam honestius nec turpi turpius.';
        const doc = new pdfjs_1.default.Document({ font: fonts.Helvetica });
        const header = doc
            .header()
            .table({ widths: [null, null], paddingBottom: 1 * pdfjs_1.default.cm })
            .row();
        // const src = fs.readFileSync(__dirname + '/logo.jpg');
        // const logo = new pdf.Image(src);
        //headerLogo.cell().image(logo, { height: 1.5 * pdf.cm });
        header.cell().image(logo_1.default, { height: 2 * pdfjs_1.default.cm });
        header
            .cell()
            .text({ textAlign: 'right' })
            .add('A Portable Document Format (PDF) generation library targeting both the server- and client-side.')
            .add('https://github.com/rkusa/pdfjs', {
            link: 'https://github.com/rkusa/pdfjs',
            underline: true,
            color: 0x569cd6,
        });
        doc.footer().pageNumber(function (curr, total) {
            return curr + ' / ' + total;
        }, { textAlign: 'center' });
        const cell = doc.cell({ paddingBottom: 0.5 * pdfjs_1.default.cm });
        cell.text('Features:', { fontSize: 16, font: fonts.HelveticaBold });
        cell
            .text({ fontSize: 14, lineHeight: 1.35 })
            .add('-')
            .add('different', { color: 0xf8dc3f })
            .add('font', { font: fonts.TimesRoman })
            .add('styling', { underline: true })
            .add('options', { fontSize: 9 });
        cell.text('- Images (JPEGs, other PDFs)');
        cell.text('- Tables (fixed layout, header row)');
        cell.text('- AFM fonts and');
        cell.text('- OTF font embedding (as CID fonts, i.e., support for fonts with large character sets)', {
            font: fonts.HelveticaBold,
        });
        cell.text('- Add existing PDFs (merge them or add them as page templates)');
        doc
            .cell({ paddingBottom: 0.5 * pdfjs_1.default.cm })
            .text()
            .add('For more information visit the')
            .add('Documentation', {
            link: 'https://github.com/rkusa/pdfjs/tree/master/docs',
            underline: true,
            color: 0x569cd6,
        });
        const table = doc.table({
            widths: [1.5 * pdfjs_1.default.cm, 1.5 * pdfjs_1.default.cm, null, 2 * pdfjs_1.default.cm, 2.5 * pdfjs_1.default.cm],
            borderHorizontalWidths: function (i) {
                return i < 2 ? 1 : 0.1;
            },
            padding: 5,
        });
        const tr = table.header({
            font: fonts.HelveticaBold
        });
        tr.cell('#');
        tr.cell('Unit');
        tr.cell('Subject');
        tr.cell('Price', { textAlign: 'right' });
        tr.cell('Total', { textAlign: 'right' });
        function addRow(qty, name, desc, price) {
            const tr = table.row();
            tr.cell(qty.toString());
            tr.cell('pc.');
            const article = tr.cell().text();
            article
                .add(name, { font: fonts.HelveticaBold })
                .br()
                .add(desc, { fontSize: 11, textAlign: 'justify' });
            tr.cell(price.toFixed(2) + ' €', { textAlign: 'right' });
            tr.cell((price * qty).toFixed(2) + ' €', { textAlign: 'right' });
        }
        addRow(2, 'Article A', lorem, 500);
        addRow(1, 'Article B', lorem, 250);
        addRow(2, 'Article C', lorem, 330);
        addRow(3, 'Article D', lorem, 1220);
        addRow(2, 'Article E', lorem, 120);
        addRow(5, 'Article F', lorem, 50);
        const buf = yield doc.asBuffer();
        return buf;
        //   const blob = new Blob([buf], { type: 'application/pdf' });
        //   const url = URL.createObjectURL(blob);
    });
}
exports["default"] = render;
const Courier_Bold_1 = __importDefault(__webpack_require__(5647));
const Courier_BoldOblique_1 = __importDefault(__webpack_require__(226));
const Courier_Oblique_1 = __importDefault(__webpack_require__(5953));
const Courier_1 = __importDefault(__webpack_require__(9054));
const Helvetica_Bold_1 = __importDefault(__webpack_require__(44));
const Helvetica_BoldOblique_1 = __importDefault(__webpack_require__(1459));
const Helvetica_Oblique_1 = __importDefault(__webpack_require__(4865));
const Helvetica_1 = __importDefault(__webpack_require__(7485));
const Symbol_1 = __importDefault(__webpack_require__(2437));
const Times_Bold_1 = __importDefault(__webpack_require__(3628));
const Times_BoldItalic_1 = __importDefault(__webpack_require__(7169));
const Times_Italic_1 = __importDefault(__webpack_require__(7651));
const Times_Roman_1 = __importDefault(__webpack_require__(7356));
const ZapfDingbats_1 = __importDefault(__webpack_require__(4764));
//import OpenSans from 'pdfjs/font/OpenSans';
const fonts = {
    CourierBold: Courier_Bold_1.default,
    CourierBoldOblique: Courier_BoldOblique_1.default,
    CourierOblique: Courier_Oblique_1.default,
    Courier: Courier_1.default,
    HelveticaBold: Helvetica_Bold_1.default,
    HelveticaBoldOblique: Helvetica_BoldOblique_1.default,
    HelveticaOblique: Helvetica_Oblique_1.default,
    Helvetica: Helvetica_1.default,
    Symbol: Symbol_1.default,
    TimesBold: Times_Bold_1.default,
    TimesBoldItalic: Times_BoldItalic_1.default,
    TimesItalic: Times_Italic_1.default,
    TimesRoman: Times_Roman_1.default,
    ZapfDingbats: ZapfDingbats_1.default,
    //OpenSans,
};
render().catch((err) => {
    throw err;
});


/***/ }),

/***/ 5833:
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
exports.findDocuments = exports.deleteDocument = exports.updateDocument = exports.saveDocument = exports.getDocument = exports.addDocument = exports.loadDocument = void 0;
const cache_1 = __importDefault(__webpack_require__(7429));
const getFields_1 = __importDefault(__webpack_require__(4140));
const getForm_1 = __importDefault(__webpack_require__(4012));
function customStaticsMethods(schema) {
    schema.statics.loadDocument = loadDocument;
    schema.statics.addDocument = addDocument;
    schema.statics.getDocument = getDocument;
    schema.statics.saveDocument = saveDocument;
    schema.statics.updateDocument = updateDocument;
    schema.statics.deleteDocument = deleteDocument;
    schema.statics.findDocuments = findDocuments;
    schema.statics.getFields = getFields_1.default;
    schema.statics.getForm = getForm_1.default;
}
exports["default"] = customStaticsMethods;
//loadDocument
function loadDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = yield this.findById(id);
        if (doc) {
            yield doc.virtualPopulate();
            yield doc.validateVirtuals(false);
            return doc;
        }
        else
            return null;
    });
}
exports.loadDocument = loadDocument;
//API
function addDocument(mode, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = yield this.create(data);
        document.initLocal();
        document.recalcDocument();
        let msg = yield document.validateDocument();
        if (mode === "advanced") {
            // Zapisanie dokumentu do cache
            cache_1.default.set(document._id, document);
            return { document, msg, saved: false };
        }
        else {
            yield document.saveDocument();
            return { document, msg, saved: true };
        }
    });
}
exports.addDocument = addDocument;
function getDocument(id, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        //if (!document) {
        let document = yield this.loadDocument(id);
        //}
        if (document && document._id) {
            if (mode === "advanced")
                cache_1.default.set(id, document);
        }
        return document;
    });
}
exports.getDocument = getDocument;
// zapisuje dokument
// najpierw sprawdza czy jest w cachu
// jeżeli tak, zapisuje aktyywny stan i zwraca identyfikator
// jeżeli nie, zwraca null
function saveDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = cache_1.default.get(id);
        if (document) {
            yield document.saveDocument();
            return { document_id: id, saved: true };
        }
        else {
            return { document_id: null, saved: false };
        }
    });
}
exports.saveDocument = saveDocument;
function updateDocument(id, mode, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = null;
        if (mode === "advanced") {
            document = cache_1.default.get(id);
        }
        else {
            document = yield this.loadDocument(id);
        }
        if (document) {
            let msg = [];
            if (!Array.isArray(updates))
                updates = [updates]; // array
            for (let update of updates) {
                msg = yield document.setValue(update.field, update.value, update.list, update.subrecord);
            }
            if (mode === "advanced") {
                document.recalcDocument();
                return { document, msg, saved: false };
            }
            else {
                yield document.saveDocument();
                return { document, msg, saved: true };
            }
        }
        else
            return { document: null, msg: "error", saved: false };
    });
}
exports.updateDocument = updateDocument;
function deleteDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = yield this.loadDocument(id);
        if (document) {
            document.deleted = true;
            document.recalcDocument();
            cache_1.default.del(id);
            yield document.remove();
            return { saved: true };
        }
        else {
            return { saved: false };
        }
    });
}
exports.deleteDocument = deleteDocument;
function findDocuments(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let docFields = this.getFields();
        let { limit, select, sort, skip } = options;
        let populated = {};
        for (const [key, value] of Object.entries(select)) {
            // to do - poprawić
            let fieldsSelect = { name: 1, resource: 1, type: 1 };
            let fields = key.split('.');
            if (fields.length > 1) {
                if (populated[fields[0]]) {
                    populated[fields[0]].select[fields[1]] = 1;
                    populated[fields[0]].populate.push({
                        path: fields[1],
                        select: 'name resource type'
                    });
                }
                else {
                    fieldsSelect[fields[1]] = 1;
                    populated[fields[0]] = {
                        path: fields[0],
                        select: fieldsSelect,
                        populate: [{
                                path: fields[1],
                                select: 'name resource type'
                            }]
                    };
                }
                delete select[key];
            }
            else {
                let field = docFields.find((field) => field.field == fields[0]);
                if (field && field.ref) {
                    if (!populated[fields[0]]) {
                        populated[fields[0]] = {
                            path: fields[0],
                            select: field.selects || fieldsSelect
                        };
                    }
                }
            }
        }
        let result = yield this.find(query)
            .populate(Object.values(populated))
            .sort(sort).skip(skip).limit(limit).select(select);
        return result;
    });
}
exports.findDocuments = findDocuments;


/***/ }),

/***/ 4140:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const i18n_1 = __importDefault(__webpack_require__(6734));
function getFields(local, parent) {
    let fields = [];
    let modelSchema = this.schema;
    const virtuals = modelSchema.virtuals;
    Object.entries(virtuals).forEach(([key, value]) => {
        if (value && value.options.ref) {
            let field = {
                field: key,
                name: i18n_1.default.__(`${this.modelName.toLowerCase()}.${key}`),
                ref: value.options.ref,
                //instance: schematype.instance,
                fieldType: "Table"
            };
            if (value.options.ref) {
                let refModel = mongoose_1.models[value.options.ref];
                if (!parent)
                    field.fields = refModel.getFields(local, key);
            }
            fields.push(field);
        }
    });
    //modelSchema.eachPath(async (pathname: string, schematype: any) => {
    for (const [pathname, schematype] of Object.entries(modelSchema.paths)) {
        if (schematype.options.input ||
            ["Embedded", "Array"].includes(schematype.instance)) {
            if (["Embedded", "Array"].includes(schematype.instance)) {
                //console.log('sd', pathname,JSON.stringify(schematype));
                let field = {
                    field: parent ? `${parent}.${pathname}` : pathname,
                    name: i18n_1.default.__(`${this.modelName.toLowerCase()}.${pathname}`),
                    fieldType: `${schematype.instance}Field`,
                    fields: []
                };
                if (!parent)
                    for (const [key, value] of Object.entries(schematype.schema.tree)) {
                        let subfield = {
                            field: `${pathname}.${key}`,
                            name: i18n_1.default.__(`${pathname}.${key}`),
                            required: value.required,
                            ref: value.ref,
                            resource: value.resource,
                            constant: value.constant,
                            fieldType: value.input
                        };
                        if (value.input)
                            field.fields.push(subfield);
                    }
                fields.push(field);
            }
            else {
                i18n_1.default.setLocale(local || "en");
                let field = {
                    field: parent ? `${parent}.${pathname}` : pathname,
                    name: i18n_1.default.__(`${this.modelName.toLowerCase()}.${pathname}`),
                    required: schematype.isRequired,
                    ref: schematype.options.ref,
                    resource: schematype.options.resource,
                    constant: schematype.options.constant,
                    fieldType: schematype.options.input,
                    select: schematype.options.select,
                    selects: schematype.options.autopopulate ? schematype.options.autopopulate.select : "",
                };
                if (schematype.options.ref) {
                    let refModel = mongoose_1.models[schematype.options.ref];
                    field.resource = refModel.schema.options.collection;
                    if (!parent)
                        field.fields = refModel.getFields(local, pathname);
                }
                if (field.type != "subrecords")
                    fields.push(field);
            }
        }
    }
    //});
    //if (!parent) console.log(fields);
    return fields;
}
exports["default"] = getFields;


/***/ }),

/***/ 4012:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const i18n_1 = __importDefault(__webpack_require__(6734));
function getForm(local, parent) {
    return {
        sections: [
            {
                name: i18n_1.default.__(`${this.modelName.toLowerCase()}.main`),
                cols: [
                    {
                        name: i18n_1.default.__(`${this.modelName.toLowerCase()}.billing`),
                        rows: [
                            ["entity", "date"],
                            ["billingAddress"],
                            ["paymentMethod", "terms"]
                        ]
                    },
                    {
                        name: i18n_1.default.__(`${this.modelName.toLowerCase()}.shipping`),
                        rows: [
                            ["shippingAddress"],
                            ["shippingMethod", "shippingCost"],
                            ["deliveryTerms"]
                        ]
                    },
                    {
                        name: null,
                        component: "GoogleMap"
                    },
                ]
            },
            {
                name: i18n_1.default.__(`${this.modelName.toLowerCase()}.items`),
                cols: [],
                table: "lines"
            },
            {
                name: i18n_1.default.__(`${this.modelName.toLowerCase()}.others`),
                cols: [
                    {
                        name: i18n_1.default.__(`${this.modelName.toLowerCase()}.accounting`),
                        rows: [
                            ["company"],
                            ["currency"],
                            ["exchangeRate"],
                            ["tax"],
                            ["taxNumber"]
                        ]
                    },
                    {
                        name: i18n_1.default.__(`${this.modelName.toLowerCase()}.classification`),
                        rows: [
                            ["referenceNumber"],
                            ["warehouse"]["salesRep"],
                            ["source"]
                        ]
                    },
                    {
                        name: i18n_1.default.__(`${this.modelName.toLowerCase()}.comments`),
                        rows: [
                            ["memo"]
                        ]
                    },
                ],
            },
        ]
    };
}
exports["default"] = getForm;


/***/ }),

/***/ 6491:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFileSize = exports.roundToPrecision = void 0;
const fs_1 = __importDefault(__webpack_require__(7147));
// Round a Number to n Decimal Places
// examples: roundToPrecision(1.005,2) result=1.01
// examples: roundToPrecision(1.004,2) result=1.00
function roundToPrecision(val, n = 2) {
    let _val = Number(val);
    if (isNaN(_val)) {
        throw new Error("Price: " + val + " is not a number");
    }
    const d = Math.pow(10, n);
    return Math.round((_val + Number.EPSILON) * d) / d;
}
exports.roundToPrecision = roundToPrecision;
function getFileSize(filename) {
    var stats = fs_1.default.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}
exports.getFileSize = getFileSize;


/***/ }),

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ 8432:
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ 7455:
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ 3582:
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ 5142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 9632:
/***/ ((module) => {

module.exports = require("ejs");

/***/ }),

/***/ 6860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 6674:
/***/ ((module) => {

module.exports = require("express-fileupload");

/***/ }),

/***/ 6985:
/***/ ((module) => {

module.exports = require("express-rate-limit");

/***/ }),

/***/ 3222:
/***/ ((module) => {

module.exports = require("express-status-monitor");

/***/ }),

/***/ 2425:
/***/ ((module) => {

module.exports = require("i18n");

/***/ }),

/***/ 9344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 9514:
/***/ ((module) => {

module.exports = require("mime-types");

/***/ }),

/***/ 1185:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 8037:
/***/ ((module) => {

module.exports = require("mongoose-paginate-v2");

/***/ }),

/***/ 4580:
/***/ ((module) => {

module.exports = require("node-cache");

/***/ }),

/***/ 5184:
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ 6684:
/***/ ((module) => {

module.exports = require("pdfjs");

/***/ }),

/***/ 9054:
/***/ ((module) => {

module.exports = require("pdfjs/font/Courier");

/***/ }),

/***/ 5647:
/***/ ((module) => {

module.exports = require("pdfjs/font/Courier-Bold");

/***/ }),

/***/ 226:
/***/ ((module) => {

module.exports = require("pdfjs/font/Courier-BoldOblique");

/***/ }),

/***/ 5953:
/***/ ((module) => {

module.exports = require("pdfjs/font/Courier-Oblique");

/***/ }),

/***/ 7485:
/***/ ((module) => {

module.exports = require("pdfjs/font/Helvetica");

/***/ }),

/***/ 44:
/***/ ((module) => {

module.exports = require("pdfjs/font/Helvetica-Bold");

/***/ }),

/***/ 1459:
/***/ ((module) => {

module.exports = require("pdfjs/font/Helvetica-BoldOblique");

/***/ }),

/***/ 4865:
/***/ ((module) => {

module.exports = require("pdfjs/font/Helvetica-Oblique");

/***/ }),

/***/ 2437:
/***/ ((module) => {

module.exports = require("pdfjs/font/Symbol");

/***/ }),

/***/ 3628:
/***/ ((module) => {

module.exports = require("pdfjs/font/Times-Bold");

/***/ }),

/***/ 7169:
/***/ ((module) => {

module.exports = require("pdfjs/font/Times-BoldItalic");

/***/ }),

/***/ 7651:
/***/ ((module) => {

module.exports = require("pdfjs/font/Times-Italic");

/***/ }),

/***/ 7356:
/***/ ((module) => {

module.exports = require("pdfjs/font/Times-Roman");

/***/ }),

/***/ 4764:
/***/ ((module) => {

module.exports = require("pdfjs/font/ZapfDingbats");

/***/ }),

/***/ 2081:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 1017:
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
/******/ 	var __webpack_exports__ = __webpack_require__(3165);
/******/ 	
/******/ })()
;