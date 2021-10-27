
import * as Facebook from 'expo-facebook';



const FacebookProfilePic = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '3031407350517054'
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'user_link'],
      });
      if (type === 'success') {
        
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=name,picture.type(large)`);

        const parseRes = await response.json()

         return({
            inputID: 'facebook',
            url: parseRes.picture.data.url,
            isValid: true
         })
      } else {
         return(null)
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };



  export default FacebookProfilePic;
