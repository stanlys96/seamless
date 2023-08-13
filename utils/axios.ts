import axios from "axios";

export const axiosCustom = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/coins",
});

export const fetcher = (url: string) => axiosCustom.get(url).then((res) => res);
