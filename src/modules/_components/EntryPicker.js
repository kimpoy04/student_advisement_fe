import React, { Component } from "react";
import { StyleSheet, View } from "../../shared/custom-react-native";
import APIConstants from "../../shared/modules/APIConstants";
import Layout from "./Layout";
const Constants = new APIConstants();
export default class EntryPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      did_set_entries: false,
    };
  }

  componentDidMount = () => {
    const props = this.props;
    const { table_name, _this, stateless } = props;
    if (stateless) {
      _this.setState({
        [table_name + "_entries"]: Constants.default_entries,
      });
    } else {
      this.set_entries(Constants.default_entries);
    }
  };

  set_entries = (e, will_reload, data_name = null) => {
    const props = this.props;
    const { table_name, data, _this, stateless, callback } = props;

    _this.setState(
      {
        [table_name + "_entries"]: e,
      },
      () => {
        if (stateless) {
          if (callback) {
            callback();
          }
        } else {
          if (will_reload) {
            _this.reload_table(table_name, null, data_name);
          }
        }
      }
    );
  };

  render() {
    const props = this.props;
    const { table_name, data, _this, data_name } = props;

    return (
      <View style={{ width: 120 }}>
        <Layout.SelectPicker
          onChange={(e) => {
            this.set_entries(e, true, data_name ? data_name : null);
          }}
          {...props}
          state_name={table_name}
        >
          <option value={"5"}>5 entries</option>
          <option value={"10"}>10 entries</option>
          <option value={"25"}>25 entries</option>
          <option value={"100"}>100 entries</option>
          <option value={Constants.limits.max_int}>All entries</option>
        </Layout.SelectPicker>
      </View>
    );
  }
}

export function autoPopulate(arr) {
  let new_array = [...arr, ...arr, ...arr, ...arr, ...arr];
  new_array = [
    ...new_array,
    ...new_array,
    ...new_array,
    ...new_array,
    ...new_array,
  ];
  new_array = [
    ...new_array,
    ...new_array,
    ...new_array,
    ...new_array,
    ...new_array,
  ];

  return new_array;
}

const styles = StyleSheet.create({});
