import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UI from "../../shared/Components/UI/js";
import {
  Image,
  ImageBackground,
  ImageFit,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "../../shared/custom-react-native";
import "./css.css";

export default class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_password: false,

      show_number_error: false,

      last_value: "",
    };
  }

  toggle_show_password = () => {
    this.setState({
      show_password: !this.state.show_password,
    });
  };

  error_number_timeout = setTimeout(() => {}, 10);

  error_number = () => {
    clearTimeout(this.error_number_timeout);
    this.error_number_timeout = setTimeout(() => {
      this.setState(
        {
          show_number_error: true,
        },
        () => {
          this.error_number_timeout = setTimeout(() => {
            this.setState({
              show_number_error: false,
            });
          }, 2500);
        }
      );
    }, 1);
  };

  render() {
    const _this = this.props._this;
    const {
      title,
      placeholder,
      state_name,
      isPassword,
      prefix,
      isNumber,
      maxLength,
      disableLength,
      is_keyword,
      disabled,
      cell_type,
    } = this.props;
    const { show_password } = this.state;
    let value = _this.state[state_name];
    if (value == undefined || value == null) {
      value = "";
    }
    let additional = <View></View>;
    if (this.props.additional) {
      additional = this.props.additional;
    }
    let right = <View></View>;
    if (this.props.right) {
      right = this.props.right;
    }

    let propStyle = {};
    if (this.props.style) {
      propStyle = this.props.style;
    }

    let type = "text";
    if (this.props.type) {
      type = this.props.type;
    }

    let is_active = false;
    if (_this.state["focus_" + state_name]) {
      is_active = _this.state["focus_" + state_name];
    }

    let form_errors = _this.state.form_errors ?? [];
    let form_messages = _this.state.form_messages ?? [];
    let isError = false;
    if (form_errors.includes(state_name)) {
      isError = true;
    }

    let available_characters = 0;

    if (maxLength && _this.state) {
      if (!_this.state[state_name]) {
        _this.state[state_name] = "";
      }
      available_characters = maxLength - (_this.state[state_name] + "").length;
    }

    if (is_keyword) {
      if (is_active) {
        if (!_this.state[state_name]) {
          isError = true;
          form_messages = [{ [state_name]: "Please input a keyword" }];
        }
      }
    }

    let input_background = disabled ? "#ededed" : "white";

    return (
      <View
        style={{
          alignSelf: "stretch",
          ...propStyle,
          pointerEvents: disabled ? "none" : "all",
          height: cell_type ? 50 : null
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            display: title.length > 0 ? (cell_type ? "none" : "flex") : "none",
          }}
        >
          <Text style={styles.title}>
            {title}
            <Text
              style={{
                color: "#FF0000",
                opacity: this.props.isRequired ? 1 : 0,
              }}
            >
              {" "}
              *
            </Text>
          </Text>
          <View style={{ flex: 1 }}></View>
          {additional}
        </View>
        {UI.box(8)}

        <View
          style={{
            ...styles.input_container,
            borderColor: isError
              ? "#EC7B6F"
              : is_active
              ? UI.colors.primary
              : "#CACACA",
            height: this.props.height ? this.props.height : 50,
            backgroundColor: input_background,
            borderWidth: cell_type ? 1 : 2
          }}
        >
          <View
            style={{
              ...styles.prefix_container,
              display: prefix ? "flex" : "none",
            }}
          >
            <Text style={styles.prefix_text}>{prefix}</Text>
          </View>
          {this.props.type == "big" ? (
            <textarea
              className={"input_" + state_name}
              onFocus={() => {
                _this.setState({
                  ["focus_" + state_name]: true,
                });
              }}
              onBlur={() => {
                _this.setState({
                  ["focus_" + state_name]: false,
                });
              }}
              onInput={(e) => {
                if (!isNumber || !maxLength) {
                  return;
                }
                let target = e.nativeEvent.target;

                if (target.value.length > target.maxLength) {
                  target.value = target.value.slice(0, target.maxLength);
                }
                if (isNumber) {
                  const with_number =
                    target.value.match(/[a-z]/i)?.index >= 0 ? true : false;
                  if (with_number) {
                    this.error_number();
                  }
                  if (target.value.includes(".")) {
                    //count the dots, remove the last index
                    var dots_count = target.value.match(/\./g).length;
                    if (dots_count > 1) {
                      //remove the last dot
                      target.value = target.value.replace(/\.$/, "");
                    }
                  } else {
                    target.value = target.value.replace(/\D/g, "");
                  }
                }
              }}
              maxlength={maxLength}
              type={
                isPassword
                  ? show_password
                    ? "text"
                    : "password"
                  : isNumber
                  ? "text"
                  : "text"
              }
              onChange={(e) => {
                _this.setState({
                  [state_name]: e.target.value,
                });
                if (this.props.onChange) {
                  this.props.onChange(e.target.value);
                }
              }}
              style={{
                height: "100%",
                width: "100%",
                paddingTop: 10,
                backgroundColor: input_background,
              }}
              placeholder={placeholder}
            />
          ) : (
            <input
              className={"input_" + state_name}
              onFocus={() => {
                _this.setState({
                  ["focus_" + state_name]: true,
                });
              }}
              onBlur={() => {
                _this.setState({
                  ["focus_" + state_name]: false,
                });
              }}
              onInput={(e) => {
                if (!isNumber || !maxLength) {
                  return;
                }
                let target = e.nativeEvent.target;

                if (target.value.length > target.maxLength) {
                  target.value = target.value.slice(0, target.maxLength);
                }
                if (isNumber) {
                  const with_number =
                    target.value.match(/[a-z]/i)?.index >= 0 ? true : false;
                  if (with_number) {
                    this.error_number();
                  }
                  if (target.value.includes(".")) {
                    //count the dots, remove the last index
                    var dots_count = target.value.match(/\./g).length;
                    if (dots_count > 1) {
                      //remove the last dot
                      target.value = target.value.replace(/\.$/, "");
                    }
                  } else {
                    target.value = target.value.replace(/\D/g, "");
                  }
                }
              }}
              maxlength={maxLength}
              type={
                isPassword
                  ? show_password
                    ? "text"
                    : "password"
                  : isNumber
                  ? "text"
                  : "text"
              } /* type={
                isPassword
                  ? show_password
                    ? type
                    : "password"
                  : isNumber
                  ? "number"
                  : type
              } */
              onChange={(e) => {
                _this.setState({
                  [state_name]: e.target.value,
                });
                if (this.props.onChange) {
                  this.props.onChange(e.target.value);
                }
              }}
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: input_background,
              }}
              placeholder={placeholder}
            />
          )}
          <View style={{ alignSelf: "center" }}>{right}</View>
        </View>
        {isPassword && value.length > 0 && (
          <TouchableOpacity
            onClick={this.toggle_show_password}
            style={styles.show_pass_btn}
          >
            <View style={{ display: !show_password ? "flex" : "none" }}>
              <Image
                height={20}
                width={20}
                tintColor={"transparent"}
                source={UI.EYE_OPENED}
              />
            </View>
            <View style={{ display: show_password ? "flex" : "none" }}>
              <Image
                height={20}
                width={20}
                tintColor={"transparent"}
                source={UI.EYE_CLOSED}
              />
            </View>
          </TouchableOpacity>
        )}
        { cell_type ? "" : isError ? (
          <View style={styles.error_container}>
            <img style={{ height: 15, width: 15 }} src={UI.WARNING} />
            <Text style={{ marginLeft: 5, fontSize: 12, color: "#EC7B6F" }}>
              {
                form_messages.filter((f) => {
                  const key = Object.keys(f)[0];
                  return key == state_name;
                })[0][state_name]
              }
            </Text>
          </View>
        ) : maxLength ? (
          maxLength && !this.state.show_number_error ? (
            maxLength == _this.state[state_name].length ? (
              !disableLength && (
                <View style={{ ...styles.error_container, display: "none" }}>
                  <img
                    style={{ height: 15, width: 15 }}
                    src={UI.GEAR_WARNING}
                  />
                  <Text
                    style={{ marginLeft: 5, fontSize: 12, color: "#f39c12" }}
                  >
                    Max length reached.
                  </Text>
                </View>
              )
            ) : disableLength ? (
              <View></View>
            ) : (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row-reverse",
                  marginTop: -15,
                  marginLeft: -5,
                }}
              >
                <Text style={{ fontSize: 10, color: "#CACACA" }}>
                  {available_characters}
                </Text>
              </View>
            )
          ) : (
            isNumber &&
            this.state.show_number_error && (
              <View style={styles.error_container}>
                <img style={{ height: 15, width: 15 }} src={UI.GEAR_WARNING} />
                <Text style={{ marginLeft: 5, fontSize: 12, color: "#f39c12" }}>
                  Only numbers are accepted.
                </Text>
              </View>
            )
          )
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}

