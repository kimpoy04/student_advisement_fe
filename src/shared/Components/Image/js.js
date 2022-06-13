import React, { Component } from "react";
import "./css.css";
import IconTint from "react-icon-tint";

export default class Item extends Component {
  constructor(props = { style: {}, source: "", imageFit: "contain" }) {
    super(props);
  }

  render() {
    let propStyles = {};
    if (this.props.style) {
      propStyles = this.props.style;
    }

    return (
      <div
        style={{
          ...propStyles,
          backgroundImage: "url(" + this.props.source + ")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "inline-flex",
          flexDirection: "column",
          backgroundSize: this.props.imageFit,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export class Image extends Component {
  constructor(props = { height: 0, width: 0, tintColor: "white", source: "" }) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style = {{height: this.props.height, width: this.props.width}}>
        <IconTint
          src={this.props.source}
          maxHeight={this.props.height}
          maxWidth={this.props.width}
          color={this.props.tintColor}
        />
      </div>
    );
  }
}

const ImageFit = {
  CONTAIN: "contain",
  COVER: "cover",
  FILL: "fill",
  INHERIT: "inherit",
  INITIAL: "initial",
  NONE: "none",
  REVERT: "revert",
  SCALEDOWN: "scale-down",
  UNSET: "unset",
};

export { ImageFit };
