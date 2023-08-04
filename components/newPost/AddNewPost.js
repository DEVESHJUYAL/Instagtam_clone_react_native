import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import FormikPostUploader from './FormikPostUploader'

const Head = ({navigation}) => {
  return (
    <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require("../../assets/back_icon.png")} style={{ width: 30, height: 30, }} />
    </TouchableOpacity>
    <Text style={styles.headerText}>NEW POST</Text>
    <Text></Text>
</View>
  )
}

const AddNewPost = ({navigation}) => {
     return(<View style={styles.container}>
        <Head navigation={navigation} />
        <FormikPostUploader navigation={navigation}/>
    </View>)
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 20,
        marginRight: 23,

    },
})

export default AddNewPost

