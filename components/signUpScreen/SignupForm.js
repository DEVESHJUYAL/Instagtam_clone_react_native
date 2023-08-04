import { View, Text, TextInput,  Pressable, TouchableOpacity, Alert } from 'react-native'
import React, {useState} from 'react'
import { StyleSheet } from 'react-native'
import { getAuth } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { collection, doc, setDoc } from '@firebase/firestore';

import { Formik } from 'formik'
import * as Yup from 'yup'
import emailValidator from 'email-validator'


const SignupForm = ({navigation}) => {

const LoginFormSchema = Yup.object().shape({
  email: Yup.string().email().required('An email is required'),
  username: Yup.string().required('An email is required'),
  password: Yup.string().required().min(6, "Your password has to have at least 8 characters")

})

const getRandomProfilePicture = async() => {
  const response = await fetch('https://randomuser.me/api')
  const data = await response.json();
  return data.results[0].picture.large

}


const onSignup = async (email,password, username) => {

  const auth = getAuth();
  try {  const response = await createUserWithEmailAndPassword(auth, email, password)
   const document = {
      id: response.user.uid,
      username: username,
      email: email,
      profile_picture: await getRandomProfilePicture(),
  }
  const usersRef = collection(db, "users");
  await setDoc(doc(usersRef, email), document);
console.log("User is created successfully")  
}
  catch(error) {
    Alert.alert('My Lord...', error.message)
  }
}


return (
    <View style={styles.wrapper}>
      <Formik initialValues={{email: '', username:'', password: ''}} onSubmit={values => {
        onSignup(values.email, values.password, values.username)
      }}   validationSchema={LoginFormSchema}
      validateOnMount={true}>
       {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
        <>
        <View style={[styles.inputField , {
           borderColor: values.email.length < 1 || emailValidator.validate(values.email) ? '#ccc' : 'red'}]}>
      <TextInput
      placeholderTextColor='#444'
      placeholder='Phone number, username or email'
      autoCapitalize='none'
      keyboardType='email-address'
      textContentType='emailAddress'
      autoFocus={true}
      onChangeText={handleChange('email')}
      onBlur={handleBlur('email')}
      value={values.email}
      />
      </View>
      <View style={[styles.inputField, {
           borderColor: values.username.length < 1 || values.username.length >= 6 ? '#ccc' : 'red'}]}>
      <TextInput
      placeholderTextColor='#444'
      placeholder='Username'
      autoCapitalize='none'
      autoCorrect={false}
      textContentType='username'
       onChangeText={handleChange('username')}
      onBlur={handleBlur('username')}
      value={values.username}

      />
      </View>
      <View style={[styles.inputField, {
           borderColor: values.password.length < 1 || values.password.length >= 6 ? '#ccc' : 'red'}]}>
      <TextInput
      placeholderTextColor='#444'
      placeholder='Password'
      autoCapitalize='none'
      autoCorrect={false}
      secureTextEntry={true}
      textContentType='password'
       onChangeText={handleChange('password')}
      onBlur={handleBlur('password')}
      value={values.password}

      />
      </View>
      <View style={{alignItems: 'flex-end', marginBottom: 30}}>
        <Text style={{color: '#6BB0F5'}}>Forgot password?</Text>
      </View>
      <Pressable titleSize={20} style={styles.button(isValid)} disabled={!isValid} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <View style={styles.loginContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color: '#6BB0F5'}} >Log In</Text>
        </TouchableOpacity>
      </View>
      </>)}
      </Formik>

    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 80,
    },

    inputField: {
        borderRadius: 4,
        padding:8,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1,
    
    },

button: isValid=>({
backgroundColor:isValid ? '#0096F6' : '#9ACAF7',
alignItems: 'center',
justifyContent: 'center',
minHeight: 42,
borderRadius: 4,

}),

buttonText: {
  fontWeight: '600',
  color: '#FFF',
  fontSize: 20,
},

loginContainer: {
  flexDirection:'row',
  width: '100%',
  justifyContent: 'center',
  marginTop: 50,
}

})

export default SignupForm