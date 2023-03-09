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
exports.App3CERP = exports.cache = void 0;
const express_1 = __importDefault(__webpack_require__(6860));
const dotenv = __importStar(__webpack_require__(5142));
const cors_1 = __importDefault(__webpack_require__(3582));
const compression_1 = __importDefault(__webpack_require__(7455));
const database_1 = __importDefault(__webpack_require__(991));
const i18n_1 = __importDefault(__webpack_require__(6734));
const core_1 = __importDefault(__webpack_require__(6585));
const maintenance_1 = __importDefault(__webpack_require__(6802));
const public_1 = __importDefault(__webpack_require__(93));
const emitEvents_1 = __importDefault(__webpack_require__(1321));
const error_handler_1 = __webpack_require__(9868);
const storage_1 = __importDefault(__webpack_require__(4091));
const cache_1 = __importDefault(__webpack_require__(9732));
const path_1 = __importDefault(__webpack_require__(1017));
// Custom ENVIRONMENT Veriables
let env = dotenv.config({
    path: path_1.default.resolve(`.env.${"production"}`)
});
exports.cache = new cache_1.default();
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
    }
    config() {
        this.app.use((0, compression_1.default)()); // compress all responses
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        //this.app.use(helmet());
        // serving static files
        this.app.use("/public", express_1.default.static("public"));
        this.app.use('/hosting', express_1.default.static("hosting"));
        this.app.use(__webpack_require__(3222)());
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
mongoose_1.default.plugin(static_1.default);
mongoose_1.default.plugin(methods_1.default);
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
const priceBasis = ["BasePrice", "PurchasePrice"];
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
exports["default"] = ["pendingapproval", "open"];


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
const constants = { countries: countries_1.getCountries, states: states_1.getStates, currencies: currencies_1.getCurrencies, pricebasis: price_basis_1.getPriceBasis };
class controller {
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // i18n
            i18n_1.default.configure({
                directory: path_1.default.resolve(__dirname, "../constants/locales")
            });
            try {
                const values = yield constants[req.params.recordtype](req.query);
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
class controller {
    constructor(models) {
        this.models = {};
        this.models = models;
    }
    setModel(recordtype) {
        if (this.models)
            return this.models.submodels[recordtype] || this.models.model;
        else
            throw 'błąd';
    }
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // init Model and create new Document
            const model = this.setModel(req.params.recordtype);
            try {
                let document = yield model.addDocument(req.body);
                res.json(document);
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
                let options = { select: { name: 1, type: 1, collection: 1, link: 1 }, sort: {}, limit: 50 };
                let filters = (req.query.filters || "").toString();
                if (filters) {
                    query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
                }
                let select = (req.query.select || "").toString();
                if (select) {
                    options.select = select.split(",").reduce((o, f) => { o[f] = 1; return o; }, { name: 1, type: 1, collection: 1, link: 1 });
                }
                let sort = (req.query.sort || "").toString();
                if (sort) {
                    options.sort = sort.split(",").reduce((o, f) => {
                        // -date = desc sort per date field
                        if (f[0] == "-") {
                            f = f.substring(1);
                            o[f] = 1;
                        }
                        else
                            o[f] = 1;
                        return o;
                    }, {});
                }
                options.limit = parseInt((req.query.limit || 0).toString());
                let result = yield model.findDocuments(query, options);
                for (let line of result) {
                    yield line.autoPopulate(req);
                }
                res.json(result);
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
                        message: 'Document not found'
                    });
                else
                    res.json(document);
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
                let { list, subrecord, field, value, save } = req.body;
                let document = yield model.updateDocument(id, list, subrecord, field, value, save);
                res.json(document);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    delete(req, res, next) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try {
            let document = model.deleteDocument(id);
            res.json(document);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports["default"] = controller;


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
const file_model_1 = __importDefault(__webpack_require__(3630));
class controller {
    add(req, res, next) {
        let Model = file_model_1.default;
        let doc = new Model(req.body);
        doc.save((err, result) => {
            if (err) {
                next(err);
            }
            res.json(result);
        });
    }
    find(req, res, next) {
        file_model_1.default.find({})
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
        return __awaiter(this, void 0, void 0, function* () {
            const path = encodeURI(`/${req.params.path}${req.params["0"]}`);
            let file = yield file_model_1.default.findOne({
                urlcomponent: path
            });
            if (file) {
                res
                    .status(200)
                    .header("Content-Type", file.type)
                    .sendFile(file.urlcomponent);
                //.sendFile(file.path, { root: "./storage/" });
            }
            else {
                res.status(400).send();
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = encodeURI(req.params["0"]);
            let doc = yield file_model_1.default.loadDocument(req.params.id);
            doc.rename(path);
        });
    }
    delete(req, res, next) {
        const path = encodeURI(`/${req.params.path}${req.params["0"]}`);
        file_model_1.default.deleteFile(path).then((err) => {
            if (err) {
                next(err);
            }
            res.json({ message: "Successfully deleted contact!" });
        });
    }
}
exports["default"] = controller;


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
class controller {
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            i18n_1.default.setLocale(req.locale);
            console.log('tu tez', req.subdomains, req.params.view);
            let hostingPath = path_1.default.resolve("hosting");
            var views = path_1.default.resolve(hostingPath, req.subdomains[0]);
            var filepath = path_1.default.join(views, "index" + ".ejs");
            let data = { company: "testss", searchResult: [], item: {} };
            if (req.params.view) {
                let viewpath = path_1.default.join(views, "templates", req.params.view + ".ejs");
                if (fs_1.default.existsSync(viewpath)) {
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
                        let options = { sort: {}, limit: 0 };
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
                        //console.log(options)
                        let result = yield model_1.default.findDocuments(query, options);
                        for (let line of result) {
                            yield line.autoPopulate(req);
                        }
                        data.searchResult = result;
                    }
                    if (["item", "product"].includes(req.params.view)) {
                        let result = yield model_1.default.getDocument('60df047fec2924769a00834d', 'view');
                        data.item = result;
                    }
                }
                else {
                    req.params.view = "404";
                }
            }
            // i18n
            i18n_1.default.configure({
                directory: path_1.default.join(views, "/locales")
            });
            try {
                console.log(filepath, req.params.view);
                ejs_1.default.renderFile(filepath, { data: data, view: req.params.view }, (err, result) => {
                    console.log(err, !!result);
                    //res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
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
                        res.status(500).json({ message: "failed to authenticate token" });
                    else
                        next();
                });
            }
            catch (err) {
                res.status(400).json({ message: "Invalid token" });
            }
        }
        else {
            res.status(401).json({ message: "Access denied. No token provided" });
        }
    }
    accessGranted(req, res, next) {
        res.status(200).json({ message: "Access granted" });
    }
    login(req, res, next) {
        model_1.default.findOne({ email: req.body.email }).then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user) {
                const valide = yield user.validatePassword(req.body.password);
                if (valide) {
                    const token = jsonwebtoken_1.default.sign({ user: user._id }, this.tokenSecret, {
                        expiresIn: "24h"
                    });
                    let userLoged = {
                        name: user.name,
                        date: new Date()
                    };
                    res.status(200).json({ user: userLoged, token });
                }
                else {
                    res.status(403).json({ message: "password do not match" });
                }
            }
            else
                res.status(404).json({ message: "no user with that email found" });
        }));
    }
}
exports["default"] = Auth;


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
    console.log('ErrorHandlesr', error);
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
const mime_types_1 = __importDefault(__webpack_require__(9514));
const file_model_1 = __importDefault(__webpack_require__(3630));
const usefull_1 = __webpack_require__(6491);
class StorageStructure {
    constructor() {
        //resolve storage path of directory
        this.storagePath = path_1.default.resolve("storage");
        this.importPath = path_1.default.resolve("storage", "import");
        this.exportPath = path_1.default.resolve("storage", "export");
        if (!fs_1.default.existsSync(this.storagePath))
            fs_1.default.mkdirSync(this.storagePath);
        if (!fs_1.default.existsSync(this.importPath))
            fs_1.default.mkdirSync(this.importPath);
        if (!fs_1.default.existsSync(this.exportPath))
            fs_1.default.mkdirSync(this.exportPath);
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
            let dirSize = 0;
            files.forEach((file) => {
                let doc = {
                    name: file,
                    type: mime_types_1.default.lookup(file).toString(),
                    path: dirPath,
                    urlcomponent: encodeURI(`${dirPath}/${file}`)
                };
                if (fs_1.default.lstatSync(path_1.default.join(dirPath, file)).isDirectory()) {
                    doc.type = "directory";
                    this.mapFiles(path_1.default.join(dirPath, file), doc);
                }
                else {
                    doc.size = (0, usefull_1.getFileSize)(doc.urlcomponent);
                    dirSize += doc.size;
                }
                file_model_1.default.updateOrInsert(doc);
            });
            if (parent) {
                parent.size = dirSize;
                file_model_1.default.updateOrInsert(parent);
            }
        });
    }
}
exports["default"] = StorageStructure;


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
exports["default"] = schema_1.default;
exports.ClassificationTypes = {
    pricelevel: schema_2.default,
    pricegroup: schema_3.default
};


