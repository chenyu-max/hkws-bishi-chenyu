import axios from 'axios';

// 创建一个axios拦截器
const instance = axios.create();

// 创建相应拦截 获得响应时 进行判断
// 如果是正常的信息 则返回 data
// 如果是错误的信息 则返回后台发送的错误信息 msg
instance.interceptors.response.use((response) => {
    if (response.data.code !== '200') {
        return Promise.reject(response.data.msg);
    }
    return response.data.data;
}, (error) => Promise.reject(error));

export default instance;
