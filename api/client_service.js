import axios from "axios";

const api_key = 'http://192.168.169.76:3000/api/v1/'


const Service_client = {

getServiceRequestsClient : async ()=> {


  try {
    const response = await axios.get(`${api_key}servicerequests/client`, {  headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaG9jaW5lYUBleGFtcGxlLmNvbSIsImlhdCI6MTc1MTMxNDM4NiwiZXhwIjoxNzUxMzUwMzg2fQ.FagsMzUjhmTcFidu7GDE58yD8KbAKzKZok7RT9J5GFI`,
      },});
    return response.data; 
  } catch (error) {

    throw error;
  }
  },
  createServiceRequest :  async (data) =>{
    /*
    
    {
  "category": "Plumber",
  "description": "Water is leaking under the kitchen sink. Needs urgent repair.",
  "status": "open",
  "budget": 5000,
  "urgency": "urgent",
  "longitude": 3.0588,
  "latitude": 36.7538
}

    */

  try {
    const response = await axios.post(`${api_key}/servicerequests/create`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}


}

export default Service_client;



