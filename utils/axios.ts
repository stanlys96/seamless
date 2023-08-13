import axios from "axios";

export const axiosCustom = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/coins",
});

export const fetcher = (url: string) => axiosCustom.get(url).then((res) => res);

export const axiosStrapi = axios.create({
  baseURL: "https://seamless-cms-production.up.railway.app",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
  },
});

export const fetcherStrapi = (url: string) =>
  axiosStrapi.get(url).then((res) => res);
