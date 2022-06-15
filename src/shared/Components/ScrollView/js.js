import React, { Component } from "react";
import "./css.css";

import Helper from "../helper";

export default class Item extends Component {
  constructor(props = { style: {}, horizontal: false }) {
    super(props);
  }
  id = Helper.uniqid("scroll");

  componentDidMount = () => {
    if (this.props.getId) {
      this.props.getId(() => {
        return this.id;
      });
    }
  };

  onScroll = (e) => {
    if (this.props.onScroll) {
      this.props.onScroll(e.target.scrollTop); //return the scroll
    }
  };

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    let id = this.id;
    if (this.props.id) {
      id = this.props.id;
    }

    return (
      <div
        onScroll={this.onScroll}
        id={id}
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
