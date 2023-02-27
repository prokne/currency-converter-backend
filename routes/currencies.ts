import express, { Request, Response } from "express";
import axios from "axios";
import { readStats } from "../util/stats";

export const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
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
      mostPopularDestinationCurrencies,
      totalAmount,
      totalNumberOfRequests,
    } = await readStats();

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
  } catch (err: any) {
    console.log(err);
    res.send({ error: err.message || "Something went wrong" });
  }
});
