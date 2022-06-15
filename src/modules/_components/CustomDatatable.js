import React, { Component } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  ImageBackground,
  ImageFit,
  Text,
  StyleSheet,
  Shadow,
} from "../../shared/custom-react-native";
import UI from "../../shared/Components/UI/js";
const cell_min_width = 100;

const empty_data = "-";
const ellipsis = "...";

const width_ranges = [
  {
    range: [0, 450],
    value: 2,
  },
  {
    range: [450, 560],
    value: 3,
  },
  {
    range: [560, 624],
    value: 4,
  },
  {
    range: [624, 724],
    value: 5,
  },
  {
    range: [724, 824],
    value: 6,
  },
  {
    range: [824, 924],
    value: 7,
  },
  {
    range: [924, 1024],
    value: 8,
  },
  {
    range: [1024, 1124],
    value: 9,
  },
  {
    range: [1124, 1224],
    value: 10,
  },
];
function between(x, min, max) {
  return x >= min && x <= max;
}

function clean_int(int) {
  int = parseInt(int);
  if (isNaN(int)) {
    int = 1;
  }

  return int;
}

function number_of_col(width) {
  return new Promise((resolve, reject) => {
    let cols = 100;
    let index = 0;
    width_ranges.map((item) => {
      index++;
      if (between(width, item.range[0], item.range[1])) {
        cols = item.value;
      }
      if (index == width_ranges.length) {
        resolve(cols);
      }
    });
  });
}

export default class CustomDatatable extends Component {
  constructor(props) {
    super(props);

    const { _this, state_name } = props;

    let current_page = props.current_page;
    if (!current_page) {
      current_page = _this.state[state_name + "_current_page"] ?? 1;
    }
    let number_of_pages = props.number_of_pages;
    if (!number_of_pages) {
      number_of_pages = _this.state[state_name + "_number_of_pages"] ?? 1;
    }

    this.state = {
      table_width: this.props._this.state.width,
      number_of_columns: 0,
      hidden_columns: [],
      data: [],
      columns: this.props.columns,
      current_page: current_page,
      custom_current_page: current_page,
      number_of_pages: number_of_pages,
      rendered_pages: [],
      main_pages: [],
      show_custom_pagination: false,
      is_pagination_clicked: false,
      key: this.props.state_name + "_" + Date.now(),
    };
  }

  reset_key = () => {
    this.setState({
      key: this.props.state_name + "_" + Date.now(),
    });
  };
  reload = () => {
    this.setState({
      key: this.props.state_name + "_" + Date.now(),
    });
  };

  componentDidMount = () => {
    this.on_resize();
    this.props._this.on_resize = this.on_resize;
    this.set_data();
    this.set_listener();
    this.props._this["table_" + this.props.state_name] = this;

  };

  componentWillUnmount = () => {
    this.remove_listener();
  };

  set_listener = () => {
    window.addEventListener("click", this.paginator_logic);
  };
  remove_listener = () => {
    window.removeEventListener("click", this.paginator_logic);
  };

  paginator_logic = (e) => {
    if (this.state.show_custom_pagination && this.state.is_pagination_clicked) {
      if (
        !document
          .getElementById("paginator_" + this.props.state_name)
          .contains(e.target)
      ) {
        // Clicked outside box
        this.close_paginator();
      }
    }
    this.setState({
      is_pagination_clicked: true,
    });
  };

  get_custom_pages = () => {
    let { number_of_pages, custom_current_page } = this.state;
    if (custom_current_page > number_of_pages) {
      custom_current_page = number_of_pages;
    }

    custom_current_page = clean_int(custom_current_page);

    let num_pages = [];
    for (let i = 0; i < 5; i++) {
      let page_num = custom_current_page + i - 2;

      if (custom_current_page - 2 <= 0) {
        page_num = i + 1;
      }

      if (custom_current_page + 2 == number_of_pages + 1) {
        page_num = custom_current_page + i - 3;
      }

      if (custom_current_page + 2 == number_of_pages + 2) {
        page_num = custom_current_page + i - 4;
      }

      num_pages.push(page_num);
    }

    return num_pages;
  };

