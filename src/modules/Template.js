import React, { Component } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  ImageBackground,
  ImageFit,
  Text,
  StyleSheet,
} from "../../../shared/custom-react-native";
import UI from "../../../shared/Components/UI/js";


export default class BigContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const _this = this.props._this;
    const width = _this.state.width;
    const paddingX = width * 0.05;



    return (
      <View style={{}}>
          
      </View>
    );
  }
}


const styles = StyleSheet.create({
    
});
