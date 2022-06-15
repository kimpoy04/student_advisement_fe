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
  Wrap,
  r,
} from "../../shared/custom-react-native";
import UI from "../../shared/Components/UI/js";
import Loading from "../_components/Loading";
import InputForm from "../_components/InputForm";
import Layout from "../_components/Layout";
import MainLayout from "../_components/MainLayout";
import {
  get_grades,
  get_ordinal,
  get_subjects,
  subjects_not_yet_taken,
} from "../actions";

import Modal, {
  CustomConfirmation,
  Success,
  Failed,
} from "../_components/Modal";

export default class StudentNotYetTaken extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      selected_tab: "Student Grade Summary",

      data: [],
      student: {},
    });
  }

  onCreate = async (student) => {
    this.loading.show();
    const not_yet_taken = await subjects_not_yet_taken(student);
    this.setState({
      data: not_yet_taken,
      student: student,
    });

    this.loading.hide();
  };

  enroll = async (subject_id) => {
    this.show_modal(
      <CustomConfirmation
        title={"Confirmation"}
        text={"Are you sure you want to enroll this subject?"}
        backgroundColor={UI.colors.primary}
        onCancel={{
          method: () => {
            this.hide_modal();
          },
          text: "CANCEL",
        }}
        onOk={{
          method: () => {
            this.hide_modal();
            this.loading.show();
            r.request({
              method: "post",
              url: "/grades",
              params: { subject_id, user_id: this.state.student.id },
              onSuccess: async (e) => {
                this.show_modal(
                  <Success
                    description={"You have successfully enrolled a subject."}
                    onDismiss={() => {
                      this.hide_modal();
                      this.onCreate(this.state.student);
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
          },
          text: "YES",
        }}
      />
    );

    return;
  };

  render() {
    const { height, width, selected_tab } = this.state;
    const _this = this;

    const List = this.state.data.map((item) => {
      return (
        <View style={{ paddingBottom: 30 }}>
          <View>
            <Text style={{ fontWeight: "bold", width: 200 + 50 }}>
              {get_ordinal(item.year_level)} YEAR
            </Text>
            <View style={{ flexDirection: "row", height: 40 }}>
              <Text style={{ fontWeight: "bold", width: 200 + 50 }}>
                {get_ordinal(item.semester)} SEM
              </Text>
            </View>
            {UI.box(10)}
            <View style={{ marginLeft: 50, flexDirection: "row", height: 50 }}>
              <View style={{ width: 200, borderWidth: 1, padding: 5 }}>
                <Wrap>
                  <Text>{item.name}</Text>
                </Wrap>
              </View>

              {UI.box(20)}
              <Layout.Btn
                onClick={() => {
                  this.enroll(item.id);
                }}
                color={UI.colors.secondary}
                text={"ENROLL"}
                style={{ alignSelf: "flex-start" }}
              />
            </View>
          </View>
        </View>
      );
    });

    return (
      <MainLayout _this={_this} tab={"Not Yet Taken"}>
        <View style={{ backgroundColor: "white", margin: 30, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Subjects Not Yet Taken
          </Text>
          {UI.box(30)}

          <Record name={"Student Number"} value={"2018-BN-00360"} />
          <Record name={"Last Name"} value={"San Miguel"} />
          <Record name={"First Name"} value={"Kurt Matthew"} />
          <Record name={"Course"} value={"BSCS"} />
          {UI.box(30)}

          {List}
        </View>
      </MainLayout>
    );
  }
}

const Record = (props = { name: "", value: "" }) => {
  return (
    <View style={{ flexDirection: "row", width: 500 }}>
      <Text style={{ flex: 1, fontWeight: "bold" }}>{props.name}:</Text>
      <Text style={{ flex: 1 }}>{props.value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  B: {
    fontWeight: "bold",
  },
  cell_border: {
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0984e3",
    flexDirection: "row",
  },
});
