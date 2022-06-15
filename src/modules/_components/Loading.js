import React, { Component } from "react";
import UI from "../../shared/Components/UI/js";
import { StyleSheet, Text, View } from "../../shared/custom-react-native";
const zIndex = 10001;
export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 1.1,

      show: false
    };
  }

  componentDidMount = () => {};

  show = () => {
    this.setState({
      show: true,
      hide: false
    })
  }
  hide = () => {
    this.setState({
      hide: true,
      show: false
    })
  }

  render() {
    let props = this.props;
    let { visible, title, text, modal_opaque } = props;
    if (this.state.show) {
      visible = true;
    }
    if (this.state.hide) {
      visible = false;
    }
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: zIndex,
          backgroundColor: modal_opaque
            ? "rgba(255,255,255,1)"
            : "rgba(255,255,255,0.85)",
          justifyContent: "center",
          alignItems: "center",
          display: visible ? "flex" : "none",
        }}
      >
        <img
          style={{
            height: 50,
            width: 50,
            userSelect: "none",
            animation: `spin ${this.state.speed}s linear infinite`,
          }}
          src={UI.LOADER}
        />
        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
          {title}
        </Text>
        <Text style={{ textAlign: "center" }}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
