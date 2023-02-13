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
const app = (0, express_1.default)();
const axios = require("axios");
require("dotenv").config();
//Generates list of currencies from currency API
const getListOfCurrencies = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield axios.get("https://api.apilayer.com/fixer/symbols?apikey=" + process.env.APIKEY);
        let listofCurrencies = [];
        for (const currency in data.data.symbols) {
            listofCurrencies.push({
                shortcut: currency,
                name: data.data.symbols[currency],
            });
        }
        return listofCurrencies;
    }
    catch (err) {
        return {
            message: err.message,
            status: err.status,
        };
    }
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getListOfCurrencies();
    console.log(response);
    res.send(response);
}));
app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
});
