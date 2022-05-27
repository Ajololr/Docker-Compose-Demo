const supertest = require("supertest");
const expect = require("expect");
const app = require("../app");
const db = require("../db");
const Todo = require("../models/todo");

const request = supertest(app);
const endpoint = "/api/todos";

describe(endpoint, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  describe("GET /", () => {
    it("should return all todos", async () => {
      const titles = ["m1", "m2"];
      const todos = titles.map((title) => ({
        title,
      }));
      await Todo.insertMany(todos);

      const res = await request.get(endpoint);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      titles.forEach((title) =>
        expect(res.body.some((m) => m.title === title))
      );

      await Todo.deleteMany({ title: { $in: titles } });
    });
  });

  describe("POST /", () => {
    it("should return 400 if request is not valid", async () => {
      const res = await request.post(endpoint).send({});

      expect(res.status).toBe(400);
    });

    it("should store the todo and return 201 if request is valid", async () => {
      const todo = { title: "m" };

      const res = await request.post(endpoint).send(todo);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(todo.title);
      expect(res.body._id).toBeTruthy();

      await Todo.findByIdAndDelete(res.body._id);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if todo was not found", async () => {
      const res = await request.delete(endpoint);

      expect(res.status).toBe(404);
    });

    it("should delete the todo and return 204", async () => {
      const todo = new Todo({ title: "m" });
      await todo.save();

      const res = await request.delete(`${endpoint}/${todo._id}`);

      expect(res.status).toBe(204);

      const todoInDb = await Todo.findById(todo._id);
      expect(todoInDb).toBeFalsy();
    });
  });
});
