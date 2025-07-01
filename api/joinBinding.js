import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export async function joinBidding(serviceRequestId) {
  const url = "http://192.168.169.173:3000/api/v1/servicerequests/joinbidding";
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
}