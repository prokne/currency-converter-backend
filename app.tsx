import express from "express";
const app = express();
const axios = require("axios");
require("dotenv").config();

type Currencies = { [key: string]: string }[];

type ApiError = {
  message: string;
  status: number;
};

//Generates list of currencies from currency API
const getListOfCurrencies = async (): Promise<Currencies | ApiError> => {
  try {
    const data = await axios.get(
      "https://api.apilayer.com/fixer/symbols?apikey=" + process.env.APIKEY
    );

    let listofCurrencies: { shortcut: string; name: string }[] = [];
    for (const currency in data.data.symbols) {
      listofCurrencies.push({
        shortcut: currency,
        name: data.data.symbols[currency],
      });
    }
    return listofCurrencies;
  } catch (err: any) {
    return {
      message: err.message,
      status: err.status,
    };
  }
};

app.get("/", async (req: express.Request, res: express.Response) => {
  const response = await getListOfCurrencies();
  console.log(response);
  res.send(response);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
