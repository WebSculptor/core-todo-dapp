import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("TodoList", () => {
  let todoList: Contract;

  async function deployTodoListFixture() {
    const TodoList = await ethers.getContractFactory("TodoList");
    return await TodoList.deploy();
  }

  beforeEach(async () => {
    todoList = (await loadFixture(deployTodoListFixture)) as any;
  });

  describe("Create Todo", () => {
    it("Should be able to push todo to todos array", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      const todo = await todoList.todos(0);
      const count = await todoList.todoCount();

      expect(todo.id).to.equal(1);
      expect(todo.title).to.equal("Breakfast");
      expect(todo.description).to.equal("Cook bread and tea");
      expect(todo.isDone).to.equal(false);
      expect(count).to.equal(1);
    });
  });

  describe("toggleCompleted", () => {
    it("Should toggle the completion status of a todo item", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      const before = await todoList.todos(0);
      await todoList.toggleCompleted(0);
      const after = await todoList.todos(0);

      expect(after.isDone).to.equal(!before.isDone);
    });
  });

  describe("deleteTodo", () => {
    it("Should delete a todo item", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      await todoList.createTodo("Lunch", "Cook rice and beans");

      const initialTodos = await todoList.getAllTodos();
      await todoList.deleteTodo(0);
      const finalTodos = await todoList.getAllTodos();

      expect(finalTodos.length).to.equal(initialTodos.length - 1);
    });
  });

  describe("updateTodoTitle", () => {
    it("should update the todo title", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      await todoList.updateTodoTitle("Lunch", 0);
      const updatedTodo = await todoList.todos(0);
      expect(updatedTodo.title).to.equal("Lunch");
    });
  });
  describe("updateTodoDescription", () => {
    it("should update the todo description", async () => {
      await todoList.createTodo("Breakfast", "Cook bread and tea");
      await todoList.updateTodoDescription("Cook Porridge yam", 0);
      const updatedTodo = await todoList.todos(0);
      expect(updatedTodo.description).to.equal("Cook Porridge yam");
    });
  });

  describe("getspecificTodos", () => {
    it("Should retrieve specific todo items", async () => {
      await todoList.createTodo("Breakfast", "Drink Tea and Bread");
      await todoList.createTodo("Lunch", "Cook rice and beans");

      const todo1 = await todoList.getspecificTodos(0);
      const todo2 = await todoList.getspecificTodos(1);

      expect(todo1.title).to.equal("Breakfast");
      expect(todo1.description).to.equal("Drink Tea and Bread");
      expect(todo2.title).to.equal("Lunch");
      expect(todo2.description).to.equal("Cook rice and beans");
    });
  });
});
