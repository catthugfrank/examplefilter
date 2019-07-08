import * as React from 'react';

import Modal from 'react-native-modal';
import {TextInput, View, Text, DatePickerIOS, Button, ListView, ActivityIndicator, Alert} from 'react-native';

export default class CarModal extends React.Component{

    constructor(props) {

        super(props);

        this.state = {

            isLoading: true,
            text: '',

        };

        this.arrayholder = [] ;
    }

    componentDidMount() {
        return fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json&fbclid=IwAR3mohzTTmrGRpZ9Q2gRBFGa2eFmZ7W3I3T4gIjFICkP7NS69GqPK1SLtq4')
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson.Results),
                }, function() {

                    // In this block you can do something with new state.
                    this.arrayholder = responseJson.Results ;

                });
            })
            .catch((error) => {
                console.error(error);
            });

    }

    GetListViewItem (Make_Name) {

        Alert.alert(Make_Name);

    }

    SearchFilterFunction(text){

        const newData = this.arrayholder.filter(function(item){
            const itemData = item.Make_Name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            text: text
        })
    }

    ListViewItemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <Modal
                style={styles.modal}
                isVisible={this.props.visible}>
                <View style={styles.MainContainer}>

                    <TextInput
                        style={styles.TextInputStyleClass}
                        onChangeText={(text) => this.SearchFilterFunction(text)}
                        value={this.state.text}
                        underlineColorAndroid='transparent'
                        placeholder="Search Here"
                    />

                    <ListView

                        dataSource={this.state.dataSource}

                        renderSeparator= {this.ListViewItemSeparator}

                        renderRow={(rowData) => <Text style={styles.rowViewContainer}

                                                      onPress={this.GetListViewItem.bind(this, rowData.Make_Name)} >{rowData.Make_Name}</Text>}

                        enableEmptySections={true}

                        style={{marginTop: 10}}

                    />

                </View>
                <Button
                    title="Schedule"
                    onPress={() => {
                        this.props.handleConfirm(this.state.date, this.state.notes);
                    }}
                />
            </Modal>
        );
    }
}


styles = {
    modalStyle: {
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    datepicker: {

    },
    notes: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
};
