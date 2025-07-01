import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export async function inviteWorkerToServiceRequest(serviceRequestId, workerId) {
  const url = "http://127.0.0.1:3000/api/v1/servicerequests/invite";
  const token = await AsyncStorage.getItem('accessToken');
  const body = {
    serviceRequestId,
    workerId,
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