import React, { Component } from "react";
import UI from "../../shared/Components/UI/js";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "../../shared/custom-react-native";

export default class FilePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initial_text: "Drop Your File Here",
      image: null,
    };
  }

  componentDidMount = () => {
    let el = document.getElementById("drop_" + this.props.state_name);
    let fileInput = document.getElementById("file_" + this.props.state_name);
    el.ondragenter = function (evt) {
      evt.preventDefault();
    };
    el.ondragover = function (evt) {
      evt.preventDefault();
    };

    el.ondrop = (evt) => {
      let files = evt.dataTransfer.files;
      this.processFileList(files);

      evt.preventDefault();
    };

    this.setState({
      initial_text: this.props.text,
    });

    const _this = this.props._this;
    const state_name = this.props.state_name;

    let filepickers = _this["filepickers_" + state_name];
    if (!filepickers) {
      _this["filepickers_" + state_name] = [];
      filepickers = _this["filepickers_" + state_name];
    }

    filepickers.push(this);
  };

  set_text = (text) => {
    this.setState({
      initial_text: text,
    });
  };

  processFileList = async (fileList) => {
    let fileInput = document.getElementById("file_" + this.props.state_name);
    if (this.props.onChange && fileList.length > 0) {
      // fileInput.files = fileList;
      if (fileList.length > 0) {
        const file = fileList[0];
        var ext = UI.get_file_extension(file.name).toLowerCase();

        await this.validate_allowed_files(ext);

        const { display_type } = this.props;
        const file_size = UI.get_file_size(file);
        if (display_type == "filename_size") {
          this.set_initial_text(file?.name + " (" + file_size + ")");
        }

        this.props.onChange(file); //get first file only
      }
    }
  };

  get_uri_from_file = async (file /* files[0] */) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  pickFile = () => {
    let el = document.getElementById("file_" + this.props.state_name);
    el.click();
  };

  set_initial_text = (text) => {
    const _this = this.props._this;
    const state_name = this.props.state_name;

    let filepickers = _this["filepickers_" + state_name];
    if (!filepickers) {
      _this["filepickers_" + state_name] = [];
      filepickers = _this["filepickers_" + state_name];
    }

    filepickers.map((item) => {
      item.set_text(text);
    });
  };

  onChange = async (evt) => {
    this.processFileList(evt.target.files);
    var ext = evt.target.value
      .substring(evt.target.value.lastIndexOf(".") + 1)
      .toLowerCase();

    if (evt.target.files.length == 0) {
      return;
    }
    await this.validate_allowed_files(ext);
    const { display_type } = this.props;
    const filename = evt.target.value.split(/(\\|\/)/g).pop();

    if (evt.target.files[0]) {
      const file_size = UI.get_file_size(evt.target.files[0]);

      if (display_type == "filename_size") {
        /*this.setState({
          initial_text: filename + " (" + file_size + ")",
        }); */
        this.set_initial_text(filename + " (" + file_size + ")");
      } else if (display_type == "image") {
        this.set_image(evt);
      }
    }
  };

  set_image = (evt) => {
    const input = evt.target;
    var url = input.value;
    var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();

    if (
      input.files &&
      input.files[0] &&
      (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")
    ) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.setState({
          image: e.target.result,
        });
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      this.setState({
        image: null,
      });
      this.invalid_file();
    }
  };

  validate_allowed_files = (ext) => {
    return new Promise((resolve, reject) => {
      const allowed_files = this.props.allowed_files ?? [];
      if (allowed_files.includes(ext)) {
        resolve();
      } else {
        if (allowed_files.length == 0) {
          resolve();
        } else {
          this.invalid_file();
        }
      }
    });
  };

  invalid_file = () => {
    let props = this.props;
    let { state_name, _this } = props;
    if (_this) {
      if (_this.failed_modal) {
        _this.failed_modal("Invalid file format.");
        const input_element = document.getElementById("file_" + state_name);
        input_element.value = null;
      }
    }
  };

  render() {
    let props = this.props;
    let { state_name, display_type, _this } = props;
    let { initial_text } = this.state;

    if (initial_text != "Drop Your File Here") {
      initial_text = "File Uploaded";
    }

    let form_errors = _this.state.form_errors ?? [];
    let form_messages = _this.state.form_messages ?? [];
    let isError = false;
    if (form_errors.includes(state_name)) {
      isError = true;
    }

    const borderColor = isError ? "#EC7B6F" : "#c9c9c9";

    let showed_item = this.props.component ? (
      this.props.component
    ) : (
      <View
        onClick={() => {
          this.pickFile();
        }}
        style={{
          ...styles.file_container,
          height: props.height ? props.height : 80,
          paddingLeft: 10,
          paddingRight: 10,
          borderColor,
          maxWidth: 400,
        }}
      >
        <Image
          height={59.35 * 0.6}
          width={53.29 * 0.6}
          source={UI.FOLDER}
          tintColor={"transparent"}
        />
        {UI.box(20)}
        <Text style={styles.file_text}>{initial_text}</Text>
      </View>
    );

    if (display_type == "image" && this.state.image) {
      showed_item = (
        <img
          onClick={() => {
            this.pickFile();
          }}
          style={{
            ...styles.file_container,
            height: props.height ? props.height : 80,
            width: "100%",
            objectFit: "cover",
            borderRadius: 10,
          }}
          src={this.state.image}
        />
      );
    }

    return (
      <View id={"drop_" + state_name} style={{ width: "100%" }}>
        <input
          onChange={this.onChange}
          hidden
          id={"file_" + state_name}
          type={"file"}
        />
        <Text style={styles.title}>
          {props.title}
          {props.isRequired && <Text style={styles.asterisk}> *</Text>}
          <Text style={styles.fade}> {props.additional}</Text>
        </Text>
        {UI.box(8)}
        {showed_item}
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
}

const styles = StyleSheet.create({
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
