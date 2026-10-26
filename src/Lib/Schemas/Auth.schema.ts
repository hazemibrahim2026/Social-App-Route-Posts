import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(15, "Name must be at most 15 characters long"),
    userName: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(10, "Username must be at most 10 characters long"),
    userEmail: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    userBirthday: z
      .string()
      .nonempty("Date of Birth is required")
      .refine((date) => {
        const currentYear = new Date().getFullYear();
        const userYear = new Date(date).getFullYear();
        const age = currentYear - userYear;
        return age >= 18;
      }, "You must be at least 18 years old"),
    gender: z.string().nonempty("Gender is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    },
  );

  export const loginSchema = z
  .object({    
    userEmail: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),    
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long"),    
  });

  export const updatePasswordSchema = z
  .object({    
    currentPassword: z
      .string()
      .nonempty("Current Password is required")
      .min(6, "Current Password must be at least 6 characters long")
      .max(20, "Current Password must be at most 20 characters long"),
    newPassword: z
      .string()
      .nonempty("New Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    },
  );
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;