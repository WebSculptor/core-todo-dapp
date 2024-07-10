import { getTaskContract } from ".";
import { ethers } from "ethers";

// Helper function to check if MetaMask is installed
const checkMetaMaskInstalled = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
};

// ? GETTER FUNCTIONS

// Function to get all tasks from the contract
export const getAllTasks = async (): Promise<ITask[]> => {
  checkMetaMaskInstalled();

  try {
    const contract = await getTaskContract();
    const tasks = await contract.getAllTodos();

    if (!tasks) {
      return [];
    }

    // Structuring the tasks
    const structuredTasks: ITask[] = tasks.map((task: any) => ({
      id: Number(task[0]),
      title: task[1],
      description: task[2],
      isDone: task[3],
    }));

    return Promise.resolve(structuredTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Promise.reject(error);
  }
};

// ? SETTER FUNCTIONS

// Function to create a new task in the contract
export const createNewTask = async (
  title: string,
  description: string
): Promise<any> => {
  checkMetaMaskInstalled();

  try {
    const contract = await getTaskContract();
    const tx = await contract.createTodo(title, description);

    const result = await tx.wait();

    if (!result.status) {
      console.error("Error creating task");
      return Promise.reject("Error creating task");
    }

    return Promise.resolve(result);
  } catch (error) {
    console.error("Error creating task:", error);
    return Promise.reject(error);
  }
};

// Function to delete a task in the contract
export const deleteTask = async (id: number): Promise<any> => {
  checkMetaMaskInstalled();

  try {
    const contract = await getTaskContract();
    const tx = await contract.deleteTodo(id);

    const result = await tx.wait();

    if (!result.status) {
      console.error("Error deleting task");
      return Promise.reject("Error deleting task");
    }

    return Promise.resolve(result);
  } catch (error) {
    console.error("Error deleting task:", error);
    return Promise.reject(error);
  }
};

// Function to toggle the completed status of a task in the contract
export const toggleCompleted = async (id: number): Promise<any> => {
  checkMetaMaskInstalled();

  try {
    const contract = await getTaskContract();
    const tx = await contract.toggleCompleted(Number(id));

    const result = await tx.wait();

    if (!result.status) {
      console.error("Error updating task status");
      return Promise.reject("Error updating task status");
    }

    return Promise.resolve(result);
  } catch (error) {
    console.error("Error updating task status:", error);
    return Promise.reject(error);
  }
};

// Function to update a task's title and description in the contract
export const updateTask = async (
  id: number,
  title: string,
  description: string
): Promise<any> => {
  checkMetaMaskInstalled();

  try {
    const contract = await getTaskContract();

    // Update the title
    const txTitle = await contract.updateTodoTitle(title, id);
    const receiptTitle = await txTitle.wait();
    if (!receiptTitle.status) {
      console.error("Error updating title");
      return Promise.reject("ERROR UPDATING TITLE...");
    }

    // Update the description
    const txDescription = await contract.updateTodoDescription(description, id);
    const receiptDescription = await txDescription.wait();
    if (!receiptDescription.status) {
      console.error("Error updating description");
      return Promise.reject("Error updating description");
    }

    return Promise.resolve({ txTitle, txDescription });
  } catch (error) {
    console.error("Error updating task:", error);
    return Promise.reject(error);
  }
};
