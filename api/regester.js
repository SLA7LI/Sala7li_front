import axios from "axios";


export async function registerAsWorker(data) {
  const url = "http://127.0.0.1:3000/api/v1/auth/registerasworker";

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    // Gérer l'erreur ici (par exemple, retourner l'erreur ou l'afficher)
    throw error;
  }
}

export async function registerAsClient(data) {
  const url = "http://127.0.0.1:3000/api/v1/auth/registerasclient";
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    // Gérer l'erreur ici (par exemple, retourner l'erreur ou l'afficher)
    throw error;
  }
}