export class DateForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { _this, placeholder, state_name, borderColor, date_props } =
      this.props;
    let value = placeholder;
    if (_this.state[state_name]) {
      value = _this.state[state_name];
    }

    if (!date_props) {
      date_props = {};
    }
    return (
      <View
        onClick={() => {
          this.date.setOpen(true);
        }}
        style={{ ...styles.date_input, borderColor }}
      >
        <View style={{ flex: 1 }}>
          <DatePicker
            ref={(view) => {
              this.date = view;
            }}
            /*    customInput={
              <View>
                <Text>{value}</Text>
              </View>
            } */
            placeholderText={placeholder}
            selected={_this.state[state_name + "_date"]}
            onChange={(date) => {
              const timestamp = date.getTime();
              let time = UI.timestampToDate(timestamp);
              time.day = UI.pad2(time.day);
              let value = time.month + "/" + time.day + "/" + time.year;
              let dashed =
                time.year + "-" + UI.pad2(time.month) + "-" + UI.pad2(time.day);
              const carespan = time.year + "-" + time.month + "-" + time.day;

              if (this.props.will_correct) {
                const d = new Date(timestamp);
                time = UI.timestampToDate(d.getTime() + 100000000);
                dashed =
                  time.year +
                  "-" +
                  UI.pad2(time.month) +
                  "-" +
                  UI.pad2(time.day);
              }

              _this.setState({
                [state_name]: value,
                [state_name + "_date"]: date,
                [state_name + "_timestamp"]: timestamp,
                [state_name + "_carespan"]: carespan,
                [state_name + "_dashed"]: dashed,
              });
            }}
            {...date_props}
          />
        </View>

        <ImageBackground
          style={{ height: 20, width: 20 }}
          imageFit={ImageFit.CONTAIN}
          source={UI.CALENDAR_2}
        />
      </View>
    );
  }
}

