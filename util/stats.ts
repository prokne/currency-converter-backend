import fs from "fs/promises";
import { StatsData } from "../types/types";
import convert from "./convert";

export async function readStats(): Promise<
  { mostPopularDestinationCurrencies: string[] } & StatsData
> {
  const data = await fs.readFile("stats.json", "utf-8");
  const stats: StatsData = JSON.parse(data);

  let mostPopularDestinationCurrencies: string[] = [];
  let numOfRequests = 0;

  //Sort destination currencies array in descending order by number of requests
  const sortedMostPopDestCurrencies = stats.destinationCurrencies.sort(
    (a, b) => b.numOfRequests - a.numOfRequests
  );

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
}

//Function that updates all stats based on recieved input
export async function updateStats(
  fromCurrency: string,
  destinationCurrency: string,
  amount: number
) {
  const { totalAmount, totalNumberOfRequests, destinationCurrencies } =
    await readStats();

  //Convert requested amount to USD
  // const amounttoUSD = await convert(fromCurrency, "USD", amount);
  const amounttoUSD = 25;

  //If destination currencies array already has requested destination currency, update number of requests,
  //otherwise add this destination currency to the destination currencies array
  const existingDestCurrency = destinationCurrencies.find(
    (currency) => currency.shortcut === destinationCurrency
  );

  if (existingDestCurrency) {
    const index = destinationCurrencies.indexOf(existingDestCurrency);
    existingDestCurrency.numOfRequests++;
    destinationCurrencies[index] = existingDestCurrency;
  } else {
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

  await fs.writeFile("stats.json", data);
}

//resets the stats.json file
export async function resetStats() {
  const data = JSON.stringify({
    destinationCurrencies: [],
    totalAmount: 0,
    totalNumberOfRequests: 0,
  });

  await fs.writeFile("stats.json", data);
}
