import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Gameplay from "./scenes/gameplay";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Gameplay} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
