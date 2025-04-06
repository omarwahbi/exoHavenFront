import Spinner from "./Components/Spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[40vh] w-full">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
      </div>
    </div>
  );
} 