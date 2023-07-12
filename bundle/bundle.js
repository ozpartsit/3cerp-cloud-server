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
exports.App3CERP = exports.email = exports.cache = void 0;
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
const storage_1 = __importDefault(__webpack_require__(4091));
const cache_1 = __importDefault(__webpack_require__(9732));
const path_1 = __importDefault(__webpack_require__(1017));
// Custom ENVIRONMENT Veriables
let env = dotenv.config({
    path: path_1.default.resolve(`.env.${"production"}`)
});
exports.cache = new cache_1.default();
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStates = void 0;
const app_1 = __webpack_require__(3165);
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
            let document = app_1.cache.getCache(query.id);
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

/***/ 7003:
/***/ ((__unused_webpack_module, exports) => {


// class TranTypes {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "SalesOrder", name: "Sales Order" },
//       { _id: "Invoice", name: "Invoice" }
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
// export default new TranTypes();
exports["default"] = ["SalesOrder", "Invoice"];


/***/ }),

/***/ 76:
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
const model_1 = __importStar(__webpack_require__(7397));
const controller_1 = __importDefault(__webpack_require__(450));
class IAccountingController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.AccountingTypes });
    }
}
exports["default"] = IAccountingController;


/***/ }),

/***/ 5282:
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
const model_1 = __importStar(__webpack_require__(625));
const controller_1 = __importDefault(__webpack_require__(450));
class IActivityController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.ActivityTypes });
    }
}
exports["default"] = IActivityController;


/***/ }),

/***/ 3096:
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
const model_1 = __importStar(__webpack_require__(2731));
const controller_1 = __importDefault(__webpack_require__(450));
class ClassificationController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.ClassificationTypes });
    }
}
exports["default"] = ClassificationController;


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

/***/ 450:
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
const mongoose_1 = __importDefault(__webpack_require__(1185));
const email_1 = __importDefault(__webpack_require__(3097));
const changelog_model_1 = __importDefault(__webpack_require__(7617));
class controller {
    constructor(models) {
        this.models = {};
        this.models = models;
    }
    setModel(recordtype, db) {
        if (this.models) {
            let Model = (this.models.submodels[recordtype] || this.models.model);
            //Model.getFields();
            // Create or assign models from dedicate BD - to do
            if (db) {
                const connection = mongoose_1.default.connections.find(conn => conn.name === db);
                if (connection) {
                    if (!connection.models[Model.modelName])
                        Model = connection.model(Model.modelName, Model.schema); //- działa
                    else
                        Model = connection.models[Model.modelName];
                }
            }
            return Model;
        }
        else
            throw 'błąd';
    }
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // init Model and create new Document
            const model = this.setModel(req.params.recordtype);
            try {
                //req.body.ownerAccount = req.headers.owneraccount; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
                let { document, msg } = yield model.addDocument(req.body);
                //populate response document
                yield document.autoPopulate();
                document = document.constantTranslate(req.locale);
                res.json({ document, msg });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.setModel(req.params.recordtype);
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
                    model.getFields(req.locale).forEach(field => {
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
                let result = yield model.findDocuments(query, options);
                let total = yield model.count(query);
                // get fields
                let fields = model.getFields(req.locale).filter((field) => options.select[field.field]).map(field => {
                    return { field: field.field, name: req.__(`${req.params.recordtype}.${field.field}`), type: field.type, resource: field.resource };
                });
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
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id, mode } = req.params;
            const model = this.setModel(recordtype);
            try {
                let document = yield model.getDocument(id, mode);
                if (!document)
                    res.status(404).json({
                        message: req.__('doc_not_found')
                    });
                else {
                    //populate response document
                    yield document.autoPopulate();
                    document = document.constantTranslate(req.locale);
                    res.json(document);
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
            const model = this.setModel(recordtype);
            try {
                let document = yield model.saveDocument(id);
                res.json(document);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            const model = this.setModel(recordtype);
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
                let { document, msg } = yield model.updateDocument(id, update);
                //populate response document
                yield document.autoPopulate();
                document = document.constantTranslate(req.locale);
                res.json({ document, msg });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    delete(req, res, next) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try { // to do - do poprawy
            let document = model.deleteDocument(id);
            res.json(document);
        }
        catch (error) {
            return next(error);
        }
    }
    send(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            const model = this.setModel(recordtype);
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
            const model = this.setModel(recordtype);
            try {
                let fields = yield model.getFields(req.locale);
                res.json(fields);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    logs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            const model = this.setModel(recordtype);
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
const controller_1 = __importDefault(__webpack_require__(450));
const child_process_1 = __webpack_require__(2081);
class EmailController extends controller_1.default {
    constructor() {
        super({ model: email_model_1.default, submodels: {} });
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
exports["default"] = EmailController;


/***/ }),

/***/ 5067:
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
const model_1 = __importStar(__webpack_require__(8702));
const controller_1 = __importDefault(__webpack_require__(450));
class EntityController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.EntityTypes });
    }
}
exports["default"] = EntityController;


/***/ }),

/***/ 4758:
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
const model_1 = __importStar(__webpack_require__(248));
const schema_1 = __importDefault(__webpack_require__(7662));
const controller_1 = __importDefault(__webpack_require__(450));
const path_1 = __importDefault(__webpack_require__(1017));
class FileController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.StorageTypes });
        this.storagePath = path_1.default.resolve("storage");
    }
    upload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo
            try {
                if (!req.files) {
                    res.send({
                        status: false,
                        message: 'No file uploaded'
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

/***/ 1199:
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
const model_1 = __importStar(__webpack_require__(7849));
const controller_1 = __importDefault(__webpack_require__(450));
class ItemController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.ItemTypes });
    }
}
exports["default"] = ItemController;


/***/ }),

/***/ 3002:
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
const model_1 = __importDefault(__webpack_require__(8947));
const controller_1 = __importDefault(__webpack_require__(450));
class ReportController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: {} });
    }
    results(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            const model = this.setModel(recordtype);
            let document = yield model.loadDocument(id);
            if (!document)
                res.status(404).json({
                    message: 'Report not found'
                });
            else {
                let results = yield document.getResults();
                res.json(results);
            }
        });
    }
}
exports["default"] = ReportController;


/***/ }),

/***/ 4604:
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
const table_model_1 = __importDefault(__webpack_require__(8556));
const dashboard_model_1 = __importDefault(__webpack_require__(984));
class SettingController {
    constructor() {
        this.models = {
            table: table_model_1.default,
            dashboard: dashboard_model_1.default
        };
    }
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.models[req.params.recordtype];
            try {
                let document = new model(req.body);
                document.initLocal();
                document.save();
                res.json(document);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.models[req.params.recordtype];
            try {
                //let document = new model(req.body);
                // to do - update
                let document = yield model.findOne({ _id: req.params.id });
                if (document) {
                    document = yield document.updateOne(req.body);
                }
                res.json(document);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.models[req.params.recordtype];
            try {
                // to to - zwraca tablice a powinno jeden element
                let query = req.query;
                let table = query.table;
                let defaultSetting = defaultSettings[table];
                let document = yield model.find(query);
                if (document.length)
                    res.json(document);
                else
                    res.json([defaultSetting]);
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports["default"] = SettingController;
// to do - przenieść do odzielnego pliku
const defaultSettings = {
    "salesorder.pendingapproval": { headers: ["name", "date", "entity", "amount"] },
    "salesorder.open": { headers: ["name", "date", "entity", "amount"] }
};


/***/ }),

/***/ 2069:
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
const model_1 = __importStar(__webpack_require__(235));
const controller_1 = __importDefault(__webpack_require__(450));
class TransactionController extends controller_1.default {
    constructor() {
        super({ model: model_1.default, submodels: model_1.TransactionTypes });
    }
    pdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { recordtype, id } = req.params;
            const model = this.setModel(recordtype);
            let document = yield model.getDocument(id, 'view');
            let pdf = yield document.pdf();
            res.contentType('application/pdf;charset=UTF-8');
            res.send(pdf);
        });
    }
}
exports["default"] = TransactionController;


