import React, { Component } from 'react';
import Login from './components/login'
import Mainpage from './components/mainpage'
import Month from './components/month'
import Profile from './components/profile'
import LoadingScreen from './components/loadingScreen'
import {
  StackNavigator,
} from 'react-navigation';


export default StackNavigator({
    LoadingScreen: {
      screen: LoadingScreen
    },
    Login: {
      screen: Login,
    },
    Mainpage: {
        screen: Mainpage
    },
    Month:{
        screen: Month
    },
    Profile: {
      screen: Profile,
    },
});

