import { KeyRound } from "lucide-react";
import { TextField, Input, FieldError, Button, Spinner } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePasswordSchema,
  type UpdatePasswordSchemaType,
} from "../../Lib/Schemas/Auth.schema";
import { useForm } from "react-hook-form";
import { updatePassword } from "../../Services/auth.services";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../../Components/Context/tokenContext";

export default function UpdatePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UpdatePasswordSchemaType>({
    mode: "all",
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const { setToken } = useAuth();
  async function submitData(values: UpdatePasswordSchemaType) {
    try {
      const response = await updatePassword(values);
      toast.success(response.data.message);
      localStorage.removeItem("userToken");
      setToken(null);
      navigate("/auth/login", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Failed to update password";
        console.error(message);
        toast.error(message);
      } else {
        console.error(error);
        toast.error("An unexpected error occurred while updating the password");
      }
    }
  }

  return (
    <>
    <title>Change Password | Route Posts</title>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-2xl">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                  <KeyRound size={18} />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Change Password
                  </h1>
                  <p className="text-sm text-slate-500">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit(submitData)}>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Current Password
                </label>
                <TextField
                  className="relative w-full"
                  isInvalid={Boolean(errors.currentPassword)}
                  aria-label="password"
                >
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound size={18} />
                  </span>
                  <Input
                    {...register("currentPassword")}
                    aria-label="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
                    placeholder="Enter Current Password"
                  />
                  <FieldError>{errors.currentPassword?.message}</FieldError>
                </TextField>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  New Password
                </label>
                <TextField
                  className="relative w-full"
                  isInvalid={Boolean(errors.newPassword)}
                  aria-label="password"
                >
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound size={18} />
                  </span>
                  <Input
                    {...register("newPassword")}
                    aria-label="newPassword"
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
                    placeholder="Enter New Password"
                  />
                  <FieldError>{errors.newPassword?.message}</FieldError>
                </TextField>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Confirm New Password
                </label>
                <TextField
                  className="relative w-full"
                  isInvalid={Boolean(errors.confirmPassword)}
                  aria-label="password"
                >
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound size={18} />
                  </span>
                  <Input
                    {...register("confirmPassword")}
                    aria-label="confirmPassword"
                    type="password"
                    autoComplete="confirm-password"
                    className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-primary"
                    placeholder="Confirm New Password"
                  />
                  <FieldError>{errors.confirmPassword?.message}</FieldError>
                </TextField>
                <div
                  className={`w-full ${!isValid || isSubmitting ? "cursor-not-allowed" : ""}`}
                >
                  <Button
                    type="submit"
                    isDisabled={!isValid || isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5]"
                  >
                    {isSubmitting ? (
                      <span className="flex gap-2">
                        <Spinner className="text-white" />
                        <span>Updating...</span>
                      </span>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
