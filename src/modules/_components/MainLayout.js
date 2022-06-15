import React, { Component } from "react";
import "./css.css";
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
import Loading from "../_components/Loading";
import InputForm from "../_components/InputForm";
import Layout from "../_components/Layout";
import Modal from "../_components/Modal";
import mem from "../../shared/Components/Memory/js";

export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_type: "",
    };
  }

  componentDidMount = async () => {
    const { _this } = this.props;
    UI.set_context(_this);

    _this.show_modal = this.show_modal;
    _this.hide_modal = this.hide_modal;
    _this.loading = this.loading;

    this.setState({
      user_type: mem.get("user_type"),
    });
  };

  show_modal = (content) => {
    const { _this } = this.props;
    _this.setState({
      modal_content: content,
      modal_display: true,
    });
  };
  hide_modal = () => {
    const { _this } = this.props;
    _this.setState({
      modal_content: "",
      modal_display: false,
    });
  };

  render() {
    const { tab, _this } = this.props;
    const state = _this.state;
    const { modal_display } = state;

    const { user_type } = this.state;

    return (
      <View style={{ ...styles.main_container }}>
        <Loading
          ref={(v) => {
            this.loading = v;
          }}
        />

        <Modal visible={modal_display} _this={_this} />
        <View
          style={{
            width: 220,
            height: "100%",
            backgroundColor: "white",
            paddingTop: 20,
          }}
        >
          <Text style={styles.header_text}>Student</Text>
          <Text style={styles.header_text}>Advisement</Text>

          {UI.box(30)}

          {user_type == "admin" && (
            <>
              <DrawerItem tab={tab} text={"Courses"} path={"/admin/courses"} />
              <DrawerItem
                tab={tab}
                text={"Subjects"}
                path={"/admin/subjects"}
              />
              <DrawerItem
                tab={tab}
                text={"Student Records"}
                path={"/admin/student-records"}
              />
              <DrawerItem
                tab={tab}
                text={"Summary of Subjects"}
                path={"/admin/summary-of-subjects"}
              />
            </>
          )}

          {user_type == "student" && (
            <>
              <DrawerItem
                tab={tab}
                text={"Profile"}
                path={"/student/profile"}
              />
              <DrawerItem
                tab={tab}
                text={"Enrolled Subjects"}
                path={"/student/enrolled-subjects"}
              />
              <DrawerItem
                tab={tab}
                text={"Not Yet Taken"}
                path={"/student/not-yet-taken"}
              />
            </>
          )}
          <View style={{ flex: 1 }}></View>
          <DrawerItem
            tab={"Logout"}
            text={"Logout"}
            path={"/student/not-yet-taken"}
            onClick={() => {
              mem.clear();
              setTimeout(() => {
                _this.componentDidMount();
              }, 10);
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>{this.props.children}</ScrollView>
        </View>
      </View>
    );
  }
}

const DrawerItem = (
  props = { tab: "", text: "", onClick: () => {}, path: "" }
) => {
  let is_active = false;
  if (props.tab == props.text) {
    is_active = true;
  }

  return (
    <TouchableOpacity
      onClick={() => {
        UI.goTo(props.path);
        if (props.onClick) {
          props.onClick();
        }
      }}
      style={{
        width: "100%",
        height: 40,
        backgroundColor: is_active ? "#00b894" : "white",
        justifyContent: "center",
        paddingLeft: 30,
      }}
    >
      <Text
        style={{
          color: is_active ? "white" : UI.colors.primary,
          fontWeight: "bold",
          fontSize: 14,
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header_text: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0984e3",
    flexDirection: "row",
  },
});
