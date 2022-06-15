import React, { Component } from "react";
import { animated, Spring } from "react-spring";
import UI from "../../shared/Components/UI/js";
import {
  Shadow,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "../../shared/custom-react-native";
import "./css.css";
const zIndex = 10002;
export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 1.1,
    };
  }

  componentDidMount = () => {};

  render() {
    let props = this.props;
    let { visible, _this } = props;
    return (
      <View
        style={{
          display: visible ? "flex" : "none",
          ...styles.modal_container,
        }}
      >
        {_this.state.modal_content}
      </View>
    );
  }
}

export class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  render() {
    let props = this.props;
    const initial = { ...styles.default_modal, width: 300, padding: 0 };
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    const onCancel = () => {
      if (props.onDismiss) {
        props.onDismiss();
      }
    };
    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style }}>
            <View style={{ ...styles.md_header, backgroundColor: "#64C31E" }}>
              <TouchableOpacity onClick={onCancel} style={styles.md_close}>
                <img style={{ height: 15, width: 15 }} src={UI.CLOSE} />
              </TouchableOpacity>

              <View style={styles.md_header_text_container}>
                <Text style={styles.md_header_text}>SUCCESS!</Text>
              </View>

              {UI.box(60)}
            </View>

            <View style={styles.md_content_container}>
              <img
                style={{ width: 219 * 0.5, height: 158 * 0.5 }}
                src={UI.SUCCESS_BANNER}
              />
              {UI.box(20)}

              <Text style={styles.md_text_content}>
                {this.props.description}
              </Text>

              {UI.box(20)}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onClick={onCancel}
                  style={{ ...styles.md_button, backgroundColor: "#004F99" }}
                >
                  <Text style={styles.md_btn_text}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </animated.div>
        )}
      </Spring>
    );
  }
}

export class Failed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let props = this.props;
    const initial = { ...styles.default_modal, width: 300, padding: 0 };
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    const onCancel = () => {
      if (props.onDismiss) {
        props.onDismiss();
      }
    };

    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style }}>
            <View style={{ ...styles.md_header, backgroundColor: "#B90C0C" }}>
              <TouchableOpacity onClick={onCancel} style={styles.md_close}>
                <img style={{ height: 15, width: 15 }} src={UI.CLOSE} />
              </TouchableOpacity>

              <View style={styles.md_header_text_container}>
                <Text style={styles.md_header_text}>PROCESS FAILED</Text>
              </View>

              {UI.box(60)}
            </View>

            <View style={styles.md_content_container}>
              <img
                style={{ width: 219 * 0.5, height: 158 * 0.5 }}
                src={UI.TRASH_BANNER}
              />
              {UI.box(20)}

              <Text style={styles.md_text_content}>
                {this.props.description}
              </Text>

              {UI.box(20)}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onClick={onCancel}
                  style={{ ...styles.md_button, backgroundColor: "#004F99" }}
                >
                  <Text style={styles.md_btn_text}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </animated.div>
        )}
      </Spring>
    );
  }
}

export class CustomFailed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let props = this.props;
    const initial = { ...styles.default_modal, width: 300, padding: 0 };
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    const onCancel = () => {
      if (props.onDismiss) {
        props.onDismiss();
      }
    };

    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style }}>
            <View style={{ ...styles.md_header, backgroundColor: "#B90C0C" }}>
              <TouchableOpacity onClick={onCancel} style={styles.md_close}>
                <img style={{ height: 15, width: 15 }} src={UI.CLOSE} />
              </TouchableOpacity>

              <View style={styles.md_header_text_container}>
                <Text style={styles.md_header_text}>{this.props.title}</Text>
              </View>

              {UI.box(60)}
            </View>

            <View style={styles.md_content_container}>
              <img
                style={{ width: 219 * 0.5, height: 158 * 0.5 }}
                src={UI.WARNING_BANNER}
              />
              {UI.box(20)}

              <Text style={styles.md_text_content}>
                {this.props.description_title}
              </Text>
              {UI.box(10)}
              <Text style={styles.md_text_content}>
                {this.props.description}
              </Text>

              {UI.box(20)}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onClick={onCancel}
                  style={{ ...styles.md_button, backgroundColor: "#004F99" }}
                >
                  <Text style={styles.md_btn_text}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </animated.div>
        )}
      </Spring>
    );
  }
}

