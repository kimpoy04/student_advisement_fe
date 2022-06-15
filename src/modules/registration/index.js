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
import mem from "../../shared/Components/Memory/js";
import Modal, { Failed, Success } from "../_components/Modal";
import { get_courses } from "../actions";

export default class Login extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(
      this,
      {
        //Initial State Here
        email: "",
        password: "",
        show_modal: false,
        courses: [],
      },
      {
        auth_exception: true,
      }
    );
  }

  onCreate = async () => {
    this.loading.show();
    this.setState({
      courses: await get_courses(),
    });
    this.loading.hide();
    UI.set_select_value("course_id", "");
    UI.set_select_value("year_level", "");
  };

  submit = async () => {
    await UI.clear_errors();
    const {
      email,
      password,
      student_number,
      first_name,
      last_name,
      course_id,
      year_level,
    } = this.state;

    if (!year_level) {
      await UI.error_form("year_level", "Year Level is required.");
    }

    if (!course_id) {
      await UI.error_form("course_id", "Course Name is required.");
    }

    if (!last_name) {
      await UI.error_form("last_name", "Last Name is required.");
    }

    if (!first_name) {
      await UI.error_form("first_name", "First Name is required.");
    }

    if (!student_number) {
      await UI.error_form("student_number", "Student Number is required.");
    }

    if (!email) {
      await UI.error_form("email", "Email is required.");
    }

    if (!password) {
      await UI.error_form("password", "Password is required.");
    }

    if (!(password.length >= 8)) {
      await UI.error_form("password", "Password must be atleast 8 characters.");
    }

    const error_count = this.state.error_count;
    if (error_count > 0) {
      return;
    }

    this.loading.show();

    r.request({
      method: "post",
      url: "/signup",
      params: {
        email,
        password,
        student_number,
        first_name,
        last_name,
        course_id: parseInt(course_id),
        year_level: parseInt(year_level),
        user_type: "student",
      },
      onSuccess: async (e) => {
        this.show_modal(
          <Success
            description={
              "You have successfully registered to the system. You may login."
            }
            onDismiss={() => {
              this.hide_modal();
              UI.goTo("/login");
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
  show_modal = (msg) => {
    this.setState({
      show_modal: true,
      modal_content: msg,
    });
  };
  hide_modal = () => {
    this.setState({
      show_modal: false,
      modal_content: "",
    });
  };

  render() {
    const { height, width, show_modal } = this.state;
    const _this = this;

    const Courses = this.state.courses.map((item) => {
      return <option value={item.id}>{item.name}</option>;
    });
    return (
      <View style={{ ...styles.main_container }}>
        <Loading
          ref={(v) => {
            this.loading = v;
          }}
        />
        <Modal _this={this} visible={show_modal} />

        <View
          style={{
            borderRadius: 20,
            backgroundColor: "white",
            ...Shadow._3(),
            padding: 20,
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Student Advisement Registration
          </Text>
          {UI.box(10)}
          <Text>Please enter your details below</Text>
          {UI.box(10)}
          <View style={{ flexDirection: "row" }}>
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
            </View>

            {UI.box(30)}

            <View style={{ width: 300 }}>
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
              <InputForm
                _this={_this}
                title={"Email"}
                placeholder={"Enter Email Here"}
                state_name={"email"}
                style={{ flex: 1, marginTop: -8 }}
                isRequired={false}
              />
              {UI.box(10)}
              <InputForm
                _this={_this}
                title={"Password"}
                placeholder={"Enter Password Here"}
                state_name={"password"}
                style={{ flex: 1, marginTop: -8 }}
                isRequired={false}
                isPassword={true}
              />

              {UI.box(10)}
              <Layout.Btn
                text={"REGISTER"}
                color={"#00CBFF"}
                onClick={this.submit}
              />
            </View>
          </View>
        </View>
        {UI.box(20)}
        <TouchableOpacity
          onClick={() => {
            UI.goTo("/login");
          }}
        >
          <Text style={{ color: "white" }}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "bold" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0984e3",
    justifyContent: "center",
    alignItems: "center",
  },
});
