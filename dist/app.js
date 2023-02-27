"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
//import convert from "./util/convert";
const currencies_1 = require("./routes/currencies");
const convert_1 = require("./routes/convert");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
dotenv_1.default.config();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use("/currencies", currencies_1.router);
app.use("/convert", convert_1.router);
app.listen(process.env.PORT, () => {
    console.log("Server is listening to port " + process.env.PORT);
});
