import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getNotifications() {
  return axios.get(`${baseURL}/notifications?unread=true&page=1&limit=10`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}