  get_main_pages = () => {
    let { number_of_pages, current_page } = this.state;
    if (current_page > number_of_pages) {
      current_page = number_of_pages;
    }
    current_page = clean_int(current_page);
    let pages = [];
    if (number_of_pages <= 5) {
      for (let i = 0; i < number_of_pages; i++) {
        let page_num = i + 1;
        pages.push(page_num);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let page_num = i + 1;
        if (i == 3) {
          page_num = ellipsis;
        }

        if (i == 0) {
          if (current_page - 1 > 0) {
            page_num = current_page - 1;
          }
        }

        if (i == 1) {
          if (current_page - 1 > 0) {
            page_num = current_page;
          }
        }

        if (i == 2) {
          if (current_page + 1 < number_of_pages) {
            page_num = current_page + 1;
          }

          if (current_page - 1 <= 0) {
            page_num = current_page + 2;
          }
        }

        if (i == 4) {
          page_num = number_of_pages;
        }

        if (current_page + 4 > number_of_pages) {
          if (i == 0) {
            page_num = ellipsis;
          }
          if (i == 1) {
            page_num = number_of_pages - 3;
          }

          if (i == 2) {
            page_num = number_of_pages - 2;
          }

          if (i == 3) {
            page_num = number_of_pages - 1;
          }
          if (i == 4) {
            page_num = number_of_pages;
          }
        }

        pages.push(page_num);
      }
    }

    return pages;
  };

  get_keys = (arr) => {
    return new Promise((resolve, reject) => {
      if (arr.length == 0) {
        resolve([]);
      }

      let new_array = [];
      let index = 0;
      arr.map((item) => {
        index++;
        let key = item[Object.keys(item)[0]];
        new_array.push(key);
        if (index == arr.length) {
          resolve(new_array);
        }
      });
    });
  };

  check_missing_keys = (obj = {}) => {
    return new Promise(async (resolve, reject) => {
      let keys = await this.get_keys(this.props.columns);
      if (keys.length == 0) {
        resolve({ missing: [] });
      }

      let new_array = [];
      let index = 0;
      keys.map((item) => {
        index++;
        if (!(item in obj)) {
          new_array.push(item);
        }

        if (index == keys.length) {
          resolve({ missing: new_array, keys: keys });
        }
      });
    });
  };

  set_missing_keys = (arr = {}) => {
    return new Promise(async (resolve, reject) => {
      if (arr.length == 0) {
        resolve([]);
      }

      let new_array = [];
      let index = 0;

      arr.map(async (item) => {
        index++;
        let missing_keys = await this.check_missing_keys(item);
        missing_keys.missing.map((mk) => {
          item[mk] = empty_data;
        });
        let new_item = {};
        missing_keys.keys.map((key) => {
          new_item[key] = item[key];
        });

        new_array.push(new_item);

        if (index == arr.length) {
          resolve(new_array);
        }
      });
    });
  };

  set_data = async () => {
    let items = await this.set_missing_keys(this.props.data);
    this.setState(
      {
        data: items,
      },
      () => {
        this.set_table_defaults();
      }
    );
  };

  set_table_defaults = async () => {
    const { _this, state_name } = this.props;

    let current_page = _this.state[state_name + "_current_page"] ?? 1;

    let number_of_pages = _this.state[state_name + "_number_of_pages"] ?? 1;
    let total_entries = _this.state[state_name + "_total_entries"] ?? 0;

    this.setState({
      current_page: current_page,
      custom_current_page: current_page,
      number_of_pages: number_of_pages,
      key: this.props.state_name + "_" + Date.now(),
      total_entries: total_entries,
    });
  };

  on_resize = async () => {
    const id = "view_" + this.props.state_name;
    let el = document.getElementById(id);
    if (el == null) {
      return;
    }
    let width = el.offsetWidth;

    let cols = await number_of_col(width);
    this.setState(
      {
        table_width: width,
        number_of_columns: cols,
      },
      () => {
        this.set_hidden_columns();
        this.close_paginator();
      }
    );
  };

  get_hidden = () => {
    return new Promise((resolve, reject) => {
      let { columns, number_of_columns } = this.state;
      if (columns.length == 0) {
        resolve([]);
      }

      let index = 0;
      let new_array = [];

      columns.map((item) => {
        index++;
        if (index > number_of_columns) {
          new_array.push(item[Object.keys(item)[0]]);
        }

        if (index == columns.length) {
          resolve(new_array);
        }
      });
    });
  };

  set_hidden_columns = async () => {
    let hidden = await this.get_hidden();
    this.setState({
      hidden_columns: hidden,
    });
  };

  open_paginator = () => {
    const { _this, state_name } = this.props;

    let current_page = this.props.current_page;
    if (!current_page) {
      current_page = _this.state[state_name + "_current_page"] ?? 1;
    }

    this.setState({
      show_custom_pagination: true,
      is_pagination_clicked: false,
      custom_current_page: current_page,
    });
  };

