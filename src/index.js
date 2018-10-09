import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  document.getElementById("root").setAttribute("class", "ios");
} else if (/Mac/.test(navigator.userAgent) && !window.MSStream) {
  document.getElementById("root").setAttribute("class", "mac");
}

ReactDOM.render(<App />, document.getElementById("root"));

registerServiceWorker();
