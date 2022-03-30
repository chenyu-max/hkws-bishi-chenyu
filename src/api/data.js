import axios from './axios';

export default {
    getTreeData() {
        return axios.post('http://preview.shamiao.xyz/api/v1/exam/1/getAreaData');
    },
    getMonitorData(params) {
        return axios.post('http://preview.shamiao.xyz/api/v1/exam/1/getMonitorByAreaId', params);
    }
};
