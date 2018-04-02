import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    ImageBackground,
    TouchableHighlight,
    Modal,
    TextInput
} from 'react-native';

import config from '../config';

export default class Item extends Component {

 constructor(props){
    super(props);
    this.state ={
        name: this.props.name,
        value: this.props.value,
        error: false,
        isEditing: false,
        changedName: '',
        changedValue: 0
    }
  }
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  };

  componentWillReceiveProps(nextProps){
    if ((nextProps.name !== this.props.name) && (nextProps.value !== this.props.value)) {
      this.setState({ name: nextProps.name, value: nextProps.value })
    }
  }
 setModalVisible=()=>{
     console.log(this.state.value)
     this.setState({isEditing: true})
    };

 hideModal=()=>this.setState({isEditing: false});

 editItem(){
     const { value, name } = this.state;
     const { id } = this.props;
    const data = {
        value: value,
        name: name,
    }
    fetch(config.editItemUrl + id, {
        method: "PUT",
          body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "same-origin"
          }).then((response) => {
              if(response.status == 200){
                this.setState({isEditing: false, name: name, value: value})
                this.forceUpdate()
              } 
              else {
                this.setState({
                    error: true
                    })
              }
            })
 };


 render() {
     const { type, count } = this.props;
     const { isEditing, error, value, name } = this.state;
     console.log(this.state.name)
     return (
         <View style={styles.container} ref={component => this._root = component}>

             <View style={styles.textContainer}>
                 <Text style={styles.countNumber}>{count+1}) </Text>
                 <Text style={styles.textName}>{name}</Text>
                 <Text style={styles.textValue}>{value} р.</Text>
             </View>
             {isEditing && <Modal
                 animationType={'fade'}
                 transparent={true}
                 visible={this.state.isEditing}
                 onRequestClose={() => {
                     alert('Modal has been closed.');
                 }}>
                 <View style={styles.modalMain}>
                    <View style={styles.modal}>
                      <Text style={styles.modalText}>Редактирование</Text>
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
                        </View>
                        {error && <Text>Ошибка. Проверьте сетевое соединение...</Text>}
                        <View style={styles.modalButtons}>
                            <Button title={'Сохранить'} onPress={() => {
                                this.editItem();
                            }}/>
                            <Button title={'Отмена'} onPress={() => {
                                this.hideModal();
                            }}/>
                        </View>
                    </View>
                  </View>
                </Modal>
             }
             <View style={styles.imageContainer}>
                 <TouchableHighlight onPress={(isEditing) => this.setModalVisible()} >
                     <ImageBackground style={[styles.image, styles.edit]} source={require('../images/edit.png')}/>
                 </TouchableHighlight>
             </View>
         </View>
     );
 }
}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: '#d8d4d1',
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderWidth: 1,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1,
    },
    textContainer:{
        display: 'flex',
        flexDirection: 'row',
        flex: 3,
    },
    countNumber:{
        flex: 1,
    },
    textName:{
        flex: 7,
        fontSize: 16
    },
    textValue:{
        flex: 2,
        fontSize: 16
    },
    image:{
        width: 16,
        height: 20,
        padding: 5,
        margin: 5,
    },
    edit:{
        width: 20
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
