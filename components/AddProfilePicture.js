import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddProfilePicture = async () => {
    
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }


    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
        return ({
            inputID: 'choose',
            url: result.uri,
            isValid: true
        });
    } else {
        return (null)
    }



    //   return (
    //     // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //     //   <Button title="Pick an image from camera roll" onPress={pickImage} />
    //     //   {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    //     // </View>
    //     image
    //   );
}

export default AddProfilePicture;