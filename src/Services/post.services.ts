import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getSinglePost (postId: string) {
  

  const data = await axios.get(
    `${baseURL}/posts/${postId}`,
    
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
      },
    },
  );

  return data;
}

export async function createPost(formData:FormData) {
  const data = await axios.post(
    `${baseURL}/posts`,

    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function updatePost(postId: string, formData:FormData) {
  const data = await axios.put(
    `${baseURL}/posts/${postId}`,

    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function toggleBookmark(postId: string) {
  return axios.put(
    `${baseURL}/posts/${postId}/bookmark`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

export async function togglePostLike(postId: string) {
  return axios.put(
    `${baseURL}/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

export async function getPostLikes(postId: string) {
  return axios.get(`${baseURL}/posts/${postId}/likes?page=1&limit=50`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function deletePost(postId: string) {
  const data = await axios.delete(
    `${baseURL}/posts/${postId}`,

    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function getUserPosts(userId: string) {
  return axios.get(`${baseURL}/users/${userId}/posts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}