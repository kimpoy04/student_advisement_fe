import React, { Component } from "react";
import Select from "react-select";
import UI from "../../shared/Components/UI/js";
import {
  ImageBackground,
  ImageFit,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "../../shared/custom-react-native";
import { DateForm, TimeForm } from "../_components/InputForm";
import FilePicker from "./FilePicker";

class Helper {
  Btn = (props = { color: "#00CBFF", onClick: () => {}, text: "", style: {} }) => {
    return (
      <TouchableOpacity
        onClick={props.onClick}
        style={{
          ...styles.blue_btn_2,
          backgroundColor: props.color,
          width: props.width,
          height: props.height,
          ...props.style
        }}
      >
        <Text style={styles.btn_text_1}>{props.text}</Text>
      </TouchableOpacity>
    );
  };

  SelectPicker = (
    props = {
      title: "",
      isRequired: false,
      noTitle: false,
      state_name: "",
      _this: null,
      isMultiple: false,
    }
  ) => {
    let { state_name, isMultiple } = props;
    let _this = props._this ?? { state: {} };

    let form_errors = _this.state.form_errors ?? [];
    let form_messages = _this.state.form_messages ?? [];
    let isError = false;
    if (form_errors.includes(state_name)) {
      isError = true;
    }

    if (isMultiple) {
      let multiple_options = [];
      if (props.children.length > 0) {
        const options = props.children[1];
        multiple_options = options;
      }

      if (!multiple_options) {
        multiple_options = [];
      }

      const Items = multiple_options.map((item, index) => {
        const { value, children } = item.props;
        if (children) {
          return { value: value, label: children };
        } else {
          return { value: value, label: "N/A" };
        }
      });

      const options = _this.state["options_" + state_name];
      if (!options) {
        _this.setState({
          ["options_" + state_name]: Items,
        });
        _this["reload_multiple_option_" + state_name] = () => {
          _this.setState({
            ["options_" + state_name]: null,
          });
        };
      }

      return (
        <View style={{ flex: 1 }}>
          <View style={{ display: props.noTitle ? "none" : "flex" }}>
            <Text style={styles.title}>
              {props.title}
              {props.isRequired && <Text style={styles.asterisk}> *</Text>}
            </Text>
            {UI.box(8)}
          </View>

          <View
            style={{
              ...styles.option_container,
              borderColor: isError ? "#EC7B6F" : "#CACACA",
              height: null,
            }}
          >
            <Select
              onChange={(e) => {
                const values = e.map((item) => {
                  return item?.value;
                });
                _this.setState({
                  [state_name]: values,
                });
                if (props.onChange) {
                  props.onChange(e);
                }
              }}
              ref={(rf) => {
                _this["multiple_select_" + state_name] = rf;
              }}
              placeholder={props.title}
              isMulti={true}
              options={Items}
              styles={{
                control: (base) => ({
                  ...base,
                  border: 0,
                  // This line disable the blue border
                  boxShadow: "none",
                  marginTop: -2,
                  backgroundColor: "transparent",
                }),
              }}
            ></Select>
          </View>

          {isError && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
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
          )}
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ display: props.noTitle ? "none" : "flex" }}>
          <Text style={styles.title}>
            {props.title}
            {props.isRequired && <Text style={styles.asterisk}> *</Text>}
          </Text>
          {UI.box(8)}
        </View>

        <View
          style={{
            ...styles.option_container,
            borderColor: isError ? "#EC7B6F" : "#CACACA",
          }}
        >
          <select
            className={"select_" + state_name}
            onChange={(e) => {
              if (_this.setState) {
                _this.setState({
                  [state_name]: e.target.value,
                });
                if (props.onChange) {
                  props.onChange(e.target.value);
                }
              }
            }}
            style={{ height: "100%", width: "100%" }}
          >
            {props.children}
          </select>
        </View>

        {isError && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
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
        )}
      </View>
    );
  };

  EntryPicker = (
    props = { title: "", isRequired: false, noTitle: true, onChange: () => {} }
  ) => {
    return (
      <View style={{ width: 120 }}>
        <this.SelectPicker {...props}>
          <option value="5">5 entries</option>
          <option value="5">10 entries</option>
          <option value="5">25 entries</option>
          <option value="5">100 entries</option>
          <option value="5">All entries</option>
        </this.SelectPicker>
      </View>
    );
  };

  DatePicker = (
    props = {
      title: "",
      isRequired: false,
      placeholder: "mm/dd/yyyy",
      state_name: "",
      _this: null,
      date_props: {},
      additional: "",
      will_correct: false,
    }
  ) => {
    let { state_name } = props;
    let _this = props._this ?? { state: {} };

    let form_errors = _this.state.form_errors ?? [];
    let form_messages = _this.state.form_messages ?? [];
    let isError = false;
    if (form_errors.includes(state_name)) {
      isError = true;
    }

    const borderColor = isError ? "#EC7B6F" : "#CACACA";

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {props.title}
          {props.isRequired && <Text style={styles.asterisk}> *</Text>}
          <Text style={styles.fade}> {props.additional}</Text>
        </Text>
        {UI.box(8)}
        <DateForm
          _this={props._this}
          placeholder={props.placeholder}
          state_name={props.state_name}
          borderColor={borderColor}
          date_props={props.date_props}
          will_correct={props.will_correct}
        />
        {isError && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
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
        )}
      </View>
    );
  };

  TimePicker = (
    props = {
      title: "",
      isRequired: false,
      placeholder: "mm/dd/yyyy",
      state_name: "",
      _this: null,
    }
  ) => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {props.title}
          {props.isRequired && <Text style={styles.asterisk}> *</Text>}
        </Text>
        {UI.box(8)}

        <TimeForm
          _this={props._this}
          placeholder={props.placeholder}
          state_name={props.state_name}
        />
      </View>
    );
  };

  FilePicker = (
    props = {
      title: "",
      additional: "",
      isRequired: false,
      text: "",
      state_name: "",
      _this: null,
      display_type: "filename_size",
      onChange: (file) => {},
    }
  ) => {
    return <FilePicker {...props} />;
  };

  graph_tooltip = (props = { title: "", color: "", value: "" }) => {
    return (
      "<div style=' padding: 10; border-radius: 10px; min-width: 100px; border-style: none; display: flex; height: 90px; box-shadow: 0px 2px 8px -4px #888888; flex-direction: column; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; ' > <span style=' margin-top: 10px; margin-left: 10px; font-size: 13px; color: #535353; font-weight: bold; ' >" +
      props.title +
      "</span > <div style='display: flex; flex-direction: row; align-items: center; margin-left: 10px; margin-top: 10px; margin-right: 10px;'> <div style=' height: 15px; width: 15px; background-color: " +
      props.color +
      "; border-radius: 30px; margin-top: 8px; ' ></div> <span style=' margin-top: 10px; margin-left: 10px; font-size: 16px; color: #535353; font-weight: bold; ' >" +
      props.value +
      "</span > </div> </div>"
    );
  };

  SortFilter = (props = { _this: null, state_name: "" }) => {
    let { _this, state_name } = props;
    let active = _this.state["sort_filter_" + state_name]; //can be day, month, year
    if (!active) {
      active = "day";
      if (props.btn_1) {
        active = props.btn_1.text.toLowerCase();
      }
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onClick={() => {
            if (props.onChange) {
              props.onChange(props.btn_1.text.toLowerCase());
            }
            if (props.btn_1) {
              props.btn_1.onClick(props.btn_1.text.toLowerCase());
            }
          }}
          style={{
            ...styles.sort_filter,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            backgroundColor:
              active == props.btn_1.text.toLowerCase() ? "#EDFBFF" : "white",
          }}
        >
          <Text
            style={{
              ...styles.sort_filter_text,
              color:
                active == props.btn_1.text.toLowerCase()
                  ? "#004F99"
                  : "#BFBFBF",
            }}
          >
            {props.btn_1 ? props.btn_1.text : "Year"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onClick={() => {
            if (props.onChange) {
              props.onChange(props.btn_2.text.toLowerCase());
            }
            if (props.btn_2) {
              props.btn_2.onClick(props.btn_2.text.toLowerCase());
            }
          }}
          style={{
            ...styles.sort_filter,
            marginLeft: -2,
            backgroundColor:
              active == props.btn_2.text.toLowerCase() ? "#EDFBFF" : "white",
          }}
        >
          <Text
            style={{
              ...styles.sort_filter_text,
              color:
                active == props.btn_2.text.toLowerCase()
                  ? "#004F99"
                  : "#BFBFBF",
            }}
          >
            {props.btn_2 ? props.btn_2.text : "Month"}
          </Text>
        </TouchableOpacity>
        {props.btn_4 && (
          <TouchableOpacity
            onClick={() => {
              if (props.onChange) {
                props.onChange(props.btn_4.text.toLowerCase());
              }
              if (props.btn_4) {
                props.btn_4.onClick(props.btn_4.text.toLowerCase());
              }
            }}
            style={{
              ...styles.sort_filter,
              marginLeft: -2,
              backgroundColor:
                active == props.btn_4.text.toLowerCase() ? "#EDFBFF" : "white",
            }}
          >
            <Text
              style={{
                ...styles.sort_filter_text,
                color:
                  active == props.btn_4.text.toLowerCase()
                    ? "#004F99"
                    : "#BFBFBF",
              }}
            >
              {props.btn_4 ? props.btn_4.text : "Month"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onClick={() => {
            if (props.onChange) {
              props.onChange(props.btn_3.text.toLowerCase());
            }
            if (props.btn_3) {
              props.btn_3.onClick(props.btn_3.text.toLowerCase());
            }
          }}
          style={{
            ...styles.sort_filter,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            marginLeft: -2,
            backgroundColor:
              active == props.btn_3.text.toLowerCase() ? "#EDFBFF" : "white",
          }}
        >
          <Text
            style={{
              ...styles.sort_filter_text,
              color:
                active == props.btn_3.text.toLowerCase()
                  ? "#004F99"
                  : "#BFBFBF",
            }}
          >
            {props.btn_3 ? props.btn_3.text : "Day"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export class PreviewFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_previewed: false,
      pdf_link: "",
    };
  }

  toggle_preview = () => {
    this.setState({
      is_previewed: !this.state.is_previewed,
    });
  };

  render() {
    const props = this.props; //props = { url: "", extension: "" }
    let { url, extension, filename } = props;
    const { is_previewed, pdf_link } = this.state;
    if (!url) {
      return <View></View>;
    }
    url = encodeURI(url);
    if (extension == "pdf") {
      return (
        <TouchableOpacity
          onClick={async () => {
            window.open(url);
            //UI.download_file(url, filename);
            /*      const base64 = await UI.url_to_base64(url);
            this.setState({
              pdf_link: base64,
            }); */
          }}
          style={{ marginTop: 10, alignSelf: "flex-start" }}
        >
          <Text style={{ color: UI.colors.secondary }}>Preview</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={{ marginTop: 10, flexDirection: "flex-start" }}>
          <TouchableOpacity style = {{width: 100}} onClick={this.toggle_preview}>
            <Text style={{ color: UI.colors.secondary }}>
              {is_previewed ? "Hide Preview" : "Preview"}
            </Text>
          </TouchableOpacity>
          {UI.box(5)}
          {is_previewed && (
            <TouchableOpacity
              onClick={() => {
                window.open(url);
              }}
              style = {{width: 360}}
            >
              <ImageBackground
                imageFit={ImageFit.COVER}
                source={url}
                style={{ ...styles.preview_image }}
              ></ImageBackground>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  }
}

export const Asterisk = (props) => {
  return <Text style={{ color: "#FF0000", marginLeft: 5 }}>*</Text>;
};

const styles = StyleSheet.create({
  preview_image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    maxWidth: 360,
    borderWidth: 1,
    borderStyle: "solid",
  },
  sort_filter_text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#BFBFBF",
  },
  sort_filter: {
    height: 35,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C9C9C9",
  },
  fade: {
    color: "#BFBFBF",
  },
  file_text: {
    fontSize: 15,
    fontWeight: "bold",
    color: UI.colors.secondary,
  },
  file_container: {
    width: "100%",
    height: 80,
    backgroundColor: "#EFF3F7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C9C9C9",
    borderWidth: 2,
    borderStyle: "dashed",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  asterisk: {
    color: "#FF0000",
  },
  option_container: {
    height: 40,
    width: "100%",
    borderRadius: 5,
    borderStyle: "solid",
    borderWidth: 2,
    padding: 5,
    borderColor: "#CACACA",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: UI.colors.primary,
  },
  btn_text_1: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  blue_btn_2: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: UI.colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Layout = new Helper();
export default Layout;
