import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    AsyncStorage
} from 'react-native';



export default class Profile extends Component {
   static navigationOptions = ({ navigation }) => ({
    title: `Профиль`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor(){
    super();
    this.state = {
    }
  }
  getUser = async () => {
    try {
        await AsyncStorage.getItem('user').then((user) => {            
            this.setState({user: JSON.parse(user)})            
        })        
      } catch (error) {
        // Error retrieving data
      }
  }

  componentDidMount(){
    this.getUser()  
  }

  render() {
      if(this.state.user){
        const { user } = this.state;
        console.log(user)
          return(
            <View style={styles.container}>
                <Image source={require('../images/profile.png')} style={styles.avatar}/>
                <View style={styles.personalDataContainer}>
                    <Text>Имя: {user.name}</Text>
                    <Text>Email: {user.email}</Text>    
                </View>            
            </View>
          )
      }
    return <Text>Loading...</Text>;
  }
}



const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    avatar:{
        flex:1,
        width: 100,
        height: 120,
    },    
    personalDataContainer:{
        padding: 10,
        flex:2,
    },
});
