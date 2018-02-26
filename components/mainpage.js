import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button
} from 'react-native';


export default class Mainpage extends Component {
    static navigationOptions = {
        header: null
    };

  constructor(){
    super();

  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.logoLabel}>Welcome to the Mainpage!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    constainer: {
        borderWidth: 1,
    },
    logoLabel: {
        textAlign: 'center',
        fontSize: 25,
        margin: 25,
        opacity: 0.5
    },

});
