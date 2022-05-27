import React, { useState } from "react";
import Input from "./Input";

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState("");

  const handleChange = (e) => setTitle(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) return;

    onAddTodo(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        aria-label="New Todo"
        onChange={handleChange}
        placeholder="Add a new todo..."
        type="text"
        value={title}
      />
    </form>
  );
}

export default TodoForm;
