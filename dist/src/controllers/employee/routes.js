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
exports.employeeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Controller = __importStar(require("./controller"));
const middlewares_1 = require("../../middlewares");
const constants_1 = require("../../constants");
exports.employeeRoutes = express_1.default.Router();
exports.employeeRoutes.route('/register-employee-profile').post(Controller.registerEmployeeProfile);
exports.employeeRoutes.route('/update-employee-profile').put(middlewares_1.Authorization, Controller.updateEmployeeProfile);
exports.employeeRoutes.route('/get-employee-profile').get(middlewares_1.Authorization, Controller.getEmployeeProfile);
exports.employeeRoutes.route('/get-employee-profile/:_id').get(middlewares_1.Authorization, Controller.getEmployeeProfile);
exports.employeeRoutes
    .route('/get-employee-list')
    .get(middlewares_1.Authorization, (0, middlewares_1.CheckRole)([constants_1.Identify.Admin, constants_1.Identify.Manager, constants_1.Identify.Assistant]), Controller.getEmployeeList);
exports.employeeRoutes.route('/upload-avatar-employee').post(middlewares_1.ImageHandler.single('avatar'), Controller.uploadEmployeeAvatar);
