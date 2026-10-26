// Calling api for authentication
import axios from "axios";
import type {
  RegisterSchemaType,
  LoginSchemaType,
  UpdatePasswordSchemaType,
} from "../Lib/Schemas/Auth.schema";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function registerUser(formData: RegisterSchemaType) {
  const payload = {
    name: formData.name,
    email: formData.userEmail,
    password: formData.password,
    rePassword: formData.confirmPassword,
    dateOfBirth: formData.userBirthday,
    gender: formData.gender,
  };

  const data = await axios.post(`${baseURL}/users/signup`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function loginUser(formData: LoginSchemaType) {
  const payload = {
    email: formData.userEmail,
    password: formData.password,
  };

  const data = await axios.post(`${baseURL}/users/signin`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function updatePassword(formData: UpdatePasswordSchemaType) {
  const payload = {
    password: formData.currentPassword,
    newPassword: formData.newPassword,
  };

  const data = await axios.patch(`${baseURL}/users/change-password`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

  return data;
}