/***/ }),

/***/ 6606:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const warehouse_model_1 = __importDefault(__webpack_require__(2419));
const controller_1 = __importDefault(__webpack_require__(450));
class WarehouseController extends controller_1.default {
    constructor() {
        super({ model: warehouse_model_1.default, submodels: {} });
    }
}
exports["default"] = WarehouseController;


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
const controller_1 = __importDefault(__webpack_require__(450));
const child_process_1 = __webpack_require__(2081);
const path_1 = __importDefault(__webpack_require__(1017));
const fs_1 = __importDefault(__webpack_require__(7147));
class WebsiteController extends controller_1.default {
    constructor() {
        super({ model: shop_model_1.default, submodels: {} });
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
            console.log('mapShops');
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
const model_1 = __importDefault(__webpack_require__(8702));
class Auth {
    constructor() {
        this.tokenSecret = process.env.TOKEN_SECRET || "";
    }
    authenticate(req, res, next) {
        const tokenParts = (req.headers.authorization || "").split(" ");
        const token = tokenParts[1];
        if (token) {
            try {
                jsonwebtoken_1.default.verify(token, this.tokenSecret, (err, value) => {
                    if (err)
                        res.status(500).json({ message: req.__('auth.failed_auth_token') });
                    else
                        next();
                });
            }
            catch (err) {
                res.status(400).json({ message: req.__('auth.invalid_token') });
            }
        }
        else {
            res.status(401).json({ message: req.__("auth.no_token") });
        }
    }
    accessGranted(req, res, next) {
        res.status(200).json({ message: req.__("auth.access_granted") });
    }
    login(req, res, next) {
        model_1.default.findOne({ email: req.body.email }).then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user) {
                const valide = yield user.validatePassword(req.body.password);
                if (valide) {
                    const tokens = createTokenPair(user._id, this.tokenSecret);
                    res.status(200).json(tokens);
                }
                else {
                    res.status(403).json({ message: req.__("auth.wrong_password") });
                }
            }
            else
                res.status(404).json({ message: req.__("auth.user_not_exist") });
        }));
    }
    refreshToken(req, res, next) {
        if (req.body.refreshToken) {
            try {
                jsonwebtoken_1.default.verify(req.body.refreshToken, this.tokenSecret, (err, value) => {
                    if (err)
                        res.status(500).json({ message: req.__('auth.failed_auth_token') });
                    else {
                        const tokens = createTokenPair(value.user, this.tokenSecret);
                        res.status(200).json(tokens);
                    }
                });
            }
            catch (err) {
                res.status(400).json({ message: req.__('auth.invalid_token') });
            }
        }
        else {
            res.status(401).json({ message: req.__("auth.no_token") });
        }
    }
    getUser(req, res, next) {
        const tokenParts = (req.headers.authorization || "").split(" ");
        const token = tokenParts[1];
        if (token) {
            try {
                jsonwebtoken_1.default.verify(token, this.tokenSecret, (err, value) => {
                    if (err)
                        res.status(500).json({ message: req.__('auth.failed_auth_token') });
                    else {
                        if (value && value.user) {
                            model_1.default.findOne({ _id: value.user }).then((user) => __awaiter(this, void 0, void 0, function* () {
                                if (user) {
                                    let userLoged = {
                                        name: user.name,
                                        locale: user.locale,
                                        role: "TODO",
                                    };
                                    res.status(200).json({ user: userLoged });
                                }
                            }));
                        }
                    }
                });
            }
            catch (err) {
                res.status(400).json({ message: req.__('auth.invalid_token') });
            }
        }
        else {
            res.status(401).json({ message: req.__("auth.no_token") });
        }
    }
}
exports["default"] = Auth;
function createTokenPair(user, tokenSecret) {
    const token = jsonwebtoken_1.default.sign({ user: user }, tokenSecret, {
        expiresIn: "1h"
    });
    const refreshToken = jsonwebtoken_1.default.sign({ user: user }, tokenSecret, {
        expiresIn: "2h"
    });
    const expires = Math.floor(addHours(new Date(), 1).getTime() / 1000);
    return { token, expires, refreshToken };
}
function addHours(date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
}


/***/ }),

/***/ 9732:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class DataCache {
    constructor() {
        this.cache = {};
        console.log("init cache");
        this.cache = {};
        this.resetCache = this.resetCache.bind(this);
    }
    addCache(Document) {
        if (Document && !this.getCache(Document._id)) {
            this.cache[Document._id] = Document;
        }
        else {
            //throw new Error("the document is now open!");
        }
    }
    getCache(DocumentID) {
        if (DocumentID)
            return this.cache[DocumentID];
        else
            return this.cache;
    }
    delCache(DocumentID) {
        if (DocumentID)
            delete this.cache[DocumentID];
    }
    getLength() {
        return Object.keys(this.cache).length;
    }
    resetCache() {
        this.cache = {};
    }
}
exports["default"] = DataCache;


/***/ }),

/***/ 9868:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.log('ErrorHandler', error);
    let errors = [];
    let status = 500;
    let message = "Error";
    if (!Array.isArray(error)) {
        status = error.status || 500;
        message = error.message;
        errors = [error];
    }
    else
        errors = error;
    errors.forEach((error) => {
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
    });
    return res.status(400).send(errors);
    // res.status(status).send({
    //   message: message
    // });
};
exports.errorHandler = errorHandler;


/***/ }),

/***/ 4091:
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
                let doc = {
                    name: file,
                    type: 'File',
                    path: path_1.default.join(folder, encodeURI(file)),
                    urlcomponent: path_1.default.join(folder, encodeURI(file)),
                };
                if (fs_1.default.lstatSync(path_1.default.join(dirPath, file)).isDirectory()) {
                    doc.type = "Folder";
                    this.mapFiles(path_1.default.join(dirPath, file), doc);
                }
                schema_1.default.updateOrInsert(doc);
            });
        });
    }
}
exports["default"] = StorageStructure;


/***/ }),

/***/ 7397:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountingTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(4465));
const schema_2 = __importDefault(__webpack_require__(5401));
const schema_3 = __importDefault(__webpack_require__(7510));
exports["default"] = schema_1.default;
// interface Types {
//     terms: ITermsModel;
//     paymentmethod: IPaymentMethodModel;
// }
exports.AccountingTypes = {
    terms: schema_1.default.discriminator("Terms", schema_2.default),
    paymentmethod: schema_1.default.discriminator("PaymentMethod", schema_3.default),
};


/***/ }),

/***/ 7510:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "accounting" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


/***/ }),

/***/ 4465:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const options = {
    discriminatorKey: "type",
    collection: "accounting",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    name: { type: String, required: true, input: "text" },
    description: { type: String, input: "text", default: "" },
    type: {
        type: String,
        required: true,
    },
}, options);
const Accounting = (0, mongoose_1.model)("Accounting", schema);
exports["default"] = Accounting;


/***/ }),

/***/ 5401:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "accounting" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


/***/ }),

/***/ 5287:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = {
    discriminatorKey: "activity",
    collection: "activities.tasks_events",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    activity: { type: mongoose_1.Schema.Types.ObjectId },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'Event',
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    date: { type: Date, input: "date", required: true },
    endDate: { type: Date, input: "date" },
    color: {
        type: String,
        default: "#e1e1e1"
    },
}, options);
const Event = (0, mongoose_1.model)("Event", schema);
exports["default"] = Event;


