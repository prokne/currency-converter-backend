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
const body_parser_1 = __importDefault(require("body-parser"));
//import convert from "./util/convert";
const stats_1 = require("./util/stats");
//ADD VALIDATION
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
dotenv_1.default.config();
app.get("/currencies", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { mostPopularDestinationCurrency, totalAmount, totalNumberOfRequests, } = yield (0, stats_1.readStats)();
        const statsData = {
            mostPopularDestinationCurrency,
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
app.post("/convert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = req.body.amount;
    const fromCurrency = req.body.from;
    const toCurrency = req.body.to;
    //Server-side form validation
    if (+amount <= 0 || fromCurrency === toCurrency) {
        res.status(422).send({ error: "There was a validation error" });
    }
    try {
        //const result = await convert(fromCurrency, toCurrency, amount);
        const result = 21;
        yield (0, stats_1.updateStats)(fromCurrency, toCurrency, amount);
        const stats = yield (0, stats_1.readStats)();
        //console.log(stats);
        res.status(200).send({
            message: "Result fetched successfuly",
            data: {
                result: {
                    amount: amount,
                    from: fromCurrency,
                    to: toCurrency,
                    result: result,
                },
                stats: {
                    mostPopularDestinationCurrency: stats.mostPopularDestinationCurrency,
                    totalAmount: stats.totalAmount,
                    totalNumberOfRequests: stats.totalNumberOfRequests,
                },
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            error: error.message || "Unable to access server with demandend request",
        });
    }
}));
app.listen(process.env.PORT, () => {
    console.log("Server is listening to port " + process.env.PORT);
});
