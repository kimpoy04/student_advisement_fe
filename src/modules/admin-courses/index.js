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
import { get_courses } from "../actions";

export default class AdminCourses extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      data: [],
    });
  }

  onCreate = async () => {
    this.loading.show();
    this.setState(
      {
        data: await get_courses({}),
      },
      () => {
        this.courses.set_data();
      }
    );
    this.loading.hide();
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
            url: "/courses/" + id,
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

    return (
      <MainLayout _this={_this} tab={"Courses"}>
        <View style={{ backgroundColor: "white", margin: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ margin: 20, fontSize: 20, fontWeight: "bold" }}>
              Courses
            </Text>
            <Layout.Btn
              onClick={() => {
                UI.goTo("/admin/courses/add");
              }}
              color={UI.colors.primary}
              text={"+ Add Course"}
              style={{ paddingTop: 5, paddingBottom: 5, borderRadius: 100 }}
            />
          </View>
          <CustomDatatable
            total_entries={10}
            current_page={2}
            state_name={"courses"}
            ref={(v) => {
              this.courses = v;
            }}
            _this={_this}
            columns={[
              // { ID: "id" },
              { "Course Name": "course_name" },
              { Actions: "action" },
            ]}
            disable_pagination={true}
            data={this.state.data.map((item) => {
              return {
                course_name: item.name,

                action: (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onClick={() => {
                        UI.goTo("/admin/courses/edit/" + item.id);
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
