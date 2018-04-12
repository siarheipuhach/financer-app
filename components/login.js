import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
    Linking,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    AsyncStorage,
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
      registrationCompleted: false,
      user: undefined,
      logout: false
    }
    this.statusChange = this.statusChange.bind(this);
    this.navigateNext = this.navigateNext.bind(this);
    this.registrationCompleted = this.registrationCompleted.bind(this);
  }
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url && !this.state.logout) {
        this.handleOpenURL({ url });
      }
    });
  };

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  removeEventList(){
    this.setState({user: {}})
  }

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    console.log("HERE")
    if (this.state.user === undefined){
      this.setState({
        // Decode the user string and parse it into JSON
        user: JSON.parse(decodeURI(user_string))
      });  
       }
   
    
  };

  // Handle Login with Facebook button tap
  loginWithFacebook = () => this.openURL('https://financerapp.herokuapp.com/users/auth/facebook');

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL('https://financerapp.herokuapp.com/users/auth/google');

  // Open URL in a browser
  openURL = (url) => {   
    // Linking.openURL on Android
    Linking.openURL(url);
  }; 

  loginOauth(user){
    const {email, facebookId, googleId} = user;
    const password = facebookId || googleId
      data = {
        email: email,
        password: password    
      } 
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
                    AsyncStorage.setItem('user', response._bodyInit);
                    Linking.removeEventListener('url', this.handleOpenURL);
                    this.setState({logout: true})
                    this.navigateNext()
                  } 
                  else {
                    this.setState({
                        isLoading: false,
                         wrongCredentials: true
                        })
                  }
                })
              }else{
                console.log('No credentials')
              } 
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
    const { signin, signup, registrationCompleted, user, logout } = this.state;
    console.log(this.state)  
    if (user && !logout){
      this.loginOauth(user)
    }  
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style={styles.logoLabel}>Добро пожаловать в Financer!</Text>
          <View style={{width: 200, marginLeft: 'auto', marginRight: 'auto'}}>
            <Image style={styles.logo} source={require('../images/logo2.png')}/>
          </View>
            {registrationCompleted && <Text style={styles.regSuccess}>Вы успешно зарегистрировались! Теперь вы можете войти.</Text>}
            {signin && <LoginForm statusChange={this.statusChange} navigateNext={this.navigateNext} removeEventList={this.removeEventList}/>}
            {signup && <RegistrationForm statusChange={this.statusChange} registrationCompleted={this.registrationCompleted}/>}
            {!signup && !signin &&
              <View style={{marginTop: 20}}>
                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                  <Button color='#e17773' title='Войти' onPress={()=>this.setState({signin: true})}/>
                </View>

                <View style={{marginRight: 40, marginLeft: 40, marginTop: 20 }}>
                  <Button color='#e17773' title='Зарегистрироваться' onPress={()=>this.setState({signup: true})}/>
                </View>
                {/* <View style={styles.buttons}>
                  <Icon.Button
                    name="facebook"
                    backgroundColor="#3b5998"
                    onPress={()=>this.loginWithFacebook()}
                    {...iconStyles}
                  >
                    Login with Facebook
                  </Icon.Button>
                  <Icon.Button
                      name="google"
                      backgroundColor="#DD4B39"
                      onPress={()=>this.loginWithGoogle()}
                      {...iconStyles}
                    >
                      Login with Google
                    </Icon.Button>
                </View> */}
                
              </View>
            }
            {signin}
        </View>
      </View>
    );
  }
}

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

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
    },
    buttons: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      margin: 20,
      marginBottom: 30,
    },

});
