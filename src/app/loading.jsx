import Spinner from "./Components/Spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[40vh] w-full">
      <Spinner size="lg" />
    </div>
  );
} 