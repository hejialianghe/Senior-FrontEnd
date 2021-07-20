import axios from 'axios'

const req = axios.create({
  baseURL:'http://localhost:3003/api',
});

req.interceptors.response.use(function (response) {
  return response.data;
});

// 请求首页
export const fetchHome = () => req.get('/home')
// 请求用户信息
export const fetchUser = () => req.get('/user')