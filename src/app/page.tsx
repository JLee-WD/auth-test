"use client"

import { useEffect, useState } from "react";

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
      <div>todo list</div>
    ) : (
      <div>login</div>
    )}
    </div>
  );
}
