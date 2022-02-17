import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert, Dimensions, TouchableOpacity } from 'react-native'
import Input from '../components/Input';
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import AddProfilePicture from '../components/AddProfilePicture';
import FacebookProfilePic from '../components/FacebookProfilePic';
import BackButton from '../components/Buttons/BackButton';


const SignUpThree = ({ route, navigation }) => {

    const { phoneNumber, firstname, surname, email, password, category, account } = route.params

    const [pictureIsValid, setPictureIsValid] = useState(false)
    const [picture, setPicture] = useState('')

    const [isVisibleFB, setIsVisibleFB] = useState(true);
    const [isVisibleChoose, setIsVisibleChoose] = useState(true)

    const pictureHandler = async (inputID) => {

        if (inputID === 'facebook') {
            const facebook = await FacebookProfilePic()

            const success = () => {
                setPicture(facebook.url)
                setPictureIsValid(facebook.isValid)
                setIsVisibleFB(false)
                setIsVisibleChoose(true)
            }


            !facebook ? null : success()
        }

        if (inputID === 'choose') {
            const choose = await AddProfilePicture()

            console.log(choose)

            const success = () => {
                setPicture(choose.url)
                setPictureIsValid(choose.isValid)
                setIsVisibleChoose(false)
                setIsVisibleFB(true)
            }

            !choose ? null : success()
        }
    }

    const onGoPress = async () => {
        try {
            //const category = 'driver'

            // const url = Linking.createURL('', { queryParams: { params: 'emailToken' } });

            //read about paths in expo linking

            //add scheme

            const body = { firstname, surname, email, password, category, phoneNumber, picture }

            const sendUser = await fetch("https://spareseat-app.herokuapp.com/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const parseResponse = await sendUser.json();

            //dispatch({ type: LOGGED_IN, token: parseResponse.token, category: 'driver' });

            if (typeof parseResponse === 'object') {
                navigation.navigate('CScreen', { token: parseResponse.token, email: email, category: category });
            } else {
                Alert.alert(parseResponse)
            };

        } catch (error) {
            console.log(error.message)
        }
        //await props.navigation.navigate('DRoute')
    };

    return (
        <ScrollView>
            <View>
                <View style={styles.headerComponent}>
                    <View style={styles.backButton}>
                        <BackButton onPress={() => navigation.goBack()} />
                    </View>
                </View>
                <View style={styles.LogIn}>
                    {/* <Avatar
                        rounded
                        size='xlarge'
                        source={{
                            uri:
                                pictureIsValid ? picture : 'placeholder',
                        }}
                        containerStyle={styles.avatar}
                    /> */}
                    <Image style={styles.pictureDimensions} source={{
                        uri: pictureIsValid ? picture : 'placeholder'
                    }}/>
                    <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'center' }}>
                        <View style={styles.pictureButtons}>
                            <Button title="use Facebook profile picture" onPress={pictureHandler.bind(this, 'facebook')} disabled={!isVisibleFB} />
                        </View>
                        <View style={styles.pictureButtons}>
                            <Button title="choose from library" onPress={pictureHandler.bind(this, 'choose')} disabled={!isVisibleChoose} />
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity disabled={!pictureIsValid} onPress={onGoPress} style={{marginBottom: Dimensions.get('window').height * 0.05}}>
                            <Ionicons name="chevron-forward-circle-outline" size={40} color={pictureIsValid ? "green" : "black"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    LogIn: {
        backgroundColor: '#fff',
        alignItems: 'center',
        //padding: '3%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        overflow: 'hidden',
        flex: 1
    },
    pictureDimensions: {
        height: 325,
        width: 325,
        borderRadius: 325,
        marginTop: Dimensions.get('window').height * 0.08
    },
    pictureButtons: {
        width: '50%',
        borderRadius: 15,
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        marginLeft: 10,
        marginTop: Dimensions.get('window').height * 0.02
    },
    headerComponent: {
        height: Dimensions.get('window').height * 0.2,
        padding: '3%'
    },
    avatar: {
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.5,
        marginTop: Dimensions.get('window').height * 0.02
    },
    backButton: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.025
    },
});


export default SignUpThree;