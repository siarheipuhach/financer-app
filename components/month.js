import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    ScrollView,
    ImageBackground,
    TouchableHighlight,
    SwipeableFlatList,
    StatusBar
} from 'react-native';

import Item from './item'

let income = [
    {type: 'income', name: 'Зарплата', value: '100', id: 0},
    {type: 'income', name: 'Дополнительный доход', value: '31', id: 1},
];


let expenses = [
    {type: 'expenses', name: 'Комуналка', value: '6', id: 0},
    {type: 'expenses', name: 'Продукты доход', value: '10', id: 1},
    {type: 'expenses', name: 'Комуналка', value: '6', id: 2},
    {type: 'expenses', name: 'Продукты доход', value: '10', id: 3},
    {type: 'expenses', name: 'Комуналка', value: '6', id: 4},
];


export default class Month extends Component {
   static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.monthName}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor(){
    super();
    this.state = {
        monthName: 'Месяц',
        showIncome: false,
        showExpenses: false,
    }
  }
  _renderItem({item}){
      return  <Item key={item.id} count={item.id} type={item.type} name={item.name} value={item.value}/>
  }

  _keyExtractor = (item, index) => item.id;

  render() {
      const {showIncome, showExpenses} = this.state;
    return (
      <ScrollView>
          <View style={styles.container}>

                <TouchableHighlight onPress={()=>this.setState({showIncome: !showIncome})}>
                    <Text style={styles.containerLabel}>Список доходов</Text>
                </TouchableHighlight>

              {showIncome &&
              <SwipeableFlatList
                  style={{marginTop: 10}}
                  bounceFirstRowOnMount
                  maxSwipeDistance={55}
                  data={income}
                  renderItem={this._renderItem.bind(this)}
                  keyExtractor={this._keyExtractor}
                  renderQuickActions={ (item) => (
                      <View style={styles.rowBack} key={item.id}>
                        <TouchableHighlight onPress={()=>alert('Are you sure?')}>
                            <ImageBackground
                                style={[styles.image, styles.trash]}
                                source={require('../images/trash.png')}
                            />
                        </TouchableHighlight>
                      </View>
            )}
                  rightOpenValue={-55}
              />
              }

              <Text style={[styles.total, {color: '#2EB698'}]}>Итого доходов: 100500 р.</Text>

          </View>
          <View style={styles.container}>
              <TouchableHighlight onPress={()=>this.setState({showExpenses: !showExpenses})}>
                  <Text style={styles.containerLabel}>Список расходов</Text>
              </TouchableHighlight>

             {showExpenses &&
             <SwipeableFlatList
                 style={{marginTop: 10}}
                 bounceFirstRowOnMount
                 maxSwipeDistance={55}
                 data={expenses}
                 keyExtractor={this._keyExtractor}
                 renderItem={this._renderItem.bind(this)}
                 renderQuickActions={ (data, index) => (
                     <View style={styles.rowBack}>
                        <TouchableHighlight onPress={()=>alert('Are you sure?')}>
                            <ImageBackground
                                style={[styles.image, styles.trash]}
                                source={require('../images/trash.png')}
                            />
                        </TouchableHighlight>
                      </View>
            )}
            rightOpenValue={-55}
              />}

              <Text style={styles.total}>Итого расходов: 100500 р.</Text>

          </View>

          <View style={styles.balance}>
              <Text style={styles.balanceText}>Баланс: </Text>
              <Text style={styles.balanceCount}>100500 р.</Text>
          </View>
      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    balance: {
        margin: 10,
    },
    balanceText: {
        textAlign: 'center',
        fontSize: 25,
    },
    rowBack: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 15,
        backgroundColor: '#e17773'
    },
    image:{
        width: 16,
        height: 20,
        padding: 5,
        margin: 5,
    },
    balanceCount:{
        fontSize: 30,
        color: '#2EB698',
        textAlign: 'center'
    },
    containerLabel: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        backgroundColor: '#e17773',
        height: 40,
        lineHeight: 33,
        opacity: 0.9,
    },
    addButton:{
        width: 15,
        height: 15,
        position: 'relative',
        top: 15,
        right: 2,
        zIndex: 100
    },
    total: {
        textAlign: 'right',
        padding: 10,
        marginTop: 10,
        color: 'red',
        backgroundColor: 'white'
    }
});
