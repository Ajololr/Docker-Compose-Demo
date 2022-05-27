import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";

const todos = [
  { _id: 1, title: "Todo 1" },
  { _id: 2, title: "Todo 2" },
  { _id: 3, title: "Todo 3" },
];

const newTodo = { _id: 4, title: "New Todo" };

const apiEndpoint = "http://localhost:3001/api/todos";

const server = setupServer(
  rest.get(apiEndpoint, (req, res, ctx) => res(ctx.json(todos))),
  rest.post(apiEndpoint, (req, res, ctx) => res(ctx.json(newTodo))),
  rest.delete(apiEndpoint + "/" + todos[0]._id, (req, res, ctx) =>
    res(ctx.status(204))
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("App component", () => {
  test("renders all the todos fetched from the server", async () => {
    render(<App />);

    const listItems = await screen.findAllByRole("listitem");

    expect(listItems.length).toEqual(todos.length);
  });

  test("displays an error if the call to the server fails", async () => {
    server.use(rest.get(apiEndpoint, (req, res, ctx) => res(ctx.status(500))));

    render(<App />);

    await screen.findByRole("alert");
  });

  describe("When a new todo is added", () => {
    test("the input field gets cleared", async () => {
      await renderApp();

      addTodo();
      await screen.findByText(newTodo.title);

      const inputField = screen.getByLabelText("New Todo");
      expect(inputField).toHaveValue("");
    });

    test("it is added to the list", async () => {
      await renderApp();

      addTodo();

      await screen.findByText(newTodo.title);
    });

    test("it is removed from the list if the call to the server fails", async () => {
      server.use(
        rest.post(apiEndpoint, (req, res, ctx) => res(ctx.status(500)))
      );

      await renderApp();

      addTodo();

      await waitForElementToBeRemoved(() => screen.queryByText(newTodo.title));
    });

    test("An error is displayed if the call to the server fails", async () => {
      server.use(
        rest.post(apiEndpoint, (req, res, ctx) => res(ctx.status(500)))
      );

      await renderApp();

      addTodo();

      const error = await screen.findByRole("alert");
      expect(error).toHaveTextContent(/save/i);
    });
  });

  describe("When a todo is deleted", () => {
    test("it is removed from the list", async () => {
      await renderApp();

      deleteTodo();

      expect(screen.queryByText(todos[0].title)).not.toBeInTheDocument();
    });

    test("it is inserted back in the list if the call to the server fails", async () => {
      server.use(
        rest.delete(apiEndpoint + "/" + todos[0]._id, (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      await renderApp();

      deleteTodo();

      await screen.findByText(todos[0].title);
    });

    test("an error is displayed if the call to the server fails", async () => {
      server.use(
        rest.delete(apiEndpoint + "/" + todos[0]._id, (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      await renderApp();

      deleteTodo();

      const error = await screen.findByRole("alert");
      expect(error).toHaveTextContent(/delete/i);
    });
  });
});

// Helper functions
const renderApp = async () => {
  render(<App />);
  await screen.findAllByRole("listitem");
};

const addTodo = () => {
  const inputField = screen.getByLabelText("New Todo");
  fireEvent.change(inputField, {
    target: { value: newTodo.title },
  });
  fireEvent.submit(inputField);
};

const deleteTodo = () => fireEvent.click(screen.getAllByRole("button")[0]);
