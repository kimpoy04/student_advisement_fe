import React, { Component } from "react";
import "./css.css";

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    return (
      <div
        style={{
            display: "inline-flex",
            flexDirection: "column",
          ...propStyles,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
