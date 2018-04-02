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
import config from '../config'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'



export default class Login extends Component {
    static navigationOptions = {
        header: null
    };
  constructor(){
    super();
    this.state = {
      signin: false,
      signup: false,
      registrationCompleted: false
    }
    this.statusChange = this.statusChange.bind(this);
    this.navigateNext = this.navigateNext.bind(this);
    this.registrationCompleted = this.registrationCompleted.bind(this);
  }
  statusChange() {
    if(this.state.signin){
      this.setState({signin: false})
    }else{
      this.setState({signup: false})
    }
  }
  registrationCompleted(){
    this.setState({signion: true, signup: false, registrationCompleted: true})
  }

  navigateNext(){
    this.props.navigation.navigate('Mainpage')
  }

  render() {
    const { signin, signup, registrationCompleted } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.logoLabel}>Welcome to the Financer!</Text>
          <View style={{width: 200, marginLeft: 'auto', marginRight: 'auto'}}>
            <Image style={styles.logo} source={require('../images/logo2.png')}/>
          </View>
            {registrationCompleted && <Text style={styles.regSuccess}>Вы успешно зарегистрировались! Теперь вы можете войти.</Text>}
            {signin && <LoginForm statusChange={this.statusChange} navigateNext={this.navigateNext}/>}
            {signup && <RegistrationForm statusChange={this.statusChange} registrationCompleted={this.registrationCompleted}/>}
            {!signup && !signin &&
              <View style={{marginTop: 20}}>
                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                  <Button color='#e17773' title='Войти' onPress={()=>this.setState({signin: true})}/>
                </View>

                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                  <Button color='#e17773' title='Зарегистрироваться' onPress={()=>this.setState({signup: true})}/>
                </View>
              </View>
            }
            {signin}
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
    },
    loginInput: {
        height: 40,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    loginError:{
      width: '75%',
      marginLeft: 'auto',
      marginRight: 'auto',
      color: 'red',
    },
    regSuccess:{
      width: '75%',
      color: '#2EB698',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 10,      
    }

});