  close_paginator = () => {
    this.setState({
      show_custom_pagination: false,
      is_pagination_clicked: false,
    });
  };

  toggle_paginator = () => {
    if (this.state.show_custom_pagination) {
      this.close_paginator();
    } else {
      this.open_paginator();
    }
  };

  handle_page = (num) => {
    if (num == ellipsis) {
      this.toggle_paginator();
    } else {
      if (this.props.on_page) {
        this.on_page(num);
        if (this.state.show_custom_pagination) {
          this.close_paginator();
        }
      }
    }
  };

  on_page = (num) => {
    const { _this, state_name } = this.props;

    let current_page = this.props.current_page;
    if (!current_page) {
      current_page = _this.state[state_name + "_current_page"] ?? 1;
    }

    let number_of_pages = this.props.number_of_pages;
    if (!number_of_pages) {
      number_of_pages = _this.state[state_name + "_number_of_pages"] ?? 1;
    }
    this.props.on_page(
      num,
      () => {
        this.setState(
          {
            columns: this.props.columns,
            current_page: current_page,
            custom_current_page: current_page,
            number_of_pages: number_of_pages,
          },
          () => {
            this.set_data();
          }
        );
      },
      this.props.state_name
    );
  };

  minus_page = (page) => {
    return page - 1 > 0 ? page - 1 : 1;
  };

  plus_page = (page) => {
    return page + 1 < this.state.number_of_pages
      ? page + 1
      : this.state.number_of_pages;
  };

