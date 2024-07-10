// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log for debugging
// import "hardhat/console.sol";

contract TodoList {
    // Define a struct to represent a todo item
    struct Todo {
        uint256 id; // Unique identifier for each todo item
        string title; // Title of the todo item
        string description; // Description of the todo item
        bool isDone; // Boolean to mark if the todo item is completed or not
    }

    // Public variable to hold the count of todo items
    uint256 public todoCount;
    // Public array to hold all todo items
    Todo[] public todos;

    // Event to be emitted when a new todo item is created
    event TodoCreated(
        uint256 id,
        string title,
        string description,
        bool isDone
    );
    // Event to be emitted when a todo item is toggled
    event TodoToggled(uint256 id, bool isDone);
    // Event to be emitted when a todo item is deleted
    event TodoDeleted(uint256 id);
    // Event to be emitted when a todo item's title is updated
    event TodoTitleUpdated(uint256 id, string title);
    // Event to be emitted when a todo item's description is updated
    event TodoDescriptionUpdated(uint256 id, string description);

    // Function to create a new todo item
    function createTodo(
        string memory _title, // Title of the new todo item
        string memory _description // Description of the new todo item
    ) public {
        todoCount++; // Increment the todo count
        // Create a new todo item and add it to the todos array
        Todo memory newTodo = Todo(todoCount, _title, _description, false);
        todos.push(newTodo); // Add the new todo to the array
        emit TodoCreated(todoCount, _title, _description, false); // Emit the event
    }

    // Function to toggle the completion status of a todo item
    function toggleCompleted(uint256 _id) public {
        require(_id < todos.length, "Invalid todo item id");
        // Use storage keyword to modify the state variable
        Todo storage todo = todos[_id]; // Get the todo item by id
        todo.isDone = !todo.isDone; // Toggle the completion status
        emit TodoToggled(_id, todo.isDone); // Emit the event
    }

    // Function to delete a todo item
    function deleteTodo(uint256 _id) public {
        require(_id < todos.length, "Invalid todo item id");
        todoCount--; // Decrement the todo count
        // Shift the array elements to fill the gap created by deletion
        for (uint256 i = _id; i < todos.length - 1; i++) {
            todos[i] = todos[i + 1]; // Shift each element to the left
        }
        todos.pop(); // Remove the last element of the array
        emit TodoDeleted(_id); // Emit the event
    }

    // Function to update the title of a todo item
    function updateTodoTitle(string memory _title, uint _id) public {
        require(_id < todos.length, "Invalid todo item id");
        // Use storage keyword to modify the state variable
        Todo storage todo = todos[_id]; // Get the todo item by id
        todo.title = _title; // Update the title
        emit TodoTitleUpdated(_id, _title); // Emit the event
    }

    // Function to update the description of a todo item
    function updateTodoDescription(
        string memory _description, // New description
        uint _id // Id of the todo item
    ) public {
        require(_id < todos.length, "Invalid todo item id");
        // Use storage keyword to modify the state variable
        Todo storage todo = todos[_id]; // Get the todo item by id
        todo.description = _description; // Update the description
        emit TodoDescriptionUpdated(_id, _description); // Emit the event
    }

    // Function to get all todo items
    function getAllTodos() public view returns (Todo[] memory) {
        return todos; // Return the entire todos array
    }

    // Function to get a specific todo item by id
    function getSpecificTodo(uint _id) public view returns (Todo memory) {
        require(_id < todos.length, "Invalid todo item id");
        return todos[_id]; // Return the todo item by id
    }
}
