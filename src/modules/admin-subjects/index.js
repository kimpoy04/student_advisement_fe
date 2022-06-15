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
import { get_courses, get_subjects } from "../actions";

export default class AdminSubjects extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      data: [],
      courses: [],
    });
  }

  onCreate = async () => {
    this.loading.show();

    this.setState({
      courses: await get_courses(),
    });
    this.setState(
      {
        data: await get_subjects({}),
      },
      () => {
        this.subjects.set_data();
      }
    );
    UI.set_select_value("course_id", "");
    UI.set_select_value("year_level", "");
    this.loading.hide();
  };

  clear_filters = async () => {
    this.onCreate();
  };

  apply_filters = async () => {
    const { course_id, year_level } = this.state;
    if (course_id || year_level) {
      this.loading.show();
      let filters = {
        "filter[where][user_type]": "student",
      };
      if (course_id) {
        filters["filter[where][course_id]"] = course_id;
      }
      if (year_level) {
        filters["filter[where][year_level]"] = year_level;
      }

      this.setState(
        {
          data: await get_subjects(filters),
        },
        () => {
          this.subjects.set_data();
        }
      );

      this.loading.hide();
    }
  };

  delete = async (id) => {
    this.show_modal(
      <DeleteConfirmation
        text={"Are you sure you want to delete this item?"}
        onCancel={() => {
          this.hide_modal();
        }}
        onDelete={() => {
          this.hide_modal();
          this.loading.show();
          r.request({
            method: "delete",
            url: "/subjects/" + id,
            params: {},
            onSuccess: (e) => {
              this.loading.hide();
              this.onCreate();
            },
          });
        }}
      />
    );
  };

  render() {
    const { height, width } = this.state;
    const _this = this;
    const Courses = this.state.courses.map((item) => {
      return <option value={item.id}>{item.name}</option>;
    });

    return (
      <MainLayout _this={_this} tab={"Subjects"}>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            margin: 30,
            paddingBottom: 30,
            marginBottom: 0,
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
        <View style={{ backgroundColor: "white", margin: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ margin: 20, fontSize: 20, fontWeight: "bold" }}>
              Subjects
            </Text>
            <Layout.Btn
              onClick={() => {
                UI.goTo("/admin/subjects/add");
              }}
              color={UI.colors.primary}
              text={"+ Add Subject"}
              style={{ paddingTop: 5, paddingBottom: 5, borderRadius: 100 }}
            />
          </View>
          <CustomDatatable
            total_entries={10}
            current_page={2}
            state_name={"subjects"}
            ref={(v) => {
              this.subjects = v;
            }}
            _this={_this}
            columns={[
              // { ID: "id" },
              { "Subject Name": "subject_name" },
              { "Year Level": "year_level" },
              { Semester: "semester" },
              { Units: "units" },
              { Code: "code" },
              { Actions: "action" },
            ]}
            disable_pagination={true}
            data={this.state.data.map((item) => {
              return {
                subject_name: item.name,
                year_level: item.year_level,
                semester: item.semester,
                units: item.units,
                code: item.code,

                action: (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onClick={() => {
                        UI.goTo("/admin/subjects/edit/" + item.id);
                      }}
                    >
                      <Image
                        height={28}
                        width={28}
                        tintColor={"transparent"}
                        source={UI.EDIT_BTN}
                      />
                    </TouchableOpacity>
                    {UI.box(5)}
                    <TouchableOpacity
                      onClick={() => {
                        this.delete(item.id);
                      }}
                    >
                      <Image
                        height={28}
                        width={28}
                        tintColor={"transparent"}
                        source={UI.DELETE_BTN}
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
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0984e3",
    flexDirection: "row",
  },
});
