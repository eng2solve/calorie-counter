import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import BgImage from "../assets/bg.jpg";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const { errors } = formState;
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      // expected: { token: "...", user: {...} }
      const token = res.data.token ?? res.data.access_token ?? null;
      const user = res.data.user ?? null;
      if (!token) {
        toast.error("Login failed: no token returned");
        return;
      }
      setToken(token);
      setUser(user);
      toast.success("Logged in");
      navigate("/get-calories");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail ?? "Login failed invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
     style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              {...register("email", { required: "Email required" })}
              className="mt-1 w-full rounded border px-3 py-2"
              type="email"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              {...register("password", { required: "Password required" })}
              className="mt-1 w-full rounded border px-3 py-2"
              type="password"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
