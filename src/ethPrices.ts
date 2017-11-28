import * as Moment from "moment";
import fetch from "node-fetch";

import { Currency } from "./constants";

export const ethPrices = async (startDate: string, currency: Currency) => {
    console.log(`getting prices from Kraken starting from: ${startDate} in ${currency}`);
    const startDateParsed = Moment(startDate);
    const currencySymbol = currency === Currency.USD ? "XETHZUSD" : "XETHZEUR";
    const url = `https://api.kraken.com/0/public/OHLC?pair=${currencySymbol}&since=${startDateParsed.unix()}&interval=1440`;
    return fetch(url)
        .then((res) => res.json())
        .then((res) => {
            const pricesRaw = res.result[currencySymbol];
            const prices = pricesRaw.map(
                (price: any) => {
                    return {
                        date: Moment.unix(price[0]).format("YYYY-MM-DD"),
                        price: parseFloat(price[5]),
                    };
                }).reduce((acc: any, v: any) => {
                    acc[v.date] = v.price;
                    return acc;
                },
                {});

            // console.log(prices);
            return prices;
        });
};
