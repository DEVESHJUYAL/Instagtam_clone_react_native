import { View, Text, TextInput,  Pressable, TouchableOpacity, Alert } from 'react-native'
import React, {useState} from 'react'
import { StyleSheet } from 'react-native'
import {  doc, getDoc,  } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { signInWithEmailAndPassword } from '@firebase/auth';

import { Formik } from 'formik'
import * as Yup from 'yup'
import emailValidator from 'email-validator'

const LoginForm = ({navigation}) => {

const LoginFormSchema = Yup.object().shape({
  email: Yup.string().email().required('An email is required'),
  password: Yup.string().required().min(6, "Your password has to have at least 8 characters")

})

// Adjust the import path as needed
const onLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, 'users', userCredential.user.email);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();
    console.log('successfull')
    // Handle the logged-in user here or set it in your global state if you're using a state management library.
  } catch (error) {
    Alert.alert(
      'Error',
      error.message + '\n\nPlease check your email and password.',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK'),
          style: 'cancel',
        },
      ]
    );
  }
};





  return (
    <View style={styles.wrapper}>
      <Formik initialValues={{email: '', password: ''}} onSubmit={values => {
        onLogin(values.email,values.password)
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
           borderColor: values.password.length < 1 || values.password.length >=6 ? '#ccc' : 'red'}]}>
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
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push('SignUpScreen')}>
          <Text style={{color: '#6BB0F5'}} >Sign Up</Text>
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

signupContainer: {
  flexDirection:'row',
  width: '100%',
  justifyContent: 'center',
  marginTop: 50,
}

})

export default LoginForm
