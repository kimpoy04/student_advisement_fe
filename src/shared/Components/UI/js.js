import React from "react";
import Images from "../Images/js";
import { View } from "../../custom-react-native";
import api from "../../../modules/_components/Auth";
import Auth from "../../../modules/_components/Auth";

class ui extends Images {
  _this = null;
  search = async (url, parameters = {}) => {
    let add_to_link = await this.encodeParams(parameters);
    url = url + "?" + add_to_link;
    this.goTo(url);
  };

  encodeParams = (parameters = {}) => {
    return new Promise((resolve, reject) => {
      let new_query_string = "";
      let index = 0;
      let parameter_array = [];
      let param_keys = Object.keys(parameters);
      if (param_keys.length == 0) {
        resolve("");
      }
      param_keys.map((param_key) => {
        index++;
        let param_value = parameters[param_key];
        if (!param_value) {
          param_value = "";
        }
        parameter_array.push(param_key + "=" + param_value);
        if (index == param_keys.length) {
          new_query_string = parameter_array.join("&");
          resolve(new_query_string);
        }
      });
    });
  };

  form_errors = [];
  form_messages = [];

  error_form = (state_name, message) => {
    return new Promise((resolve, reject) => {
      const _this = this._this;
      clearTimeout(_this.error_timeout);
      _this.setState({
        error_count: (_this.state.error_count ?? 0) + 1,
      });

      this.form_errors.push(state_name);
      this.form_messages.push({ [state_name]: message });

      _this.error_timeout = setTimeout(() => {
        _this.setState({
          form_errors: this.form_errors,
          form_messages: this.form_messages,
        });

        //clear errors after 10 seconds
        _this.error_timeout = setTimeout(this.clear_errors, 10000);
      }, 100);
      resolve();
    });
  };

  clear_errors = () => {
    return new Promise((resolve, reject) => {
      const _this = this._this;
      _this.setState({
        form_errors: [],
        form_messages: [],
        error_count: 0,
      });
      this.form_errors = [];
      this.form_messages = [];
      setTimeout(() => {
        resolve();
      }, 10);
    });
  };

