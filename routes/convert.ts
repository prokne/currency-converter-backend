import express, { Request, Response } from "express";

import { readStats, updateStats } from "../util/stats";

export const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const amount: number = req.body.amount;
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
          mostPopularDestinationCurrencies:
            stats.mostPopularDestinationCurrencies,
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
