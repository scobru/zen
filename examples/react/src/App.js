import React, { Component } from "react";
import Gun from "@akaoio/zen";
import Todos from "./Todos.js";
import Chat from "./Chat.js";
import Json from "./Json.js";

class App extends Component {
  constructor() {
    super();
    this.gun = Gun(location.origin + "/zen");
  }

  render() {
    return (
      <div>
        <h1>React Examples</h1>
        <h2>Todo</h2>
        <Todos gun={this.gun} />
        <br />
        <hr />
        <h2>Chat</h2>
        <Chat gun={this.gun} />
        <br />
        <hr />
        <h2>Json</h2>
        <Json gun={this.gun} />
      </div>
    );
  }
}

export default App;
