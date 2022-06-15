import React, { Component } from "react";
import { animated, SpringValue, Transition } from "react-spring";
import {
  Shadow,
  StyleSheet,
  TouchableOpacity,
  View,
} from "../../shared/custom-react-native";

const active_color = "rgba(0, 120, 212, 1)";
const inactive_color = "rgba(200, 209, 219, 1)";

export default class ToggleElement extends Component {
  constructor(props) {
    super(props);

    const defaultValue = this.props.defaultValue ?? false;

    this.state = {
      id: this.props.id,
      is_active: defaultValue,
      is_animating: false,
      bg_color: new SpringValue(defaultValue ? active_color : inactive_color),
    };
  }

  timeout = setTimeout(() => {});

  componentDidMount = () => {
    this.timeout = setInterval(() => {
      this.update_self();
    }, 200);
  };

  componentWillUnmount = () => {
    clearInterval(this.timeout);
  };

  update_self = () => {
    setTimeout(() => {
      const defaultValue = this.props.defaultValue ?? false;
      this.setState(
        {
          is_active: defaultValue,
          is_animating: false,
          bg_color: new SpringValue(
            defaultValue ? active_color : inactive_color
          ),
        },
        () => {}
      );
    }, 10);
  };

  toggle = () => {
    this.setState(
      {
        is_active: !this.state.is_active,
      },
      () => {
        this.animate_bg();
        if (this.props.onChange) {
          this.props.onChange(this.state.is_active);
        }
      }
    );
  };

  setValue = (bool) => {
    this.setState(
      {
        is_active: bool,
      },
      () => {
        this.animate_bg();
      }
    );
  };

  animate_bg = () => {
    if (!this.state.is_active) {
      this.state.bg_color.start({
        from: active_color,
        to: inactive_color,
      });
    } else {
      this.state.bg_color.start({
        from: inactive_color,
        to: active_color,
      });
    }
  };

  onStart = () => {
    this.setState({
      is_animating: true,
    });
  };

  onRest = () => {
    setTimeout(() => {
      this.setState({
        is_animating: false,
      });
    }, 200);
  };

  render() {
    const { is_active, is_animating } = this.state;

    return (
      <animated.div
        style={{
          backgroundColor: this.state.bg_color,
          height: 20,
          borderRadius: 50,
        }}
      >
        <TouchableOpacity
          onClick={this.toggle}
          style={{
            width: 35,
            height: 20,
            borderRadius: 30,
            flexDirection: "row",
            pointerEvents: is_animating ? "none" : "all",
          }}
        >
          <Transition
            items={is_active}
            from={{ marginLeft: 15 }}
            enter={{ marginLeft: 0 }}
            leave={{ marginLeft: 15 }}
            delay={0}
            config={{ duration: 100 }}
            onStart={this.onStart}
            onRest={this.onRest}
          >
            {(style, item) => {
              if (!item && !is_active) {
                return (
                  <animated.div style={{ style }}>
                    <View style={styles.toggle_cirlce}></View>
                  </animated.div>
                );
              }
            }}
          </Transition>
          <Transition
            items={is_active}
            from={{ marginLeft: 0 }}
            enter={{ marginLeft: 15 }}
            leave={{ marginLeft: 0 }}
            delay={0}
            config={{ duration: 100 }}
            onStart={this.onStart}
            onRest={this.onRest}
          >
            {(style, item) => {
              if (item && is_active) {
                return (
                  <animated.div style={style}>
                    <View style={styles.toggle_cirlce}></View>
                  </animated.div>
                );
              }
            }}
          </Transition>
        </TouchableOpacity>
      </animated.div>
    );
  }
}

const styles = StyleSheet.create({
  toggle_cirlce: {
    height: 15,
    width: 15,
    borderRadius: 100,
    backgroundColor: "white",
    marginLeft: 3,
    marginTop: 2.3,
    ...Shadow._3(),
  },
});

{
  /* <Transition
items={is_drawer_open}
from={{ opacity: 0 }}
enter={{ opacity: 1 }}
leave={{ opacity: 0 }}
delay={0}
config={{ duration: 200 }}
>
  
{(style, item) => {
    if (item) {
        
    }
}}

</Transition> */
}
