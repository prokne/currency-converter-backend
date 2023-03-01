import axios from "axios";

//Function that converts requested amount to destination currency from inital currency.
async function convert(
  fromCurrency: string,
  destinationCurrency: string,
  amount: number
): Promise<number> {
  const data = await axios.get(
    `https://api.apilayer.com/currency_data/convert?to=${destinationCurrency}&from=${fromCurrency}&amount=${amount}&apikey=${process.env.APIKEY}`
  );

  return data.data.result;
}

export default convert;