/***/ }),

/***/ 7446:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "classifications" };
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    }
}, options);
exports.schema.index({ name: 1 });
const PriceGroup = (0, mongoose_1.model)("PriceGroup", exports.schema);
exports["default"] = PriceGroup;


/***/ }),

/***/ 3124:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.schema = void 0;
const mongoose_1 = __webpack_require__(1185);
const options = { discriminatorKey: "type", collection: "classifications" };
exports.schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["PriceLevel"],
        default: "PriceLevel"
    },
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
const PriceLevel = (0, mongoose_1.model)("PriceLevel", exports.schema);
exports["default"] = PriceLevel;


/***/ }),

/***/ 6617:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(1185);
// Schemas ////////////////////////////////////////////////////////////////////////////////
const ClassificationSchema = {
    name: { type: String, },
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
const countries_1 = __importDefault(__webpack_require__(5593));
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
        //get: (v: any) => Countries.getName(v),
        enum: countries_1.default,
        required: true,
        input: "select"
    },
    phone: { type: String, input: "text" },
    geoCodeHint: {
        type: String,
        get: (v) => `${v.address}, ${v.address2}, ${v.zip} ${v.city} ${v.country}`,
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
// billingAddress: {
//   type: Address,
//   get: (v: any) =>
//     `${v.addressee}\n${v.address}, ${v.address2}\n${v.zip} ${v.city}\n${v.country}`
// },
// shippingAddress: {
//   type: Address,
//   get: (v: any) =>
//     `${v.addressee}\n${v.address}, ${v.address2}\n${v.zip} ${v.city}\n${v.country}`
// }
}, options);
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
const file_model_1 = __webpack_require__(3630);
const role_model_1 = __webpack_require__(6016);
const warehouse_model_1 = __webpack_require__(2419);
const options = { discriminatorKey: "type", collection: "entities" };
const schema = new mongoose_1.Schema({
    jobTitle: { type: String, input: "text" },
    avatar: { type: file_model_1.schema, input: "file" },
    warehouse: { type: warehouse_model_1.schema, input: "select" },
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
const currencies_1 = __importDefault(__webpack_require__(7131));
const countries_1 = __importDefault(__webpack_require__(5593));
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
    salesRep: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Entity",
        autopopulate: true,
    },
    currency: {
        type: String,
        required: true,
        //get: (v: any) => Currencies.getName(v),
        enum: currencies_1.default,
        default: "PLN",
    },
    billingName: {
        type: String
    },
    billingAddressee: {
        type: String
    },
    billingAddress: {
        type: String
    },
    billingAddress2: {
        type: String
    },
    billingZip: {
        type: String
    },
    billingCity: {
        type: String
    },
    billingState: {
        type: String,
    },
    billingCountry: {
        type: String,
        enum: countries_1.default,
    },
    billingPhone: {
        type: String
    },
    billingEmail: {
        type: String
    },
    shippingName: {
        type: String
    },
    shippingAddressee: {
        type: String
    },
    shippingAddress: {
        type: String
    },
    shippingAddress2: {
        type: String
    },
    shippingZip: {
        type: String
    },
    shippingCity: {
        type: String
    },
    shippingState: {
        type: String,
    },
    shippingCountry: {
        type: String,
        enum: countries_1.default,
    },
    shippingPhone: {
        type: String
    },
    shippingEmail: {
        type: String
    },
    taxNumber: { type: String },
    tax: {
        type: Number,
        default: 0,
    },
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

/***/ 3630:
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
exports.schema = new mongoose_1.Schema({
    name: { type: String, required: true, input: "text" },
    type: { type: String, required: false, input: "text" },
    path: { type: String, required: true, input: "text" },
    url: { type: String, input: "text" },
    urlcomponent: { type: String, input: "text" },
    size: { type: Number, input: "text" }
});
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
            file.mv(`${path}/${name}`, function (err) {
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
const File = (0, mongoose_1.model)("File", exports.schema);
exports["default"] = File;


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
const schema_1 = __webpack_require__(3124);
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
    },
    priceLevel: {
        type: schema_1.schema,
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
const schema_1 = __webpack_require__(7446);
const price_schema_1 = __importDefault(__webpack_require__(4365));
const countries_1 = __importDefault(__webpack_require__(5593));
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
        type: schema_1.schema,
        required: false,
    },
    coo: {
        type: String,
        enum: countries_1.default,
    },
    barcode: {
        type: String,
    },
    weight: {
        type: Number,
    },
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
        console.log("getPrice", line.type);
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
const actions = {
    item: (line) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
    quantity: (line) => __awaiter(void 0, void 0, void 0, function* () {
        if (line.item && line.item.type === "KitItem") {
            yield line.item.syncComponents(line);
        }
    })
};
exports["default"] = actions;


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
const line_actions_1 = __importDefault(__webpack_require__(7571));
const transaction_lines_types_1 = __importDefault(__webpack_require__(998));
const usefull_1 = __webpack_require__(6491);
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
        set: (v) => v.toLowerCase()
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
schema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pre valide line");
        //if (this.deleted) throw new Error.ValidationError();
        let triggers = yield this.changeLogs();
        for (let trigger of triggers) {
            if (line_actions_1.default[trigger.field])
                yield line_actions_1.default[trigger.field](this);
        }
        // calc and set amount fields
        this.amount = (0, usefull_1.roundToPrecision)(this.quantity * this.price, 2);
        // tmp tax rate
        this.taxRate = 0.23;
        this.taxAmount = (0, usefull_1.roundToPrecision)(this.amount * this.taxRate, 2);
        this.grossAmount = (0, usefull_1.roundToPrecision)(this.amount + this.taxAmount, 2);
        next();
    });
});
schema.pre("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () { });
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
exports["default"] = schema_1.default;
exports.TransactionTypes = {
    salesorder: schema_2.default,
    invoice: schema_3.default,
    itemfulfillment: schema_4.default
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
const line_schema_1 = __importDefault(__webpack_require__(2801));
const currencies_1 = __importDefault(__webpack_require__(7131));
const countries_1 = __importDefault(__webpack_require__(5593));
const transaction_types_1 = __importDefault(__webpack_require__(7003));
const transaction_status_1 = __importDefault(__webpack_require__(5969));
// Schemas ////////////////////////////////////////////////////////////////////////////////
const TransactionSchema = {
    name: { type: String, input: "text", set: (v) => v.toLowerCase() },
    date: { type: Date, input: "date", required: true, },
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
        input: "autocomplete"
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
    amount: { type: Number, default: 0, input: "currency", total: "lines" },
    taxAmount: { type: Number, default: 0, input: "currency", total: "lines" },
    grossAmount: { type: Number, default: 0, input: "currency", total: "lines" },
    weight: { type: Number, default: 0, input: "number" },
    tax: {
        type: Number,
        default: 0,
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
    },
    billingName: {
        type: String
    },
    billingAddressee: {
        type: String
    },
    billingAddress: {
        type: String
    },
    billingAddress2: {
        type: String
    },
    billingZip: {
        type: String
    },
    billingCity: {
        type: String
    },
    billingState: {
        type: String,
    },
    billingCountry: {
        type: String,
        enum: countries_1.default,
    },
    billingPhone: {
        type: String
    },
    billingEmail: {
        type: String
    },
    shippingName: {
        type: String
    },
    shippingAddressee: {
        type: String
    },
    shippingAddress: {
        type: String
    },
    shippingAddress2: {
        type: String
    },
    shippingZip: {
        type: String
    },
    shippingCity: {
        type: String
    },
    shippingState: {
        type: String,
    },
    shippingCountry: {
        type: String,
        enum: countries_1.default,
    },
    shippingPhone: {
        type: String
    },
    shippingEmail: {
        type: String
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
        i18n: true,
        enum: transaction_status_1.default
    },
    taxNumber: { type: String },
    referenceNumber: { type: String },
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
    copyFields: ["entity"]
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
            console.log(transactions);
        });
    });
});
schema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pre valide");
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
        min: [2, "Must be at least 2 characters long, got {VALUE}"]
    },
    type: {
        type: String,
        required: true,
        enum: ["warehouse"],
        default: "warehouse"
    }
}, { collection: "warehouses" });
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
const constants_1 = __importDefault(__webpack_require__(2110));
const files_1 = __importDefault(__webpack_require__(4758));
const hosting_1 = __importDefault(__webpack_require__(2101));
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
        this.itemController = new items_1.default();
        this.constantController = new constants_1.default();
        this.filesController = new files_1.default();
        this.hostingController = new hosting_1.default();
    }
    start(app) {
        console.log("Start Routing");
        this.routeConstants();
        this.routeTransactions();
        this.routeWarehouses();
        this.routeClassifications();
        this.routeItems();
        this.routeUsers();
        this.routeAuth();
        this.routeFiles();
        this.routeHosting();
        this.routeCustom();
        app.use(subdomain("*", this.Router2));
        //app.use("/hosting", this.Router2);
        app.use("/api/core", this.Router);
        app.use("/storage/files", this.RouterFiles);
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
    }
    routeTransactions() {
        // Transactions
        this.Router.route("/transactions/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.transactionController.find.bind(this.transactionController));
        this.Router.route("/transactions/:recordtype/new/create").post(this.transactionController.add.bind(this.transactionController));
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
        this.Router.route("/items/:recordtype/:id/:mode")
            .get(this.itemController.get.bind(this.itemController))
            .put(this.itemController.update.bind(this.itemController))
            .delete(this.itemController.delete.bind(this.itemController));
    }
    routeUsers() {
        // Users
        this.Router.route("/entities/:recordtype").get(this.Auth.authenticate.bind(this.Auth), this.entityController.find.bind(this.entityController));
        this.Router.route("/entities/:recordtype/new/create").post(this.entityController.add.bind(this.entityController));
        this.Router.route("/entities/:recordtype/:id/:mode")
            .get(this.entityController.get.bind(this.entityController))
            .put(this.entityController.update.bind(this.entityController))
            .post(this.entityController.save.bind(this.entityController))
            .delete(this.entityController.delete.bind(this.entityController));
    }
    routeAuth() {
        // Auth
        this.Router.route("/login").post(this.Auth.login.bind(this.Auth));
        this.Router.route("/auth").get(this.Auth.authenticate.bind(this.Auth), this.Auth.accessGranted.bind(this.Auth));
    }
    routeFiles() {
        // Files
        this.RouterFiles.route("/:path*?").get(this.Auth.authenticate, this.filesController.get);
        this.RouterFiles.route("/upload").post(this.Auth.authenticate, this.filesController.add);
    }
    routeHosting() {
        // Hosting
        this.Router2.route("/:view?/:param?").get(this.hostingController.get);
        this.Router2.route("*").get(this.hostingController.get);
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
        if (actual && match) {
            req._subdomainLevel++; //enables chaining
            return fn(req, res, next);
        }
        else {
            if (actual)
                res.send("ok");
            else
                next();
        }
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
        //try {
        //var packagePath = path.resolve();
        //execSync("devil dns add mojadomena.pl", { stdio: "inherit", cwd: packagePath });
        (0, child_process_1.exec)("ls -la", (error, stdout, stderr) => {
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
        // } catch (error) {
        //   console.log(error)
        // }
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
const validateVirtuals_1 = __importDefault(__webpack_require__(4002));
const totalVirtuals_1 = __importDefault(__webpack_require__(4649));
const addToVirtuals_1 = __importDefault(__webpack_require__(2329));
function methods(schema, options) {
    // apply method to pre
    function handler(next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("recalcRecord");
            let msg = yield this.validateVirtuals();
            this.totalVirtuals();
            this.changeLogs();
            if (next)
                next();
            return msg;
        });
    }
    function handlerSave(next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("SaveRecord");
            yield this.validateVirtuals(true);
            this.totalVirtuals();
            this.changeLogs();
            if (next)
                next();
        });
    }
    schema.virtual('resource').get(function () {
        return this.schema.options.collection;
    });
    schema.methods.setValue = setValue_1.default;
    schema.methods.changeLogs = changeLogs_1.default;
    schema.methods.virtualPopulate = virtualPopulate_1.default;
    schema.methods.autoPopulate = autoPopulate_1.default;
    schema.methods.validateVirtuals = validateVirtuals_1.default;
    schema.methods.totalVirtuals = totalVirtuals_1.default;
    schema.methods.addToVirtuals = addToVirtuals_1.default;
    schema.methods.recalcRecord = handler;
    schema.pre("save", handlerSave);
    schema.pre("remove", handlerSave);
    //schema.pre("validate", handler);
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
        newline = new this.schema.virtuals[virtual].options.model(newline);
        this[virtual].splice(index, 0, newline);
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
function autoPopulate(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let paths = [];
        let doc = this;
        this.schema.eachPath(function process(pathname, schemaType) {
            if (pathname === "_id")
                return;
            if (schemaType.options.ref && schemaType.options.autopopulate) {
                paths.push({
                    field: pathname,
                    select: schemaType.options.autopopulate.select || "name displayname type _id resource"
                });
            }
            //i18n Translation - test - to use only for export report
            if (schemaType.options.enum && req) {
                doc[pathname] = req.__(doc[pathname]);
            }
        });
        // Virtuals
        const virtuals = Object.values(this.schema.virtuals);
        let Promises = [];
        for (let list of virtuals) {
            if (list.options.ref && list.options.autopopulate) {
                if (Array.isArray(this[list.path]))
                    for (let item of this[list.path]) {
                        Promises.push(item.autoPopulate());
                    }
            }
        }
        for (let path of paths) {
            if (!this.populated(path.field))
                Promises.push(yield this.populate(path.field, path.select));
            //console.log(path.field,this[path.field], this[path.field]._id)
        }
        yield Promise.all(Promises);
    });
}
exports["default"] = autoPopulate;


