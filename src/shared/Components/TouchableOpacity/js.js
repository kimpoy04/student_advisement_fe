import React, { Component } from "react";
import "./css.css";
import { CSSTransition } from "react-transition-group";

export default class Item extends Component {
  constructor(props = { style: {}, onClick: () => {} }) {
    super(props);
    this.state = {
      animate: false,
    };
  }

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    return (
      <CSSTransition in={this.state.animate} timeout={200} classNames="button">
        <div
          onMouseDown={() => {
            this.setState({
              animate: true,
            });
          }}
          onMouseOut={() => {
            this.setState({
              animate: false,
            });
          }}
          onMouseUp={() => {
            this.setState({
              animate: false,
            });
          }}
          style={{
            cursor: "pointer",
            display: "inline-flex",
            userSelect: "none",
            flexDirection: "column",
            ...propStyles,
          }}
          onClick={() => {
            if (this.props.onClick) {
              this.props.onClick();
            }
          }}
        >
          {this.props.children}
        </div>
      </CSSTransition>
    );
  }
}
