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
import CustomDatatable from "../_components/CustomDatatable";
import Modal, { DeleteConfirmation } from "../_components/Modal";
import { get_courses, get_users, gobi } from "../actions";

export default class AdminStudentRecords extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      data: [],

      courses: [],
    });
  }

  onCreate = async () => {
    setTimeout(() => {}, 1000);
    this.loading.show();
    this.setState({
      courses: await get_courses(),
    });

    UI.set_select_value("course_id", "");
    this.clear_filters();
  };

  clear_filters = async () => {
    this.loading.show();
    UI.set_select_value("course_id", "");
    UI.set_input_value("last_name", "");
    this.setState(
      {
        data: await get_users({
          "filter[where][user_type]": "student",
        }),
      },
      () => {
        this.students.set_data();
      }
    );
    this.loading.hide();
  };

  apply_filters = async () => {
    const { course_id, last_name } = this.state;
    if (course_id || last_name) {
      this.loading.show();
      let filters = {
        "filter[where][user_type]": "student",
      };
      if (course_id) {
        filters["filter[where][course_id]"] = course_id;
      }
      if (last_name) {
        filters["filter[where][last_name][like]"] = "%" + last_name + "%";
      }

      this.setState(
        {
          data: await get_users(filters),
        },
        () => {
          this.students.set_data();
        }
      );

      this.loading.hide();
    }
  };

  render() {
    const { height, width } = this.state;
    const _this = this;
    const Courses = this.state.courses.map((item) => {
      return <option value={item.id}>{item.name}</option>;
    });

    return (
      <MainLayout _this={_this} tab={"Student Records"}>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            margin: 30,
            paddingBottom: 30,
          }}
        >
          <Text style={{ margin: 20, fontSize: 18, fontWeight: "bold" }}>
            Filters
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 20,
            }}
          >
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
              title={"Last Name"}
              placeholder={"Search by Last Name"}
              state_name={"last_name"}
              style={{ width: 300 }}
              isRequired={false}
            />
            {UI.box(20)}
            <View>
              <Layout.Btn
                onClick={() => {
                  this.apply_filters();
                }}
                color={UI.colors.primary}
                text={"Apply Filters"}
                style={styles.btn}
              />
              {UI.box(10)}

              <Layout.Btn
                onClick={() => {
                  this.clear_filters();
                }}
                color={UI.colors.secondary}
                text={"Clear Filters"}
                style={styles.btn}
              />
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: "white", margin: 30, marginTop: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ margin: 20, fontSize: 20, fontWeight: "bold" }}>
              Student Records
            </Text>
          </View>
          <CustomDatatable
            total_entries={10}
            current_page={2}
            state_name={"students"}
            ref={(v) => {
              this.students = v;
            }}
            _this={_this}
            columns={[
              // { ID: "id" },
              { "Student Name": "student_name" },
              { "Course Name": "course_name" },
              { Actions: "action" },
            ]}
            disable_pagination={true}
            data={this.state.data.map((item) => {
              return {
                student_name: item.last_name + ", " + item.first_name,
                course_name: gobi(this.state.courses, "id", item.course_id)
                  .name,

                action: (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onClick={() => {
                        UI.goTo("/admin/student-records/" + item.id);
                      }}
                    >
                      <Image
                        height={28}
                        width={28}
                        tintColor={"transparent"}
                        source={UI.VIEW_BTN}
                      />
                    </TouchableOpacity>
                  </View>
                ),
              };
            })}
            on_page={(page, callback, table_name) => {}}
          />
        </View>
      </MainLayout>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 100,
    height: 40,
    alignSelf: "center",
  },
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0984e3",
    flexDirection: "row",
  },
});
