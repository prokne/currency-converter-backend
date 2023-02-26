import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import bodyParser from "body-parser";
//import convert from "./util/convert";
import { resetStats, updateStats, readStats } from "./util/stats";

//ADD VALIDATION

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
dotenv.config();

app.get("/currencies", async (req: Request, res: Response) => {
  //Generates list of currencies from currency API
  try {
    // const data = await axios.get(
    //   "https://api.apilayer.com/fixer/symbols?apikey=" + process.env.APIKEY
    // );
    const data = await axios.get(
      "https://api.apilayer.com/currency_data/list?apikey=" + process.env.APIKEY
    );

    //Create array of currencies
    let listofCurrencies: { shortcut: string; name: string }[] = [];
    for (const currency in data.data.currencies) {
      listofCurrencies.push({
        shortcut: currency,
        name: data.data.currencies[currency],
      });
    }

    const {
      mostPopularDestinationCurrency,
      totalAmount,
      totalNumberOfRequests,
    } = await readStats();

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
  } catch (err: any) {
    console.log(err);
    res.send({ error: err.message || "Something went wrong" });
  }
});

app.post("/convert", async (req: Request, res: Response) => {
  const amount: string = req.body.amount;
  const fromCurrency: string = req.body.from;
  const toCurrency: string = req.body.to;

  //Server-side form validation
  if (+amount <= 0 || fromCurrency === toCurrency) {
    res.status(422).send({ error: "There was a validation error" });
  }

  try {
    //const result = await convert(fromCurrency, toCurrency, amount);
    const result = 21;
    await updateStats(fromCurrency, toCurrency, amount);
    const stats = await readStats();
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
  } catch (error: any) {
    console.log(error);

    res.status(400).send({
      error: error.message || "Unable to access server with demandend request",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening to port " + process.env.PORT);
});
