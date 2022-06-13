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
} from "../../shared/custom-react-native";
import UI from "../../shared/Components/UI/js";

export default class Template extends Component {
  constructor(props) {
    super(props);
    UI.initiateView(this, {
        //Initial State Here

    });
  }
  

  render() {
      
    return (
      <View style={styles.main_container}>
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f3f3f3",
  },
});
