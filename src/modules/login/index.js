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
import Modal, { Failed } from "../_components/Modal";
import mem from "../../shared/Components/Memory/js";

export default class Login extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
      //Initial State Here
      email: "",
      password: "",
      modal_content: "",
      show_modal: false,
    });
  }

  onCreate = async () => {
    const user_type = mem.get("user_type");
    if (user_type == "admin") {
      UI.goTo("/admin/courses");
    }
    if (user_type == "student") {
      UI.goTo("/student/profile");
    }
  };

  login = async () => {
    await UI.clear_errors();
    const { email, password } = this.state;

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
      url: "/users/login",
      params: {
        email: email,
        password: password,
      },
      onSuccess: async (e) => {
        mem.save("jwt_token", e.token);
        setTimeout(() => {
          this.componentDidMount();
        }, 10);
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
            width: 340,
            borderRadius: 20,
            backgroundColor: "white",
            ...Shadow._3(),
            padding: 20,
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Welcome to Student Advisement
          </Text>
          {UI.box(10)}
          <Text>Please enter your details below</Text>
          {UI.box(10)}

          <InputForm
            _this={_this}
            title={"Email"}
            placeholder={"Enter Email Here"}
            state_name={"email"}
            style={{ flex: 1 }}
            isRequired={false}
          />
          {UI.box(10)}
          <InputForm
            _this={_this}
            title={"Password"}
            placeholder={"Enter Password Here"}
            state_name={"password"}
            style={{ flex: 1 }}
            isRequired={false}
            isPassword={true}
          />
          {UI.box(20)}

          <Layout.Btn text={"LOGIN"} color={"#00CBFF"} onClick={this.login} />
        </View>

        {UI.box(20)}
        <TouchableOpacity onClick = {()=>{
          UI.goTo("/registration")
        }}>
          <Text style={{ color: "white" }}>
            No account yet?{" "}
            <Text style={{ fontWeight: "bold" }}>Student Registration</Text>
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
