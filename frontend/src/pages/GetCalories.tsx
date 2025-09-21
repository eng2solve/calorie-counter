import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";
import ResultCard from "../components/ResultCard";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import BgImage from "../assets/bg.jpg";

type FormValues = {
  dish_name: string;
  servings: number;
};

type Result = {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source?: string;
};

export default function GetCalories() {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({ defaultValues: { servings: 1 }});
  const { errors } = formState;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    if (data.servings <= 0) {
      toast.error("Servings must be > 0");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/get-calories", data);
      // expected response shape: { dish_name, servings, calories_per_serving, total_calories, source }
      setResult(res.data);
      toast.success("Calories fetched");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Error fetching calories");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-cover bg-center" 
    style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-3 bg-white dark:bg-gray-800 p-2 rounded shadow">
          <h1 className="text-2xl font-semibold">Meal Calorie Lookup</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-700 text-white"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
          <div>
            <label className="block text-sm">Dish name</label>
            <input {...register("dish_name", { required: "Please enter the dish name" })} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.dish_name && <p className="text-xs text-red-500">{errors.dish_name.message}</p>} 
          </div>
          <div>
            <label className="block text-sm">Servings</label>
            <input {...register("servings", { valueAsNumber: true, required: true, min: 1 })} type="number" className="mt-1 w-32 rounded border px-3 py-2" />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? <span className="flex items-center gap-2"><Spinner size={1.2} /> Loading...</span> : "Get calories"}
            </button>
            <button type="button" className="px-2 py-1 bg-gray-700 text-white rounded" onClick={() => { reset({ dish_name: "", servings: 1 }); setResult(null); }}>
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4">
  <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
    {loading ? (
      <Spinner size={2} />
    ) : result ? (
      <ResultCard {...result} />
    ) : (
      <p className="text-gray-500 dark:text-gray-300">
        Enter a dish and click "Get calories" to see results
      </p>
    )}
  </div>
</div>
      </div>
    </div>
  );
}
