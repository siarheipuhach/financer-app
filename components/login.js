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


export default class Login extends Component {
    static navigationOptions = {
        header: null
    };
  constructor(){
    super();
    this.state = {
      login: '',
        password: '',
        signin: false,
        signup: false,
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.logoLabel}>Welcome to the Financer!</Text>
          <View style={{width: 200, marginLeft: 'auto', marginRight: 'auto'}}>
            <Image style={styles.logo} source={require('../images/logo2.png')}/>
          </View>

            {this.state.signin &&
            <View style={{marginTop: 20}}>
              <TextInput
                  style={styles.loginInput}
                  onChangeText={(login) => this.setState({login})}
                  value={this.state.login}
                  placeholder={'Email'}
                  onSubmitEditing={() => this.passwordInput.focus()}
              />
              <TextInput
                  style={styles.loginInput}
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}
                  placeholder={'Password'}
                  ref={(input) => this.passwordInput = input}

              />
              <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                <Button color='#e17773' title='Войти' onPress={() => this.props.navigation.navigate('Mainpage')}/>
              </View>
                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                <Button color='#e17773' title='Назад' onPress={()=>this.setState({signin: false})}/>
              </View>
            </View>
            }
            {this.state.signup &&
            <View style={{marginTop: 20}}>
              <TextInput
                  style={styles.loginInput}
                  onChangeText={(login) => this.setState({login})}
                  value={this.state.login}
                  placeholder={'Name'}
              />
              <TextInput
                  style={styles.loginInput}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}
                  placeholder={'Email'}
              />
              <TextInput
                  style={styles.loginInput}
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}
                  placeholder={'Password'}
              />
              <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                <Button color='#e17773' title='Регистрация' onPress={()=>console.log('login')}/>
              </View>
                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                <Button color='#e17773' title='Назад' onPress={()=>this.setState({signup: false})}/>
              </View>
            </View>
            }
            {!this.state.signup && !this.state.signin &&
              <View style={{marginTop: 20}}>
                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                  <Button color='#e17773' title='Войти' onPress={()=>this.setState({signin: true})}/>
                </View>

                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                  <Button color='#e17773' title='Зарегистрироваться' onPress={()=>this.setState({signup: true})}/>
                </View>
              </View>
            }
            {this.state.signin}
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
    }

});
