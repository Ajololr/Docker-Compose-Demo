import React from "react";
import "./TodoListItem.css";

function Todo({ todo, onDeleteTodo }) {
  return (
    <li className="TodoListItem">
      {todo.title}
      <button className="TodoListItem__Delete" onClick={onDeleteTodo}>
        <img src="/images/delete.svg" alt="Delete todo" />
      </button>
    </li>
  );
}

export default Todo;
