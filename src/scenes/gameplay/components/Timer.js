import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ms: props.ms,
      audioCtx: props.audioCtx
    };
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.ms <= 0) {
        clearInterval(this.interval);
        this.forceUpdate();
        return;
      }
      this.setState({ ms: this.state.ms - 1000 });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  format() {
    const { ms } = this.state;
    let seconds = Math.floor(ms / 1000);
    seconds = seconds < 1 ? "00" : seconds < 10 ? `0${seconds}` : seconds;
    if (seconds === "00") {
      this.state.audioCtx.suspend();
      return "Time's up!";
    }

    return `${seconds}`;
  }
  render() {
    return <div>{this.format(this.state.ms)}</div>;
  }
}

export default Timer;
