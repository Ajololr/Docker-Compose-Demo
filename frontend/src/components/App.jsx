import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import api from "../services/api";
import "./App.css";

function App() {
  const todosEndpoint = "/todos";
  const [todos, setTodos] = useState([""]);
  const [error, setError] = useState();

  const fetchTodos = async () => {
    try {
      const { data } = await api.get(todosEndpoint);
      setTodos(data);
    } catch (error) {
      setError("Could not fetch the todos!");
    }
  };

  const handleAddTodo = async (title) => {
    try {
      const todo = { _id: Date.now(), title };
      setTodos([...todos, todo]);

      const { data: savedTodo } = await api.create(todosEndpoint, todo);

      setTodos([...todos, savedTodo]);
    } catch (error) {
      setError("Could not save the todo!");
      setTodos(todos);
    }
  };

  const handleDeleteTodo = async (todo) => {
    try {
      setTodos(todos.filter((m) => m !== todo));
      await api.remove(todosEndpoint + "/" + todo._id);
    } catch (error) {
      setError("Could not delete the todo!");
      setTodos(todos);
    }
  };

  useEffect(() => fetchTodos(), []);

  return (
    <div className="App">
      <TodoForm onAddTodo={handleAddTodo} />
      {error && (
        <p role="alert" className="Error">
          {error}
        </p>
      )}
      <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} />
    </div>
  );
}

export default App;
