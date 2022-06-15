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
import { CustomConfirmation, Success, Failed } from "../_components/Modal";
import {
  get_courses,
  get_ordinal,
  get_subjects,
  get_users,
  gobi,
  subjects_not_yet_taken,
  subjects_taken,
} from "../actions";

export default class AdminViewStudent extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      selected_tab: "Student Grade Summary",
      courses: [],

      student_number: "",
      last_name: "",
      first_name: "",
      course_name: "",

      enrolled_subjects: [],
      not_yet_taken: [],
      subjects: [],
    });
  }

  onCreate = async () => {
    this.loading.show();
    const id = this.props.match.params.id;
    this.setState({
      id: id,
      courses: await get_courses(),
    });
    const student = (await get_users({ "filter[where][id]": id }))[0];
    this.setState({
      student_number: student.student_number,
      last_name: student.last_name,
      first_name: student.first_name,
      course_name: gobi(this.state.courses, "id", student.course_id).name,
    });

    const not_yet_taken = await subjects_not_yet_taken(student);
    this.setState({
      not_yet_taken: not_yet_taken,
    });
    const subjects = await get_subjects();
    this.setState({
      subjects: subjects,
    });

    const taken = await subjects_taken(student);
    const new_taken = taken.map((item) => {
      item.subject = gobi(subjects, "id", item.subject_id);
      return item;
    });

    this.setState(
      {
        enrolled_subjects: new_taken,
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

  save_grade = async (id) => {
    this.show_modal(
      <CustomConfirmation
        title={"Confirmation"}
        text={"Are you sure you want to save these grades?"}
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
                    description={"You have successfully updated the grades."}
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

  verify_grade = async (id) => {
    this.show_modal(
      <CustomConfirmation
        title={"Confirmation"}
        text={
          "Are you sure you want to verify these grades? The grades will be uneditable after this process."
        }
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
              method: "patch",
              url: "/grades/" + id,
              params: {
                status: "verified",
              },
              onSuccess: async (e) => {
                this.show_modal(
                  <Success
                    description={"You have successfully verified the grades."}
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

  render() {
    const {
      height,
      width,
      selected_tab,
      student_number,
      last_name,
      first_name,
      course_name,
    } = this.state;
    const _this = this;

    let List = this.state.not_yet_taken.map((item) => {
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
              {/* 

              {UI.box(20)}
              <Layout.Btn
                onClick={() => {
                  this.enroll(item.id);
                }}
                color={UI.colors.secondary}
                text={"ENROLL"}
                style={{ alignSelf: "flex-start" }}
              /> */}
            </View>
          </View>
        </View>
      );
    });

    if (selected_tab == "Student Grade Summary") {
      List = this.state.enrolled_subjects.map((item) => {
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
              <View
                style={{ marginLeft: 50, flexDirection: "row", height: 50 }}
              >
                <View style={{ width: 200, borderWidth: 1, padding: 5 }}>
                  <Wrap>
                    <Text>{item.subject.name}</Text>
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
                {status == "verified" && (
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
                {UI.box(10)}
                {status != "verified" && (
                  <>
                    <Layout.Btn
                      onClick={() => {
                        this.verify_grade(id);
                      }}
                      color={UI.colors.primary}
                      text={"VERIFIED"}
                      style={{ alignSelf: "flex-start" }}
                    />
                  </>
                )}
              </View>
            </View>
          </View>
        );
      });
    }

    return (
      <MainLayout _this={_this} tab={"Student Records"}>
        <View style={{ backgroundColor: "white", margin: 30, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            View Student Record
          </Text>
          {UI.box(30)}

          <Record name={"Student Number"} value={student_number} />
          <Record name={"Last Name"} value={last_name} />
          <Record name={"First Name"} value={first_name} />
          <Record name={"Course"} value={course_name} />
          {UI.box(30)}

          <View style={{ flexDirection: "row" }}>
            <TabButton
              state={selected_tab}
              text={"Student Grade Summary"}
              _this={_this}
              onClick={() => {}}
            />
            {UI.box(30)}
            <TabButton
              state={selected_tab}
              text={"Subjects not yet taken"}
              _this={_this}
              onClick={() => {}}
            />
          </View>

          {UI.box(30)}

          {List}
        </View>
      </MainLayout>
    );
  }
}

const TabButton = (
  props = { text: "", state: "", _this: null, onClick: () => {} }
) => {
  let is_active = false;
  const { _this } = props;
  if (props.text == props.state) {
    is_active = true;
  }

  return (
    <TouchableOpacity
      onClick={() => {
        _this.setState(
          {
            selected_tab: props.text,
          },
          () => {
            props.onClick();
          }
        );
      }}
      style={{
        height: 40,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 100,
        ...Shadow._3(),
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: is_active ? "#00b894" : "white",
      }}
    >
      <Text
        style={{ fontWeight: "bold", color: is_active ? "white" : "black" }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

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
