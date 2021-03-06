import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ProgressBarAndroid
} from 'react-native';
import config from '../config'
import {Actions} from 'react-native-router-flux';



export default class LoadingScreen extends Component {
    static navigationOptions = {
        header: null
    };
  constructor(props){
    super(props);       
  }
  chechIfLoggedIn(){
    fetch(config.checkIfloggedInUrl, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin"
    }).then((response) => {
        if(response.status == 200){
        // this.props.navigation.navigate('Mainpage')
        Actions.mainpage()
        } 
        if(response.status == 403){
        // this.props.navigation.navigate('Login')
        Actions.login()

        }              
    })
  }
  componentDidMount(){
    if (!this.props.shouldNotBeChecked){
      this.chechIfLoggedIn();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.logoLabel}>Добро пожаловать в Financer!</Text>
          <View style={{width: 200, marginLeft: 'auto', marginRight: 'auto'}}>
            <Image style={styles.logo} source={require('../images/logo2.png')}/>
          </View>
          <ProgressBarAndroid style={{width: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: 50}} styleAttr='Horizontal'/>            
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  welcome: {
      justifyContent: 'center',
      height: '90%',
      width: '90%',
      margin: 'auto'
  },
    logoLabel: {
        textAlign: 'center',
        fontSize: 25,
        margin: 25,
        opacity: 0.5
    },
    logo: {
        height: 200,
        width: 200,
        justifyContent: 'center',
    } 
});
