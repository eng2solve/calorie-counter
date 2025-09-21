import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import BgImage from "../assets/bg.jpg";

// Zod schema
const signupSchema = z.object({
  first_name: z.string().min(2, "First name required"),
  last_name: z.string().min(1, "Last name required"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[!@#$%^&*])/,
      "Password must contain at least one special character (!@#$%^&*)"
    ),
});

type FormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
  });
  const { errors } = formState;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);
      toast.success("Registered. Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm">First name</label>
            <input
              {...register("first_name")}
              className="mt-1 w-full rounded border px-3 py-2"
            />
            {errors.first_name && (
              <p className="text-xs text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Last name</label>
            <input {...register("last_name")} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.last_name && (
              <p className="text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 w-full rounded border px-3 py-2"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </div>
      </div>
    </div>
  );
}
