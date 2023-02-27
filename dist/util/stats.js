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
exports.resetStats = exports.updateStats = exports.readStats = void 0;
const promises_1 = __importDefault(require("fs/promises"));
function readStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield promises_1.default.readFile("stats.json", "utf-8");
        const stats = JSON.parse(data);
        let mostPopularDestinationCurrencies = [];
        let numOfRequests = 0;
        //Sort destination currencies array in descending order by number of requests
        const sortedMostPopDestCurrencies = stats.destinationCurrencies.sort((a, b) => b.numOfRequests - a.numOfRequests);
        //Keep only destination currency, which has the biggest number of requests (or multiple
        //destination currencies, if there are such with the same biggest number) and store it in a new array
        numOfRequests = sortedMostPopDestCurrencies[0].numOfRequests;
        sortedMostPopDestCurrencies.forEach((currency) => {
            if (currency.numOfRequests === numOfRequests) {
                mostPopularDestinationCurrencies.push(currency.shortcut);
            }
        });
        return {
            mostPopularDestinationCurrencies,
            destinationCurrencies: stats.destinationCurrencies,
            totalAmount: stats.totalAmount,
            totalNumberOfRequests: stats.totalNumberOfRequests,
        };
    });
}
exports.readStats = readStats;
//Function that updates all stats based on recieved input
function updateStats(fromCurrency, destinationCurrency, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const { totalAmount, totalNumberOfRequests, destinationCurrencies } = yield readStats();
        //Convert requested amount to USD
        // const amounttoUSD = await convert(fromCurrency, "USD", amount);
        const amounttoUSD = 25;
        //If destination currencies array already has requested destination currency, update number of requests,
        //otherwise add this destination currency to the destination currencies array
        const existingDestCurrency = destinationCurrencies.find((currency) => currency.shortcut === destinationCurrency);
        if (existingDestCurrency) {
            const index = destinationCurrencies.indexOf(existingDestCurrency);
            existingDestCurrency.numOfRequests++;
            destinationCurrencies[index] = existingDestCurrency;
        }
        else {
            destinationCurrencies.push({
                shortcut: destinationCurrency,
                numOfRequests: 1,
            });
        }
        //Increase total num of requests by 1 and add requested amount in USD to total converted amount stat.
        const updatedNumOfReq = totalNumberOfRequests + 1;
        const updatedTotalAmount = totalAmount + amounttoUSD;
        const data = JSON.stringify({
            destinationCurrencies: destinationCurrencies,
            totalAmount: updatedTotalAmount,
            totalNumberOfRequests: updatedNumOfReq,
        });
        console.log(data);
        yield promises_1.default.writeFile("stats.json", data);
    });
}
exports.updateStats = updateStats;
//resets the stats.json file
function resetStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.stringify({
            destinationCurrencies: [],
            totalAmount: 0,
            totalNumberOfRequests: 0,
        });
        yield promises_1.default.writeFile("stats.json", data);
    });
}
exports.resetStats = resetStats;
