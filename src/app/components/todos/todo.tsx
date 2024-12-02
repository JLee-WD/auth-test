import React from 'react'

interface Todo {
  todo: string;
  id: number;
  completed: boolean;
}

type Props = {
  todo: Todo;
}

const Todo = ({todo}: Props) => {
  return (
    <div key={todo.id} className="flex items-center justify-between p-4 border rounded shadow-sm bg-white">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={todo.completed}
        className="mr-4"
        disabled
      />
      <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
        {todo.todo}
      </span>
    </div>
  </div>
  )
}

export default Todo