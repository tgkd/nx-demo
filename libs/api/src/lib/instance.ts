import Axios from 'axios';

export const Api = Axios.create({
  baseURL: 'http://localhost:3003',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
