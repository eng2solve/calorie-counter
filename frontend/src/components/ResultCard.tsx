
type Props = {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source?: string;
};

export default function ResultCard({ dish_name, servings, calories_per_serving, total_calories, source }: Props) {
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{dish_name}</h3>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <div className="text-sm text-gray-500">Servings</div>
          <div className="font-medium">{servings}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Calories / serving</div>
          <div className="font-medium">{calories_per_serving}</div>
        </div>
        <div className="col-span-2">
          <div className="text-sm text-gray-500">Total calories</div>
          <div className="text-2xl font-bold">{total_calories}</div>
        </div>
        {source && (
          <div className="col-span-2 mt-2 text-xs text-gray-600">Source: {source}</div>
        )}
      </div>
    </div>
  );
}
