import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    FlatList,
    ImageBackground,
    TouchableHighlight,
    SwipeableFlatList,
    StatusBar,
    ToolbarAndroid,
    AsyncStorage
} from 'react-native';
var _ = require('lodash');

import config from '../config'


export default class YearItem extends Component {    

  constructor(){
    super();
    this.state = {
        showList: true,
        sortedByMonth: [],
    };
    this.updateList = this.updateList.bind(this)
  }  
   
  _renderItem({item}){
    return  (
          <TouchableHighlight onPress={() => this.props.navigate('Month', {
              month: item, 
              year: this.props.year,
              items: this.state.sortedByMonth[item],
              updateList: this.updateList
              })}>    
       
              <Text style={styles.textMonth}>{item}</Text>
          </TouchableHighlight>
      )
  }  

  _keyExtractor = (item, index) => {
      return index
    }

    componentWillReceiveProps(newProps) {
        const { items } = newProps;
        const sortedByMonth = _.groupBy(items, 'month')
        this.setState({sortedByMonth});
    }
    updateList(month, items){
        let newList = this.state.sortedByMonth
        newList[month] = items;
        this.setState({sortedByMonth: newList})

    }



  componentDidMount(){
    const { items } = this.props
    const sortedByMonth = _.groupBy(items, 'month')
    this.setState({sortedByMonth})
  }
  
  render() {
      const { showList, sortedByMonth } = this.state;
      const { year, items, updateList } = this.props
      const income = _.filter(items, function(item){
        return item.type == 'income'
    })
      const expense = _.filter(items, function(item){
        return item.type == 'expense'
        })
      const totalIncome = _.sumBy(income, function(incomeInstance){
        return incomeInstance.value || 0
        })
      const totalExpense = _.sumBy(expense, function(expenseInstance){
        return expenseInstance.value || 0
        })
      if(!items){
          return <LoadingScreen/>
      }
    return (          
          <View style={styles.container}>
               <TouchableHighlight onPress={()=>this.setState({showList: !showList})}>
                    <Text style={styles.containerLabel}>{this.props.year} год</Text>
                </TouchableHighlight>

              {showList &&
              <FlatList
                  style={{marginTop: 10}}
                  data={Object.keys(sortedByMonth)}                  
                  extraData={this.state}
                  renderItem={this._renderItem.bind(this)}
                  keyExtractor={this._keyExtractor}                  
                  rightOpenValue={-55}
              />
              }
              <Text style={[styles.total, {color: '#2EB698'}]}>Итого доходов: {totalIncome} р.</Text>
              <Text style={styles.total}>Итого расходов: {totalExpense} р.</Text>

          </View>
          
    );
  }
}



const styles = StyleSheet.create({
    container: {
        margin: 10,
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
    total: {
        textAlign: 'right',
        padding: 10,
        marginTop: 10,
        color: 'red',
        backgroundColor: 'white'
    },
    textMonth:{
        backgroundColor: 'white',
        textAlign:'center',
        fontSize: 20,
        marginTop: 5,
        borderColor: '#d8d4d1',
        borderWidth: 1,
        borderTopColor: 'white',
        borderRightColor: 'white',
        borderLeftColor: 'white',
        padding: 10
    }
});
