import React, {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useNavigation} from '@react-navigation/native';

import {useGlobalContext} from '../context/Store';
import {Text, View} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
const SignOut = () => {
  const {setState, setActiveTab} = useGlobalContext();
  const navigation = useNavigation();
  const signOut = async () => {
    await EncryptedStorage.clear();

    console.log('User signed out!');
    setState({
      USER: {
        USER: {},
        ACCESS: null,
        LOGGEDAT: null,
        USERTYPE: null,
      },
      LOGGEDAT: '',
    });
    setActiveTab(0);
    navigation.navigate('Home');
  };
  useEffect(() => {
    signOut();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <Text
        style={{
          fontFamily: 'times',
          fontSize: responsiveFontSize(8),
          color: 'darkred',
          textAlign: 'center',
        }}>
        Signed Out Successfully!
      </Text>
    </View>
  );
};

export default SignOut;