/***/ }),

/***/ 6809:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(1190));
const event_schema_1 = __importDefault(__webpack_require__(5287));
const options = { discriminatorKey: "type", collection: "activities" };
const schema = new mongoose_1.Schema({}, options);
schema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: event_schema_1.default
});
const Calendar = schema_1.default.discriminator("Calendar", schema);
exports["default"] = Calendar;


/***/ }),

/***/ 625:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivityTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(1190));
const schema_2 = __importDefault(__webpack_require__(6809));
const event_schema_1 = __importDefault(__webpack_require__(5287));
const schema_3 = __importDefault(__webpack_require__(3674));
const task_schema_1 = __importDefault(__webpack_require__(5837));
exports["default"] = schema_1.default;
exports.ActivityTypes = {
    calendar: schema_2.default,
    project: schema_3.default,
    event: event_schema_1.default,
    task: task_schema_1.default,
};


/***/ }),

/***/ 3674:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(1190));
const task_schema_1 = __importDefault(__webpack_require__(5837));
const task_group_schema_1 = __importDefault(__webpack_require__(6116));
const task_tag_schema_1 = __importDefault(__webpack_require__(7672));
const options = { discriminatorKey: "type", collection: "activities" };
const schema = new mongoose_1.Schema({}, options);
schema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: task_schema_1.default,
    options: { sort: { index: 1 } },
});
schema.virtual("groups", {
    ref: "TaskGroup",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: { select: "name displayname color" },
    model: task_group_schema_1.default,
    options: { sort: { index: 1 } },
});
schema.virtual("tags", {
    ref: "TaskTag",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: { select: "name displayname color" },
    model: task_tag_schema_1.default
});
const Project = schema_1.default.discriminator("Project", schema);
exports["default"] = Project;


/***/ }),

/***/ 6116:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const task_status_schema_1 = __importDefault(__webpack_require__(8961));
const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({}, options);
const TaskGroup = task_status_schema_1.default.discriminator("TaskGroup", schema);
exports["default"] = TaskGroup;


/***/ }),

/***/ 5837:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = {
    discriminatorKey: "activity",
    collection: "activities.tasks_events",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    index: {
        type: Number
    },
    activity: { type: mongoose_1.Schema.Types.ObjectId },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'Task',
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    date: { type: Date },
    endDate: { type: Date },
    group: { type: mongoose_1.Schema.Types.ObjectId },
    tags: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "TaskTag",
        autopopulate: { select: "name displayname color" },
    }
}, options);
const Task = (0, mongoose_1.model)("Task", schema);
exports["default"] = Task;


/***/ }),

/***/ 8961:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    index: {
        type: Number
    },
    activity: { type: mongoose_1.Schema.Types.ObjectId },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    type: {
        type: String
    },
    color: {
        type: String,
        default: "#e1e1e1"
    },
}, options);
const TaskStatus = (0, mongoose_1.model)("TaskStatus", schema);
exports["default"] = TaskStatus;


/***/ }),

/***/ 7672:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const task_status_schema_1 = __importDefault(__webpack_require__(8961));
const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({}, options);
const TaskTag = task_status_schema_1.default.discriminator("TaskTag", schema);
exports["default"] = TaskTag;


/***/ }),

/***/ 1190:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const options = {
    discriminatorKey: "type",
    collection: "activities",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema({
    name: { type: String, required: true, input: "text" },
    description: { type: String, input: "text", default: "" },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "open"
    },
}, options);
const Activity = (0, mongoose_1.model)("Activity", schema);
exports["default"] = Activity;


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

/***/ 1108:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(6617));
const options = { discriminatorKey: "type", collection: "classifications" };
exports.schema = new mongoose_1.Schema({}, options);
exports.schema.index({ name: 1 });
const Category = schema_1.default.discriminator("Category", exports.schema);
exports["default"] = Category;


/***/ }),

/***/ 9560:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(6617));
const options = { discriminatorKey: "type", collection: "classifications" };
exports.schema = new mongoose_1.Schema({}, options);
exports.schema.index({ name: 1 });
const Group = schema_1.default.discriminator("Group", exports.schema);
exports["default"] = Group;


/***/ }),

/***/ 2731:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClassificationTypes = void 0;
const schema_1 = __importDefault(__webpack_require__(6617));
const schema_2 = __importDefault(__webpack_require__(3124));
const schema_3 = __importDefault(__webpack_require__(7446));
const schema_4 = __importDefault(__webpack_require__(9560));
const schema_5 = __importDefault(__webpack_require__(1108));
exports["default"] = schema_1.default;
exports.ClassificationTypes = {
    pricelevel: schema_2.default,
    pricegroup: schema_3.default,
    group: schema_4.default,
    category: schema_5.default
};


/***/ }),

/***/ 7446:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(6617));
const options = { discriminatorKey: "type", collection: "classifications" };
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        input: "text"
    }
}, options);
exports.schema.index({ name: 1 });
const PriceGroup = schema_1.default.discriminator("PriceGroup", exports.schema);
exports["default"] = PriceGroup;


/***/ }),

/***/ 3124:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(6617));
const options = { discriminatorKey: "type", collection: "classifications" };
exports.schema = new mongoose_1.Schema({
    base: {
        type: String,
        required: true,
        default: "baseprice"
    },
    percentageChange: {
        type: Number,
        required: true,
        default: 1
    }
}, options);
exports.schema.index({ name: 1 });
const PriceLevel = schema_1.default.discriminator("PriceLevel", exports.schema);
exports["default"] = PriceLevel;


/***/ }),

/***/ 6617:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const ClassificationSchema = {
    name: { type: String, input: "text" },
    description: { type: String, input: "text" },
    type: {
        type: String,
        required: true,
    },
};
const options = {
    discriminatorKey: "type",
    collection: "classifications",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose_1.Schema(ClassificationSchema, options);
const Classification = (0, mongoose_1.model)("Classification", schema);
exports["default"] = Classification;


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

/***/ 9711:
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
const axios_1 = __importDefault(__webpack_require__(2167));
const options = {
    discriminatorKey: "entity",
    collection: "entities.addresses"
};
const schema = new mongoose_1.Schema({
    entity: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: String, input: "text" },
    addressee: { type: String, input: "text" },
    address: { type: String, required: true, input: "text" },
    address2: { type: String, input: "text" },
    city: { type: String, required: true, input: "text" },
    zip: { type: String, required: true, input: "text" },
    country: {
        type: String,
        required: true,
        resource: "constatnts",
        constant: "countries"
    },
    phone: { type: String, input: "text" },
    geoCodeHint: {
        type: String,
        get: (v) => v ? `${v.address}, ${v.address2}, ${v.zip} ${v.city} ${v.country}` : '',
        input: "text"
    },
    latitude: { type: String, input: "text" },
    longitude: { type: String, input: "text" }
}, options);
schema.method("geoCode", function (geoCodeHint) {
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
schema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("geoCodeHint"))
            return next();
        else {
            const coordinate = yield this.geoCode(this.geoCodeHint);
            this.latitude = coordinate.latitude;
            this.longitude = coordinate.longitude;
        }
        next();
    });
});
exports["default"] = schema;


/***/ }),

