import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getUserFeed () {
  

  const {data} = await axios.get(
    `${baseURL}/posts?limit=30`,
    
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
      },
    },
  );

  return data;
}
export async function getPostComments(postId: string) {
  const data = await axios.get(`${baseURL}/posts/${postId}/comments`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

  return data;
}

export async function addComment(postId: string, content: string, image?: File | null) {
  // Multipart is required when an image is attached
  const formData = new FormData();
  if (content) formData.append("content", content);
  if (image) formData.append("image", image);

  const data = await axios.post(`${baseURL}/posts/${postId}/comments`, formData, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

  return data;
}

export async function getFollowSuggestions(limit = 5) {
  const {data} = await axios.get(`${baseURL}/users/suggestions?limit=${limit}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("userToken")}`
    }
  });
  return data;
}

export async function followUser(userId: string) {
  const data = await axios.put(`${baseURL}/users/${userId}/follow`, {}, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("userToken")}`
    }
  });
  return data;
}