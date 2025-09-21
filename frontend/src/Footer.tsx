
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-center shadow-inner">
      © {new Date().getFullYear()} Calorie Counter All rights reserved.
    </footer>
  );
}