/***/ 3155:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const currencies_1 = __importDefault(__webpack_require__(7131));
const options = {
    discriminatorKey: "entity",
    collection: "entities.balances"
};
const schema = new mongoose_1.Schema({
    entity: { type: mongoose_1.Schema.Types.ObjectId },
    company: { type: mongoose_1.Schema.Types.ObjectId },
    currency: {
        type: String,
        //get: (v: any) => Currencies.getName(v),
        enum: currencies_1.default,
        required: true,
        input: "select"
    },
    balance: { type: Number, required: true, default: 0, input: "currency" }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 7044:
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
const tranNumbers_schema_1 = __importDefault(__webpack_require__(9050));
const tranNumModel = (0, mongoose_1.model)("TranNumbers", tranNumbers_schema_1.default);
const options = { discriminatorKey: "type", collection: "entities" };
const schema = new mongoose_1.Schema({}, options);
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
schema.virtual("transactionNumbers", {
    ref: "TranNumbers",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: tranNumModel
});
exports["default"] = schema;


/***/ }),

/***/ 9050:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const transaction_types_1 = __importDefault(__webpack_require__(7003));
const options = {
    discriminatorKey: "entity",
    collection: "entities.tranNumbers"
};
const schema = new mongoose_1.Schema({
    company: { type: mongoose_1.Schema.Types.ObjectId },
    type: {
        type: String,
        required: true,
        //get: (v: any) => TranTypes.getName(v),
        enum: transaction_types_1.default
    },
    prefix: { type: String, input: "text" },
    sufix: { type: String, input: "text" },
    initNumber: { type: Number, required: true, default: 1, input: "integer" },
    currentNumber: {
        type: Number,
        required: true,
        default: 1,
        input: "integer"
    }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 2868:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = {
    discriminatorKey: "entity",
    collection: "entities.contacts",
    type: "contact"
};
const schema = new mongoose_1.Schema({
    entity: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: String, input: "text" },
    firstName: { type: String, input: "text" },
    lastName: { type: String, input: "text" },
    email: { type: String, input: "text" },
    phone: { type: String, input: "text" },
    jobTitle: { type: String, input: "text" }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 9692:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
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
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        autopopulate: true,
    },
    //accounting
    terms: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Terms",
        autopopulate: true,
    },
    paymentMethod: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PaymentMethod",
        autopopulate: true,
    },
}, options);
// schema.virtual("salesOrders", {
//   ref: "Calendar",
//   localField: "name",
//   foreignField: "name",
//   justOne: false,
//   autopopulate: true,
//   model: SalesOrder
// });
exports["default"] = schema;


/***/ }),

/***/ 4822:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(7044));
//import Storage, { IStorage } from "../../storages/schema";
const role_model_1 = __webpack_require__(6016);
const options = { discriminatorKey: "type", collection: "entities" };
const schema = new mongoose_1.Schema({
    jobTitle: { type: String, input: "text" },
    //avatar: { type: Storage, input: "file" },
    company: { type: schema_1.default, input: "select" },
    role: { type: role_model_1.schema, input: "select" }
}, options);
exports["default"] = schema;


/***/ }),

/***/ 4880:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __webpack_require__(3124);
const options = {
    discriminatorKey: "entity",
    collection: "entities.grouplevels"
};
const schema = new mongoose_1.Schema({
    entity: { type: mongoose_1.Schema.Types.ObjectId },
    priceGroup: { type: String, required: true },
    priceLevel: { type: schema_1.schema, ref: "PriceLevel", required: true },
    moq: { type: Number, required: true, default: 1 },
}, options);
exports["default"] = schema;


/***/ }),

/***/ 8702:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityTypes = void 0;
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(9793));
const schema_2 = __importDefault(__webpack_require__(7044));
const schema_3 = __importDefault(__webpack_require__(9692));
const schema_4 = __importDefault(__webpack_require__(4449));
const schema_5 = __importDefault(__webpack_require__(4822));
const Entity = (0, mongoose_1.model)("Entity", schema_1.default);
exports["default"] = Entity;
exports.EntityTypes = {
    customer: Entity.discriminator("Customer", schema_3.default),
    comapany: Entity.discriminator("Company", schema_2.default),
    vendor: Entity.discriminator("Vendor", schema_4.default),
    employee: Entity.discriminator("Employee", schema_5.default)
};


/***/ }),

/***/ 9793:
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
const contact_schema_1 = __importDefault(__webpack_require__(2868));
const address_schema_1 = __importDefault(__webpack_require__(9711));
const balance_schema_1 = __importDefault(__webpack_require__(3155));
const grouplevel_schema_1 = __importDefault(__webpack_require__(4880));
//import Countries from "../../constants/countries";
const contactModel = (0, mongoose_1.model)("Contact", contact_schema_1.default);
const balanceModel = (0, mongoose_1.model)("Balance", balance_schema_1.default);
const addressModel = (0, mongoose_1.model)("Address", address_schema_1.default);
const groupLevelModel = (0, mongoose_1.model)("GroupLevel", grouplevel_schema_1.default);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const SALT_WORK_FACTOR = 10;
const options = {
    discriminatorKey: "type", collection: "entities", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
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
        enum: ["company", "customer", "vendor", "employee"],
        default: "customer",
        input: "select"
    },
    password: { type: String, input: "password" },
    locale: { type: String, default: "en" },
    salesRep: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        autopopulate: true,
        input: "select"
    },
    warehouse: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Warehouse",
        autopopulate: true,
        input: "select"
    },
    currency: {
        type: String,
        required: true,
        //get: (v: any) => Currencies.getName(v),
        //enum: Currencies,
        default: "PLN",
        input: "select",
        resource: 'constants',
        constant: 'currencies'
    },
    billingName: {
        type: String,
        input: "text"
    },
    billingAddressee: {
        type: String,
        input: "text"
    },
    billingAddress: {
        type: String,
        input: "text"
    },
    billingAddress2: {
        type: String,
        input: "text"
    },
    billingZip: {
        type: String,
        input: "text"
    },
    billingCity: {
        type: String,
        input: "text"
    },
    billingState: {
        type: String,
        input: "select"
    },
    billingCountry: {
        type: String,
        input: "select",
        resource: 'constants',
        constant: 'countries'
    },
    billingPhone: {
        type: String,
        input: "text"
    },
    billingEmail: {
        type: String,
        input: "text"
    },
    shippingName: {
        type: String,
        input: "text"
    },
    shippingAddressee: {
        type: String,
        input: "text"
    },
    shippingAddress: {
        type: String,
        input: "text"
    },
    shippingAddress2: {
        type: String,
        input: "text"
    },
    shippingZip: {
        type: String,
        input: "text"
    },
    shippingCity: {
        type: String,
        input: "text"
    },
    shippingState: {
        type: String,
        input: "select"
    },
    shippingCountry: {
        type: String,
        input: "select",
        resource: 'constants',
        constant: 'countries'
    },
    shippingPhone: {
        type: String,
        input: "text"
    },
    shippingEmail: {
        type: String,
        input: "text"
    },
    taxNumber: { type: String, input: "text" },
    tax: {
        type: Number,
        default: 0,
        input: "select"
    }
}, options);
schema.virtual("addresses", {
    ref: "Address",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: addressModel
});
schema.virtual("contacts", {
    ref: "Contact",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: contactModel
});
schema.virtual("balances", {
    ref: "Balance",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: balanceModel
});
schema.virtual("groupLevels", {
    ref: "GroupLevel",
    localField: "_id",
    foreignField: "entity",
    justOne: false,
    autopopulate: true,
    model: groupLevelModel
});
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
schema.index({ name: 1 });
exports["default"] = schema;


/***/ }),