  goTo = (url) => {
    this._this.props.history.push(url);
  }; /* 
  goTo = (url) => {
    window.location.href = url;
  };
 */
  getWidth = () => {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  };
  getHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  };

  colors = {
    primary: "#04CCFF",
    secondary: "#004F99",
    black: "#5D5D5D",
    yellow: "#FCC203",
  };
  box = (size) => {
    return <div style={{ height: size, width: size }}></div>;
  };

  PadView = (props = { _this: null, style: {} }) => {
    const _this = props._this;
    const width = _this.state.width;
    const paddingX = width * 0.05;

    return (
      <View
        style={{
          width: "100%",
          paddingRight: paddingX,
          paddingLeft: paddingX,
          ...props.style,
        }}
      >
        {props.children}
      </View>
    );
  };

  resize(_this) {
    const width = this.getWidth();
    if (width !== _this.state.width) {
      _this.setState({
        width: width,
        height: this.getHeight(),
      });
      this.checkIfMobile(_this);
    }
  }

  get_file = async () => {
    return new Promise((resolve, reject) => {
      let input = document.createElement("input");
      input.type = "file";

      input.onchange = (ev) => {
        const file = input.files[0];
        resolve(file);
      };
      input.click();
    });
  };

  get_file_extension = (filename) => {
    return filename?.substring(filename.lastIndexOf(".") + 1).toLowerCase();
  };

  url_to_base64 = (url) => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  get_specific_file = async (allowed_extensions = []) => {
    return new Promise((resolve, reject) => {
      let input = document.createElement("input");
      input.type = "file";
      console.log(input);

      input.onchange = (ev) => {
        const file = input.files[0];
        var url = input.value;
        var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
        if (input.files && input.files[0] && allowed_extensions.includes(ext)) {
          var reader = new FileReader();

          reader.onload = (e) => {
            resolve({ file, uri: e.target.result });
          };
          reader.readAsDataURL(input.files[0]);
        }
      };
      input.click();
    });
  };

  get_image = async (other_extension = []) => {
    return new Promise((resolve, reject) => {
      let input = document.createElement("input");
      input.type = "file";
      console.log(input);

      input.onchange = (ev) => {
        const file = input.files[0];
        var url = input.value;
        var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
        if (
          input.files &&
          input.files[0] &&
          (ext == "gif" ||
            ext == "png" ||
            ext == "jpeg" ||
            ext == "jpg" ||
            other_extension.includes(ext))
        ) {
          var reader = new FileReader();

          reader.onload = (e) => {
            resolve({ file, uri: e.target.result });
          };
          reader.readAsDataURL(input.files[0]);
        }
      };
      input.click();
    });
  };

  checkIfMobile = (_this) => {
    let width = _this.state.width;
    if (width < 720) {
      _this.setState({
        isMobile: true,
      });
    } else {
      _this.setState({
        isMobile: false,
      });
    }
  };

  initiateView = (_this, initialState = {}, options) => {
    this._this = _this;
    _this.state = {
      width: this.getWidth(),
      height: this.getHeight(),
      isMobile: this.getWidth() < 720 ? true : false,
      ...initialState,
    };
    _this.componentDidMount = async () => {
      window.addEventListener("resize", () => {
        this.resize(_this);
        if (_this.on_resize) {
          _this.on_resize();
        }
      });
      let will_except = false;
      if (options) {
        if (options.auth_exception) {
          will_except = true;
        }
      }
      let user = {};

      if (will_except == true) {
      } else {
        const api = new Auth({ _this });
        user = await api.authenticate();
      }

      if (_this.onCreate) {
        _this.onCreate(user);
      }
    };

    _this.componentWillUnmount = () => {
      window.removeEventListener("resize", () => {
        this.resize(_this);
      });

      if (_this.onDestroy) {
        _this.onDestroy();
      }
    };
  };

  pad = (num, size, isDecimal = false) => {
    if (num == undefined || num == null) {
      return "";
    }
    let n = num.toString();
    while (n.length < size) n = "0" + n;
    if (isDecimal) {
      if (num.length == 0) {
        num = "0";
      }
      num = Number.parseInt(num);
      let temp = num.toFixed(2);
      temp = temp.toString();
      const arr = temp.split(".");
      const suffix = arr[1];

      return n + "." + suffix;
    } else {
      return n;
    }
  };

  pad2 = (number) => {
    return this.pad(number, 2);
  };

  uniqid = (prefix = "", random = false) => {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${
      random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
    }`;
  };

  title_case = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  Row = (props = { _this: null, style: {} }) => {
    const _this = props._this;
    const isMobile = _this.state.isMobile;
    let flexDirection = "row";
    if (isMobile) {
      flexDirection = "column";
    } else {
      flexDirection = "row";
    }
    if (props.breakpoint != undefined) {
      const width = _this.state.width;
      if (width <= props.breakpoint) {
        flexDirection = "column";
        if (props.breakpoint_2 != undefined) {
          if (width <= props.breakpoint_2) {
            flexDirection = "row";
          } else {
            flexDirection = "column";
          }
        }
      } else {
        flexDirection = "row";
      }
    }
    return (
      <View style={{ ...props.style, flexDirection: flexDirection }}>
        {props.children}
      </View>
    );
  };

  Column = (props = { _this: null, style: {} }) => {
    const _this = props._this;
    const isMobile = _this.state.isMobile;
    const width = _this.state.width;
    let flexDirection = "column";
    if (isMobile) {
      flexDirection = "row";
    } else {
      flexDirection = "column";
    }
    if (props.breakpoint != undefined) {
      if (width <= props.breakpoint) {
        flexDirection = "row";
        if (props.breakpoint_2 != undefined) {
          if (width <= props.breakpoint_2) {
            flexDirection = "column";
          } else {
            flexDirection = "row";
          }
        }
      } else {
        flexDirection = "column";
      }
    }
    return (
      <View style={{ ...props.style, flexDirection: flexDirection }}>
        {props.children}
      </View>
    );
  };
  timestampToDate = (timestamp) => {
    timestamp = parseInt(timestamp);
    var dateObj = new Date(timestamp);
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    let h_m_am_pm = dateObj.toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "2-digit",
    });
    let newdate = year + "/" + month + "/" + day + " " + h_m_am_pm;
    let am_pm = h_m_am_pm.split(" ")[1].toLowerCase();
    let h_m = h_m_am_pm.split(" ")[0];
    let h = h_m.split(":")[0];
    let m = h_m.split(":")[1];

    let month_string = "";
    if (month == 1) {
      month_string = "January";
    } else if (month == 2) {
      month_string = "February";
    } else if (month == 3) {
      month_string = "March";
    } else if (month == 4) {
      month_string = "April";
    } else if (month == 5) {
      month_string = "May";
    } else if (month == 6) {
      month_string = "June";
    } else if (month == 7) {
      month_string = "July";
    } else if (month == 8) {
      month_string = "August";
    } else if (month == 9) {
      month_string = "September";
    } else if (month == 10) {
      month_string = "October";
    } else if (month == 11) {
      month_string = "November";
    } else if (month == 12) {
      month_string = "December";
    }

    let obj = {
      year: year,
      month: month,
      day: day,
      am_pm: am_pm,
      h_m: h_m,
      hour: h,
      minute: m,
      month_string: month_string,
    };

    return obj;
  };

  get_year_month_from_date = (date, delimiter = "-") => {
    const d = new Date(date);
    return d.getFullYear() + delimiter + (d.getMonth() + 1);
  };

  get_current_date = () => {
    const date = this.timestampToDate(Date.now());

    return date.month + "/" + this.pad2(date.day) + "/" + date.year;
  };
  get_date_string_by_timestamp = (timestamp) => {
    const date = this.timestampToDate(timestamp);

    return date.month + "/" + this.pad2(date.day) + "/" + date.year;
  };
  get_date_string_by_date = (d) => {
    const date = this.timestampToDate(new Date(d).getTime());

    const value = date.month + "/" + this.pad2(date.day) + "/" + date.year;
    if (!date.month || !date.day || !date.year) {
      return "";
    }
    return value;
  };
  get_dateobj_from_string = (mmddyyyy) => {
    const split = mmddyyyy.split("/");
    const month = parseInt(split[0]);
    const day = parseInt(split[1]);
    const year = parseInt(split[2]);
    const d = new Date();
    d.setMonth(month - 1);
    d.setDate(day);
    d.setFullYear(year);
    return d;
  };
  get_date_time_string_by_date = (d) => {
    const date = this.timestampToDate(new Date(d).getTime());

    const value =
      date.month +
      "/" +
      this.pad2(date.day) +
      "/" +
      date.year +
      " " +
      date.h_m +
      " " +
      date.am_pm;
    if (!date.month || !date.day || !date.year) {
      return "";
    }
    return value;
  };
  get_current_date_string = () => {
    const date = this.timestampToDate(Date.now());
    return date.month_string + " " + this.pad2(date.day) + ", " + date.year;
  };
  get_current_date_hr_mm_string = () => {
    const date = this.timestampToDate(Date.now());

    return (
      date.month_string +
      " " +
      this.pad2(date.day) +
      ", " +
      date.year +
      " " +
      date.h_m +
      " " +
      date.am_pm
    );
  };

  get_hhmmss_from_date = (date) => {
    let d = new Date(date);
    const timestamp = d.getTime();
    const obj = this.timestampToDate(timestamp);
    const value =
      this.pad2(parseInt(obj.h)) +
      ":" +
      this.pad2(parseInt(obj.m)) +
      ":" +
      this.pad2(parseInt(obj.s)) +
      " " +
      obj.AM_PM;

    return value; /* 
    let datetext = d.toTimeString();
    datetext = datetext.split(" ")[0];
    return datetext; */
  };

  msToHMS = (ms) => {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = parseInt(seconds / 60);
    seconds = seconds % 60;
    return hours + ":" + minutes + ":" + seconds;
  };

  set_context = (_this) => {
    this._this = _this;
  };
  showLoading = () => {
    this._this.setState({ showLoading: true });
  };
  hideLoading = () => {
    this._this.setState({ showLoading: false });
  };

  goBack = () => {
    window.history.back();
  };

  paginate = (array, page_size, page_number) => {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  };

  get_entries = (
    all_data = [],
    size = 1,
    table_name,
    page_number = 1,
    config = {}
  ) => {
    const context = this._this;
    page_number = parseInt(page_number);
    if (!size) {
      size = context.state[table_name + "_entries"];
    }

    if (!all_data) {
      all_data = context.state.all_data;
    }

    const slicedArray = this.paginate(all_data, size, page_number);
    // const slicedArray = all_data.slice(0, size);
    let totalPage =
      all_data.length < size ? 1 : Math.ceil(all_data.length / size);
    if (config?.total) {
      context.setState(
        {
          [table_name + "_entries"]: size,
          [table_name + "_current_page"]: page_number,
          [table_name + "_number_of_pages"]: config.pages,
          [table_name + "_total_entries"]: config.total,
        },
        () => {
          // context.set_select_value(table_name, size);

          const table = context["table_" + table_name];
          table.set_data();
        }
      );
    } else {
      context.setState(
        {
          [table_name + "_entries"]: size,
          [table_name + "_current_page"]: page_number,
          [table_name + "_number_of_pages"]: totalPage,
          [table_name + "_total_entries"]: all_data.length,
        },
        () => {
          // context.set_select_value(table_name, size);

          const table = context["table_" + table_name];
          table.set_data();
        }
      );
    }

    return slicedArray;
  };

  reload_table = (state_name, all_data, data_name) => {
    const table = this._this["table_" + state_name];
    if (table) {
      if (!all_data) {
        all_data = this._this.state.all_data;
      }
      if (!data_name) {
        data_name = "data";
      }

      if (this._this.state.will_filter) {
        all_data = this._this.state.filtered_data;
      }

      if (this._this.state.search) {
        all_data = this._this.state[data_name + "_temp"];
      }

      let sliced_data = this.get_entries(all_data, null, state_name);

      this._this.setState(
        {
          [data_name]: sliced_data,
        },
        () => {
          table.set_data();
        }
      );
    }
  };
  measure = (id) => {
    let el = document.getElementById(id);
    if (el) {
      let bounds = el.getBoundingClientRect(el);
      return bounds;
    }
    return {};
  };

  set_input_value = (state_name, value) => {
    const inputs = document.getElementsByClassName("input_" + state_name);
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      input.value = value;
    }

    this._this.setState({
      [state_name]: value,
    });
  };
  set_select_value = (state_name, value) => {
    const els = document.getElementsByClassName("select_" + state_name);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      el.value = value;
    }
    this._this.setState({
      [state_name]: value,
    });
  };
  set_multiple_select_value = (state_name, value) => {
    const _this = this._this;

    _this["reload_multiple_option_" + state_name]();
    if (_this["multiple_select_" + state_name]) {
      const options = _this.state["options_" + state_name];
      const selected = value.map((item) => {
        return options.filter((obj) => obj.value == item)[0];
      });
      _this["multiple_select_" + state_name].setValue(selected);
    }
    _this.setState({
      [state_name]: value,
    });
  };

  reload_multiple_select = (state_name) => {
    const _this = this._this;
    _this.setState({
      ["options_" + state_name]: null,
    });
  };
}

const UI = new ui();
export default UI;
