import React, { Component } from "react";
import "./css.css";
import Helper from "../helper";

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  id = Helper.uniqid("view");

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }
    let onClick = () => {};

    if (this.props.onClick) {
      onClick = this.props.onClick;
    }

    let id = null;

    if (this.props.id) {
      id = this.props.id;
    }

    let className = null;

    if (this.props.className) {
      className = this.props.className;
    }

    return (
      <div
        id={id}
        className={className}
        onClick={onClick}
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
