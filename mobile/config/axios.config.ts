import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosInstance } from "axios";

const API_URL = "http://10.11.73.91:8000/api/v1"

const commonHeaders = {
    'Content-Type': 'application/json',
};

console.log(API_URL, "API URL");


const unauthorizedAxiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: commonHeaders,
});

const authorizedAxiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        ...commonHeaders,
        Authorization: `Bearer ${AsyncStorage.getItem('accessToken')}`
    },
});

authorizedAxiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;