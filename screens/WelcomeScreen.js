import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import AppLoading from 'expo-app-loading';

import AppButton from '../components/AppButton';
import Colors from '../utils/colors';
import useStatusBar from '../hooks/useStatusBar';
import { loginAnonymously } from '../components/Firebase/firebase';

export default function WelcomeScreen({ navigation }) {
  

  useEffect(() => {
    handleOnLogin();
    }, [])

  async function handleOnLogin() {
    try {
      await loginAnonymously();
    } catch (error) {
      console.log(error);
    }
  }

  useStatusBar('light-content');

  return (
    <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center'
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 320,
    maxHeight: 53

  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 20,
    color: Colors.primary
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 60,
    width: '100%'
  }
});
