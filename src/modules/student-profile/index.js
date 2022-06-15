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
  r
} from "../../shared/custom-react-native";
import UI from "../../shared/Components/UI/js";
import Loading from "../_components/Loading";
import InputForm from "../_components/InputForm";
import Layout from "../_components/Layout";
import MainLayout from "../_components/MainLayout";
import { get_courses } from "../actions";
import { Success, Failed } from "../_components/Modal";

export default class StudentProfile extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      id: "",
      name: "",
      courses: [],
    });
  }

  onCreate = async (user) => {
    this.loading.show();
    const id = this.props.match.params.id;
    this.setState({
      id: id,
      courses: await get_courses(),
    });

    UI.set_select_value("course_id", user.course_id);
    UI.set_select_value("year_level", user.year_level);
    UI.set_input_value("email", user.email);
    UI.set_input_value("student_number", user.student_number);
    UI.set_input_value("first_name", user.first_name);
    UI.set_input_value("last_name", user.last_name);
    this.loading.hide();
  };

  submit = async () => {
    await UI.clear_errors();
    const { student_number, first_name, last_name, course_id, year_level } =
      this.state;

    if (!last_name) {
      await UI.error_form("last_name", "Last Name is required.");
    }
    if (!student_number) {
      await UI.error_form("student_number", "Student Number is required.");
    }

    if (!course_id) {
      await UI.error_form("course_id", "Course Name is required.");
    }
    if (!first_name) {
      await UI.error_form("first_name", "First Name is required.");
    }

    if (!year_level) {
      await UI.error_form("year_level", "Year Level is required.");
    }

    const error_count = this.state.error_count;
    if (error_count > 0) {
      return;
    }

    this.loading.show();

    r.request({
      method: "patch",
      url: "/user",
      params: {
        student_number,
        first_name,
        last_name,
        course_id: parseInt(course_id),
        year_level: parseInt(year_level),
      },
      onSuccess: async (e) => {
        this.show_modal(
          <Success
            description={"You have successfully updated your account."}
            onDismiss={() => {
              this.hide_modal();
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

    const Courses = this.state.courses.map((item) => {
      return <option value={item.id}>{item.name}</option>;
    });

    return (
      <MainLayout _this={_this} tab={"Profile"}>
        <View style={{ backgroundColor: "white", margin: 30, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Profile</Text>
          {UI.box(30)}

          <View style={{ width: 300 }}>
            <InputForm
              _this={_this}
              title={"Student Number"}
              placeholder={"Enter Student Number Here"}
              state_name={"student_number"}
              style={{ flex: 1 }}
              isRequired={false}
            />
            {UI.box(10)}
            <InputForm
              _this={_this}
              title={"First Name"}
              placeholder={"Enter First Name Here"}
              state_name={"first_name"}
              style={{ flex: 1 }}
              isRequired={false}
            />
            {UI.box(10)}
            <InputForm
              _this={_this}
              title={"Last Name"}
              placeholder={"Enter Last Name Here"}
              state_name={"last_name"}
              style={{ flex: 1 }}
              isRequired={false}
            />
            {UI.box(10)}
            <Layout.SelectPicker
              _this={_this}
              title={"Course Name"}
              state_name={"course_id"}
              style={{ width: 300 }}
            >
              {Courses}
            </Layout.SelectPicker>

            {UI.box(10)}
            <Layout.SelectPicker
              _this={_this}
              title={"Year Level"}
              state_name={"year_level"}
              style={{ width: 300 }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
            </Layout.SelectPicker>
            {UI.box(10)}
            <InputForm
              _this={_this}
              title={"Email"}
              placeholder={"Enter Email Here"}
              state_name={"email"}
              style={{ flex: 1 }}
              disabled={true}
              isRequired={false}
            />
          </View>
          {UI.box(30)}

          <Layout.Btn
            text={"UPDATE"}
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