  render() {
    const _this = this.props._this;
    let { state_name } = this.props;
    const { width, height, isMobile } = _this.state;
    const {
      table_width,
      number_of_columns,
      number_of_pages,
      current_page,
      custom_current_page,
      show_custom_pagination,
    } = this.state;

    const id = "view_" + state_name;
    let column_number = 0;
    const Headers = this.props.columns.map((item) => {
      column_number++;
      if (number_of_columns < column_number) {
        return <View></View>;
      }
      return <TableHeader text={Object.keys(item)[0]} />;
    });
    let row_id = 0;
    const Rows = this.state.data.map((item, index) => {
      row_id++;
      let columns = [];

      Object.keys(item).map((obj) => {
        let param_name = "";
        let col_obj = this.state.columns.filter((col) => {
          let key = Object.keys(col)[0];
          let value = col[key];
          if (obj == value) {
            param_name = key;
            return true;
          }
        });
        let style = {};
        col_obj = col_obj[0];
        if (col_obj.style) {
          style = col_obj.style;
        }
        let add = {
          text: item[obj],
          style: style,
          name: obj,
          param_name: param_name,
        };
        columns.push(add);
      });

      return (
        <DataRow
          index={index}
          _this={this}
          number_of_columns={number_of_columns}
          columns={columns}
          hidden_columns={this.state.hidden_columns}
          id={row_id}
        />
      );
    });

    let pages = this.get_main_pages();
    let MainPages = pages.map((page_num) => {
      return (
        <PaginationBtn
          onClick={() => {
            this.handle_page(page_num);
          }}
          num={page_num}
          context={this}
        />
      );
    });

    let custom_pages = this.get_custom_pages();
    let CustomPages = custom_pages.map((page_num) => {
      return (
        <PaginationBtn
          onClick={() => {
            this.handle_page(page_num);
          }}
          num={page_num}
          context={this}
          basis={this.state.custom_current_page}
        />
      );
    });

    let pagination_margin_top = UI.measure(
      "pagination_container_" + state_name
    ).y;
    const pagination_width = UI.measure(
      "pagination_container_" + state_name
    ).width;
    if (!pagination_margin_top) {
      pagination_margin_top = 100;
    }
    pagination_margin_top = pagination_margin_top - 80;

    if (pagination_width) {
      if (pagination_width <= 460) {
        pagination_margin_top = pagination_margin_top + 20;
      }
    }

    const size = _this.state[state_name + "_entries"] ?? 10;

    const start_data = (this.state.current_page - 1) * size;
    let start_count = start_data == 0 ? 1 : start_data + 1;
    let end_count = this.state.current_page * size;
    if (end_count > this.state.total_entries) {
      end_count = this.state.total_entries;
    }

    return (
      <View id={id}>
        <View style={styles.column_container}>
          <View
            style={{
              height: 40,
              width: 40,
              display: this.state.hidden_columns.length == 0 ? "none" : "flex",
            }}
          ></View>
          {Headers}
        </View>
        {Rows}

        <View
          id={"pagination_container_" + state_name}
          style={{ display: this.props.data.length > 0 ? "flex" : "none" }}
        >
          <View
            id={"paginator_" + state_name}
            style={{
              ...styles.custom_pagination_container,
              position: show_custom_pagination ? "absolute" : "relative",
              display: show_custom_pagination ? "flex" : "none",
              top: pagination_margin_top,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onClick={() => {
                  this.setState({
                    custom_current_page: this.minus_page(
                      this.state.custom_current_page
                    ),
                  });
                }}
                style={styles.custom_pagination_control_btn}
              >
                <Image
                  height={10}
                  width={10}
                  tintColor={"#484848"}
                  source={UI.MINUS}
                />
              </TouchableOpacity>

              <View style={styles.input_container}>
                <input
                  maxLength={10}
                  onInput={(e) => {
                    let target = e.nativeEvent.target;
                    if (target.value.length > target.maxLength) {
                      target.value = target.value.slice(0, target.maxLength);
                    }
                    let final_value = target.value.replace(/\D/g, "");
                    target.value = final_value;
                    if (final_value) {
                      if (final_value >= number_of_pages) {
                        this.setState({
                          custom_current_page: number_of_pages,
                        });
                        return;
                      }
                      this.setState({
                        custom_current_page: final_value,
                      });
                    } else {
                      this.setState({
                        custom_current_page: final_value,
                      });
                    }
                  }}
                  style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}
                  type={"number"}
                  value={this.state.custom_current_page}
                />
              </View>

              <TouchableOpacity
                onClick={() => {
                  this.setState({
                    custom_current_page: this.plus_page(
                      this.state.custom_current_page
                    ),
                  });
                }}
                style={styles.custom_pagination_control_btn}
              >
                <Image
                  height={10}
                  width={10}
                  tintColor={"#484848"}
                  source={UI.PLUS}
                />
              </TouchableOpacity>

              <View style={{ flex: 1 }}></View>

              <TouchableOpacity
                onClick={() => {
                  this.handle_page(this.state.custom_current_page);
                }}
                style={styles.check_btn}
              >
                <Image
                  height={20}
                  width={20}
                  tintColor={"white"}
                  source={UI.CHECK}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={{ ...styles.page_container, alignSelf: "flex-start" }}>
              {CustomPages}
            </View>
          </View>
          <UI.Row
            basis={table_width}
            breakpoint={460}
            _this={_this}
            style={{
              ...styles.pagination_container,
              alignItems: table_width > 460 ? "center" : "flex-start",
              display: this.props.disable_pagination ? "none" : "flex",
            }}
          >
            <Text style={styles.entry_text}>
              Showing {start_count} to {end_count} of {this.state.total_entries}{" "}
              entries
            </Text>
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                alignSelf: "flex-end",
                marginTop: table_width > 460 ? 0 : 10,
              }}
            >
              <View style={styles.page_btns_container}>
                <TouchableOpacity
                  onClick={() => {
                    this.handle_page(this.minus_page(this.state.current_page));
                  }}
                  style={styles.arrow_btn}
                >
                  <Image
                    height={15}
                    width={15}
                    tintColor={"white"}
                    source={UI.LEFT_ARROW}
                  />
                </TouchableOpacity>
                {UI.box(15)}

                <View style={styles.page_container}>{MainPages}</View>

                {UI.box(15)}
                <TouchableOpacity
                  onClick={() => {
                    this.handle_page(this.plus_page(this.state.current_page));
                  }}
                  style={styles.arrow_btn}
                >
                  <Image
                    height={15}
                    width={15}
                    tintColor={"white"}
                    source={UI.RIGHT_ARROW}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </UI.Row>
        </View>
      </View>
    );
  }
}

const PaginationBtn = (
  props = { onClick: () => {}, num: "", context: null }
) => {
  let is_active = false;
  is_active = props.context.state.current_page == props.num ? true : false;
  if (props.basis) {
    is_active = props.basis == props.num ? true : false;
  }
  return (
    <TouchableOpacity
      onClick={props.onClick}
      style={{
        ...styles.pagination_btn,
        backgroundColor: is_active ? UI.colors.primary : "transparent",
      }}
    >
      <Text style={{ ...styles.white, color: is_active ? "white" : "#535353" }}>
        {props.num}
      </Text>
    </TouchableOpacity>
  );
};

