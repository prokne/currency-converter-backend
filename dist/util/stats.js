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
const convert_1 = __importDefault(require("./convert"));
//Returns object of statistics saved in json object
function readStats() {
    return __awaiter(this, void 0, void 0, function* () {
        //Read statistics from json object
        const data = yield promises_1.default.readFile("stats.json", "utf-8");
        const stats = JSON.parse(data);
        //Helper variables for building most popular destination currencies array
        let mostPopularDestinationCurrencies = [];
        let numOfRequests = 0;
        //If there is at least 1 currency in destinationCurrencies recieved from json object
        //Sort destination currencies array recieved from json object in descending order by number of requests
        if (stats.destinationCurrencies.length > 0) {
            const sortedMostPopDestCurrencies = stats.destinationCurrencies.sort((a, b) => b.numOfRequests - a.numOfRequests);
            //From the sorted array keep only the destination currency, which has the biggest number of requests (The
            //destination currency with the biggest number of request is under index 0 in the sorted array) and push it into the new array
            //of most popular destination currencies. If there are multiple destination currencies which has the biggest number
            //of requests, push all of them into the new array.
            numOfRequests = sortedMostPopDestCurrencies[0].numOfRequests;
            sortedMostPopDestCurrencies.forEach((currency) => {
                if (currency.numOfRequests === numOfRequests) {
                    mostPopularDestinationCurrencies.push(currency.shortcut);
                }
            });
            //If the destinationCurrencies array is empty, mostPopularDestinationCurrencies contains array with dash
        }
        else {
            mostPopularDestinationCurrencies = [" - "];
        }
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
        const amounttoUSD = yield (0, convert_1.default)(fromCurrency, "USD", amount);
        //If destination currencies array already has requested destination currency, increase number of requests by 1,
        //otherwise add this destination currency into the destination currencies array
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
        //Increase total num of requests by 1 and add requested amount in USD to total converted amount stat
        const updatedNumOfReq = totalNumberOfRequests + 1;
        const updatedTotalAmount = totalAmount + amounttoUSD;
        //Write updated statistics into json object
        const data = JSON.stringify({
            destinationCurrencies: destinationCurrencies,
            totalAmount: updatedTotalAmount,
            totalNumberOfRequests: updatedNumOfReq,
        });
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
