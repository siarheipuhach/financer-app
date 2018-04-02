import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    AsyncStorage,
    ProgressBarAndroid
} from 'react-native';
import config from '../config'


export default class LoginForm extends Component {  
    constructor(){
      super();
      this.state = {
        email: '',
        password: '',
        signin: false,
        signup: false,
        wrongCredentials: false,
        lackOfField: false,
        name: '',
        isLoading: false
      }
    }
    setUser(user){
        AsyncStorage.setItem('user', user);
    }
    login(){
        const {email, password} = this.state;
          data = {
            email: email,
            password: password
          } 
          this.setState({isLoading: true})
          if(email && password){
            fetch(config.loginUrl, {
                method: "POST",
                  body: JSON.stringify(data),
                    headers: {
                      "Content-Type": "application/json"
                    },
                    credentials: "same-origin"
                  }).then((response) => {
                      if(response.status == 200){
                        this.setUser(response._bodyInit)
                        this.props.navigateNext()
                      } 
                      else {
                        this.setState({
                            isLoading: false,
                             wrongCredentials: true
                            })
                      }
                    })
                  }else{
                    this.setState({
                        lackOfField: true, 
                        isLoading: false
                    })
                  } 
                }

    render() {
          const { wrongCredentials, lackOfField, email, password, isLoading } = this.state;
          if (isLoading){
              return (
                <ProgressBarAndroid style={{width: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: 50}} styleAttr='Horizontal'/>           

              )
          }
          return (
                <View style={{marginTop: 20}}>
                  <TextInput
                      style={styles.loginInput}
                      onChangeText={(email) => this.setState({email})}
                      value={email}
                      placeholder={'Электронная почта'}
                      onSubmitEditing={() => this.passwordInput.focus()}
                  />
                  {lackOfField && !email && <Text style={styles.loginError}>Пожалуйста введите электронную почту!</Text>}
                  <TextInput
                      style={styles.loginInput}
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({password})}
                      value={password}
                      placeholder={'Пароль'}
                      ref={(input) => this.passwordInput = input}
                      onSubmitEditing={() => this.login()}
                  />
                  {lackOfField && !password && <Text style={styles.loginError}>Пожалуйста введите пароль!</Text>}
                  {wrongCredentials && <Text style={styles.loginError}>Неверный email или пароль!</Text>}
                  <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                    <Button color='#e17773' title='Войти' onPress={() => this.login()}/>
                  </View>
                    <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                    <Button color='#e17773' title='Назад' onPress={this.props.statusChange}/>
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
        loadingImage: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 130
        }
    
    });
    