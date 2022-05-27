import React from "react";
import TodoListItem from "./TodoListItem";
import "./TodoList.css";

function TodoList({ todos, onDeleteTodo }) {
  return (
    <ul className="TodoList">
      {todos.map((todo) => (
        <TodoListItem
          key={todo._id}
          todo={todo}
          onDeleteTodo={() => onDeleteTodo(todo)}
        />
      ))}
    </ul>
  );
}

export default TodoList;
