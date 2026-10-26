import {
  Input,
  Button,
  TextField,
  FieldError,
  Spinner,
  Alert,
} from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import { registerUser } from "../../Services/auth.services";

import { Controller, useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../../Lib/Schemas/Auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { AtSign, Calendar, KeyRound, User, Users } from "lucide-react";

export default function Register() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      userName: "",
      userEmail: "",
      gender: "",
      userBirthday: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function submitData(values: RegisterSchemaType) {
    
    try {
      const response = await registerUser(values);
      console.log(response);
      console.log(response.data.message);
      setSuccessMessage(response.data.message);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message);
        setErrorMessage(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message);
      }
    }
  }

  return (
    <>
    <title>Create Account | Route Posts</title>
      <div className="rounded-2xl bg-white p-4 sm:p-6">
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <Link
            to="/auth/login"
            className="rounded-lg cursor-pointer py-2 text-center text-sm font-extrabold transition text-slate-600 hover:text-slate-800"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            aria-current="page"
            className="rounded-lg cursor-pointer py-2 text-center text-sm font-extrabold transition bg-white text-primary shadow-sm"
          >
            Register
          </Link>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Create a new account
        </h2>
        <p className="mt-1 text-sm text-slate-500">It is quick and easy.</p>
        {successMessage && (
          <>
            <Alert status="success" className="bg-green-500">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Profile updated successfully</Alert.Title>
              </Alert.Content>
            </Alert>
          </>
        )}
        {errorMessage && (
          <>
            <Alert status="danger" className="bg-red-500">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{errorMessage}</Alert.Title>
              </Alert.Content>
            </Alert>
          </>
        )}
        <form className="mt-5 space-y-3.5" onSubmit={handleSubmit(submitData)}>
          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.name)}
            aria-label="fullName"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <User size={18} /></span>
            <Input
              {...register("name")}
              aria-label="fullName"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="Full Name"
            />
            <FieldError>{errors.name?.message}</FieldError>
          </TextField>
          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.userName)}
            aria-label="userName"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <AtSign size={18} /></span>
            <Input
              {...register("userName")}
              aria-label="userName"
              autoComplete="username"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="User Name"
            />
            <FieldError>{errors.userName?.message}</FieldError>
          </TextField>
          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.userEmail)}
            aria-label="userEmail"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <AtSign size={18} /></span>
            <Input
              {...register("userEmail")}
              aria-label="userEmail"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="Email Address"
            />
            <FieldError>{errors.userEmail?.message}</FieldError>
          </TextField>
          
          <Controller
            name={"gender" as any}
            control={control}
            render={({ field }) => (
              
              <Select
                {...field}
                className="relative w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
                placeholder="Select Gender"
                aria-label="gender"
              >
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Users size={18} />
                </span>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="male" textValue="Male">
                      Male
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="female" textValue="Female">
                      Female
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />

          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.userBirthday)}
            aria-label="userBirthday"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar size={18} />
            </span>
            <Input
              {...register("userBirthday")}
              aria-label="userBirthday"
              type="date"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
            />
            <FieldError>{errors.userBirthday?.message}</FieldError>
          </TextField>
          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.password)}
            aria-label="password"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <KeyRound size={18} />
            </span>
            <Input
              {...register("password")}
              aria-label="password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="Password"
            />
            <FieldError>{errors.password?.message}</FieldError>
          </TextField>
          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.confirmPassword)}
            aria-label="confirmPassword"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <KeyRound size={18} />
            </span>
            <Input
              {...register("confirmPassword")}
              aria-label="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="Confirm Password"
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </TextField>
          <Button
            type="submit"
            className="w-full rounded-xl py-6 text-base font-extrabold text-white transition disabled:opacity-60 bg-primary hover:bg-[#001f6b]"
          >
            {isSubmitting ? (
              <span className="flex gap-2">
                <Spinner className="text-white" />
                <p>Loading...</p>
              </span>
            ) : (
              "Create New Account"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
