import { AppRegistry } from 'react-native';
import Main from './app';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; //Import the store

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Main />
            </Provider>
        );
    }
}
AppRegistry.registerComponent('app', () => App);
