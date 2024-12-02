import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Todo from './todo';
import Button from '../common/button';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTodos = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://dummyjson.com/todos`, {
        params: {
          skip: (page - 1) * 10,
          limit: 10,
        },
      });
      setTodos(response.data.todos);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch todos.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  useEffect(() => {
    fetchTodos(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Todo List</h1>
        <Button onClick={handleLogout} buttonText="Logout" classes="px-4 py-2 bg-blue-500 text-white rounded mb-6" type='submit' />
      </div>
      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          todos.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Button classes='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
        type='button' onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} buttonText='Previous' disabled={currentPage === 1}
        />
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button classes='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50' type='button' onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} buttonText='Next' disabled={currentPage === totalPages} />
      </div>
    </div>
  );
};

export default TodoList;