/***/ 4449:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "entities" };
const schema = new mongoose_1.Schema({}, options);
exports["default"] = schema;


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
    name: { type: String, required: true, input: "text" },
    description: { type: String, input: "text", default: "" },
    type: {
        type: String,
        required: true,
        enum: item_types_1.default,
        input: "select"
    },
    priceGroup: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classification",
        autopopulate: true,
        required: false,
        input: "select"
    },
    images: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Storage",
        autopopulate: true,
        input: "file"
    },
    coo: {
        type: String,
        input: "select"
    },
    barcode: {
        type: String,
        input: "text"
    },
    weight: {
        type: Number,
        input: "number"
    },
    status: {
        type: String,
        input: "text"
    },
    manufacturer: {
        type: String,
        input: "text"
    },
    firstSalesDate: { type: Date, input: "date" },
    lastSalesDate: { type: Date, input: "date" },
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

/***/ 984:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
exports.schema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        default: "dashboard"
    },
    dashboard: {
        type: String,
        required: true,
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity"
    },
    widgets: {
        type: []
    }
}, {
    collection: "settings",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.schema.index({ name: 1 });
const Dashboard = (0, mongoose_1.model)("Dashboard", exports.schema);
exports["default"] = Dashboard;


/***/ }),

/***/ 8556:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
exports.schema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        default: "table"
    },
    table: {
        type: String,
        required: true,
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity"
    },
    headers: {
        type: [String]
    }
}, {
    collection: "settings",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.schema.index({ name: 1 });
const Setting = (0, mongoose_1.model)("Setting", exports.schema);
exports["default"] = Setting;


/***/ }),

/***/ 8947:
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
const i18n_1 = __importDefault(__webpack_require__(6734));
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        input: "text"
    },
    description: {
        type: String,
        input: "text"
    },
    type: {
        type: String,
        required: true,
        default: "report"
    },
    columns: {
        type: []
    },
    filters: {
        type: []
    }
}, {
    collection: "reports",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
//
// schema.virtual('fields').get(function (this: any) {
//     let model: any = models["Transaction"];
//     return model.getFields()
// });
exports.schema.method("getResults", function () {
    return __awaiter(this, void 0, void 0, function* () {
        let results = [];
        let sort = { _id: 1 };
        let select = { type: true };
        let query = {};
        let populated = {};
        for (let column of this.columns) {
            // to do - poprawić
            let fieldsSelect = { name: 1, resource: 1, type: 1 };
            let fields = column.field.split('.');
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
            }
            else {
                if (column.ref) {
                    if (!populated[fields[0]]) {
                        populated[fields[0]] = {
                            path: fields[0],
                            select: fieldsSelect
                        };
                    }
                }
                select[column.field] = true;
            }
        }
        //console.log(populated, select)
        //await this.find(query)
        //.populate(populated)
        //.sort(sort).skip(skip).limit(limit).select(select);
        //console.log(populated)
        let data = yield (0, mongoose_1.model)("Transaction").find(query)
            .populate(Object.values(populated))
            .sort(sort)
            .select(select);
        results = data.map((line) => {
            let row = { _id: line._id, type: line.type, resource: line.resource };
            this.columns.forEach((c) => {
                let fields = c.field.split('.');
                let value = undefined;
                fields.forEach((field, index) => {
                    if (index) {
                        value = value[field];
                    }
                    else
                        value = line[field];
                });
                if (c.constant) { // parse constat value to object
                    value = { _id: value, name: i18n_1.default.__(value) };
                }
                row[c.field] = value;
            });
            return row;
        });
        data = [];
        return results;
    });
});
exports.schema.index({ name: 1 });
const Report = (0, mongoose_1.model)("Report", exports.schema);
exports["default"] = Report;


/***/ }),

/***/ 6016:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const PermissionsSchema = {
    path: { type: String, required: true, input: "select" },
    level: {
        type: String,
        required: true,
        enum: ["edit", "view", "full"],
        default: "full",
        input: "select"
    }
};
const Permissions = new mongoose_1.Schema(PermissionsSchema);
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: [2, "Must be at least 2 characters long, got {VALUE}"]
    },
    type: {
        type: String,
        required: true,
        enum: ["role"],
        default: "role"
    },
    permissions: {
        type: [Permissions],
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
}, { collection: "roles" });
exports.schema.index({ name: 1 });
const Role = (0, mongoose_1.model)("Role", exports.schema);
Role.init().then(function (Event) {
    console.log('Role Builded');
});
exports["default"] = Role;


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
            doc.name = name;
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

/***/ 1674:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(5740));
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({}, options);
const InventoryAdjustment = schema_1.default.discriminator("InventoryAdjustment", schema);
exports["default"] = InventoryAdjustment;


/***/ }),

/***/ 145:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({}, options);
const Invoice = (0, mongoose_1.model)("Invoice", schema);
exports["default"] = Invoice;


/***/ }),

/***/ 7799:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(5740));
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({}, options);
const ItemFulfillment = schema_1.default.discriminator("ItemFulfillment", schema);
exports["default"] = ItemFulfillment;


/***/ }),

/***/ 7506:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(5740));
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({}, options);
const ItemReceipt = schema_1.default.discriminator("ItemReceipt", schema);
exports["default"] = ItemReceipt;


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
    warehouse: { type: mongoose_1.Schema.Types.ObjectId, copy: "transaction" },
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
        input: "autocomplete"
    },
    description: {
        type: String,
        set: (v) => v.toLowerCase(),
        input: "text"
    },
    price: {
        type: Number,
        default: 0,
        input: "currency",
        set: (v) => (0, usefull_1.roundToPrecision)(v, 2)
    },
    quantity: {
        type: Number,
        default: 1,
        input: "integer"
    },
    multiplyquantity: {
        type: Number,
        default: 1,
        input: "integer"
    },
    amount: { type: Number, default: 0, input: "currency" },
    taxAmount: { type: Number, default: 0, input: "currency" },
    grossAmount: { type: Number, default: 0, input: "currency" },
    weight: { type: Number, default: 0, input: "number" },
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
const schema_3 = __importDefault(__webpack_require__(145));
const schema_4 = __importDefault(__webpack_require__(7799));
const schema_5 = __importDefault(__webpack_require__(7506));
const schema_6 = __importDefault(__webpack_require__(1674));
const schema_7 = __importDefault(__webpack_require__(6472));
exports["default"] = schema_1.default;
exports.TransactionTypes = {
    salesorder: schema_2.default,
    invoice: schema_3.default,
    itemfulfillment: schema_4.default,
    itemreceipt: schema_5.default,
    inventoryadjustment: schema_6.default,
    purchaseorder: schema_7.default
};


/***/ }),

