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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const stats_1 = require("../util/stats");
exports.router = express_1.default.Router();
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Generates list of currencies from currency API
    try {
        // const data = await axios.get(
        //   "https://api.apilayer.com/fixer/symbols?apikey=" + process.env.APIKEY
        // );
        const data = yield axios_1.default.get("https://api.apilayer.com/currency_data/list?apikey=" + process.env.APIKEY);
        //Create array of currencies
        let listofCurrencies = [];
        for (const currency in data.data.currencies) {
            listofCurrencies.push({
                shortcut: currency,
                name: data.data.currencies[currency],
            });
        }
        const { mostPopularDestinationCurrencies, totalAmount, totalNumberOfRequests, } = yield (0, stats_1.readStats)();
        const statsData = {
            mostPopularDestinationCurrencies,
            totalAmount,
            totalNumberOfRequests,
        };
        res.status(200).send({
            message: "List of currencies and stats fetched successfuly",
            data: {
                currencies: listofCurrencies,
                stats: statsData,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.send({ error: err.message || "Something went wrong" });
    }
}));
