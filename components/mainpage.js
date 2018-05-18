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
    FlatList,
    ImageBackground,
    TouchableHighlight,
    SwipeableFlatList,
    StatusBar,
    ToolbarAndroid,
    AsyncStorage,
    Modal,
    Picker,
    RefreshControl,
    BackHandler
} from 'react-native';

var _ = require('lodash');

import LoadingScreen from '../components/loadingScreen'
import YearItem from '../components/yearItem'
import config from '../config'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';

import * as MyActions from '../redux/actions'; //Import your actions

class Mainpage extends Component {
    static navigationOptions = {
        header: null
    };

  constructor(props){
    super(props);
    this.state = {
        items: [],
        sortedItemsByYear: undefined,
        isAdding: false,
        name: '',
        value: '',
        year: 2018,
        month: 'Март',
        type: 'income',
        error: false,
        refreshing: false
    };
    this.forceUpdatePage = this.forceUpdatePage.bind(this);
    this.logout = this.logout.bind(this);
  }
  logout(){
    fetch(config.logoutUrl, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin"
    }).then((response) => {
        if(response.status == 200){
            Actions.login()
            // this.props.navigation.navigate('Login')
        }                     
    })
  }
  removeEventList(){
    this.props.removeEventList()
  }
  onActionSelected(position) {
    if (position == 0){
        Actions.profile()
        // this.props.navigation.navigate('Profile')
    }
    if (position == 1){
        this.logout()
    }    
    if (position == 2){
       this.setState({isAdding: true})
    }
  }

  getItems = async()=>{
      console.log('FETCHING NEW DATA')
    this.setState({isAdding: false})
    fetch(config.getItemListUrl, {
        method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "same-origin"
          }).then((response) => {
              if(response.status == 200){
                this.setState({items: JSON.parse(response._bodyInit).items});
                AsyncStorage.setItem('data', JSON.stringify(_.sortBy(JSON.parse(response._bodyInit).items, ['year', 'month', 'value'])));
                this.sortByYears()
              }                       
            }).then(()=>this.props.getQuotes())
  }
  componentDidMount(){
    this.getItems()
    }
    

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', () => {
                BackHandler.exitApp();
        });
    }
    

  _renderItem({item, index}){
    const { items, sortedItemsByYear, isAdding, name, value, type, year, month, error } = this.state;
    const {navigate} = this.props.navigation;
      return  (
        <YearItem updateList={this.getItems} navigate={navigate} key={index} year={item} items={sortedItemsByYear[item]}/>
      )
  }

  sortByYears(){
      this.setState({sortedItemsByYear: _.groupBy(this.state.items, 'year')}) 
  }

  _keyExtractor = (item, index) => index;

  hideModal=()=>this.setState({isAdding: false});

  forceUpdatePage = async() => this.forceUpdate()

  _onRefresh() {
    this.setState({refreshing: true});
    this.getItems()
    this.props.getQuotes()
    this.forceUpdatePage().then(() => {
      this.setState({refreshing: false});
    });
  }


  addItem=()=>{
      const { name, value, month, year, type, items } = this.state;
    data = {
        name: name,
        value: value, 
        month: month,
        type: type,
        year: year
    }
    fetch(config.addItemUrl , {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
              "Content-Type": "application/json"
            },
            credentials: "same-origin"
          }).then((response) => {
              if(response.status == 200){
                const newItem = JSON.parse(response._bodyInit)
                this.props.addQuote(newItem)
                this.setState({
                    isAdding: false, 
                    sortedItemsByYear: _.groupBy([...this.state.items, newItem], 'year')
                }) 
              }               
            })

  }


  render() {
      const { items, sortedItemsByYear, isAdding, name, value, type, year, month, error } = this.state;
      const {navigate} = this.props.navigation;
      if(!items){
          return <LoadingScreen/>
      }
      if (sortedItemsByYear){
        return (
            <View>
                <Modal
                        animationType={'fade'}
                        transparent={true}
                        visible={isAdding}
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
                                    <Picker
                                    style={styles.modalInput}
                                    selectedValue={year}
                                    onValueChange={(itemValue, itemIndex) => this.setState({year: itemValue})}
                                    >        
                                        <Picker.Item label="2018" value={2018} />
                                        <Picker.Item label="2019" value={2019}/>
                                    </Picker>   
                                    <Picker
                                    style={styles.modalInput}
                                    selectedValue={month}
                                    onValueChange={(itemValue, itemIndex) => this.setState({month: itemValue})}
                                    >        
                                        <Picker.Item label="Январь" value="Январь" />
                                        <Picker.Item label="Февраль" value="Февраль" />
                                        <Picker.Item label="Март" value="Март" />
                                        <Picker.Item label="Апрель" value="Апрель" />
                                        <Picker.Item label="Май" value="Май" />
                                        <Picker.Item label="Июнь" value="Июнь" />
                                        <Picker.Item label="Июль" value="Июль" />
                                        <Picker.Item label="Август" value="Август" />
                                        <Picker.Item label="Сентябрь" value="Сентябрь" />
                                        <Picker.Item label="Октябрь" value="Октябрь" />
                                        <Picker.Item label="Ноябрь" value="Ноябрь" />
                                        <Picker.Item label="Декабрь" value="Декабрь" />
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
                        </Modal>
            <ScrollView
            refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }>
                <ToolbarAndroid
                    style={{height: 55, marginTop: 5}}
                    logo={require('../images/logo_small2.png')}
                    title="Financer"
                    actions={[
                        {title: 'Profile', icon: require('../images/profile.png'), show: 'always'},
                        {title: 'Logout', icon: require('../images/logout.png'), show: 'always'},
                        {title: 'Add', icon: require('../images/plus.png'), show: 'always'},
                        ]
                        }
                    onActionSelected={this.onActionSelected.bind(this)}
                    />
                     <FlatList
                        style={{marginTop: 10}}
                        data={Object.keys(sortedItemsByYear)}
                        extraData={this.state.sortedItemsByYear}
                        renderItem={this._renderItem.bind(this)}
                        keyExtractor={this._keyExtractor}              
                    />                              
            </ScrollView>
            
            </View>
          );
      }else{
          return <LoadingScreen shouldNotBeChecked/>
      }
    
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
    },
    modalButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10
    },
});

// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        data: state.dataReducer.quotes,
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(MyActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Mainpage);