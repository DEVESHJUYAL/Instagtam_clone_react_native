import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Divider } from 'react-native-elements'
import { auth, db} from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


export const bottomTabIcons = [
    {
        name: 'Home',
        active: require('../assets/ahome.png'),
        inactive: require('../assets/home.png'),
    },
    {
        name: 'Search',
        active: require('../assets/asearch.png'),
        inactive: require('../assets/search.png'),
    },
    {
        name: 'Reels',
        active: require('../assets/areel.png'),
        inactive: require('../assets/reel.png'),
    },
    {
        name: 'Shop',
        active: require('../assets/abag.png'),
        inactive: require('../assets/bag.png'),
    },
]

const BottomTabs = ({ icons }) => {
    const [activeTab, setActiveTab] = useState('Home');
    const [userProfilePicture, setUserProfilePicture] = useState(null);
  
    useEffect(() => {
      // Fetch the user's profile picture when the component mounts
      fetchUserProfilePicture();
    }, []);
  
    const fetchUserProfilePicture = async () => {
      try {
        // Get the current user from Firebase Auth
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          // Fetch the user's document from Firestore based on their email
          const userDocRef = doc(db, 'users', currentUser.email);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            // Get the profile_picture field from the user's document
            const userData = userDocSnapshot.data();
            if (userData.profile_picture) {
              setUserProfilePicture(userData.profile_picture);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile picture:', error);
      }
    };
  
    const Icon = ({ icon }) => (
      <TouchableOpacity onPress={() => setActiveTab(icon.name)}>
        <Image
          source={
            activeTab === icon.name ? icon.active : icon.inactive
          }
          style={[
            styles.icon,
          ]}
        />
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.wrapper}>
        <Divider width={1} orientation='vertical' />
        <View style={styles.container}>
          {icons.map((icon, index) => (
            <Icon key={index} icon={icon} />
          ))}
          {userProfilePicture && (
            <Image
              source={{ uri: userProfilePicture }}
              style={[
                styles.icon, styles.profilePic
              ]}
            />
          )}
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({

    wrapper: {
        position: 'absolute',
        width: '100%',
        bottom: '0%',
        zindex: 999,
        backgroundColor: '#000',
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 50,
        paddingTop: 10,
    },

    icon: {
        width: 30,
        height: 30,
    },

    profilePic: {
        borderRadius: 50,
    },
})


export default BottomTabs