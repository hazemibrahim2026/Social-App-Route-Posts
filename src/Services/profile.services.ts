import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getMyBookmarks() {
  return axios.get(`${baseURL}/users/bookmarks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function getMyProfile() {
  const data = await axios.get(
    `${baseURL}/users/profile-data`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function getUserPosts(postId: string) {
  const data = await axios.get(
    `${baseURL}/users/${postId}/posts`,

    {
      headers: {        
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function getUserProfile(userId: string) {
  return axios.get(`${baseURL}/users/${userId}/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function followUser(userId: string) {
  return axios.put(`${baseURL}/users/${userId}/follow`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}