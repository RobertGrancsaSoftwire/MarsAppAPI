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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const chai_1 = require("chai");
const port = 8000;
describe("endpoint", () => {
    it("get rovers", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(`http://localhost:${port}/rovers`);
        (0, chai_1.expect)(res.data).to.deep.equal(JSON.parse(fs_1.default.readFileSync('response_rovers.json', 'utf-8')));
    }));
    it("get photos", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(`http://localhost:${port}/rovers/photos`);
        (0, chai_1.expect)(res.data).to.deep.equal(JSON.parse(fs_1.default.readFileSync('response_photos.json', 'utf-8')));
    }));
});