const DataRow = (
  props = {
    _this: null,
    columns: [{ text: "", style: {}, name: "" }],
    number_of_columns: 0,
    hidden_columns: [],
    id: "",
    index: 0,
  }
) => {
  let _this = props._this;
  let col = 0;
  const Cells = props.columns.map((item, index) => {
    col++;
    if (props.number_of_columns < col) {
      return <View></View>;
    }
    if (item.param_name == "ID") {
      item.text = UI.pad(props.index + 1, 12);
    }

    return (
      <DataCell
        index={index}
        _this={_this}
        text={item.text}
        style={item.style}
      />
    );
  });

  const HiddenItems = props.hidden_columns.map((item) => {
    let obj = props.columns.filter((row) => row.name == item)[0];

    return (
      <HiddenItem
        _this={_this}
        name={obj.param_name}
        value={obj.text}
        style={obj.style}
      />
    );
  });
  const data_id = "datacell_" + props.id;
  const show_hidden = _this.state[data_id];

  const show_hidden_btn = props.hidden_columns.length == 0 ? false : true;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onClick={() => {
            _this.setState({
              [data_id]:
                _this.state[data_id] == undefined ||
                _this.state[data_id] == null
                  ? true
                  : !_this.state[data_id],
            });
          }}
          style={{
            ...styles.hidden_btn,
            display: show_hidden_btn ? "flex" : "none",
          }}
        >
          <img
            style={{ height: 20, width: 20 }}
            src={show_hidden ? UI.HIDE : UI.EXPAND}
          />
        </TouchableOpacity>
        {Cells}
      </View>
      <View
        style={{
          ...styles.hidden_item_container,
          display: show_hidden ? (show_hidden_btn ? "flex" : "none") : "none",
        }}
      >
        {HiddenItems}
      </View>
    </View>
  );
};

const HiddenItem = (props = { name: "", value: "", style: {} }) => {
  return (
    <View style={styles.hidden_item}>
      <Text style={styles.hidden_item_header}>{props.name}:</Text>
      <Text style={{ ...styles.hidden_item_content, ...props.style }}>
        {props.value}
      </Text>
    </View>
  );
};

const DataCell = (props = { text: "", style: {}, index: 0 }) => {
  const i = props.index + 1;
  const id = UI.pad(i, 15);

  return (
    <View
      style={{
        ...styles.data_style,
        minWidth: cell_min_width,
        wordWrap: "break-word",
        width: 100,
      }}
    >
      <Text style={{ ...styles.data_text, ...props.style }}>{props.text}</Text>
    </View>
  );
};

const TableHeader = (props = { text: "" }) => {
  return (
    <View style={{ ...styles.table_header, minWidth: cell_min_width }}>
      <Text style={styles.table_header_text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  check_btn: {
    height: 35,
    width: 35,
    borderRadius: 3,
    backgroundColor: UI.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  input_container: {
    height: 30,
    width: 35,
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: "solid",
    marginLeft: 10,
    marginRight: 10,
  },
  custom_pagination_control_btn: {
    height: 30,
    width: 30,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
  },
  custom_pagination_container: {
    alignSelf: "flex-end",
    height: 100,
    minWidth: 200,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 5,
    ...Shadow._3(),
    padding: 10,
  },
  page_btns_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  entry_text: {
    fontSize: 14,
    color: "#B1B1B1",
  },
  pagination_container: {
    minHeight: 70,
    width: "100%",
    alignItems: "center",
    padding: 15,
  },
  white: {
    color: "white",
  },
  pagination_btn: {
    height: 30,
    minWidth: 30,
    backgroundColor: UI.colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  page_container: {
    maxWidth: 200,
    height: 30,
    minWidth: 100,
    borderRadius: 100,
    backgroundColor: "#EAEAEA",
    flexDirection: "row",
  },
  arrow_btn: {
    height: 30,
    width: 30,
    borderRadius: 100,
    backgroundColor: UI.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  hidden_btn: {
    alignSelf: "center",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  hidden_item_container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomStyle: "solid",
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  hidden_item_content: {
    marginLeft: 10,
  },
  hidden_item_header: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hidden_item: {
    flexDirection: "row",
    minHeight: 30,
  },
  data_text: {
    fontWeight: "bold",
    color: "#535353",
    fontSize: 14,
  },
  data_style: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    justifyContent: "center",
    flex: 1,
  },
  column_container: {
    width: "100%",
    backgroundColor: "#EAE9F0",
    flexDirection: "row",
  },
  table_header_text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E2E2E",
  },
  table_header: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 15,
    justifyContent: "center",
  },
});
