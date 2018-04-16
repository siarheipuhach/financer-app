import React, { Component } from 'react';
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
    StatusBar,
    Modal,
    Picker,
    Alert,
    BackHandler,
    AsyncStorage
} from 'react-native';

import Item from './item';
import config from '../config';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';

import * as MyActions from '../redux/actions'; //Import your actions
var _ = require('lodash');


class Month extends Component {
   static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.month} ${navigation.state.params.year}`,
     headerTitleStyle : {},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor(props){
    super(props);
    this.state = {
        month: props.navigation.state.params.month,
        name: '',
        data: props.data,
        value: '',
        showIncome: true,
        showExpenses: true,
        isAdding: false,
        type: 'income',
        year: props.navigation.state.params.year,
        items: props.navigation.state.params.items
    }
  }
  _renderItem({item, index}){
    return  <Item 
        updateList={this.getMonthItems} 
        updateQuote={this.props.updateQuote}
        forceUpdateFunc={this.forceUpdateFunc}
        getQuotes = {this.props.getQuotes}
        key={index} 
        id={item._id} 
        count={index} 
        type={item.type} 
        name={item.name} 
        value={item.value}
        isActive={item.isActive}
    />
  }

  _renderQuickActions({item}){
      return  (
          <View style={styles.rowBack} key={item.id}>
              <TouchableHighlight onPress={() => this.deleteItem(item)}>
                  <ImageBackground
                      style={[styles.image, styles.trash]}
                      source={require('../images/trash.png')}
                  />
              </TouchableHighlight>
          </View>
      )
  }

  _keyExtractor = (item, index) => index;

  getMonthItems(){
    fetch(config.getItemListUrl + `${year}/${month}`, {
        method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "same-origin"
          }).then((response) => {
              if(response.status == 200){
                  console.log(response)
              }               
            })
  }
  forceUpdateFunc = () => {
   // AsyncStorage.getItem('data').then((newData) => this.setState({data: JSON.parse(newData)}))
  } 

  hideModal=()=>this.setState({isAdding: false});

  addItem=()=>{
      const { name, value, month, year, type, items, data } = this.state;
    newItem = {
        name: name,
        value: value, 
        month: month,
        type: type,
        year: year
    }
    fetch(config.addItemUrl , {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
              "Content-Type": "application/json"
            },
            credentials: "same-origin"
          }).then((response) => {
              if(response.status == 200){
                  this.setState({isAdding: false})
                  const newReceivedItem = JSON.parse(response._bodyInit)
                  this.props.addQuote(newReceivedItem)
                  this.setState({data: [...data, newReceivedItem]})
              }               
            })

  }
  delete(id){
        fetch(config.deleteUrl + `/${id}` , {
            method: "POST",
            headers: {
                  "Content-Type": "application/json"
                },
                credentials: "same-origin"
              }).then((response) => {
                  if(response.status == 200){
                    const data = this.state.data;
                    const newItems = _.remove(data, function(item){
                        return item._id !== id
                    })  
                    this.props.deleteQuote(id)  
                    if (data.length <= 0){
                        Actions.mainpage()
                    }
                    this.setState({data: newItems})   

                  }               
                })
      
  }
  deleteItem= (item) => {
      Alert.alert(`Удалить запись?`,`Вы уверены что хотиде удалить '${item.name}'?`, [
        {text: 'Отмена', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Удалить', onPress: () => this.delete(item._id)},
      ])   

};
    
componentWillMount(){
    BackHandler.removeEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
}

filterByMonthAndYear(allItems){
    const { year, month } = this.state;
    return _.filter(allItems, function(item){
        return item.year == year && item.month == month
    })
}
orderBy(orderingList){
    return _.orderBy(orderingList, ['isActive', 'value'], ['desc', 'desc'])
}
    
  render() {
    
      const { showIncome, showExpenses, name, value, error, isAdding, type, data } = this.state;
     
      const items = this.filterByMonthAndYear(data)
      const income = _.filter(items, function(item){
          return item.type == 'income' 
      })
      const expense = _.filter(items, function(item){
        return item.type == 'expense'
    })
    const totalIncome = _.sumBy(income, function(incomeInstance){
        if (!incomeInstance.isActive){
            return 0
        }
        return incomeInstance.value || 0
    })
    const totalExpense = _.sumBy(expense, function(expenseInstance){
        if (!expenseInstance.isActive){
            return 0
        }
        return expenseInstance.value || 0 
    })
    console.log(this.orderBy(expense))
    const balance = totalIncome - totalExpense;
    if (!this.props.loading){        
    
    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
      <ScrollView style={{marginBottom: 105}}>
          <View style={styles.container}>

                <TouchableHighlight onPress={()=>this.setState({showIncome: !showIncome})}>
                <View>
                    <Text style={styles.containerLabel}>Доходы ({income.length})</Text>
                    <Image style={styles.backgroundArrow} source={showIncome ? require('../images/arrow_up.png'): require('../images/arrow_down.png')}/>
                    </View>
                </TouchableHighlight>

              {showIncome &&
              <SwipeableFlatList
                  style={{marginTop: 10}}
                  bounceFirstRowOnMount
                  maxSwipeDistance={55}
                  extraData={this.state}
                  data={this.orderBy(income)}
                  renderItem={this._renderItem.bind(this)}
                  keyExtractor={this._keyExtractor}
                  renderQuickActions={this._renderQuickActions.bind(this)}
                  rightOpenValue={-55}
              />
              }

              <Text style={[styles.total, {color: '#2EB698'}]}>Итого доходов: {totalIncome} р.</Text>

          </View>
          <View style={styles.container}>
              <TouchableHighlight onPress={()=>this.setState({showExpenses: !showExpenses})}>
              <View>
              <Text style={styles.containerLabel}>Расходы ({expense.length})</Text>
                <Image style={styles.backgroundArrow} source={showExpenses ? require('../images/arrow_up.png'): require('../images/arrow_down.png')}/>
              </View>
              </TouchableHighlight>

             {showExpenses &&
             <SwipeableFlatList
                 style={{marginTop: 10}}                 
                 maxSwipeDistance={55}
                 data={this.orderBy(expense)}
                 keyExtractor={this._keyExtractor}
                 renderItem={this._renderItem.bind(this)}
                 renderQuickActions={this._renderQuickActions.bind(this)}
                 rightOpenValue={-55}
              />}

              <Text style={styles.total}>Итого расходов: {totalExpense} р.</Text>

          </View>

         
          
      </ScrollView>
      <View style={styles.balance}>
              <Text style={styles.balanceText}>Баланс: </Text>
              <Text style={[styles.balanceCount, balance<0 ? {color: 'red'} : {}]}>{balance} р.</Text>
          </View>
        <TouchableHighlight style={styles.plusButton} onPress={()=>this.setState({isAdding: true})}>
            <Text style={{fontSize: 30, textAlign: 'center', color: 'white'}}>+</Text>
        </TouchableHighlight>
        {isAdding && <Modal
                 animationType={'fade'}
                 transparent={true}
                 visible={this.state.isAdding}
                 onRequestClose={() => {
                     alert('Modal has been closed.');
                 }}>
                 <View style={styles.modalMain}>
                    <View style={styles.modal}>
                      <Text style={styles.modalText}>Добавить</Text>
                        <View>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={(changedName) => this.setState({name: changedName})}
                                value={name}
                                placeholder={'Название'}
                              />
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={(changedValue) => this.setState({value: changedValue})}
                                value={`${value}`}
                                placeholder={'Значение'}
                              />    
                              <Picker
                              style={styles.modalInput}
                               selectedValue={type}
                               onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}
                               >        
                                <Picker.Item label="Доход" value="income" />
                                 <Picker.Item label="Расход" value="expense" />
                               </Picker>                  
                        </View>
                        {error && <Text>Ошибка. Проверьте сетевое соединение...</Text>}
                        <View style={styles.modalButtons}>
                            <Button title={'Добавить'} onPress={() => {
                                this.addItem();
                            }}/>
                            <Button title={'Отмена'} onPress={() => {
                                this.hideModal();
                            }}/>
                        </View>
                    </View>
                  </View>
                </Modal>}
             
      </View>
    );
}else{
    return <Text></Text>
}
  }
}



const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex:8
    },
    balance: {
        position: 'absolute',
        bottom: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        width: '95%',
        paddingTop: 10,        
        paddingBottom: 10        
    },
    plusButton:{
        paddingBottom: 5,
        justifyContent: 'center',
        position: 'absolute', 
        right: 30,              
        bottom: 35,
        zIndex: 1000,
         height:40,
         width: 40,
         borderRadius: 20,
         backgroundColor: '#e17773',
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
        opacity: 0.9
    },
    backgroundArrow:{
        position: 'absolute',
        right: 20,
        top: 15,
        height: 10,
        width: 20,
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
    },
    modalButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10
    },
    modalMain:{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        backgroundColor: 'rgba(255,255,255,0.9)'
    },
    modal:{
        width: '90%',
        height: 'auto',
        backgroundColor: 'white',
        elevation: 5
    },
    modalInput:{
        margin: 10
    },
    modalText:{
        color: 'white',
        textAlign: 'center',
        padding: 10,
        fontSize: 18,
        backgroundColor: '#e17773'
    }
});

// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        data: state.dataReducer.quotes
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(MyActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Month);