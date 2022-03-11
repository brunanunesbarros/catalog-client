import axios from 'axios'
import { parseCookies } from 'nookies';

let cookies = parseCookies(null);

export const api = axios.create({
  baseURL: process.env.HOST_API,
  headers: {
    Authorization: `Bearer ${cookies['catalog-client']}`
  }
})

api.interceptors.request.use((request) => {
  let cookies = parseCookies(null);

  if (request.headers) {
    request.headers.Authorization = `Bearer ${cookies['catalog-client']}`
  } else {
    request.headers = {
      Authorization: `Bearer ${cookies['catalog-client']}`
    }
  }

  return new Promise((resolve, reject) => {
    resolve(request);
  })
})
