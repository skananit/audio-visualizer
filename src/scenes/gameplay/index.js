import React, { Component } from "react";
import Meter from "./components/Meter";
import Timer from "./components/Timer";
import "./styles.css";
import axios from "axios";
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class Gameplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listening: false,
      volume: 0,
      maxVolume: 0,
      toggleLabel: "Start",
      deviceId: null,
      ms: 15000,
      visible: false
    };
    this.updateStats = this.updateStats.bind(this);
  }

  componentDidMount() {
    navigator.mediaDevices
      .enumerateDevices()
      .then(deviceInfos => {
        for (var i = 0; i !== deviceInfos.length; ++i) {
          var device = deviceInfos[i];
          if (device.kind === "audioinput" && device.deviceId !== "default") {
            axios
              .post("/devices", { deviceId: device.deviceId })
              .then(res => {
                console.log(res);
              })
              .catch(error => {
                console.log(error.res);
              });
            this.setState({
              deviceId: device.deviceId
            });
          }
        }
      })
      .catch(function errorCallBack(error) {
        throw error;
      });
  }

  updateStats(newVolume) {
    let currentMax = Math.max(this.state.maxVolume, newVolume);

    // if new max, update in the backened based on the device id
    if (currentMax > this.state.maxVolume) {
      axios
        .put("/devices", { deviceId: this.state.deviceId, newMax: currentMax })
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error.res);
        });
    }
    this.setState({
      volume: newVolume,
      maxVolume: currentMax
    });
  }

  handleStart(updateStats) {
    if (this.state.listening === true) {
      this.setState({
        visible: false,
        toggleLabel: "Start",
        listening: false,
        maxVolume: 0,
        volume: 0
      });
      audioCtx.suspend().then(function() {
        console.log("audio closed");
      });
    } else {
      this.setState({
        listening: true,
        toggleLabel: "Reset",
        visible: true
      });
      if (audioCtx.state === "suspended") {
        audioCtx.resume().then(function() {
          console.log(audioCtx.state);
        });
      }
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // else: wrap the call to the old navigator.getUserMedia with a promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      var source;
      var analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      if (navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");

        var constraints = { audio: true, video: false };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function(stream) {
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            setInterval(visualize, 1);
          })
          .catch(function(err) {
            console.log("The following gUM error occured: " + err);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    }
    function visualize() {
      //TODO: updateVisibility should take place here - after acesss has been granted by the user
      // both getByteFrequencyData and getFloatFrequencyData give the magnitude in decibels - they are just scaled differently and for getByteFrequencyData a minDecibles constant is subtracted
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      var sum = 0;
      for (var i = 0; i < bufferLength; i++) {
        var freq = dataArray[i];
        sum += freq;
      }
      var average = sum / bufferLength;
      average = ~average;
      average = Math.abs(average);
      console.log(average);
      setTimeout(updateStats, 1, average);
    }
  }

  timer() {
    return <Timer ms={this.state.ms} audioCtx={audioCtx} />;
  }

  render() {
    return (
      <div className="App">
        <br />
        <br />
        <button
          className="startButton"
          onClick={() => this.handleStart(this.updateStats)}
        >
          {this.state.toggleLabel}
        </button>
        {/* conditionally render the Timer based on current state */}
        <h1>{/* <Timer ms={this.state.ms} audioCtx={audioCtx} /> */}</h1>
        <Meter value={this.state.visible ? this.state.volume : 0} />
        <br /> <br />
        {this.state.visible ? (
          <h1 className="texts">
            Maximum: {this.state.maxVolume}%<br />
            <br />
            <br />
          </h1>
        ) : (
          <h1 className="texts">
            <br />
            <br />
            <br />
          </h1>
        )}
      </div>
    );
  }
}

export default Gameplay;
