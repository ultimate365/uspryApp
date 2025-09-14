import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Switch,
  BackHandler,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useGlobalContext } from '../context/Store';
import { showToast } from '../modules/Toaster';
import {
  getCurrentDateInput,
  IndianFormat,
  monthNamesWithIndex,
  round2dec,
  todayInString,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import {
  deleteDocument,
  getCollection,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';

export default function MDMTransactions() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    state,
    setActiveTab,
    transactionState,
    setTransactionState,
    accountState,
    setAccountState,
    stateObject,
    setStateObject,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState(todayInString());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);
  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
    const year = currentSelectedDate?.getFullYear();
    let month = currentSelectedDate?.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    const cmonth =
      monthNamesWithIndex[
        currentSelectedDate.getDate() > 10
          ? currentSelectedDate.getMonth()
          : currentSelectedDate.getMonth() - 1
      ].monthName;
    const cyear = year.toString();
    setMonth(cmonth);
    setYear(cyear);

    let day = currentSelectedDate?.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    const tarikh = `${day}-${month}-${year}`;
    setDate(tarikh);
    console.log(tarikh);
    setFontColor('black');
  };
  const calculateAgeOnSameDay2 = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
    const year = currentSelectedDate?.getFullYear();
    let month = currentSelectedDate?.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = currentSelectedDate?.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    const tarikh = `${day}-${month}-${year}`;
    setDate(tarikh);
    console.log(tarikh);
    setFontColor('black');
    const cmonth =
      monthNamesWithIndex[
        currentSelectedDate.getDate() > 10
          ? currentSelectedDate.getMonth()
          : currentSelectedDate.getMonth() - 1
      ].monthName;
    const cyear = year.toString();
    setEditTransaction({
      ...editTransaction,
      date: date,
      month: cmonth,
      year: cyear,
      createdAt: Date.parse(getCurrentDateInput(tarikh)),
    });
  };
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [transactionPurpose, setTransactionPurpose] =
    useState('MDM WITHDRAWAL');
  const [loader, setLoader] = useState(false);
  const [thisAccounTransactions, setThisAccounTransactions] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('DEBIT');
  const [ppOB, setPpOB] = useState('');
  const [ppCB, setPpCB] = useState('');
  const [ppRC, setPpRC] = useState('');
  const [ppEX, setPpEX] = useState('');
  const [pryOB, setPryOB] = useState('');
  const [pryRC, setPryRC] = useState('');
  const [pryCB, setPryCB] = useState('');
  const [pryEX, setPryEX] = useState('');
  const [openingBalance, setOpeningBalance] = useState(stateObject.balance);

  const [firstData, setFirstData] = useState(0);
  const [visibleItems, setVisibleItems] = useState(10);
  const [pageData, setPageData] = useState(10);
  const scrollRef = useRef();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  const loadPrev = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems - pageData);
    setFirstData(firstData - pageData);
    scrollToTop();
  };
  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + pageData);
    setFirstData(firstData + pageData);
    scrollToTop();
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      setType('CREDIT');
      setPurpose('MDM COOKING COST');
      setTransactionPurpose('MDM COOKING COST');
      setPpEX(0);
      setPryEX(0);
      setPpCB(ppOB + ppRC);
      setPryCB(pryOB + pryRC);
      setPpRC('');
      setPryRC('');
    } else {
      setType('DEBIT');
      setPurpose('MDM WITHDRAWAL');
      setTransactionPurpose('MDM WITHDRAWAL');
      setPpRC(0);
      setPryRC(0);
      setPpCB(ppOB);
      setPryCB(parseFloat(pryOB));
      setPpEX('');
      setPryEX('');
    }
  };
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const toggleEditSwitch = () => {
    setIsEditEnabled(!isEnabled);
    if (isEditEnabled) {
      setEditTransaction({
        ...editTransaction,
        closingBalance: stateObject.balance - editTransaction.amount,
        type: 'CREDIT',
      });
    } else {
      setEditTransaction({
        ...editTransaction,
        closingBalance: stateObject.balance + editTransaction.amount,
        type: 'DEBIT',
      });
    }
  };
  const [purposeText, setPurposeText] = useState('MDM WITHDRAWAL');
  const [purposeClicked, setPurposeClicked] = useState(false);
  const purposeInput = [
    { purpose: 'MDM WITHDRAWAL', value: 'MDM WITHDRAWAL' },
    { purpose: 'MDM COOKING COST', value: 'MDM COOKING COST' },
    { purpose: 'MDM INTEREST', value: 'MDM INTEREST' },
    { purpose: 'OTHERS', value: 'OTHERS' },
  ];
  const [editTransaction, setEditTransaction] = useState({
    id: '',
    accountNumber: '',
    amount: '',
    month: '',
    year: '',
    purpose: '',
    type: '',
    transactionPurpose: '',
    date: '',
    ppOB: '',
    ppRC: '',
    ppCB: '',
    ppEX: '',
    pryOB: '',
    pryRC: '',
    pryCB: '',
    pryEX: '',
    createdAt: '',
  });
  const [orgTransaction, setOrgTransaction] = useState({
    id: '',
    accountNumber: '',
    amount: '',
    month: '',
    year: '',
    purpose: '',
    type: '',
    transactionPurpose: '',
    date: '',
    ppOB: '',
    ppRC: '',
    ppCB: '',
    ppEX: '',
    pryOB: '',
    pryRC: '',
    pryCB: '',
    pryEX: '',
    createdAt: '',
  });
  const [showEdit, setShowEdit] = useState(false);
  const getId = () => {
    const currentDate = new Date();
    const month =
      monthNamesWithIndex[
        currentDate.getDate() > 10
          ? currentDate.getMonth()
          : currentDate.getMonth() === 0
          ? 11
          : currentDate.getMonth() - 1
      ].monthName;
    const year = currentDate.getFullYear();
    setMonth(month);
    setYear(year);
    return `${month}-${year}`;
  };
  const getMonthYear = date => {
    const currentDate = new Date(date);
    const cmonth =
      monthNamesWithIndex[
        currentDate.getDate() > 10
          ? currentDate.getMonth()
          : currentDate.getMonth() - 1
      ].monthName;
    const cyear = currentDate.getFullYear();
    return `${cmonth}-${cyear}`;
  };
  const [id, setId] = useState('');
  const [purpose, setPurpose] = useState('MDM WITHDRAWAL');
  const getTransactions = async () => {
    setLoader(true);
    await getCollection('transactions').then(snapshot => {
      const data = snapshot.sort((a, b) => b.createdAt - a.createdAt);
      setThisAccounTransactions(
        data.filter(
          account => account.accountNumber === stateObject.accountNumber,
        ),
      );
      setTransactionState(data.reverse());
      setLoader(false);
      const x = data.filter(t => t.id === id);
      if (x.length > 0) {
        setId(getId() + `-${x.length}`);
      } else {
        setId(getId());
      }
    });
  };

  const submitTransaction = async () => {
    if (amount && purpose && type) {
      setLoader(true);
      let y = `${id}-${purpose}`;
      let z = transactionState.filter(item => item.id === y);
      if (z.length > 0) {
        y = y + `-${z.length}`;
      }
      const transaction = {
        accountName: stateObject.accountName,
        accountNumber: stateObject.accountNumber,
        amount,
        purpose,
        type,
        date,
        month,
        year,
        transactionPurpose,
        id: y,
        ppOB,
        ppRC,
        ppEX,
        ppCB,
        pryOB,
        pryRC,
        pryEX,
        pryCB,
        openingBalance,
        closingBalance: round2dec(ppCB + pryCB),
        createdAt: Date.parse(getCurrentDateInput(date)),
      };
      let x = transactionState;
      x = [...x, transaction];
      x = x.sort((a, b) => b.createdAt - a.createdAt);
      const w = x.filter(
        item => item.accountNumber === stateObject.accountNumber,
      );

      setThisAccounTransactions(w);
      setTransactionState(x);
      await setDocument('transactions', y, transaction);
      let thisAccount = stateObject;
      thisAccount.balance = transaction.closingBalance;
      thisAccount.date = date;
      await updateDocument('accounts', stateObject.id, {
        balance: parseFloat(thisAccount.balance),
        date: date,
      });
      const filteredAccounts = accountState.filter(
        el => el.id !== stateObject.id,
      );

      setAccountState([...filteredAccounts, thisAccount]);
      setStateObject(thisAccount);
      showToast('success', 'Transaction added successfully');
      setShowEntry(false);
      setLoader(false);
      setDate(todayInString());
      setType('DEBIT');
      setPurpose('MDM WITHDRAWAL');
      setAmount('');
      // getTransactions();
    } else {
      showToast('error', 'Please fill all the required fields');
      setLoader(false);
    }
  };
  const delTransaction = async transaction => {
    setLoader(true);
    await deleteDocument('transactions', transaction.id);
    const thisAccount = stateObject;
    thisAccount.balance =
      transaction.type === 'DEBIT'
        ? parseFloat(
            round2dec(
              parseFloat(stateObject.balance) + parseFloat(transaction.amount),
            ),
          )
        : parseFloat(
            round2dec(
              parseFloat(stateObject.balance) - parseFloat(transaction.amount),
            ),
          );
    await updateDocument('accounts', stateObject.id, {
      balance: thisAccount.balance,
      date: todayInString(),
    });
    let x = transactionState;
    x = x.filter(item => item.id !== transaction.id);
    setTransactionState(x);
    const y = x
      .filter(account => account.accountNumber === stateObject.accountNumber)
      .reverse();
    setThisAccounTransactions(y);
    let filteredAccounts = accountState.filter(el => el.id !== stateObject.id);
    filteredAccounts.push(thisAccount);
    setAccountState(filteredAccounts);
    setStateObject(thisAccount);
    showToast('success', 'Transaction deleted successfully');
    setLoader(false);
    // getTransactions();
  };

  const updateTransaction = async () => {
    try {
      setLoader(true);
      await updateDocument('transactions', editTransaction.id, editTransaction);
      const fetchedAmount = stateObject.balance;
      let amount = 0;
      if (
        orgTransaction.type !== editTransaction.type &&
        orgTransaction.amount !== editTransaction.amount
      ) {
        console.log('Case 1');
        if (orgTransaction.type === 'DEBIT') {
          if (fetchedAmount + parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount + parseFloat(editTransaction.amount) * 2) * -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount + parseFloat(editTransaction.amount) * 2,
            );
          }
        } else {
          if (fetchedAmount - parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount - parseFloat(editTransaction.amount) * 2) * -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount - parseFloat(editTransaction.amount) * 2,
            );
          }
        }
      } else if (
        orgTransaction.type !== editTransaction.type &&
        orgTransaction.amount === editTransaction.amount
      ) {
        console.log('Case 2');
        if (orgTransaction.type === 'DEBIT') {
          if (fetchedAmount + parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount + parseFloat(editTransaction.amount) * 2) * -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount + parseFloat(editTransaction.amount) * 2,
            );
          }
        } else {
          if (fetchedAmount - parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount - parseFloat(editTransaction.amount) * 2) * -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount - parseFloat(editTransaction.amount) * 2,
            );
          }
        }
      } else if (
        orgTransaction.type === editTransaction.type &&
        orgTransaction.amount !== editTransaction.amount
      ) {
        console.log('Case 3');
        if (orgTransaction.type === 'DEBIT') {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) +
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount +
                  parseFloat(orgTransaction.amount) -
                  parseFloat(editTransaction.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount +
                parseFloat(orgTransaction.amount) -
                parseFloat(editTransaction.amount),
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) +
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(orgTransaction.amount) +
                  parseFloat(editTransaction.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(orgTransaction.amount) +
                parseFloat(editTransaction.amount),
            );
          }
        }
      } else {
        console.log('Case 4');
        if (orgTransaction.type === 'DEBIT') {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) +
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(orgTransaction.amount) +
                  parseFloat(editTransaction.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(orgTransaction.amount) +
                parseFloat(editTransaction.amount),
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) -
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(orgTransaction.amount) -
                  parseFloat(editTransaction.amount)) *
                  -1,
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(orgTransaction.amount) +
                parseFloat(editTransaction.amount),
            );
          }
        }
      }
      let thisAccount = stateObject;
      thisAccount.date = editTransaction.date;
      thisAccount.balance = amount;
      await updateDocument('accounts', stateObject.id, thisAccount);
      let filteredAccounts = accountState.filter(
        el => el.id !== stateObject.id,
      );
      filteredAccounts.push(thisAccount);
      setAccountState(filteredAccounts);
      setStateObject(thisAccount);
      let x = transactionState;
      x = x.filter(item => item.id !== orgTransaction.id);
      x.push(editTransaction);
      x = x.sort((a, b) => b.createdAt - a.createdAt);
      setTransactionState(x);
      const y = x.filter(
        account => account.accountNumber === stateObject.accountNumber,
      );

      setThisAccounTransactions(y);
      showToast('success', 'Transaction Updated successfully');
      setShowEdit(false);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      showToast('error', 'Transaction Updation Failed');
    }
  };
  const showConfirmDialog = entry => {
    return Alert.alert('Hold On!', 'Are You Sure? This Entry Will be Deleted', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Cancel',
        onPress: () => showToast('success', 'Entry Not Deleted'),
      }, // The "Yes" button
      {
        text: 'Yes',
        onPress: async () => {
          await delTransaction(entry);
        },
      },
    ]);
  };
  useEffect(() => {
    if (transactionState.length === 0) {
      getTransactions();
    } else {
      setThisAccounTransactions(
        transactionState.filter(
          transaction =>
            transaction.accountNumber === stateObject.accountNumber,
        ),
      );
      const x = transactionState.filter(t => t.id === id);
      if (x.length > 0) {
        setId(getId() + `-${x.length}`);
      } else {
        setId(getId());
      }
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
      <ScrollView ref={scrollRef} style={{ marginBottom: responsiveHeight(2) }}>
        <View style={[styles.dataView, { backgroundColor: 'antiquewhite' }]}>
          <Text style={styles.title}>MID DAY MEAL TRANSACTIONS</Text>
          <Text style={styles.title}>
            Account Name: {stateObject.accountName}
          </Text>
          <Text style={styles.title}>
            Account Number: {stateObject.accountNumber}
          </Text>
          <Text style={styles.title}>
            Account Balance: ₹ {IndianFormat(stateObject?.balance)}
          </Text>
        </View>
        <View style={styles.dataView}>
          <CustomButton
            title={'Add New Transaction'}
            onClick={() => {
              setShowEntry(true);
              const lastTransaction = transactionState[0];
              setPpOB(lastTransaction.ppCB);
              setPryOB(lastTransaction.pryCB);
            }}
          />
        </View>
        {!showEntry && !showEdit && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: responsiveHeight(1),
              }}
            >
              {firstData >= 10 && (
                <View>
                  <CustomButton
                    color={'orange'}
                    title={'Previous'}
                    onClick={loadPrev}
                    size={'small'}
                    fontSize={14}
                  />
                </View>
              )}
              {visibleItems < thisAccounTransactions.length && (
                <View>
                  <CustomButton
                    title={'Next'}
                    onClick={loadMore}
                    size={'small'}
                    fontSize={14}
                  />
                </View>
              )}
            </View>
            <FlatList
              data={thisAccounTransactions.slice(firstData, visibleItems)}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.dataView} key={index}>
                    <Text style={styles.label}>
                      SL.:{' '}
                      {transactionState.findIndex(i => i.id === item?.id) + 1}
                    </Text>
                    <Text style={styles.label}>Date: {item?.date}</Text>
                    <Text style={styles.label}>
                      Transaction Type: {item?.type}
                    </Text>
                    <Text style={styles.label}>
                      Transaction Purpose:{'\n'} {item?.purpose}
                    </Text>
                    <Text style={styles.label}>
                      Amount: {`₹ ${IndianFormat(item?.amount)}`}
                    </Text>
                    <Text style={styles.label}>
                      Opening Balance:{' '}
                      {`₹ ${IndianFormat(item?.openingBalance)}`}
                    </Text>
                    <Text style={styles.label}>
                      Closing Balance:{' '}
                      {`₹ ${IndianFormat(item?.closingBalance)}`}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: responsiveWidth(40),
                      }}
                    >
                      <CustomButton
                        title={'Edit'}
                        size={'xsmall'}
                        color={'darkorange'}
                        onClick={() => {
                          setShowEntry(false);
                          setEditTransaction(item);
                          setOrgTransaction(item);
                          setShowEdit(true);
                          setAmount(item?.amount);
                          setPurpose(item?.purpose);
                          setId(item?.purpose);
                          setType(item?.type);
                          if (item?.type === 'DEBIT') {
                            setIsEditEnabled(false);
                          } else {
                            setIsEditEnabled(true);
                          }
                          setDate(item?.date);
                          setCurrentDate(
                            new Date(getCurrentDateInput(item?.date)),
                          );
                          setPpOB(item?.ppOB);
                          setPpRC(item?.ppRC);
                          setPpCB(item?.ppCB);
                          setPryOB(item?.pryOB);
                          setPryRC(item?.pryRC);
                          setPryCB(item?.pryCB);
                          setPryCB(item?.pryCB);
                          setOpeningBalance(item?.openingBalance);
                          setPurposeText(item?.transactionPurpose);
                        }}
                      />
                      <CustomButton
                        title={'Delete'}
                        size={'xsmall'}
                        color={'red'}
                        onClick={() => {
                          showConfirmDialog(item);
                        }}
                      />
                    </View>
                  </View>
                );
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: responsiveHeight(1),
              }}
            >
              {firstData >= 10 && (
                <View>
                  <CustomButton
                    color={'orange'}
                    title={'Previous'}
                    onClick={loadPrev}
                    size={'small'}
                    fontSize={14}
                  />
                </View>
              )}
              {visibleItems < thisAccounTransactions.length && (
                <View>
                  <CustomButton
                    title={'Next'}
                    onClick={loadMore}
                    size={'small'}
                    fontSize={14}
                  />
                </View>
              )}
            </View>
          </View>
        )}
        {showEntry && (
          <View style={{ marginVertical: responsiveHeight(2) }}>
            <Text style={styles.title}>Add New Transaction</Text>
            <Text style={styles.label}>ID: {id}</Text>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>Date*</Text>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  borderColor: 'skyblue',
                  borderWidth: 1,
                  width: responsiveWidth(76),
                  height: 50,
                  alignSelf: 'center',
                  borderRadius: responsiveWidth(3),
                  justifyContent: 'center',
                }}
                onPress={() => setOpen(true)}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    color: fontColor,
                    paddingLeft: 14,
                  }}
                >
                  {currentDate.getDate() < 10
                    ? '0' + currentDate.getDate()
                    : currentDate.getDate()}
                  -
                  {currentDate.getMonth() + 1 < 10
                    ? `0${currentDate.getMonth() + 1}`
                    : currentDate.getMonth() + 1}
                  -{currentDate.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={currentDate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
            </View>
            <Text style={styles.label}>Transaction Type</Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                selectable
                style={[
                  styles.title,
                  {
                    paddingRight: responsiveWidth(1.5),
                    fontSize: responsiveFontSize(2),
                  },
                ]}
              >
                DEBIT
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />

              <Text
                selectable
                style={[
                  styles.title,
                  { paddingLeft: 5, fontSize: responsiveFontSize(2) },
                ]}
              >
                CREDIT
              </Text>
            </View>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                Transaction Purpose
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setPurposeClicked(!purposeClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{purposeText}</Text>

                {purposeClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {purposeClicked ? (
                <View style={styles.dropDowArea}>
                  {purposeInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setPurposeClicked(false);
                          setPurpose(item.purpose);
                          setTransactionPurpose(item.purpose);
                          setPurposeText(item.purpose);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.purpose}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            <CustomTextInput
              title={'Purpose'}
              placeholder="Enter Purpose"
              value={purpose}
              onChangeText={e => {
                setPurpose(e);
              }}
            />
            <CustomTextInput
              title={'Amount'}
              placeholder="Enter Amount"
              value={amount.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;

                  setAmount(parsedAmount);
                } else {
                  setAmount('');
                }
              }}
            />
            {type === 'DEBIT' && (
              <Text style={styles.label}>
                Maximum amount allowed: ₹ {IndianFormat(stateObject.balance)}
              </Text>
            )}
            <CustomTextInput
              title={'PP Opening Balance'}
              placeholder="Enter PP Opening Balance"
              type={'number-pad'}
              value={ppOB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;

                  setPpOB(parsedAmount);
                } else {
                  setPpOB('');
                }
              }}
            />
            {type === 'CREDIT' && (
              <CustomTextInput
                title={'PP Received'}
                placeholder="Enter PP Received"
                type={'number-pad'}
                value={ppRC.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;

                    setPpRC(parsedAmount);
                    setPpCB(ppOB + parsedAmount);
                  } else {
                    setPpRC('');
                    setPpCB(ppOB);
                  }
                }}
              />
            )}
            {type === 'DEBIT' && (
              <CustomTextInput
                title={'PP Expense'}
                placeholder="Enter PP Expense"
                type={'number-pad'}
                value={ppEX.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;

                    setPpEX(parsedAmount);
                    setPpCB(ppOB + ppRC - parsedAmount);
                  } else {
                    setPpEX('');
                    setPpCB(ppRC + ppOB);
                  }
                }}
              />
            )}
            <CustomTextInput
              title={'PP Closing Balance'}
              placeholder="Enter PP Closing Balance"
              type={'number-pad'}
              value={ppCB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;

                  setPpCB(parsedAmount);
                } else {
                  setPpCB('');
                }
              }}
            />
            <CustomTextInput
              title={'Primary Opening Balance'}
              placeholder="Enter Primary Opening Balance"
              type={'number-pad'}
              value={pryOB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;

                  setPryOB(parsedAmount);
                } else {
                  setPryOB('');
                }
              }}
            />
            {type === 'CREDIT' && (
              <CustomTextInput
                title={'Primary Received'}
                placeholder="Enter Primary Received"
                type={'number-pad'}
                value={pryRC.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;

                    setPryRC(parsedAmount);
                    setPryCB(pryOB + parsedAmount);
                  } else {
                    setPryRC('');
                    setPryCB(pryOB);
                  }
                }}
              />
            )}
            {type === 'DEBIT' && (
              <CustomTextInput
                title={'Primary Expense'}
                placeholder="Enter Primary Expense"
                type={'number-pad'}
                value={pryEX.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;

                    setPryEX(parsedAmount);
                    setPryCB(round2dec(pryOB + pryRC - parsedAmount));
                  } else {
                    setPryEX('');
                    setPryCB(pryRC + pryOB);
                  }
                }}
              />
            )}
            <CustomTextInput
              title={'Primary Closing Balance'}
              placeholder="Enter Primary Closing Balance"
              type={'number-pad'}
              value={pryCB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;

                  setPryCB(parsedAmount);
                } else {
                  setPryCB('');
                }
              }}
            />
            <CustomButton
              title={'Submit'}
              color={'green'}
              disabled={
                stateObject.amount <= 0 ||
                stateObject.amount > stateObject.balance
              }
              onClick={() => submitTransaction()}
            />
            <CustomButton
              title={'Close'}
              color={'darkorange'}
              onClick={() => {
                setShowEntry(false);
                setAmount('');
                setPurpose('MDM WITHDRAWAL');
                setId(getId());
                setType('DEBIT');
                setDate(todayInString());
                setPpOB('');
                setPpRC('');
                setPpCB('');
                setPryOB('');
                setPryRC('');
                setPryCB('');
                setPryCB('');
                setOpeningBalance(stateObject.balance);
                setPurposeText('MDM WITHDRAWAL');
                setIsEnabled(false);
                scrollToTop();
              }}
            />
          </View>
        )}
        {showEdit && (
          <View style={{ marginVertical: responsiveHeight(2) }}>
            <Text style={styles.title}>Update Transaction</Text>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>Date*</Text>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  borderColor: 'skyblue',
                  borderWidth: 1,
                  width: responsiveWidth(76),
                  height: 50,
                  alignSelf: 'center',
                  borderRadius: responsiveWidth(3),
                  justifyContent: 'center',
                }}
                onPress={() => setOpen(true)}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    color: fontColor,
                    paddingLeft: 14,
                  }}
                >
                  {currentDate.getDate() < 10
                    ? '0' + currentDate.getDate()
                    : currentDate.getDate()}
                  -
                  {currentDate.getMonth() + 1 < 10
                    ? `0${currentDate.getMonth() + 1}`
                    : currentDate.getMonth() + 1}
                  -{currentDate.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={currentDate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay2}
                />
              )}
            </View>
            <CustomTextInput
              title={'Amount'}
              placeholder="Enter Amount"
              value={editTransaction.amount.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditTransaction({
                    ...editTransaction,
                    amount: parsedAmount,
                  });
                } else {
                  setEditTransaction({
                    ...editTransaction,
                    amount: '',
                  });
                }
              }}
            />
            {editTransaction.type === 'DEBIT' && (
              <Text style={styles.label}>
                Maximum amount allowed: ₹ {IndianFormat(stateObject.balance)}
              </Text>
            )}
            <Text style={styles.label}>Edit Transaction Type</Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                selectable
                style={[
                  styles.title,
                  {
                    paddingRight: responsiveWidth(1.5),
                    fontSize: responsiveFontSize(2),
                  },
                ]}
              >
                DEBIT
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEditEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleEditSwitch}
                value={isEditEnabled}
              />

              <Text
                selectable
                style={[
                  styles.title,
                  { paddingLeft: 5, fontSize: responsiveFontSize(2) },
                ]}
              >
                CREDIT
              </Text>
            </View>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                Edit Transaction Purpose
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setPurposeClicked(!purposeClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{purposeText}</Text>

                {purposeClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {purposeClicked ? (
                <View style={styles.dropDowArea}>
                  {purposeInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setPurposeClicked(false);
                          setPurposeText(item.purpose);
                          setEditTransaction({
                            ...editTransaction,
                            transactionPurpose: item.purpose,
                          });
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.purpose}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            <CustomTextInput
              title={'Edit Purpose'}
              placeholder="Enter Purpose"
              value={editTransaction.purpose}
              onChangeText={e => {
                setEditTransaction({
                  ...editTransaction,
                  purpose: e,
                });
              }}
            />
            <CustomTextInput
              title={'PP Opening Balance'}
              placeholder="Enter PP Opening Balance"
              type={'number-pad'}
              value={editTransaction.ppOB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditTransaction({
                    ...editTransaction,
                    ppOB: parsedAmount,
                  });
                } else {
                  setEditTransaction({
                    ...editTransaction,
                    ppOB: '',
                  });
                }
              }}
            />
            {editTransaction.type === 'CREDIT' && (
              <CustomTextInput
                title={'PP Received'}
                placeholder="Enter PP Received"
                type={'number-pad'}
                value={editTransaction.ppRC.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;
                    setEditTransaction({
                      ...editTransaction,
                      ppRC: parsedAmount,
                      pryCB: parsedAmount + editTransaction.ppOB,
                    });
                  } else {
                    setEditTransaction({
                      ...editTransaction,
                      ppRC: '',
                      ppCB: '',
                    });
                  }
                }}
              />
            )}
            {editTransaction.type === 'DEBIT' && (
              <CustomTextInput
                title={'PP Expense'}
                placeholder="Enter PP Expense"
                type={'number-pad'}
                value={editTransaction?.ppEX.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;
                    setEditTransaction({
                      ...editTransaction,
                      ppEX: parsedAmount,
                      ppCB:
                        editTransaction.ppOB +
                        editTransaction.ppRC -
                        parsedAmount,
                    });
                  } else {
                    setEditTransaction({
                      ...editTransaction,
                      ppEX: '',
                      ppCB: editTransaction.ppOB + editTransaction.ppRC,
                    });
                  }
                }}
              />
            )}
            <CustomTextInput
              title={'PP Closing Balance'}
              placeholder="Enter PP Closing Balance"
              type={'number-pad'}
              value={editTransaction.ppCB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditTransaction({
                    ...editTransaction,
                    ppCB: parsedAmount,
                  });
                } else {
                  setEditTransaction({
                    ...editTransaction,
                    ppCB: '',
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Primary Opening Balance'}
              placeholder="Enter Primary Opening Balance"
              type={'number-pad'}
              value={editTransaction.pryOB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;

                  setEditTransaction({
                    ...editTransaction,
                    pryOB: parsedAmount,
                  });
                } else {
                  setEditTransaction({
                    ...editTransaction,
                    pryOB: '',
                  });
                }
              }}
            />
            {type === 'CREDIT' && (
              <CustomTextInput
                title={'Primary Received'}
                placeholder="Enter Primary Received"
                type={'number-pad'}
                value={editTransaction.pryRC.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;

                    setEditTransaction({
                      ...editTransaction,
                      pryRC: parsedAmount,
                    });
                  } else {
                    setEditTransaction({
                      ...editTransaction,
                      pryRC: '',
                    });
                  }
                }}
              />
            )}
            {type === 'DEBIT' && (
              <CustomTextInput
                title={'Primary Expense'}
                placeholder="Enter Primary Expense"
                type={'number-pad'}
                value={editTransaction?.pryEX.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const parsedAmount = e;

                    setEditTransaction({
                      ...editTransaction,
                      pryEX: parsedAmount,
                      pryCB: round2dec(
                        editTransaction.pryOB +
                          editTransaction.pryRC -
                          parsedAmount,
                      ),
                    });
                  } else {
                    setEditTransaction({
                      ...editTransaction,
                      pryEX: '',
                      pryCB: round2dec(
                        editTransaction.pryOB + editTransaction.pryRC,
                      ),
                    });
                  }
                }}
              />
            )}
            <CustomTextInput
              title={'Primary Closing Balance'}
              placeholder="Enter Primary Closing Balance"
              type={'number-pad'}
              value={editTransaction.pryCB.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditTransaction({
                    ...editTransaction,
                    pryCB: parsedAmount,
                  });
                } else {
                  setEditTransaction({
                    ...editTransaction,
                    pryCB: '',
                  });
                }
              }}
            />
            <CustomButton
              color={'green'}
              disabled={
                stateObject.amount <= 0 ||
                stateObject.amount > stateObject.balance
              }
              onClick={() => {
                scrollToTop();
                updateTransaction();
              }}
              title={'Submit'}
            />
            <CustomButton
              color={'darkorange'}
              onClick={() => {
                setShowEdit(false);
                setPurposeText('MDM WITHDRAWAL');
                scrollToTop();
              }}
              title={'Close'}
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
  result: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: 'darkgreen',
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: THEME_COLOR,
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  itemView: {
    width: responsiveWidth(92),
    backgroundColor: 'white',

    alignSelf: 'center',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(0.5),
    padding: responsiveWidth(2),
    shadowColor: 'black',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255,.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dropDownText: {
    fontSize: responsiveFontSize(1.8),
    color: 'royalblue',
    alignSelf: 'center',
    textAlign: 'center',
  },
  error: {
    fontSize: responsiveFontSize(1.8),
    color: 'red',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'kalpurush',
    marginVertical: responsiveHeight(1),
  },
  dropDownTextTransfer: {
    fontSize: responsiveFontSize(1.8),
    color: THEME_COLOR,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  dropDownnSelector: {
    width: responsiveWidth(76),
    height: responsiveHeight(7),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: THEME_COLOR,
    alignSelf: 'center',
    marginTop: responsiveHeight(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
  },
  dropDowArea: {
    width: responsiveWidth(76),

    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
  },
  AdminName: {
    width: responsiveWidth(76),
    height: responsiveHeight(7),
    borderBottomWidth: 0.2,
    borderBottomColor: THEME_COLOR,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    marginTop: responsiveHeight(3),
    alignSelf: 'center',
    color: THEME_COLOR,
  },
  dataView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: responsiveHeight(0.5),
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(1),
    width: responsiveWidth(94),
    elevation: 5,
  },
  bankDataText: {
    alignSelf: 'center',
    color: THEME_COLOR,
    textAlign: 'center',
    padding: 1,
    fontSize: responsiveFontSize(2),
    marginLeft: 5,
  },
});
