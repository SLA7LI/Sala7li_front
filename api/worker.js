import axios from "axios";

const api_key = 'http://172.20.10.9:3000/api/v1/auth';

const manage_worker = {


    getWorkerRequests: async () => {
        try {
        const response = await axios.get(`${api_key}/getworkers`);
        return response.data;
        } catch (error) {
        throw error;
        }
    },
    
  


}

export default manage_worker;