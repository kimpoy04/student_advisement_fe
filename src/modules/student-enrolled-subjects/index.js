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
import { get_ordinal, get_subjects, gobi, subjects_taken } from "../actions";
import Modal, {
  Success,
  Failed,
  CustomConfirmation,
} from "../_components/Modal";

export default class StudentEnrolledSubjects extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      selected_tab: "Student Grade Summary",

      data: [],
      student: {},
      subjects: [],
    });
  }

  onCreate = async (student) => {
    this.loading.show();
    const subjects = await get_subjects();
    this.setState({
      subjects: subjects,
      student: student,
    });
    const taken = await subjects_taken(student);
    const new_taken = taken.map((item) => {
      item.subject = gobi(subjects, "id", item.subject_id);
      return item;
    });

    this.setState(
      {
        data: new_taken,
      },
      () => {
        setTimeout(() => {
          this.process_grades(new_taken);
        }, 100);
      }
    );

    this.loading.hide();
  };

  process_grades = async (new_taken) => {
    new_taken.map((item) => {
      const id = item.id;
      UI.set_input_value("preliminary_" + id, item.preliminary);
      UI.set_input_value("midterm_" + id, item.midterm);
      UI.set_input_value("semifinal_" + id, item.semifinal);
      UI.set_input_value("final_" + id, item.final);
    });
  };

  submit = async () => {};

  unenroll = async (grade_id) => {
    this.show_modal(
      <CustomConfirmation
        title={"Confirmation"}
        text={"Are you sure you want to unenroll this subject?"}
        backgroundColor={"#d63031"}
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
              method: "delete",
              url: "/grades/" + grade_id,
              params: {},
              onSuccess: async (e) => {
                this.show_modal(
                  <Success
                    description={"You have unenrolled a subject."}
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
  };

  save_grade = async (id) => {
    this.show_modal(
      <CustomConfirmation
        title={"Confirmation"}
        text={"Are you sure you want to save your grades?"}
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

            let preliminary = this.state["preliminary_" + id];
            let midterm = this.state["midterm_" + id];
            let semifinal = this.state["semifinal_" + id];
            let final = this.state["final_" + id];

            r.request({
              method: "patch",
              url: "/grades/" + id,
              params: {
                preliminary,
                midterm,
                semifinal,
                final,
              },
              onSuccess: async (e) => {
                this.show_modal(
                  <Success
                    description={"You have successfully updated your grades."}
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
  };

  render() {
    const { height, width, selected_tab } = this.state;
    const _this = this;

    const List = this.state.data.map((item) => {
      const subject = item.subject;
      const { id, status } = item;
      const { year_level, semester } = subject;
      const enabled = this.state["enabled_" + id];
      let disabled = !enabled;

      if (status == "verified") {
        disabled = true;
      }

      let preliminary = this.state["preliminary_" + id];
      let midterm = this.state["midterm_" + id];
      let semifinal = this.state["semifinal_" + id];
      let final = this.state["final_" + id];
      let divisor = 0;
      if (preliminary) {
        divisor += 1;
      }
      if (midterm) {
        divisor += 1;
      }
      if (semifinal) {
        divisor += 1;
      }
      if (final) {
        divisor += 1;
      }
      let dividend = 0;

      if (preliminary) {
        preliminary = parseInt(preliminary);
        dividend += preliminary;
      }
      if (midterm) {
        midterm = parseInt(midterm);
        dividend += midterm;
      }
      if (semifinal) {
        semifinal = parseInt(semifinal);
        dividend += semifinal;
      }
      if (final) {
        final = parseInt(final);
        dividend += final;
      }
      let average = (dividend / divisor).toFixed(2);
      if (isNaN(average)) {
        average = 0.0;
      }

      return (
        <View style={{ paddingBottom: 30 }}>
          <View>
            <Text style={{ fontWeight: "bold", width: 200 + 50 }}>
              {get_ordinal(year_level)} YEAR
              <Text
                style={{
                  color: "#00b894",
                  marginLeft: 30,
                  display: status == "verified" ? "display" : "none",
                }}
              >
                (VERIFIED)
              </Text>
            </Text>
            <View style={{ flexDirection: "row", height: 40 }}>
              <Text style={{ fontWeight: "bold", width: 200 + 50 }}>
                {get_ordinal(semester)} YEAR
              </Text>
              <View style={styles.cell_border}>
                <Text style={styles.B}>P</Text>
              </View>
              <View style={styles.cell_border}>
                <Text style={styles.B}>M</Text>
              </View>
              <View style={styles.cell_border}>
                <Text style={styles.B}>SF</Text>
              </View>
              <View style={styles.cell_border}>
                <Text style={styles.B}>F</Text>
              </View>
              <View style={styles.cell_border}>
                <Text style={styles.B}>GRADE</Text>
              </View>
            </View>
            {UI.box(10)}
            <View style={{ marginLeft: 50, flexDirection: "row", height: 50 }}>
              <View style={{ width: 200, borderWidth: 1, padding: 5 }}>
                <Wrap>
                  <Text>Comtemporary World</Text>
                </Wrap>
              </View>
              <View style={styles.cell_border}>
                <InputForm
                  _this={_this}
                  cell_type={true}
                  title={""}
                  placeholder={""}
                  state_name={"preliminary_" + id}
                  style={{ marginTop: -7 }}
                  isNumber={true}
                  maxLength={3}
                  onChange={(text) => {
                    console.log(text);
                  }}
                  disabled={disabled}
                />
              </View>
              <View style={styles.cell_border}>
                <InputForm
                  _this={_this}
                  cell_type={true}
                  title={""}
                  placeholder={""}
                  state_name={"midterm_" + id}
                  style={{ marginTop: -7 }}
                  isNumber={true}
                  maxLength={3}
                  onChange={(text) => {
                    console.log(text);
                  }}
                  disabled={disabled}
                />
              </View>
              <View style={styles.cell_border}>
                <InputForm
                  _this={_this}
                  cell_type={true}
                  title={""}
                  placeholder={""}
                  state_name={"semifinal_" + id}
                  style={{ marginTop: -7 }}
                  isNumber={true}
                  maxLength={3}
                  onChange={(text) => {
                    console.log(text);
                  }}
                  disabled={disabled}
                />
              </View>
              <View style={styles.cell_border}>
                <InputForm
                  _this={_this}
                  cell_type={true}
                  title={""}
                  placeholder={""}
                  state_name={"final_" + id}
                  style={{ marginTop: -7 }}
                  isNumber={true}
                  maxLength={3}
                  onChange={(text) => {
                    console.log(text);
                  }}
                  disabled={disabled}
                />
              </View>
              <View style={styles.cell_border}>
                <Text style={styles.B}>{average}</Text>
              </View>
            </View>
            {UI.box(30)}
            <View style={{ flexDirection: "row" }}>
              {status != "verified" && (
                <>
                  <Layout.Btn
                    onClick={() => {
                      this.unenroll(id);
                    }}
                    color={"#d63031"}
                    text={"UNENROLL"}
                    style={{ alignSelf: "flex-start" }}
                  />
                  {UI.box(10)}
                </>
              )}
              <Layout.Btn
                onClick={() => {
                  this.setState({
                    ["enabled_" + id]: !this.state["enabled_" + id],
                  });

                  if (enabled && status != "verified") {
                    this.onCreate(this.state.student);
                  }
                }}
                color={UI.colors.secondary}
                text={disabled ? "EDIT" : "CANCEL EDIT"}
                style={{ alignSelf: "flex-start" }}
              />
              {UI.box(10)}
              <Layout.Btn
                onClick={() => {
                  if (status != "verified") {
                    this.setState({
                      ["enabled_" + id]: !this.state["enabled_" + id],
                    });
                    this.save_grade(id);
                  }
                }}
                color={"#00b894"}
                text={"SAVE"}
                style={{ alignSelf: "flex-start" }}
              />
            </View>
          </View>
        </View>
      );
    });

    return (
      <MainLayout _this={_this} tab={"Enrolled Subjects"}>
        <View style={{ backgroundColor: "white", margin: 30, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Enrolled Subjects
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
