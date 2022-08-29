import React from "react";
import "./styles.css";
import Modal from "react-modal";

// Modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const classNames = {
  // constants for css style application
  TODO_ITEM: "todo-container",
  TODO_CHECKBOX: "todo-checkbox",
  TODO_TEXT: "todo-text",
  TODO_DELETE: "todo-delete",
  TODO_EDIT: "todo-edit"
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

// Used to put a unique identifier on each new
let id = 0;

// Takes the properties (props) from each todo:
//    variables: id, text, checked, and
//    functions: onToggle, onDelete
// and adds them into the HTML form
// Filling in the todo.text and the checkbox and delete button links
const Todo = (props) => (
  <li className={classNames.TODO_ITEM}>
    <input
      type="checkbox"
      className={classNames.TODO_CHECKBOX}
      checked={props.todo.checked}
      onChange={props.onToggle} // When checkbox is changed, it triggers onToggle in Todo
      // onToggle, in turn, calls toggleTodo function in App
    />
    <button className={classNames.TODO_EDIT} onClick={props.onEdit}>
      edit
    </button>
    <button className={classNames.TODO_DELETE} onClick={props.onDelete}>
      delete
    </button>
    <span className={classNames.TODO_TEXT}>{props.todo.text}</span>
  </li>
);

// extend the App class and make it the deafault export
export default class App extends React.Component {
  constructor() {
    super(); // Reference the component parent class
    this.state = {
      // Add a state
      todos: [], // Create an empty list to hold todos
      response: "",
      ModalIsOpen: false,
      editingID: null
    };
  }

  // Set model open
  openModal() {
    this.setState({
      ModalIsOpen: true
    });
  }

  // Set model closed
  closeModal() {
    this.setState({
      ModalIsOpen: false
    });
  }

  // Get response from state, create a todo object and add it to the list of todos
  addTodo(props) {
    if (this.state.response === "" || this.state.response === null) {
      return;
    }
    if (this.state.editingID !== null) {
      id = this.state.editingID;
      this.setState({
        editingID: null
      });
      this.removeTodo(id);
    } else {
      id++;
    }
    this.setState({
      todos: [
        // Get existing todos from list
        ...this.state.todos,
        // Create a new todo object with three properties and increment id
        { id: id, text: this.state.response, checked: false }
      ]
    });
  }

  // Save user response to state as they ype
  updateResponse(event) {
    this.setState({
      response: event.target.value
    });
  }

  // When user presses enter key, add Todo obj, clear response and close modal
  getKeyPress(event) {
    if (event.key === "Enter") {
      this.addTodo();
      this.setState({
        response: ""
      });
      this.closeModal(event);
    } else {
      return;
    }
  }

  // Edit an existing todo
  editTodo(id) {
    const todoToEdit = this.state.todos[id];
    this.setState({
      response: todoToEdit.text,
      editingID: id
    });
    this.openModal();
  }

  // Remove todo from todo list by filtering it out
  removeTodo(id) {
    this.setState({
      todos: this.state.todos.filter((todo) => todo.id !== id)
    });
  }

  // Change the checked property to the opposite of its current value
  toggleTodo(id) {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id !== id) return todo; // if not this todo, just add it back to list
        return {
          // else change the checked status and add it back to list
          id: todo.id,
          text: todo.text,
          checked: !todo.checked
        };
      })
    });
  }

  // This method renders the webpage
  render() {
    return (
      <div>
        <div className="container center">
          <h1 className="center title">My TODO App</h1>
          <div className="flow-right controls">
            {/* Add two counters */}
            {/* Count items by getting length of todo list */}
            <span>
              Item count: <span id="item-count">{this.state.todos.length}</span>
            </span>
            <span>
              {/* Get uncommpleted count by filtering out checked */}
              Uncompleted count:{" "}
              <span id="unchecked-count">
                {this.state.todos.filter((todo) => !todo.checked).length}
              </span>
            </span>
          </div>
          {/* Add button for new TODOs */}
          <button
            id="myBtn"
            className="button center"
            onClick={() => this.openModal()}
          >
            New TODO
          </button>
          <div>
            <Modal
              isOpen={this.state.ModalIsOpen}
              idBeingEdited={this.state.editing}
              onRequestClose={() => this.closeModal()}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <span className="close" onClick={() => this.closeModal()}>
                &times;
              </span>
              <form>
                <p>
                  Type below, and press enter to save ToDo. Click x to cancel
                </p>
                <input
                  type="text"
                  id="prompt"
                  size="40"
                  onChange={(event) => this.updateResponse(event)}
                  onKeyPress={(event) => this.getKeyPress(event)}
                  value={this.state.response}
                ></input>
              </form>
            </Modal>
          </div>
          {/* This section creates the TODO list items */}
          {/* By reading each todo in todo list and applying the HTML specific to the <Todo> */}
          {/* Adds links for if checkbox or delete button is clcked */}
          <div>
            <ul id="todo-list">
              {this.state.todos.map((todo) => (
                <Todo
                  // pass functions from App down to each Todo as props
                  onToggle={() => this.toggleTodo(todo.id)}
                  onEdit={() => this.editTodo(todo.id)}
                  onDelete={() => this.removeTodo(todo.id)}
                  todo={todo}
                  key={todo.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
