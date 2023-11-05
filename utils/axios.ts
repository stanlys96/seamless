import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export const axiosCustom = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_CUSTOM,
});

export const axiosSecondary = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_SECONDARY,
});

export const fetcher = (url: string) => axiosCustom.get(url).then((res) => res);

export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AXIOS_API,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_STRAPI_TOKEN,
  },
});

export const fetcherFlip = (url: string) =>
  axiosSecondary.get(url).then((res) => res);

export const fetcherStrapi = (url: string) =>
  axiosApi.get(url).then((res) => res);

axiosSecondary.interceptors.request.use((requestConfig: any) => {
  (requestConfig.headers as AxiosRequestHeaders)["Authorization"] =
    process.env.NEXT_PUBLIC_FLIP_AUTH;

  return requestConfig;
});
