import Axios from 'axios';
// import { API_DOMAIN } from '@repo/helper';

const baseURL = (import.meta.env.VITE_API_URL ?? '') + '/api/v1';
export const axios = Axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});