import axios from "axios";
import mem from "../Memory/js";

class Request {
  protocol = "http://";
  path = "student-advisement.backend.ksmiguel.com";
  hosting = this.protocol + this.path;

  async request(
    props = {
      method: "",
      url: "",
      params: {},
      onSuccess: () => {},
      onFail: () => {},
      onFinish: () => {},
      isMultiPart: false,
    }
  ) {
    let token = mem.get("jwt_token");
    const req = axios.create({
      baseURL: this.hosting + props.url,
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (props.isMultiPart) {
      req.defaults.headers.common["Content-Type"] = "multipart/form-data";
    }

    let final_url = "";

    let queryParams = "";

    if (!props.isMultiPart) {
      if (props.params) {
        queryParams = await this.encodeParams(props.params);
      }
    }

    if (props.url.includes("?")) {
      final_url = "&" + queryParams;
    } else {
      final_url = "?" + queryParams;
    }

    let params = props.params;

    if (props.isMultiPart) {
      if (props.params) {
        params = new FormData();
        Object.keys(props.params).map((key) => {
          params.append(key, props.params[key]);
        });
      }
    }

    const response = await req[props.method.toLowerCase()](
      final_url,
      params
    ).catch((err) => {
      if (err) {
        if (props.onFail) {
          if (err.response) {
            console.log(err.response.data.error);
            props.onFail(err.response.data.error);
          }
        }
      }
      if (props.onFinish) {
        props.onFinish();
      }
    });
    if (response) {
      if (props.onSuccess) {
        // console.log(response.data);
        props.onSuccess(response.data);
      }
      setTimeout(() => {
        if (props.onFinish) {
          props.onFinish();
        }
      }, 300);
    }
  }

  async request_with_token(
    props = {
      method: "",
      url: "",
      params: {},
      onSuccess: () => {},
      onFail: () => {},
      onFinish: () => {},
      isMultiPart: false,
      token: ""
    }
  ) {
    // let token = mem.get("jwt_token");
    const req = axios.create({
      baseURL: this.hosting + props.url,
      headers: {
        Authorization: "Bearer " + props.token,
      },
    });

    if (props.isMultiPart) {
      req.defaults.headers.common["Content-Type"] = "multipart/form-data";
    }

    let final_url = "";

    let queryParams = "";

    if (!props.isMultiPart) {
      if (props.params) {
        queryParams = await this.encodeParams(props.params);
      }
    }

    if (props.url.includes("?")) {
      final_url = "&" + queryParams;
    } else {
      final_url = "?" + queryParams;
    }

    let params = props.params;

    if (props.isMultiPart) {
      if (props.params) {
        params = new FormData();
        Object.keys(props.params).map((key) => {
          params.append(key, props.params[key]);
        });
      }
    }

    const response = await req[props.method.toLowerCase()](
      final_url,
      params
    ).catch((err) => {
      if (err) {
        if (props.onFail) {
          if (err.response) {
            console.log(err.response.data.error);
            props.onFail(err.response.data.error);
          }
        }
      }
      if (props.onFinish) {
        props.onFinish();
      }
    });
    if (response) {
      if (props.onSuccess) {
        // console.log(response.data);
        props.onSuccess(response.data);
      }
      setTimeout(() => {
        if (props.onFinish) {
          props.onFinish();
        }
      }, 300);
    }
  }

  string = (obj) => {
    return JSON.stringify(obj);
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
}

const r = new Request();
export default r;
