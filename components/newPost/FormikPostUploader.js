import { View, Text, Image, TextInput, Button, ActivityIndicator} from 'react-native'
import React, { useState, useEffect } from 'react'
import { yupToFormErrors } from 'formik'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Divider } from 'react-native-elements'
import validUrl from "valid-url"
import { auth, db } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, serverTimestamp} from 'firebase/firestore'
import { addDoc } from 'firebase/firestore'


const PLACEHOLDER_IMG = require("../../assets/person.jpg")

const uploadPostSchema = Yup.object().shape({
    imageUrl: Yup.string().url().required('A URL is required'),
    caption: Yup.string().max(2200, 'caption has reached the charater'),
})

const FormikPostUploader = ({navigation}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [userDetailsLoaded, setUserDetailsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await getCurrentUserDetails(user);
      } else {
        setCurrentLoggedInUser(null);
      }
      setUserDetailsLoaded(true);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const getCurrentUserDetails = async (user) => {
    try {
      const docRef = doc(db, 'users', user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setCurrentLoggedInUser({
          username: userData.username,
          profilePicture: userData.profile_picture,
        });
      } else {
        setCurrentLoggedInUser(null);
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
      setUserDetailsLoaded(true);
    }
  };

  const uploadPostToFirebase = async (imageUrl, caption) => {
    try {
      if (!userDetailsLoaded) {
        console.log('User details are still loading...');
        return;
      }

      if (!currentLoggedInUser) {
        console.log('User is not logged in. Please log in to upload a post.');
        return;
      }

      if (!caption || typeof caption !== 'string' || caption.trim() === '') {
        console.log('Caption is required and must be a non-empty string.');
        return;
      }

      const postsCollectionRef = collection(db, 'users', auth.currentUser.email, 'posts');

      // Add a new document to the "posts" subcollection
      await addDoc(postsCollectionRef, {
        imageUrl: imageUrl,
        user: currentLoggedInUser.username,
        owner_uid: auth.currentUser.uid,
        owner_email: auth.currentUser.email,
        profile_picture: currentLoggedInUser.profilePicture,
        caption: caption,
        createdAt: serverTimestamp(),
        likes_by_user: [],
        comments: [],
      })
      .then(() => navigation.goBack());
    } catch (error) {
      console.log('Error uploading post:', error);
    }
  };


    return (
        <Formik
            initialValues={{ caption: '', imageUrl: '' }}
            onSubmit={(values) => {uploadPostToFirebase(values.imageUrl, values.caption)}}
            validationSchema={uploadPostSchema}
            validateOnMount={true}
        >
            {({ handleBlur, handleChange, handleSubmit, values, errors, isValid }) =>
            (
                <> 
            {userDetailsLoaded ? (
            <>
              <View style={{ margin: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                <Image
                  source={validUrl.isUri(thumbnailUrl) ? { uri: thumbnailUrl } : PLACEHOLDER_IMG}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <TextInput
                    style={{ color: 'white', fontSize: 20 }}
                    placeholder="Write a caption..."
                    placeholderTextColor="gray"
                    multiline={true}
                    onChangeText={handleChange('caption')}
                    onBlur={handleBlur('caption')}
                    value={values.caption}
                  />
                </View>
              </View>
              <TextInput
                onChange={(e) => setThumbnailUrl(e.nativeEvent.text)}
                style={{ color: 'white' }}
                placeholder="Enter Image Url"
                placeholderTextColor="gray"
                onChangeText={handleChange('imageUrl')}
                onBlur={handleBlur('imageUrl')}
                value={values.imageUrl}
              />
              {errors.imageUrl && (
                <Text style={{ fontSize: 10, color: 'red', marginBottom: 4, marginTop: 5}}>{errors.imageUrl}</Text>
              )}
              <Button onPress={() => {
  handleSubmit();
  navigation.goBack();
}}  title="Share" disabled={!isValid} />
            </>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </>
      )}
    </Formik>
  );
};

export default FormikPostUploader;