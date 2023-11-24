"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const bcrypt_1 = __importDefault(require("bcrypt"));
const configs_1 = require("../configs");
const utils_1 = require("../utils");
(0, app_1.initializeApp)(configs_1.FirebaseConfigs);
const firebaseStorage = (0, storage_1.getStorage)();
const firebaseParty = {
    uploadImage: (file, type) => __awaiter(void 0, void 0, void 0, function* () {
        const hashImage = yield bcrypt_1.default.hashSync(file.originalname, 0.1);
        const storagePath = (0, utils_1.uploadTypeHelper)(type);
        const storageRef = (0, storage_1.ref)(firebaseStorage, `${storagePath}/${hashImage}`);
        const metadata = { contentType: file.mimetype };
        const snapShot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
        const imageUrl = yield (0, storage_1.getDownloadURL)(snapShot.ref);
        return imageUrl;
    }),
};
exports.default = firebaseParty;
