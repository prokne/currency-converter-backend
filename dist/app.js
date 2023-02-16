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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
dotenv_1.default.config();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Generates list of currencies from currency API
    try {
        const data = yield axios_1.default.get("https://api.apilayer.com/fixer/symbols?apikey=" + process.env.APIKEY);
        let listofCurrencies = [];
        for (const currency in data.data.symbols) {
            listofCurrencies.push({
                shortcut: currency,
                name: data.data.symbols[currency],
            });
        }
        res.status(200).send({
            message: "List of currencies fetched successfuly",
            data: listofCurrencies,
        });
    }
    catch (err) {
        res.send({ error: err.message });
    }
}));
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
});
