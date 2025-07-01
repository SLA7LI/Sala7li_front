import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export async function getWorkerServiceRequests() {
  const url = "http://192.168.169.173:3000/api/v1/servicerequests/worker";
  const token = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(url, {
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