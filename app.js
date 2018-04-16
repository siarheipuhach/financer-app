import React, { Component } from 'react';
import Login from './components/login'
import Mainpage from './components/mainpage'
import Month from './components/month'
import Profile from './components/profile'
import LoadingScreen from './components/loadingScreen'
import {
  StackNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';


import { View, AsyncStorage } from 'react-native';

import { Router, Scene } from 'react-native-router-flux';


import {connect} from 'react-redux';
import { getQuotes } from './redux/actions'


const Data = {}

class Main extends Component {

    componentDidMount() {
        var _this = this;
        //Check if any data exist
        AsyncStorage.getItem('data', (err, data) => {
            //if it doesn't exist, extract from json file
            //save the initial data in Async
            if (data === null){
                AsyncStorage.setItem('data', JSON.stringify(Data.quotes));
                _this.props.getQuotes();
            }
        });
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="loading" component={LoadingScreen} title="Loading Screen" initial/>
                    <Scene key="login" component={Login} title="Login"/>
                    <Scene key="mainpage" component={Mainpage} title="Mainpage"/>
                    <Scene key="month" component={Month} title="Month"/>
                    <Scene key="profile" component={Profile} title="Profile"/>
                </Scene>
            </Router>
        );
    }
}
export default connect(null, { getQuotes })(Main);

