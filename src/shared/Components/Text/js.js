import React, { Component } from "react";
import "./css.css";

export default class Item extends Component {
  constructor(props = { style: {} }) {
    super(props);
  }

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    return <span style={{ ...propStyles }}>{this.props.children}</span>;
  }
}
