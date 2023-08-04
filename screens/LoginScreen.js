import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import LoginForm from '../components/LoginScreen/LoginForm/LoginForm'

const INSTAGRAM_LOGO = "../assets/logo.jpg"

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require(INSTAGRAM_LOGO)} style={{height:100, width: 100}} />
      </View>
      <LoginForm navigation={navigation}/>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal:12,
},

logoContainer:{
    alignItems:'center',
    marginTop: 60,
}
})

export default LoginScreen