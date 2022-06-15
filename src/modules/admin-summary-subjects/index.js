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
} from "../../shared/custom-react-native";
import UI from "../../shared/Components/UI/js";
import Loading from "../_components/Loading";
import InputForm from "../_components/InputForm";
import Layout from "../_components/Layout";
import MainLayout from "../_components/MainLayout";
import {
  get_courses,
  get_grades,
  get_ordinal,
  get_subjects,
  get_users,
} from "../actions";
import { DownloadPDF } from "../_components/CustomPDF";

export default class AdminSummarySubjects extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      selected_tab: "Student Grade Summary",
      data: [],
      courses: [],
    });
  }

  download = async (type) => {
    this.setState(
      {
        is_rendering: true,
      },
      () => {
        setTimeout(() => {
          DownloadPDF("summary", "Summary of Subjects Not Yet Taken", type);
          this.setState(
            {
              is_rendering: false,
            },
            () => {}
          );
        }, 300);
      }
    );

    //DownloadPDF("main_transaction_content")
  };

  onCreate = async () => {
    this.loading.show();
    this.setState({
      courses: await get_courses(),
    });
    UI.set_select_value("course_id", "");
    UI.set_select_value("year_level", "");

    const subjects = await get_subjects();
    const students = await get_users({
      ["filter[where][user_type]"]: "student",
    });
    const grades = await get_grades();
    this.process_untaken_subjects(subjects, students, grades);

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

      const subjects = await get_subjects(filters);
      const students = await get_users({
        ["filter[where][user_type]"]: "student",
      });
      const grades = await get_grades();
      this.process_untaken_subjects(subjects, students, grades);

      this.loading.hide();
    }
  };

  process_untaken_subjects = async (subjects, students, grades) => {
    const arr = subjects.map((item) => {
      const student_with_this_subject = students.filter(
        (i) => i.year_level == item.year_level
      );
      let unenrolled = 0;
      let enrolled = 0;
      const number_of_enrolled = student_with_this_subject.map((i) => {
        const student_has_grade_in_this = grades.filter(
          (j) => j.user_id == i.id && item.id === j.subject_id
        );
        if (student_has_grade_in_this.length > 0) {
          enrolled += 1;
          return true;
        } else {
          unenrolled += 1;
          return false;
        }
      });
      item.enrolled = enrolled;
      item.unenrolled = unenrolled;
      return item;
    });
    this.setState({
      data: arr,
    });
  };

  submit = async () => {};

  render() {
    const { height, width, selected_tab } = this.state;
    const _this = this;

    const Courses = this.state.courses.map((item) => {
      return <option value={item.id}>{item.name}</option>;
    });

    const List = this.state.data.map((item) => {
      return (
        <View>
          <Text style={{ fontWeight: "bold", width: 200 + 50 }}>
            {get_ordinal(item.year_level)} YEAR
          </Text>
          <View style={{ flexDirection: "row", height: 40 }}>
            <Text style={{ fontWeight: "bold", width: 200 + 50 }}>
              {get_ordinal(item.semester)} YEAR SEM
            </Text>
          </View>
          {UI.box(10)}
          <View style={{ marginLeft: 50, flexDirection: "row", height: 50 }}>
            <View style={{ width: 200, borderWidth: 1, padding: 5 }}>
              <Wrap>
                <Text>{item.name}</Text>
              </Wrap>
            </View>
            <View style={styles.cell_border}>
              <Text>{item.unenrolled}</Text>
            </View>
          </View>
          {UI.box(30)}
        </View>
      );
    });

    return (
      <MainLayout _this={_this} tab={"Summary of Subjects"}>
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
        <View
          id={"summary"}
          style={{ backgroundColor: "white", margin: 30, padding: 20 }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Summary of Subjects Not Yet Taken
          </Text>

          {UI.box(30)}

          {List}
        </View>
        {UI.box(30)}
        <View style = {{backgroundColor: "white", margin: 30, marginTop: 0, padding: 30, flexDirection: "row"}}>
          <Layout.Btn
            onClick={() => {
              this.download("print");
            }}
            color={UI.colors.secondary}
            text={"Print"}
            style={{ width: 100 }}
          />
          {UI.box(20)}
          <Layout.Btn
            onClick={() => {
              this.download("download");
            }}
            color={UI.colors.secondary}
            text={"Download"}
            style={{ width: 100 }}
          />
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
    width: 200,
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
