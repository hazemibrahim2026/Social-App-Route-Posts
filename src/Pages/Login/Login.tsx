import { Input, Button, TextField, FieldError, Spinner } from "@heroui/react";
import { loginUser } from "../../Services/auth.services";

import { useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginSchemaType,
} from "../../Lib/Schemas/Auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext } from "react";
import { TokenContext } from "../../Components/Context/tokenContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { KeyRound, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const tokenContext = useContext(TokenContext);
  if (!tokenContext) {
    throw new Error("Login must be used within a TokenProvider");
  }
  const { setToken } = tokenContext;
  const {
    register,

    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userEmail: "",
      password: "",
    },
  });
  async function submitData(values: LoginSchemaType) {
    try {
      const response = await loginUser(values);
      console.log(response);
      const token = response.data.data.token;
      localStorage.setItem("userToken", token);
      setToken(token);

      toast.success(response.data.message);
      navigate("/feed");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message);
        // setErrorMessage(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message);
      }
    }
  }

  return (
    <>
    <title>Sign In | Route Posts</title>
      <div className="rounded-2xl bg-white p-4 sm:p-6">
        <div className="mb-4 text-center lg:hidden">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Route Posts
          </h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-700">
            Connect with friends and the world around you on Route Posts.
          </p>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <Link
            to="/auth/login"
            aria-current="page"
            className="rounded-lg cursor-pointer py-2 text-center text-sm font-extrabold transition bg-white text-primary shadow-sm"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="rounded-lg cursor-pointer py-2 text-center text-sm font-extrabold transition text-slate-600 hover:text-slate-800"
          >
            Register
          </Link>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Log in to Route Posts
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Log in and continue your social journey.
        </p>

        <form className="mt-5 space-y-3.5" onSubmit={handleSubmit(submitData)}>
          <TextField
            className="relative w-full"
            isInvalid={Boolean(errors.userEmail)}
            aria-label="userEmail"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={18} />
            </span>
            <Input
              {...register("userEmail")}
              aria-label="userEmail"
              type="email"
              autoComplete="email"
              className="input input--primary w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="Email Address"
            />
            <FieldError>{errors.userEmail?.message}</FieldError>
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
              className="input input--primary w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
              placeholder="Password"
            />
            <FieldError>{errors.password?.message}</FieldError>
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
              "Log In"
            )}
          </Button>
          <button
            type="button"
            className="mx-auto block text-sm font-semibold cursor-pointer text-primary transition hover:underline"
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </>
  );
}
