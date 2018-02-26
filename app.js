import React, { Component } from 'react';
import Login from './components/login'
import Mainpage from './components/mainpage'
import {
  StackNavigator,
} from 'react-navigation';


export default StackNavigator({
    Login: {
      screen: Login,
    },
    Mainpage: {
      screen: Mainpage
    }
});
