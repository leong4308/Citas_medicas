import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("¡Hola desde React!");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">{message}</h1>
      </div>
    </main>
  );
}
