import React from "react";
import Images from "../Images/js";
import { View } from "../../custom-react-native";

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

  goTo = (url) => {
    this._this.props.history.push(url)
  };/* 
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

  initiateView = (_this, initialState = {}) => {
    this._this = _this;
    _this.state = {
      width: this.getWidth(),
      height: this.getHeight(),
      isMobile: this.getWidth() < 720 ? true : false,
      ...initialState,
    };
    _this.componentDidMount = () => {
      window.addEventListener("resize", () => {
        this.resize(_this);
        if (_this.on_resize) {
          _this.on_resize();
        }
      });
      if (_this.onCreate) {
        _this.onCreate();
      }
    };

    _this.componentWillUnmount = () => {
      window.removeEventListener("resize", () => {
        this.resize(_this);
      });
    };
  };

  
  uniqid = (prefix = "", random = false) => {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${
      random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
    }`;
  };
  
  Row = (props = {_this: null, style : {}}) => {
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
      <View style = {{...props.style, flexDirection: flexDirection}} >
        {props.children}
      </View>
    );
  } 
  
  Column = (props = {_this: null, style : {}}) => {
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
      <View style = {{...props.style, flexDirection: flexDirection}} >
        {props.children}
      </View>
    );
  } 
  timestampToDate = (timestamp)=> {
    timestamp = parseInt(timestamp);
    var dateObj = new Date(timestamp);
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    let h_m_am_pm = dateObj.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' });
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
      month_string: month_string
    }

    return obj;
  }
}

const UI = new ui();
export default UI;
