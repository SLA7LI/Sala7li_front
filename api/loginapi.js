import axios from "axios";


export async function login(email, password) {
  const url = "http://127.0.0.1:3000/api/v1/auth/login";
  const body = {
    email,
    password,
  };

  try {
    const response = await axios.post(url, body);
    return response.data; 
  } catch (error) {

    throw error;
  }
}