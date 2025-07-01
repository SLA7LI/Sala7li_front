import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";



 const loby = {


 leaveBidding : async (serviceRequestId) => {
  const url = 'http://192.168.169.173:3000/api/v1/servicerequests/leave';
  const token = await AsyncStorage.getItem('accessToken');
  const body = {
    serviceRequestId,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},
placeBid: async (serviceRequestId, money) =>{
  const url = 'http://192.168.169.173:3000/api/v1/servicerequests/placebid';
  const token = await AsyncStorage.getItem('accessToken');
  const body = {
    serviceRequestId,
    money,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


 }





export default loby;