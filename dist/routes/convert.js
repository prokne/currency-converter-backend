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
const convert_1 = __importDefault(require("../util/convert"));
const stats_1 = require("../util/stats");
exports.router = express_1.default.Router();
//Handles /convert post request
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = req.body.amount;
    const fromCurrency = req.body.from;
    const toCurrency = req.body.to;
    //Server-side form validation
    if (isNaN(amount)) {
        res.status(422).send({ error: "There was a validation error" });
        return;
    }
    if (+amount <= 0 || fromCurrency === toCurrency) {
        res.status(422).send({ error: "There was a validation error" });
        return;
    }
    try {
        const result = yield (0, convert_1.default)(fromCurrency, toCurrency, amount);
        //Update stats with recieved values
        yield (0, stats_1.updateStats)(fromCurrency, toCurrency, amount);
        //Get updated stats object
        const stats = yield (0, stats_1.readStats)();
        //sends result of conversion and updatet statistics to frontend
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
                    mostPopularDestinationCurrencies: stats.mostPopularDestinationCurrencies,
                    totalAmount: stats.totalAmount,
                    totalNumberOfRequests: stats.totalNumberOfRequests,
                },
            },
        });
        //Error handling
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            error: error.message || "Unable to access server with demandend request",
        });
    }
}));