/***/ 6472:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
const schema_1 = __importDefault(__webpack_require__(5740));
const options = { discriminatorKey: "type", collection: "transactions" };
const schema = new mongoose_1.Schema({}, options);
const PurchaseOrder = schema_1.default.discriminator("PurchaseOrder", schema);
exports["default"] = PurchaseOrder;


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
    //discriminatorKey: "type",
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
        // if (this.kit) {
        //   let kit = this.parent["lines"].find(line => line._id.toString() == this.kit.toString());
        //   if (kit)
        //     this.quantity = (this.multiplyquantity || 1) * (kit.quantity || 1);
        //   else
        //     this.deleted = true;
        // }
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
    shippingCost: { type: Number, default: 0, input: "currency" },
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
const line_schema_1 = __importDefault(__webpack_require__(2801));
const currencies_1 = __importDefault(__webpack_require__(7131));
//import Countries from "../../constants/countries";
const transaction_types_1 = __importDefault(__webpack_require__(7003));
// Schemas ////////////////////////////////////////////////////////////////////////////////
const TransactionSchema = {
    name: { type: String, input: "text", set: (v) => v.toLowerCase(), select: true },
    date: { type: Date, input: "date", required: true, select: true },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Company",
        required: false,
        autopopulate: true,
        input: "autocomplete"
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        required: true,
        autopopulate: true,
        input: "autocomplete",
        select: true
    },
    warehouse: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true,
        autopopulate: true,
        input: "autocomplete",
        default: "635fcec4dcd8d612939f7b90"
    },
    number: { type: Number, input: "number" },
    quantity: {
        type: Number,
        default: 0,
        input: "integer",
        total: "lines"
    },
    amount: { type: Number, default: 0, input: "currency", total: "lines", select: true },
    taxAmount: { type: Number, default: 0, input: "currency", total: "lines", select: true },
    grossAmount: { type: Number, default: 0, input: "currency", total: "lines", select: true },
    weight: { type: Number, default: 0, input: "number" },
    tax: {
        type: Number,
        default: 0,
        input: "number"
    },
    exchangeRate: {
        type: Number,
        required: true,
        default: 1,
        input: "number",
        precision: 4
    },
    currency: {
        type: String,
        required: true,
        //get: (v: any) => Currencies.getName(v),
        enum: currencies_1.default,
        default: "PLN",
        input: "select",
        resource: 'constants',
        constant: 'currencies',
        select: true
    },
    billingName: {
        type: String,
        input: "text"
    },
    billingAddressee: {
        type: String,
        input: "text"
    },
    billingAddress: {
        type: String,
        input: "text"
    },
    billingAddress2: {
        type: String,
        input: "text"
    },
    billingZip: {
        type: String,
        input: "text"
    },
    billingCity: {
        type: String,
        input: "text"
    },
    billingState: {
        type: String,
        input: "text"
    },
    billingCountry: {
        type: String,
        input: "select",
        resource: 'constants',
        constant: 'countries'
    },
    billingPhone: {
        type: String,
        input: "text"
    },
    billingEmail: {
        type: String,
        input: "text"
    },
    shippingName: {
        type: String,
        input: "text"
    },
    shippingAddressee: {
        type: String,
        input: "text"
    },
    shippingAddress: {
        type: String,
        input: "text"
    },
    shippingAddress2: {
        type: String,
        input: "text"
    },
    shippingZip: {
        type: String,
        input: "text"
    },
    shippingCity: {
        type: String,
        input: "text"
    },
    shippingState: {
        type: String,
        input: "select"
    },
    shippingCountry: {
        type: String,
        input: "select",
        resource: 'constants',
        constant: 'countries'
    },
    shippingPhone: {
        type: String,
        input: "text"
    },
    shippingEmail: {
        type: String,
        input: "text"
    },
    type: {
        type: String,
        required: true,
        //get: (v: any) => TranTypes.getName(v),
        enum: transaction_types_1.default
    },
    status: {
        type: String,
        default: "pendingapproval",
        resource: 'constants',
        constant: 'currencies',
        //enum: TranStatus,
        input: "select",
        select: true
    },
    taxNumber: { type: String, input: "text" },
    referenceNumber: { type: String, input: "text" },
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