/***/ }),

/***/ 2573:
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
function changeLogs() {
    return __awaiter(this, void 0, void 0, function* () {
        // init local array to hold modified paths
        let newModifiedPaths = [];
        this.$locals.modifiedPaths = this.$locals.modifiedPaths || {};
        this.directModifiedPaths().forEach((path) => {
            if (this.schema.path(path).options.ref) {
                if ((this.$locals.modifiedPaths[path]
                    ? (this.$locals.modifiedPaths[path]._id ||
                        this.$locals.modifiedPaths[path]).toString()
                    : null) !==
                    (this[path] ? (this[path]._id || this[path]).toString() : null)) {
                    newModifiedPaths.push({
                        field: path,
                        value: this[path] ? (this[path]._id || this[path]).toString() : null,
                        oldValue: this.$locals.modifiedPaths[path]
                            ? (this.$locals.modifiedPaths[path]._id ||
                                this.$locals.modifiedPaths[path]).toString()
                            : null
                    });
                }
            }
            else {
                if (this.$locals.modifiedPaths[path] !== this[path]) {
                    newModifiedPaths.push({
                        field: path,
                        value: this[path],
                        oldValue: this.$locals.modifiedPaths[path]
                    });
                }
            }
            this.$locals.modifiedPaths[path] = this[path];
        });
        return newModifiedPaths;
    });
}
exports["default"] = changeLogs;


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
function setValue(list, subrecord, field, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("setValue", field, list);
            let changeLogs = this.getChanges();
            if (list) {
                let SubDocument = this[list].find((element) => {
                    return element._id.toString() === subrecord;
                });
                if (SubDocument) {
                    SubDocument[field] = value;
                }
                else {
                    let virtual = this.schema.virtuals[list];
                    if (field) {
                        SubDocument = new mongoose_1.models[virtual.options.ref]();
                        SubDocument[field] = value;
                        this[list].push(SubDocument);
                    }
                    else
                        console.log("The list does not exist");
                }
                //await SubDocument.validate();
                changeLogs[list] = SubDocument.getChanges();
            }
            else {
                this[field] = value;
                yield this.populate(field, "name displayname type _id");
                changeLogs = this.getChanges();
            }
            yield this.validate();
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
        //console.log("validateVirtuals");
        let errors = [];
        const virtuals = Object.values(this.schema.virtuals);
        for (let list of virtuals) {
            if (list.options.ref && !list.options.justOne) {
                if (this[list.path] && this[list.path].length) {
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
                        console.log("save", save);
                        // Validate or validate and save
                        try {
                            if (save) {
                                // before save validate is automatic
                                if (this.deleted)
                                    line.deleted = true;
                                if (line.deleted)
                                    yield line.remove();
                                else
                                    yield line.save();
                            }
                            else {
                                // Catch errors from validate all virtual list
                                yield line.validate();
                            }
                        }
                        catch (err) {
                            //console.log(err)
                            err._id = line._id;
                            err.list = list.path;
                            errors.push(err);
                        }
                        //await line.autoPopulate();
                        this[list.path][index] = line;
                    }
                }
                else {
                    this[list.path] = [];
                }
            }
        }
        if (errors.length > 0) {
            console.log(errors.length);
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
                yield this.populate(list.path);
            }
        }
    });
}
exports["default"] = virtualPopulate;


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findDocuments = exports.deleteDocument = exports.updateDocument = exports.saveDocument = exports.getDocument = exports.addDocument = exports.loadDocument = void 0;
const app_1 = __webpack_require__(3165);
//loadDocument
function loadDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = yield this.findOne({ _id: id });
        if (doc) {
            yield doc.virtualPopulate();
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
        yield document.recalcRecord();
        let msg = yield document.validateSync();
        // insert document to cache
        app_1.cache.addCache(document);
        yield document.autoPopulate();
        return { document, msg };
    });
}
exports.addDocument = addDocument;
function getDocument(id, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = app_1.cache.getCache(id);
        if (mode === "edit") {
            if (!document) {
                document = yield this.loadDocument(id);
                app_1.cache.addCache(document);
            }
            if (document)
                yield document.autoPopulate();
        }
        else {
            document = yield this.loadDocument(id);
            if (document)
                yield document.autoPopulate();
        }
        return document;
    });
}
exports.getDocument = getDocument;
function saveDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = app_1.cache.getCache(id);
        yield document.save();
        app_1.cache.delCache(id);
        return id;
    });
}
exports.saveDocument = saveDocument;
function updateDocument(id, list, subrecord, field, value, save) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = app_1.cache.getCache(id);
        if (!document)
            document = yield this.getDocument(id, "edit");
        yield document.setValue(list, subrecord, field, value);
        let msg = yield document.recalcRecord();
        if (save) {
            document = yield this.saveDocument(id);
            return { document, msg };
        }
        else {
            yield document.autoPopulate();
            return { document, msg };
        }
    });
}
exports.updateDocument = updateDocument;
function deleteDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let document = app_1.cache.getCache(id);
        document.deleted = true;
        yield document.recalcRecord();
        app_1.cache.delCache(id);
        document.remove();
        return id;
    });
}
exports.deleteDocument = deleteDocument;
function findDocuments(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let { limit, select, sort } = options;
        let result = yield this.find(query).sort(sort).limit(limit).select(select);
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
}
exports["default"] = staticsMethods;


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