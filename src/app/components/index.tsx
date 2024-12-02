import TodoList from "./todos";
import Login from "./login";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { authToken } = useAuth();
  return (
      <div className="bg-black">
        {authToken ? (
          <TodoList />
        ) : (
          <Login />
        )}
      </div>
  );
}