/***/ 2419:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: [2, "Must be at least 2 characters long, got {VALUE}"],
        input: "text"
    },
    type: {
        type: String,
        required: true,
        enum: ["warehouse"],
        default: "warehouse"
    }
}, {
    collection: "warehouses",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.schema.index({ name: 1 });
const Warehouse = (0, mongoose_1.model)("Warehouse", exports.schema);
Warehouse.init().then(function (Event) {
    console.log('Warehouse Builded');
});
exports["default"] = Warehouse;


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
const warehouses_1 = __importDefault(__webpack_require__(6606));
const classifications_1 = __importDefault(__webpack_require__(3096));
const entities_1 = __importDefault(__webpack_require__(5067));
const transactions_1 = __importDefault(__webpack_require__(2069));
const items_1 = __importDefault(__webpack_require__(1199));
const activities_1 = __importDefault(__webpack_require__(5282));
const websites_1 = __importDefault(__webpack_require__(718));
const constants_1 = __importDefault(__webpack_require__(2110));
const files_1 = __importDefault(__webpack_require__(4758));
const hosting_1 = __importDefault(__webpack_require__(2101));
const emails_1 = __importDefault(__webpack_require__(4267));
const settings_1 = __importDefault(__webpack_require__(4604));
const reports_1 = __importDefault(__webpack_require__(3002));
const accounting_1 = __importDefault(__webpack_require__(76));
const shop_model_1 = __importDefault(__webpack_require__(1725));
class Routes {
    constructor() {
        this.Router = express_1.default.Router();
        this.Router2 = express_1.default.Router();
        this.RouterFiles = express_1.default.Router();
        this.RouterCustom = express_1.default.Router();
        this.Auth = new auth_1.default();
        this.entityController = new entities_1.default();
        this.classificationController = new classifications_1.default();
        this.warehouseController = new warehouses_1.default();
        this.transactionController = new transactions_1.default();
        this.websiteController = new websites_1.default();
        this.itemController = new items_1.default();
        this.activityController = new activities_1.default();
        this.constantController = new constants_1.default();
        this.filesController = new files_1.default();
        this.hostingController = new hosting_1.default();
        this.emailController = new emails_1.default();
        this.settingController = new settings_1.default();
        this.reportController = new reports_1.default();
        this.accountingController = new accounting_1.default();
    }
    start(app) {
        console.log("Start Routing");
        this.routeConstants();
        // this.routeTransactions();
        this.routeUniversal("transactions", this.transactionController);
        this.routeWarehouses();
        //this.routeClassifications();
        this.routeUniversal("classifications", this.classificationController);
        //this.routeItems();
        this.routeUniversal("items", this.itemController);
        //this.routeActivities();
        this.routeUniversal("activities", this.activityController);
        //this.routeUsers();
        this.routeUniversal("entities", this.entityController);
        //this.routeWebsites();
        this.routeUniversal("websites", this.websiteController);
        this.routeAuth();
        this.routeFiles();
        this.routeHosting();
        this.routeCustom();
        //this.routeEmails();
        this.routeUniversal("emails", this.emailController);
        this.routeSettings();
        this.routeReports();
        this.routeAccounting();
        app.use(subdomain("*", this.Router2));
        //app.use("/hosting", this.Router2);
        app.use("/api/core", this.Router);
        //app.use("/api/core/storage", this.RouterFiles);
        //Custom
        app.use("/api/custom", this.RouterCustom);
    }
    routeCustom() {
        // Constants
        this.RouterCustom.route("/items").get(function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                // let db = mongoose.connection.db;
                // let items = await db.collection('items').find().toArray();
                // console.log(items.length)
                // if (items.length) {
                //   let tmp = await db.collection('transactions.lines').findOne();
                //   if (tmp) {
                //     for (let item of items) {
                //       console.log(item.name);
                //       await db.collection('items').updateOne({ name: item.name }, { $set: { type: 'InvItem' } })
                //       delete tmp._id;
                //       tmp.item = item._id;
                //       await db.collection('transactions.lines').insertOne(tmp);
                //     }
                //   }
                // }
            });
        });
    }
    routeUniversal(collection, controller) {
        this.Router.route(`/${collection}/:recordtype/fields`).get(this.Auth.authenticate.bind(this.Auth), controller.fields.bind(controller));
        this.Router.route(`/${collection}/:recordtype`).get(this.Auth.authenticate.bind(this.Auth), controller.find.bind(controller));
        this.Router.route(`/${collection}/:recordtype/new/create`).post(controller.add.bind(controller));
        if (controller.pdf)
            this.Router.route(`/${collection}/:recordtype/:id/pdf`).get(controller.pdf.bind(controller));
        this.Router.route(`/${collection}/:recordtype/:id/logs`)
            .get(controller.logs.bind(controller));
        this.Router.route(`/${collection}/:recordtype/:id/:mode`)
            .get(controller.get.bind(controller))
            .put(controller.update.bind(controller))
            .post(controller.save.bind(controller))
            .delete(controller.delete.bind(controller));
    }
    routeConstants() {
        // Constants
        this.Router.route("/constants/:recordtype").get(this.constantController.get);
    }
    routeWarehouses() {
        // Warehouses
        this.Router.route("/warehouses/:recordtype").get(this.warehouseController.find.bind(this.warehouseController));
    }
    routeClassifications() {
        // Classifications
        this.Router.route("/classifications/:recordtype").get(this.classificationController.find.bind(this.classificationController));
        this.Router.route("/classifications/:recordtype/new/create").post(this.classificationController.add.bind(this.classificationController));
        this.Router.route("/classifications/:recordtype/:id/:mode")
            .get(this.classificationController.get.bind(this.classificationController))
            .put(this.classificationController.update.bind(this.classificationController))
            .post(this.classificationController.save.bind(this.classificationController))
            .delete(this.classificationController.delete.bind(this.classificationController));
    }
    routeTransactions() {
        // Transactions
        this.Router.route("/transactions/:recordtype/fields").get(this.Auth.authenticate.bind(this.Auth), this.transactionController.fields.bind(this.transactionController));
        this.Router.route("/transactions/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.transactionController.find.bind(this.transactionController));
        this.Router.route("/transactions/:recordtype/new/create").post(this.transactionController.add.bind(this.transactionController));
        this.Router.route("/transactions/:recordtype/:id/pdf").get(this.transactionController.pdf.bind(this.transactionController));
        this.Router.route("/transactions/:recordtype/:id/logs")
            .get(this.transactionController.logs.bind(this.transactionController));
        this.Router.route("/transactions/:recordtype/:id/:mode")
            .get(this.transactionController.get.bind(this.transactionController))
            .put(this.transactionController.update.bind(this.transactionController))
            .post(this.transactionController.save.bind(this.transactionController))
            .delete(this.transactionController.delete.bind(this.transactionController));
    }
    routeItems() {
        //Items
        this.Router.route("/items/").get(this.Auth.authenticate.bind(this.Auth), this.itemController.find.bind(this.itemController));
        this.Router.route("/items/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.itemController.find.bind(this.itemController));
        this.Router.route("/items/:recordtype/new/create").post(this.itemController.add.bind(this.itemController));
        this.Router.route("/items/:recordtype/:id/logs")
            .get(this.itemController.logs.bind(this.itemController));
        this.Router.route("/items/:recordtype/:id/:mode")
            .get(this.itemController.get.bind(this.itemController))
            .put(this.itemController.update.bind(this.itemController))
            .post(this.itemController.save.bind(this.itemController))
            .delete(this.itemController.delete.bind(this.itemController));
    }
    routeActivities() {
        //Activities
        this.Router.route("/activities/").get(this.Auth.authenticate.bind(this.Auth), this.activityController.find.bind(this.activityController));
        this.Router.route("/activities/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.activityController.find.bind(this.activityController));
        this.Router.route("/activities/:recordtype/new/create").post(this.activityController.add.bind(this.activityController));
        this.Router.route("/activities/:recordtype/:id/:mode")
            .get(this.activityController.get.bind(this.activityController))
            .put(this.activityController.update.bind(this.activityController))
            .post(this.activityController.save.bind(this.activityController))
            .delete(this.activityController.delete.bind(this.activityController));
    }
    routeUsers() {
        // Users
        // this.Router.route("/entities/:recordtype/:id/options").get(
        //   this.Auth.authenticate.bind(this.Auth) as any,
        //   this.entityController.options.bind(this.entityController) as any
        // );
        this.Router.route("/entities/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.entityController.find.bind(this.entityController));
        this.Router.route("/entities/:recordtype/new/create").post(this.entityController.add.bind(this.entityController));
        this.Router.route("/entities/:recordtype/:id/logs")
            .get(this.entityController.logs.bind(this.entityController));
        this.Router.route("/entities/:recordtype/:id/:mode")
            .get(this.entityController.get.bind(this.entityController))
            .put(this.entityController.update.bind(this.entityController))
            .post(this.entityController.save.bind(this.entityController))
            .delete(this.entityController.delete.bind(this.entityController));
    }
    routeWebsites() {
        // Websites
        this.Router.route("/websites/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.websiteController.find.bind(this.websiteController));
        this.Router.route("/websites/:recordtype/new/create").post(this.websiteController.add.bind(this.websiteController));
        this.Router.route("/websites/:recordtype/:id/:mode")
            .get(this.websiteController.get.bind(this.websiteController))
            .put(this.websiteController.update.bind(this.websiteController))
            .post(this.websiteController.save.bind(this.websiteController))
            .delete(this.websiteController.delete.bind(this.websiteController));
    }
    routeEmails() {
        // Emails
        this.Router.route("/emails/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.emailController.find.bind(this.emailController));
        this.Router.route("/emails/:recordtype/new/create").post(this.emailController.add.bind(this.emailController));
        this.Router.route("/emails/:recordtype/:id/send")
            .post(this.emailController.send.bind(this.emailController));
        this.Router.route("/emails/:recordtype/:id/:mode")
            .get(this.emailController.get.bind(this.emailController))
            .put(this.emailController.update.bind(this.emailController))
            .post(this.emailController.save.bind(this.emailController))
            .delete(this.emailController.delete.bind(this.emailController));
    }
    routeSettings() {
        // Settings
        this.Router.route("/settings/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.settingController.find.bind(this.settingController));
        this.Router.route("/settings/:recordtype/new/create").post(this.Auth.authenticate.bind(this.Auth), this.settingController.add.bind(this.settingController));
        // this.Router.route("/settings/:recordtype/new/create").post(
        //   this.settingController.add.bind(this.settingController) as any
        // );
        this.Router.route("/settings/:recordtype/:id/:mode?")
            .put(this.settingController.update.bind(this.settingController));
        // .get(this.settingController.get.bind(this.settingController) as any)
        //   .post(this.settingController.save.bind(this.settingController) as any)
        //   .delete(this.settingController.delete.bind(this.settingController) as any);
    }
    routeReports() {
        // Reports
        this.Router.route("/reports/:recordtype/fields").get(this.Auth.authenticate.bind(this.Auth), this.reportController.fields.bind(this.reportController));
        this.Router.route("/reports/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.reportController.find.bind(this.reportController));
        this.Router.route("/reports/:recordtype/new/create").post(this.Auth.authenticate.bind(this.Auth), this.reportController.add.bind(this.reportController));
        this.Router.route("/reports/:recordtype/:id/results")
            .get(this.reportController.results.bind(this.reportController));
        this.Router.route("/reports/:recordtype/:id/:mode?")
            .put(this.reportController.update.bind(this.reportController))
            .get(this.reportController.get.bind(this.reportController))
            .post(this.reportController.save.bind(this.reportController))
            .delete(this.reportController.delete.bind(this.reportController));
    }
    routeAuth() {
        // Auth
        // to do - do usunięcia
        this.Router.route("/login").post(this.Auth.login.bind(this.Auth));
        this.Router.route("/auth").get(this.Auth.authenticate.bind(this.Auth), this.Auth.accessGranted.bind(this.Auth));
        this.Router.route("/user").get(this.Auth.authenticate.bind(this.Auth), this.Auth.getUser.bind(this.Auth));
        //new auth
        this.Router.route("/auth/login").post(this.Auth.login.bind(this.Auth));
        this.Router.route("/auth/refresh").post(this.Auth.refreshToken.bind(this.Auth));
        this.Router.route("/auth/user").get(this.Auth.authenticate.bind(this.Auth), this.Auth.getUser.bind(this.Auth));
        this.Router.route("/auth/verify").get(this.Auth.authenticate.bind(this.Auth), this.Auth.accessGranted.bind(this.Auth));
    }
    routeFiles() {
        // Files
        this.Router.route("/files/upload/:path*?").post(this.filesController.upload.bind(this.filesController));
        this.Router.route("/files/:path*?").get(this.Auth.authenticate.bind(this.Auth), this.filesController.find.bind(this.filesController));
    }
    routeHosting() {
        // Hosting
        this.Router2.route("/:view?/:param?").get(this.hostingController.get);
        this.Router2.route("*").get(this.hostingController.get);
    }
    routeAccounting() {
        //Accounting
        this.Router.route("/accounting/").get(this.Auth.authenticate.bind(this.Auth), this.accountingController.find.bind(this.accountingController));
        this.Router.route("/accounting/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.accountingController.find.bind(this.accountingController));
        this.Router.route("/accounting/:recordtype/new/create").post(this.accountingController.add.bind(this.accountingController));
        this.Router.route("/accounting/:recordtype/:id/:mode")
            .get(this.accountingController.get.bind(this.accountingController))
            .put(this.accountingController.update.bind(this.accountingController))
            .post(this.accountingController.save.bind(this.accountingController))
            .delete(this.accountingController.delete.bind(this.accountingController));
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
        this.user = "notification@3cerp.cloud";
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
const app_1 = __webpack_require__(3165);
function methods(schema, options) {
    // apply method to pre
    function recalcDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("default recalc Record");
        });
    }
    function validateDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("validateDocument");
            let errors = [];
            let err = this.validateSync();
            if (err)
                errors.push(err);
            let virtualmsg = yield this.validateVirtuals();
            if (virtualmsg && virtualmsg.length)
                errors.push(...virtualmsg);
            return errors;
        });
    }
    function saveDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("save document");
            yield this.recalcDocument();
            yield this.validateVirtuals(true);
            yield this.changeLogs();
            let document = yield this.save();
            app_1.cache.delCache(document._id);
            return document;
        });
    }
    //add locals
    function initLocal(next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$locals.oldValue = {};
            this.$locals.triggers = [];
        });
    }
    //triggers loop
    function actions(next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post valide ");
            for (let trigger of this.$locals.triggers) {
                if (this.actions)
                    yield this.actions(trigger);
                // remove trigger
                this.$locals.triggers.shift();
                yield this.validate();
            }
        });
    }
    // to do - zmienić na wartość statyczną zamiast virtualną
    // add resource
    schema.virtual('resource').get(function () {
        let resources = this.schema.options.collection.split(".");
        return resources[0];
    });
    schema.methods.setValue = setValue_1.default;
    schema.methods.changeLogs = changeLogs_1.default;
    schema.methods.virtualPopulate = virtualPopulate_1.default;
    schema.methods.autoPopulate = autoPopulate_1.default;
    schema.methods.constantTranslate = constantTranslate_1.default;
    schema.methods.validateVirtuals = validateVirtuals_1.default;
    schema.methods.totalVirtuals = totalVirtuals_1.default;
    schema.methods.addToVirtuals = addToVirtuals_1.default;
    schema.methods.recalcDocument = recalcDocument;
    schema.methods.saveDocument = saveDocument;
    schema.methods.validateDocument = validateDocument;
    schema.methods.initLocal = initLocal;
    // schema.pre("save", handlerSave);
    // schema.pre("remove", handlerSave);
    schema.pre("init", initLocal);
    schema.post("validate", actions);
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
exports["default"] = methods;


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
        yield this.validateVirtuals();
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
function changeLogs(document, list) {
    return __awaiter(this, void 0, void 0, function* () {
        //zmodyfikować by przed zapisaniem pobierało oryginalny obiekt i zapisywalo zmiany
        if (this.isModified) {
            let selects = this.directModifiedPaths();
            //get original document if exists (only changed fields)
            let originalDoc = yield this.constructor.findById(this.id, selects);
            if (originalDoc) {
                selects.forEach((field) => {
                    let ref = this[field] && this[field].constructor ? this[field].constructor.modelName : null;
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
                    console.log(doc[list.path][index]);
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
                    this.validateVirtuals();
                }
            }
            else {
                document = this;
            }
            document.$locals.oldValue[field] = document[field];
            document.$locals.triggers.push({ type: "setValue", field: field, oldValue: document.$locals.oldValue[field] });
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
const app_1 = __webpack_require__(3165);
const getFields_1 = __importDefault(__webpack_require__(4140));
const pdf_1 = __importDefault(__webpack_require__(180));
//loadDocument
function loadDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = yield this.findOne({ _id: id });
        if (doc) {
            yield doc.virtualPopulate();
            yield doc.validateVirtuals();
            return doc;
        }
        else
            return null;
    });
}
exports.loadDocument = loadDocument;
//API
function addDocument(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = new this(data);
        document.initLocal();
        yield document.recalcDocument();
        let msg = yield document.validateDocument();
        // insert document to cache
        app_1.cache.addCache(document);
        return { document, msg };
    });
}
exports.addDocument = addDocument;
function getDocument(id, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        //let document = cache.getCache(id);
        //if (!document) {
        let document = yield this.loadDocument(id);
        //}
        if (document) {
            if (mode === "edit")
                app_1.cache.addCache(document);
        }
        return document;
    });
}
exports.getDocument = getDocument;
function saveDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = app_1.cache.getCache(id);
        if (document) {
            yield document.saveDocument();
            (0, pdf_1.default)();
            return id;
        }
        else {
            // to do - dodać error
        }
    });
}
exports.saveDocument = saveDocument;
function updateDocument(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = app_1.cache.getCache(id);
        let save = false;
        if (!document) {
            document = yield this.loadDocument(id);
            save = true;
        }
        let msg = [];
        if (!Array.isArray(updates))
            updates = [updates]; // array
        for (let update of updates) {
            msg = yield document.setValue(update.field, update.value, update.list, update.subrecord);
        }
        if (save) {
            document = yield document.saveDocument();
            return { document, msg };
        }
        else {
            yield document.recalcDocument();
            return { document, msg };
        }
    });
}
exports.updateDocument = updateDocument;
function deleteDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = yield this.loadDocument(id);
        if (document) {
            document.deleted = true;
            yield document.recalcDocument();
            app_1.cache.delCache(id);
            document.remove();
        }
        else {
            // to do - dodać error
        }
        return id;
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
function staticsMethods(schema, options) {
    schema.statics.loadDocument = loadDocument;
    schema.statics.addDocument = addDocument;
    schema.statics.getDocument = getDocument;
    schema.statics.saveDocument = saveDocument;
    schema.statics.updateDocument = updateDocument;
    schema.statics.deleteDocument = deleteDocument;
    schema.statics.findDocuments = findDocuments;
    schema.statics.getFields = getFields_1.default;
}
exports["default"] = staticsMethods;


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
            // fields.push({
            //   name: key,
            //   ref: value.options.ref,
            //   //instance: schematype.instance,
            //   type: "subrecords"
            // });
        }
    });
    //modelSchema.eachPath(async (pathname: string, schematype: any) => {
    for (const [pathname, schematype] of Object.entries(modelSchema.paths)) {
        if (schematype.options.input ||
            ["Embedded", "Array"].includes(schematype.instance)) {
            if (["Embedded", "Array"].includes(schematype.instance)) {
                //console.log(pathname, schematype.schema);
                // this.getFields(schematype.schema, type).forEach((field) =>
                //   fields.push({ path: pathname, ...field })
                // );
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
                    type: schematype.options.input,
                    select: schematype.options.select,
                    fields: [],
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