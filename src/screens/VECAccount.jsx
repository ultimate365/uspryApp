import { StyleSheet, Text, View, ScrollView, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import Loader from '../components/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useGlobalContext } from '../context/Store';
import { showToast } from '../modules/Toaster';
import {
  getCurrentDateInput,
  todayInString,
  IndianFormat,
} from '../modules/calculatefunctions';
import { getCollection, updateDocument } from '../firebase/firestoreHelper';

export default function VECAccount() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { state, setStateObject, setActiveTab } = useGlobalContext();
  const access = state?.ACCESS;
  const [showUpdate, setShowUpdate] = useState(false);
  const [account, setAccount] = useState({
    accountName: '',
    accountNumber: '',
    balance: 0,
    date: todayInString(),
  });

  const [loader, setLoader] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const getAccounts = async () => {
    setLoader(true);
    await getCollection('vecaccount').then(snapshot => {
      const data = snapshot.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      );
      setLoader(false);
      setAllAccounts(data);
    });
  };
  const updateAccount = async account => {
    try {
      await updateDocument('vecaccount', account.id, {
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        balance: account.balance,
        date: todayInString(),
      });
      showToast('success', 'Account updated successfully');
      setShowUpdate(false);
      getAccounts();
    } catch (error) {
      showToast('error', 'Error updating account');
      console.error(error);
    }
  };
  useEffect(() => {
    getAccounts();
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    }
  }, [isFocused]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home');
        setActiveTab(0);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={loader} />
      <Text style={styles.title}>VEC ACCOUNT</Text>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}
      >
        {allAccounts.length > 0 &&
          allAccounts.map((account, index) => (
            <View style={{ marginVertical: responsiveHeight(1) }} key={index}>
              <Text style={styles.label}>
                ACCOUNT NAME: {account.accountName}
              </Text>
              <Text style={styles.label}>
                ACCOUNT NUMBER: {account.accountNumber}
              </Text>
              <Text style={styles.label}>
                BALANCE: ₹ {IndianFormat(account.balance)}
              </Text>
              <Text style={styles.label}>UPDATED AT: {account.date}</Text>
              <CustomButton
                title={'Transactions'}
                color={'green'}
                onClick={() => {
                  setStateObject(account);
                  setActiveTab(9);
                }}
              />
              <CustomButton
                title={'Update'}
                color={'darkorange'}
                onClick={() => {
                  setShowUpdate(true);
                  setAccount(account);
                }}
              />
            </View>
          ))}
        {showUpdate && (
          <View style={{ marginVertical: responsiveHeight(1) }}>
            <Text style={styles.label}>
              ACCOUNT NAME: {account.accountName}
            </Text>
            <CustomTextInput
              title={'Account Name'}
              placeholder={'Enter Account Name'}
              value={account.accountName}
              onChangeText={e => setAccount({ ...account, accountName: e })}
            />
            <CustomTextInput
              title={'Account Number'}
              placeholder={'Enter Account Number'}
              type={'number-pad'}
              value={account.accountNumber}
              onChangeText={e => setAccount({ ...account, accountNumber: e })}
            />
            <CustomTextInput
              title={'Balance'}
              placeholder={'Enter Balance'}
              type={'number-pad'}
              value={account.balance.toString()}
              onChangeText={e => {
                if (e.length > 0) {
                  setAccount({ ...account, balance: e });
                } else {
                  setAccount({ ...account, balance: '' });
                }
              }}
            />
            <CustomButton
              title={'Update Account'}
              color={'darkorange'}
              onClick={() => updateAccount(account)}
            />
            <CustomButton
              title={'Cancel'}
              color={'purple'}
              onClick={() => setShowUpdate(false)}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: responsiveWidth(4),
    color: THEME_COLOR,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: THEME_COLOR,
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
});
