
import React, { Component } from 'react';

import { Text, StyleSheet, View, ListView, TextInput, ActivityIndicator, Alert , Dimensions} from 'react-native';


let {height, width} = Dimensions.get('window');

export default class MakeModal extends Component {

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
                <View style={styles.container}>
                    <ActivityIndicator size= "large" animating/>
                </View>
            );
        }

        return (

            <View style={styles.MainContainer}>

                <TextInput
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    placeholder="Search Here"

                    onChangeText={(text) => this.SearchFilterFunction(text)}
                    value={this.state.text}

                />

                <ListView

                    dataSource={this.state.dataSource}

                    renderSeparator= {this.ListViewItemSeparator }

                    renderRow={(rowData) => <Text style={styles.words}

                                                  onPress={this.GetListViewItem.bind(this, rowData.Make_Name)} >{rowData.Make_Name}</Text>}

                    enableEmptySections={true}

                    style={{marginTop: 5}}

                />

            </View>
        );
    }
}

const headerWidth = 20;
const remainingWidth = width - headerWidth;
export {headerWidth, };

const styles = StyleSheet.create({

    MainContainer :{

        justifyContent: 'center',
        flex:1,
        width: remainingWidth,
        margin: 7,
        marginTop: 30,



    },

    rowViewContainer: {
        fontSize: 17,
        padding: 10
    },

    TextInputStyleClass:{

        textAlign: 'left',
        height: 40,
        borderWidth: 1,
        borderColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        //borderRadius: 7 ,
        backgroundColor : "#FFFFFF",
        marginTop: 40,
        fontSize: 20,



    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: "100%"
    },
    item: {
        padding: 15,
    },
    words: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 5,
        fontWeight: 'bold'
    },
});
