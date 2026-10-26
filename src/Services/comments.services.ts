import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function getPostComments(postId: string) {
  const data = await axios.get(
    `${baseURL}/posts/${postId}/comments`,

    {
      params: { _t: Date.now() },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function updateComment(
  postId: string,
  commentId: string,
  content: string,
) {
  const formData = new FormData();
  formData.append("content", content);

  return axios.put(
    `${baseURL}/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

export async function deleteComment(postId: string, commentId: string) {
  return axios.delete(`${baseURL}/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export async function createPostComment(postId: string, formData:FormData) {
  const data = await axios.post(
    `${baseURL}/posts/${postId}/comments`,

    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

export async function toggleCommentLike(postId: string, commentId: string) {
  return axios.put(
    `${baseURL}/posts/${postId}/comments/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

// Not listed in the API docs; the likes modal shows an error if the server rejects it
export async function getCommentLikes(postId: string, commentId: string) {
  return axios.get(
    `${baseURL}/posts/${postId}/comments/${commentId}/likes?page=1&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

export async function getCommentReplies(postId: string, commentId: string) {
  const data = await axios.get(`${baseURL}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
  return data;
}

export async function createCommentReply(postId: string, commentId: string, formData:FormData) {
  const data = await axios.post(
    `${baseURL}/posts/${postId}/comments/${commentId}/replies`,

    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}