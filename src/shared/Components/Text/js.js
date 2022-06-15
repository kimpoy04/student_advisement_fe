import React, { Component } from "react";
import "./css.css";

export default class Item extends Component {
  constructor(props = { style: {}, max: 0 }) {
    super(props);
  }

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    const string = this.props.children;
    let output_text = string;
    if (this.props.max) {
      let initial_text = "";
      if (string instanceof Array) {
        output_text = string.join("");
        initial_text = output_text;
        output_text = output_text.substring(0, this.props.max);
      } else if (typeof string == "string") {
        initial_text = output_text;
        output_text = string.substring(0, this.props.max);
      }

      if (initial_text.length > this.props.max) {
        output_text = output_text + "...";
      }


      return <span style={{ ...propStyles }}>{output_text}</span>;
    } else {
      return <span style={{ ...propStyles }}>{output_text}</span>;
    }
  }
}
