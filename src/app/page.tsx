"use client"

import { useEffect, useState } from "react";
import TodoList from "./components/todos";
import Login from "./components/login";

export default function Home() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setLoading(false);
  }, []);
  
  return (
    <div>
    {loading ? (
      <div className="text-center">Loading...</div>
    ) : authToken ? (
      <TodoList />
    ) : (
      <Login setAuthToken={setAuthToken} />
    )}
    </div>
  );
}
