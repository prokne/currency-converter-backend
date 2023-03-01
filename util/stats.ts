import fs from "fs/promises";
import { StatsData } from "../types/types";
import convert from "./convert";

//Returns object of statistics saved in json object
export async function readStats(): Promise<
  { mostPopularDestinationCurrencies: string[] } & StatsData
> {
  //Read statistics from json object
  const data = await fs.readFile("stats.json", "utf-8");
  const stats: StatsData = JSON.parse(data);

  //Helper variables for building most popular destination currencies array
  let mostPopularDestinationCurrencies: string[] = [];
  let numOfRequests = 0;

  //If there is at least 1 currency in destinationCurrencies recieved from json object
  //Sort destination currencies array recieved from json object in descending order by number of requests
  if (stats.destinationCurrencies.length > 0) {
    const sortedMostPopDestCurrencies = stats.destinationCurrencies.sort(
      (a, b) => b.numOfRequests - a.numOfRequests
    );

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
  } else {
    mostPopularDestinationCurrencies = [" - "];
  }

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
  const amounttoUSD = await convert(fromCurrency, "USD", amount);

  //If destination currencies array already has requested destination currency, increase number of requests by 1,
  //otherwise add this destination currency into the destination currencies array
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

  //Increase total num of requests by 1 and add requested amount in USD to total converted amount stat
  const updatedNumOfReq = totalNumberOfRequests + 1;
  const updatedTotalAmount = totalAmount + amounttoUSD;

  //Write updated statistics into json object
  const data = JSON.stringify({
    destinationCurrencies: destinationCurrencies,
    totalAmount: updatedTotalAmount,
    totalNumberOfRequests: updatedNumOfReq,
  });

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