export class TimeForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { _this, placeholder, state_name } = this.props;
    let value = placeholder;
    if (_this.state[state_name]) {
      value = _this.state[state_name];
    }
    return (
      <View onClick={() => {}} style={styles.date_input}>
        <input
          style={{ height: "100%", width: "100%" }}
          type="time"
          onChange={(date) => {
            _this.setState({
              [state_name]: date.target.value,
            });
          }}
        />
      </View>
    );
  }
}

export class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick(!this.props.is_checked);
    }
  };

  render() {
    const { is_checked, text } = this.props;
    let color = UI.colors.primary;
    if (this.props.color) {
      color = this.props.color;
    }
    let fontSize = 14;
    if (this.props.fontSize) {
      fontSize = this.props.fontSize;
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          <TouchableOpacity
            onClick={this.onClick}
            style={{
              ...styles.checkbox_style,
              backgroundColor: is_checked ? "#2ED9D3" : "white",
            }}
          >
            {UI.box(3)}
            <View style={{ marginTop: -4, opacity: is_checked ? 1 : 0 }}>
              <img
                style={{ height: 12 * 0.85, width: 14 * 0.85 }}
                src={UI.THICK_CHECK}
              />
            </View>
          </TouchableOpacity>
        </div>

        {UI.box(7)}

        <TouchableOpacity onClick={this.onClick}>
          <View style={{ wordWrap: "break-word" }}>
            <Text style={{ ...styles.title, color, fontSize }}>{text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  error_container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  date_input: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#C9C9C9",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    width: "100%",
    height: 50,
  },
  prefix_text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  prefix_container: {
    paddingRight: 7,
    alignSelf: "center",
  },
  checkbox_style: {
    height: 20,
    width: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#B2BBC5",
    justifyContent: "center",
    alignItems: "center",
  },
  show_pass_btn: {
    height: 35,
    width: 35,
    alignSelf: "flex-end",
    marginTop: -37,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  input_container: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#CACACA",
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: "white",
    flexDirection: "row",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: UI.colors.primary,
  },
});