export class DeleteConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let props = this.props;
    const initial = { ...styles.default_modal, width: 300, padding: 0 };
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    const onCancel = () => {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    };
    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style, justifyContent: "flex-start" }}>
            <View style={{ ...styles.md_header, backgroundColor: "#B90C0C" }}>
              <TouchableOpacity onClick={onCancel} style={styles.md_close}>
                <img style={{ height: 15, width: 15 }} src={UI.CLOSE} />
              </TouchableOpacity>

              <View style={styles.md_header_text_container}>
                <Text style={styles.md_header_text}>DELETE ITEM</Text>
              </View>

              {UI.box(60)}
            </View>

            <View style={styles.md_content_container}>
              <img
                style={{ width: 219 * 0.5, height: 158 * 0.5 }}
                src={UI.TRASH_BANNER}
              />
              {UI.box(20)}

              <Text style={styles.md_text_content}>{this.props.text}</Text>

              {UI.box(20)}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onClick={() => {
                    if (props.onDelete) {
                      props.onDelete();
                    }
                  }}
                  style={{ ...styles.md_button, backgroundColor: "#B90C0C" }}
                >
                  <Text style={styles.md_btn_text}>Delete</Text>
                </TouchableOpacity>
                {UI.box(10)}
                <TouchableOpacity onClick={onCancel} style={styles.md_button}>
                  <Text style={styles.md_btn_text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </animated.div>
        )}
      </Spring>
    );
  }
}
export class CustomConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let props = this.props;
    const initial = { ...styles.default_modal, width: 300, padding: 0 };
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    const onCancel = () => {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    };
    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style, justifyContent: "flex-start" }}>
            <View
              style={{
                ...styles.md_header,
                backgroundColor: this.props.backgroundColor ?? "#B90C0C",
              }}
            >
              <TouchableOpacity
                onClick={() => {
                  if (props.onCancel.method) {
                    props.onCancel.method();
                  }
                }}
                style={styles.md_close}
              >
                <img style={{ height: 15, width: 15 }} src={UI.CLOSE} />
              </TouchableOpacity>

              <View style={styles.md_header_text_container}>
                <Text style={styles.md_header_text}>{this.props.title}</Text>
              </View>

              {UI.box(60)}
            </View>

            <View style={styles.md_content_container}>
              <img
                style={{ width: 219 * 0.5, height: 158 * 0.5 }}
                src={UI.COMING_SOON}
              />
              {UI.box(20)}

              <Text style={styles.md_text_content}>{this.props.text}</Text>

              {UI.box(20)}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onClick={() => {
                    if (props.onOk.method) {
                      props.onOk.method();
                    }
                  }}
                  style={{
                    ...styles.md_button,
                    backgroundColor: this.props.backgroundColor ?? "#B90C0C",
                  }}
                >
                  <Text style={styles.md_btn_text}>{props.onOk.text}</Text>
                </TouchableOpacity>
                {UI.box(10)}
                <TouchableOpacity
                  onClick={() => {
                    if (props.onCancel.method) {
                      props.onCancel.method();
                    }
                  }}
                  style={styles.md_button}
                >
                  <Text style={styles.md_btn_text}>{props.onCancel.text}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </animated.div>
        )}
      </Spring>
    );
  }
}

