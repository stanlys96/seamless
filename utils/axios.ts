import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export const axiosCustom = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_CUSTOM,
});

export const axiosFlip = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_SECONDARY,
});

export const fetcher = (url: string) => axiosCustom.get(url).then((res) => res);

export const axiosStrapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_API,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_STRAPI_TOKEN,
  },
});

export const fetcherFlip = (url: string) =>
  axiosFlip.get(url).then((res) => res);

export const fetcherStrapi = (url: string) =>
  axiosStrapi.get(url).then((res) => res);

axiosFlip.interceptors.request.use((requestConfig: any) => {
  (requestConfig.headers as AxiosRequestHeaders)["Authorization"] =
    process.env.NEXT_PUBLIC_FLIP_AUTH;

  return requestConfig;
});
