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

export default class AdminAddSubject extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      id: "",
      name: "",

      courses: [],
    });
  }

  onCreate = async () => {
    const id = this.props.match.params.id;
    this.loading.show();
    this.setState({
      id: id,
      courses: await get_courses(),
    });
    UI.set_select_value("course_id", "");
    UI.set_select_value("semester", "");
    UI.set_select_value("year_level", "");

    this.loading.hide();
  };

  submit = async () => {
    await UI.clear_errors();
    const { course_id, name, code, year_level, semester, units } = this.state;

    if (!course_id) {
      await UI.error_form("course_id", "Course Name is required.");
    }
    if (!name) {
      await UI.error_form("name", "Subject Name is required.");
    }

    if (!code) {
      await UI.error_form("code", "Subject Code is required.");
    }

    if (!year_level) {
      await UI.error_form("year_level", "Year Level is required.");
    }
    if (!semester) {
      await UI.error_form("semester", "Semester is required.");
    }
    if (!units) {
      await UI.error_form("units", "Units is required.");
    }

    const error_count = this.state.error_count;
    if (error_count > 0) {
      return;
    }

    this.loading.show();

    r.request({
      method: "post",
      url: "/subjects",
      params: { course_id: parseInt(course_id), name, code, year_level: parseInt(year_level), semester, units },
      onSuccess: async (e) => {
        this.show_modal(
          <Success
            description={"You have successfully added a subject."}
            onDismiss={() => {
              UI.goTo("/admin/subjects");
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
      <MainLayout _this={_this} tab={"Subjects"}>
        <View style={{ backgroundColor: "white", margin: 30, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Subject</Text>
          {UI.box(30)}

          <View style={{ width: 300 }}>
            <Layout.SelectPicker
              _this={_this}
              title={"Course Name"}
              state_name={"course_id"}
              style={{ width: 300 }}
            >
              {Courses}
            </Layout.SelectPicker>
          </View>

          {UI.box(10)}
          <InputForm
            _this={_this}
            title={"Subject Name"}
            placeholder={"Enter Subject Name Here"}
            state_name={"name"}
            style={{ width: 300 }}
            isRequired={false}
          />
          {UI.box(10)}
          <InputForm
            _this={_this}
            title={"Subject Code"}
            placeholder={"Enter Subject Code Here"}
            state_name={"code"}
            style={{ width: 300 }}
            isRequired={false}
          />
          {UI.box(10)}
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
          </View>
          {UI.box(10)}
          <View style={{ width: 300 }}>
            <Layout.SelectPicker
              _this={_this}
              title={"Semester"}
              state_name={"semester"}
              style={{ width: 300 }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </Layout.SelectPicker>
          </View>
          {UI.box(10)}
          <InputForm
            _this={_this}
            title={"Units"}
            placeholder={"Enter Units Here"}
            state_name={"units"}
            style={{ width: 300 }}
            isRequired={false}
            isNumber={true}
            maxLength={3}
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
