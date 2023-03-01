import express, { Request, Response } from "express";
import axios from "axios";
import { readStats } from "../util/stats";

export const router = express.Router();

//Handles /currencies get request
router.get("/", async (req: Request, res: Response) => {
  //Generates list of available currencies from currency API
  try {
    const data = await axios.get(
      "https://api.apilayer.com/currency_data/list?apikey=" + process.env.APIKEY
    );

    //Create array of currencies
    let listofCurrencies: { shortcut: string; name: string }[] = [];

    //Transforms recieved currencies object into array of currency objects, so every currency has its own object, which has
    //shortcut property and name property
    //e.g. [{"EUR", "Euro"}, ...]
    for (const currency in data.data.currencies) {
      listofCurrencies.push({
        shortcut: currency,
        name: data.data.currencies[currency],
      });
    }

    //Get needed statistics
    const {
      mostPopularDestinationCurrencies,
      totalAmount,
      totalNumberOfRequests,
    } = await readStats();

    //Create object of statistics, which will be send to frontend
    const statsData = {
      mostPopularDestinationCurrencies,
      totalAmount,
      totalNumberOfRequests,
    };

    //Send available currencies array and statistics object to frontend
    res.status(200).send({
      message: "List of currencies and stats fetched successfuly",
      data: {
        currencies: listofCurrencies,
        stats: statsData,
      },
    });
    //Error handling
  } catch (err: any) {
    console.log(err);
    res.send({ error: err.message || "Something went wrong" });
  }
});
