import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api_key = 'http://192.168.169.173:3000/api/v1/';

const Service_client = {
  getServiceRequestsClient: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${api_key}servicerequests/client`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createServiceRequest: async (data) => {
    try {
      console.log("Creating service request with data:", data);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        `http://192.168.169.173:3000/api/v1/servicerequests/create`,
        data
,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating service request:", error);
      throw error;
    }
  }
};

export default Service_client;



