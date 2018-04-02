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


export default class RegistrationForm extends Component {  
    constructor(){
      super();
      this.state = {
        name: '',
        email: '',
        password: '',
        signin: false,
        signup: false,
        lackOfField: false,
        isLoading: false
      }
    }
    register(){
        const {email, password, name} = this.state;
          data = {
            email: email,
            password: password,
            name: name
          } 
          this.setState({isLoading: true})
          if(email && password && name){
            fetch(config.registrationUrl, {
                method: "POST",
                  body: JSON.stringify(data),
                    headers: {
                      "Content-Type": "application/json"
                    },
                    credentials: "same-origin"
                  }).then((response) => {
                      if(response.status == 200){
                        this.props.registrationCompleted()
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
          const { lackOfField, email, password, name, isLoading } = this.state;
          if (isLoading){
            return (
            <View style={styles.loadingImage}>
                <Image style={{width: 100, height: 100}} source={require('../images/spinner.gif')}/>
            </View>
            )
        }
          return (
            <View style={{marginTop: 20}}>
            <TextInput
                style={styles.loginInput}
                onChangeText={(name) => this.setState({name})}
                value={name}
                placeholder={'Имя'}
            />
            {lackOfField && !name && <Text style={styles.registerError}>Пожалуйста введите Ваше имя.</Text>}
            <TextInput
                style={styles.loginInput}
                onChangeText={(email) => this.setState({email})}
                value={email}
                placeholder={'Электронная почта'}
            />
            {lackOfField && !email && <Text style={styles.registerError}>Пожалуйста введите электронную почту.</Text>}
            <TextInput
                style={styles.loginInput}
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                placeholder={'Пароль'}
            />
            {lackOfField && !password && <Text style={styles.registerError}>Пожалуйста введите пароль.</Text>}
            <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
              <Button color='#e17773' title='Регистрация' onPress={()=> this.register()}/>
            </View>
              <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
              <Button color='#e17773' title='Назад' onPress={this.props.statusChange}/>
            </View>
          </View>
          );
          }
    }

const styles = StyleSheet.create({  
    
    loginInput: {
        height: 40,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },    
    registerError:{
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
