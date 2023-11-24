"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiApp = void 0;
require("express-error-handler");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const SwaggerUI = __importStar(require("swagger-ui-express"));
const configs_1 = require("./configs");
const third_party_1 = require("./third-party");
const ApiController = __importStar(require("./controllers"));
const middlewares_1 = require("./middlewares");
const SwaggerConfig = __importStar(require("./configs/swagger.config.json"));
exports.ApiApp = (0, express_1.default)();
/*      Using Library Middlewares       */
exports.ApiApp.use(express_1.default.json());
exports.ApiApp.use(express_1.default.urlencoded({ extended: false }));
exports.ApiApp.use((0, cors_1.default)({ origin: '*' }));
exports.ApiApp.use((0, helmet_1.default)());
exports.ApiApp.use((0, compression_1.default)({ level: 1, threshold: 128 /* 0.125KB */ }));
/*      Main Endpoint      */
exports.ApiApp.use('/api', ApiController.apiControllers);
exports.ApiApp.use('/api-doc', SwaggerUI.serve, SwaggerUI.setup(SwaggerConfig));
/*      Using Library Middlewares       */
exports.ApiApp.use(middlewares_1.ResponseHandler);
exports.ApiApp.use(middlewares_1.ErrorHandler);
/*      Main Endpoint      */
third_party_1.MongoDBParty.connectionHandler();
exports.ApiApp.listen(configs_1.ApiConfigs.port, () => {
    console.log(`Server is listening on ${configs_1.ApiConfigs.port}`);
});
