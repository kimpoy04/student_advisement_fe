
class Request {
  hosting = "http://internal.malabon.highlysucceed.com/";
  
  request(method = "GET", url = "", parameters = {}, headers = {}, data) {
    return new Promise(async (resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      let new_query_string = "";
      let index = 0;
      let parameter_array = [];

      let param_keys = Object.keys(parameters);
      param_keys.map((param_key) => {
        index++;
        let param_value = parameters[param_key];
        parameter_array.push(param_key + "=" + param_value);
        if (index == param_keys.length) {
          new_query_string = parameter_array.join("&");
        }
      });
      let string = "";
      xhttp.onreadystatechange = async function () {
        string += this.readyState + "  " + this.status + "  " + this.responseText + "\n\n";
        if (this.readyState == 4 && this.status < 400) {
          let response_text = this.responseText;
          try {
            let parsed = JSON.parse(response_text);
            parsed.success = true;
            resolve(parsed);
          } catch (e) {
            resolve(response_text);
          }
        } else if (this.readyState == 4 && this.status >= 400) {
          let response_text = this.responseText;
          try {
            let parsed = JSON.parse(response_text);
            parsed.success = false;
            resolve(parsed);
          } catch (e) {
            resolve(response_text);
          }
        }
      };

      let new_url = this.hosting + url;
      if (method == "GET") {
        new_url = this.hosting + url + "?" + new_query_string;
      }


      xhttp.open(method, new_url, true);

      if (method == "POST") {
        if (!data) {
          xhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
        }
        if (data && Object.keys(parameters).length > 0) {
          xhttp.setRequestHeader(
            "Content-type",
            "multipart/form-data"
          );
        }
        xhttp.setRequestHeader(
          "Accept",
          "application/json"
        );
      }
      if (method == "PUT") {
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.setRequestHeader(
          "Accept",
          "application/json"
        );
      }
      let header_keys = Object.keys(headers);
      header_keys.map((header_key) => {
        let header_value = headers[header_key];
        xhttp.setRequestHeader(header_key, header_value);
      });

      if (data) {
        let keys = Object.keys(parameters);
        if (keys.length > 0) {
          keys.map(item => {
            data.append(item, parameters[item])
          });
        }
        xhttp.send(data);
      } else {
        xhttp.send(new_query_string);
      }
    });
  }


  string = (obj) => {
    return JSON.stringify(obj);
  }
}

const r = new Request();
export default r;
