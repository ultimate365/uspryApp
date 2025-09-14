import { StyleSheet, Text, View, ScrollView, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import firestore from '@react-native-firebase/firestore';
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
import {
  deleteDocument,
  getCollection,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';

export default function Expense() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    state,
    setStateObject,
    setExpensesState,
    expensesState,
    setActiveTab,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const [showUpdate, setShowUpdate] = useState(false);
  const [account, setAccount] = useState({
    accountName: '',
    balance: 0,
    date: todayInString(),
  });
  const [newAccount, setNewAccount] = useState({
    id: '',
    accountName: '',
    balance: '',
    date: todayInString(),
  });
  const [loader, setLoader] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [addAccount, setAddAccount] = useState(false);
  const getAccounts = async () => {
    setLoader(true);
    await getCollection('expenses').then(data => {
      const res = data.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      );
      setLoader(false);
      setAllAccounts(res);
      setExpensesState(res);
    });
  };
  const updateAccount = async account => {
    setLoader(true);
    try {
      await updateDocument('expenses', account.id, {
        accountName: account.accountName,
        balance: account.balance,
        date: todayInString(),
      });
      setLoader(false);
      showToast('success', 'Account updated successfully');
      setShowUpdate(false);
      getAccounts();
    } catch (error) {
      setLoader(false);
      showToast('error', 'Error updating account');
      console.error(error);
    }
  };
  const addNewAccount = async () => {
    setLoader(true);
    try {
      await setDocument('expenses', newAccount.id, newAccount);
      setExpensesState([...expensesState, newAccount]);
      setAllAccounts([...expensesState, newAccount]);
      setLoader(false);
      showToast('success', 'Account added successfully');
    } catch (error) {
      setLoader(false);
      showToast('error', 'Error updating account');
      console.error(error);
    }
  };
  const deleteAccount = async account => {
    setLoader(true);
    try {
      await deleteDocument('expenses', account.id);
      setExpensesState(expensesState.filter(a => a.id !== account.id));
      setAllAccounts(expensesState.filter(a => a.id !== account.id));
      setLoader(false);
      showToast('success', 'Account deleted successfully');
    } catch (error) {
      setLoader(false);
      showToast('error', 'Error updating account');
      console.error(error);
    }
  };
  useEffect(() => {
    if (expensesState.length === 0) {
      getAccounts();
    } else {
      setAllAccounts(expensesState);
    }
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
      <Text style={styles.title}>Expenses</Text>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}
      >
        <CustomButton
          title={!addAccount ? 'Add New Account' : 'Close'}
          onClick={() => {
            setAddAccount(!addAccount);
          }}
        />
        {addAccount && (
          <View style={{ marginVertical: responsiveHeight(1) }}>
            <CustomTextInput
              title={'Account Name'}
              placeholder={'Enter Account Name'}
              value={newAccount.accountName}
              onChangeText={text => {
                if (text) {
                  setNewAccount({
                    ...newAccount,
                    accountName: text,
                    id: text?.split(' ')?.join('-'),
                  });
                } else {
                  setNewAccount({
                    ...newAccount,
                    accountName: '',
                    id: '',
                    balance: '',
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Balance'}
              placeholder={'Enter Balance'}
              type={'number-pad'}
              value={newAccount.balance.toString()}
              onChangeText={text => {
                if (text) {
                  setNewAccount({
                    ...newAccount,
                    balance: text,
                  });
                } else {
                  setNewAccount({
                    ...newAccount,
                    balance: '',
                  });
                }
              }}
            />
            <CustomButton
              color={'green'}
              disabled={
                newAccount.accountName === '' &&
                newAccount.id === '' &&
                newAccount.balance === ''
              }
              title={'Add Account'}
              onClick={() => addNewAccount()}
            />
            <CustomButton
              color={'red'}
              title={'Cancel'}
              onClick={() => {
                setAddAccount(false);
                setNewAccount({
                  id: '',
                  accountName: '',
                  balance: '',
                  date: todayInString(),
                });
              }}
            />
          </View>
        )}

        {allAccounts.length > 0 &&
          !addAccount &&
          !showUpdate &&
          allAccounts.map((account, index) => (
            <View style={{ marginVertical: responsiveHeight(1) }} key={index}>
              <Text style={styles.label}>
                ACCOUNT NAME: {account.accountName}
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
                  setActiveTab(11);
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
