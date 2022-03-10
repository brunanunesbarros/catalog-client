import axios from 'axios'
import { parseCookies } from 'nookies';

let cookies = parseCookies(null);

export const api = axios.create({
  baseURL: process.env.HOST_API,
  headers: {
    Authorization: `Bearer ${cookies['catalog-client']}`
  }
})
