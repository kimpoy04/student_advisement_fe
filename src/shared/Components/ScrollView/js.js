import React, { Component } from "react";
import "./css.css";
function uniqid(prefix = "", random = false) {
  const sec = Date.now() * 1000 + Math.random() * 1000;
  const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
  return `${prefix}${id}${
    random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
  }`;
}
export default class Item extends Component {
  constructor(props = { style: {}, horizontal: false }) {
    super(props);
  }
  id = uniqid("scroll");

  componentDidMount = () => {
    if (this.props.getId) {
      this.props.getId(() => {
        return this.id;
      });
    }
  };

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    return (
      <div
        id={this.id}
        style={{
          height: "100%",
          width: "100%",
          display: "inline-flex",
          flexDirection: this.props.horizontal ? "row" : "column",
          overflowX: this.props.horizontal ? "auto" : "hidden",
          overflowY: this.props.horizontal ? "hidden" : "auto",
          ...propStyles,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
