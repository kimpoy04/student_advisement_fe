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
  r,
} from "../../shared/custom-react-native";
import UI from "../../shared/Components/UI/js";
import Loading from "../_components/Loading";
import InputForm from "../_components/InputForm";
import Layout from "../_components/Layout";
import MainLayout from "../_components/MainLayout";
import { Success, Failed } from "../_components/Modal";

export default class AdminAddCourse extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      name: "",
    });
  }

  onCreate = async () => {};

  submit = async () => {
    await UI.clear_errors();
    const { name } = this.state;

    if (!name) {
      await UI.error_form("name", "Course Name is required.");
    }

    const error_count = this.state.error_count;
    if (error_count > 0) {
      return;
    }

    this.loading.show();

    r.request({
      method: "post",
      url: "/courses",
      params: { name },
      onSuccess: async (e) => {
        this.show_modal(
          <Success
            description={"You have successfully added a course."}
            onDismiss={() => {
              UI.goTo("/admin/courses");
            }}
          />
        );
      },
      onFail: (e) => {
        this.show_modal(
          <Failed
            description={e.message}
            onDismiss={() => {
              this.hide_modal();
            }}
          />
        );
      },
      onFinish: () => {
        if (this.loading) {
          this.loading.hide();
        }
      },
    });
  };

  render() {
    const { height, width } = this.state;
    const _this = this;

    return (
      <MainLayout _this={_this} tab={"Courses"}>
        <View style={{ backgroundColor: "white", margin: 30, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Course</Text>
          {UI.box(30)}

          <InputForm
            _this={_this}
            title={"Course Name"}
            placeholder={"Enter Course Name Here"}
            state_name={"name"}
            style={{ width: 300 }}
            isRequired={false}
          />
          {UI.box(30)}

          <Layout.Btn
            text={"SAVE"}
            color={"#00b894"}
            onClick={this.submit}
            style={{ width: 100 }}
          />
        </View>
      </MainLayout>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0984e3",
    flexDirection: "row",
  },
});
