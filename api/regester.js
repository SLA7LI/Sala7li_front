import axios from "axios";


export async function registerAsWorker(data) {
  const url = "http://192.168.169.173:3000/api/v1/auth/registerasworker";

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {

    throw error;
  }
}

export async function registerAsClient(data) {
  const url = "http://192.168.169.173:3000/api/v1/auth/registerasclient";
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {

    throw error;
  }
}