export class ComingSoon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let props = this.props;
    const initial = { ...styles.default_modal, width: 300, padding: 0 };
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    const onCancel = () => {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    };

    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style, justifyContent: "flex-start" }}>
            <View style={styles.md_header}>
              <TouchableOpacity onClick={onCancel} style={styles.md_close}>
                <img style={{ height: 15, width: 15 }} src={UI.CLOSE} />
              </TouchableOpacity>

              <View style={styles.md_header_text_container}>
                <Text style={styles.md_header_text}>COMING SOON</Text>
              </View>

              {UI.box(60)}
            </View>

            <View style={styles.md_content_container}>
              <img
                style={{ width: 219 * 0.5, height: 158 * 0.5 }}
                src={UI.COMING_SOON}
              />
              {UI.box(20)}

              <Text style={styles.md_text_content}>
                This page is still under development We’ll get back to you soon.
              </Text>

              {UI.box(20)}

              <TouchableOpacity onClick={onCancel} style={styles.md_button}>
                <Text style={styles.md_btn_text}>Close</Text>
              </TouchableOpacity>
            </View>
          </animated.div>
        )}
      </Spring>
    );
  }
}

export class NotApproved extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  render() {
    let props = this.props;
    const initial = styles.default_modal;
    const before = { ...styles.modal_before, ...initial };
    const during = { ...styles.modal_during, ...initial };

    return (
      <Spring from={before} to={during} delay={0} config={{ duration: 200 }}>
        {(style) => (
          <animated.div style={{ ...style }}>
            <img style={{ height: 50, width: 50 }} src={UI.TRANSACTION_ITEM} />

            <Text style={styles.modal_title}>Waiting for approval</Text>
            {UI.box(10)}
            <Text
              style={{
                ...styles.modal_description,
                textAlign: "left",
                width: "100%",
              }}
            >
              Kindly wait for a maximum of 24 hours for our team to validate the documents
              that you have submitted. Thank you.
            </Text>
            {UI.box(30)}
            <Text
              style={{
                ...styles.modal_description,
                textAlign: "left",
                width: "100%",
              }}
            >
              Regards,
            </Text>

            <Text
              style={{
                ...styles.modal_description,
                textAlign: "left",
                width: "100%",
              }}
            >
              mWell Management
            </Text>

            <TouchableOpacity
              onClick={() => {
                if (this.props.onDismiss) {
                  this.props.onDismiss();
                }
              }}
              style={styles.modal_black_btn}
            >
              <Text style={styles.modal_btn_text}>Dismiss</Text>
            </TouchableOpacity>
          </animated.div>
        )}
      </Spring>
    );
  }
}

const Button = (props = { color: "", text: "", onClick: () => {} }) => {
  return (
    <TouchableOpacity
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
      style={{ ...styles.modal_black_btn, backgroundColor: props.color }}
    >
      <Text style={styles.modal_btn_text}>{props.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  md_btn_text: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  md_button: {
    padding: 30,
    backgroundColor: "#004F99",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  md_text_content: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    color: "#004F99",
    width: 230,
  },
  md_content_container: {
    padding: 25,
    alignItems: "center",
  },
  md_header_text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  md_header_text_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  md_close: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  md_header: {
    height: 60,
    width: "100%",
    backgroundColor: "#00CBFF",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: "row-reverse",
  },
  modal_description_text: {
    color: "#585858",
    fontSize: 16,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  modal_header_text: {
    color: "#3E3E3E",
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  modal_btn_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  modal_black_btn: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#111111",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
  },
  modal_description: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#434343",
    textAlign: "center",
  },
  modal_title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0E0E0E",
    marginTop: 20,
    textAlign: "center",
  },
  modal_during: {
    opacity: 1,
    minHeight: 220,
    minWidth: 220,
    marginTop: 0,
  },
  modal_before: {
    opacity: 0,
    minHeight: 100,
    minWidth: 100,
    marginTop: 200,
  },
  default_modal: {
    backgroundColor: "white",
    borderRadius: 10,
    ...Shadow._3(),
    zIndex: zIndex + 1,
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    maxWidth: 320,
  },
  modal_container: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: zIndex,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
});
