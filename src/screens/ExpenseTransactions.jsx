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
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from '../context/Store';
import {
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOLNAME,
} from '../modules/constants';
import { showToast } from '../modules/Toaster';
import {
  compareObjects,
  getCurrentDateInput,
  getSubmitDateInput,
  IndianFormat,
  monthNamesWithIndex,
  round2dec,
  todayInString,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import {
  deleteDocument,
  getCollection,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';

export default function ExpenseTransactions() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    setActiveTab,
    stateObject,
    setStateObject,
    state,
    sourceState,
    setSourceState,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const [account, setAccount] = useState({
    accountName: '',
    accountNumber: '',
    balance: 0,
    date: todayInString(),
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
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
    setEditexpenseObj({
      ...editexpenseObj,
      date: tarikh,
    });
  };

  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allFTransactions, setAllFTransactions] = useState([]);
  const [showExpenseEntry, setShowExpenseEntry] = useState(false);
  const [showExpenseEdit, setShowExpenseEdit] = useState(false);
  const [expenseObj, setExpenseObj] = useState({
    id: '',
    amount: '',
    purpose: '',
    sourceName: '',
    sourceName: '',
    type: 'DEBIT',
    date: todayInString(),
    openingBalance: parseFloat(stateObject?.balance),
    closingBalance: parseFloat(stateObject?.balance),
  });
  const [editexpenseObj, setEditexpenseObj] = useState({
    id: '',
    amount: '',
    purpose: '',
    sourceName: '',
    sourceName: '',
    type: '',
    date: todayInString(),
    openingBalance: '',
    closingBalance: '',
  });
  const [editOrgexpenseObj, setEditOrgexpenseObj] = useState({
    id: '',
    amount: '',
    purpose: '',
    sourceName: '',
    sourceName: '',
    type: '',
    date: todayInString(),
    openingBalance: '',
    closingBalance: '',
  });
  const docId = uuid.v4().split('-')[0];
  const [allSources, setAllSources] = useState([]);
  const [sources, setSources] = useState({
    sourceName: '',
    id: docId,
    accountId: stateObject?.id,
  });
  const [addSource, setAddSource] = useState(false);
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
    return `${month}-${year}`;
  };
  const [id, setId] = useState(getId());

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
      setExpenseObj({
        ...expenseObj,
        type: 'CREDIT',
        closingBalance: stateObject.balance + expenseObj.amount,
      });
    } else {
      setExpenseObj({
        ...expenseObj,
        type: 'DEBIT',
        closingBalance: round2dec(stateObject.balance - expenseObj.amount),
      });
    }
  };
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const toggleEditSwitch = () => {
    setIsEditEnabled(!isEditEnabled);
    if (isEditEnabled) {
      setEditexpenseObj({
        ...editexpenseObj,
        type: 'CREDIT',
        closingBalance: stateObject.balance + editexpenseObj.amount,
      });
    } else {
      setEditexpenseObj({
        ...editexpenseObj,
        type: 'DEBIT',
        closingBalance: round2dec(stateObject.balance - editexpenseObj.amount),
      });
    }
  };
  const [sourceText, setSourceText] = useState('Select Source');
  const [sourceClicked, setSourceClicked] = useState(false);
  const getTransactions = async () => {
    setLoader(true);
    await getCollection('expensesTransactions')
      .get()
      .then(res => {
        const data = res.sort(
          (a, b) =>
            Date.parse(getCurrentDateInput(a.date)) -
            Date.parse(getCurrentDateInput(b.date)),
        );
        setLoader(false);
        setAllFTransactions(data);
        const idata = data.reverse();
        setAllTransactions(idata);
        const x = data.filter(t => t.id === id);
        if (x.length > 0) {
          setId(getId() + `-${x.length}`);
        } else {
          setId(getId());
        }
        setExpenseObj({
          id: '',
          amount: '',
          purpose: '',
          sourceName: '',
          type: 'DEBIT',
          date: todayInString(),
          openingBalance: parseFloat(stateObject?.balance),
          closingBalance: parseFloat(stateObject?.balance),
        });
      });
  };
  const getSources = async () => {
    setLoader(true);
    await getCollection('expensesources').then(snapshot => {
      const data = snapshot.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      );
      setLoader(false);
      setSourceState(data);
      const filteredSources = data.filter(
        source => source.accountId === stateObject?.id,
      );
      setAllSources(filteredSources);
    });
  };
  const submitSource = async () => {
    setLoader(true);
    try {
      await setDocument('expensesources', sources.id, sources);
      let x = [];
      x = [...sourceState, sources];
      setSourceState(x);
      setAllSources(x);
      setAddSource(false);
      setLoader(false);
      setSources({
        sourceName: '',
        id: docId,
        accountId: stateObject?.id,
      });
      showToast('success', 'Source added successfully');
    } catch (error) {
      setLoader(false);
      showToast('error', '"Source addition failed"');
      console.error(error);
    }
  };
  const handleExpenseSubmit = async () => {
    try {
      setLoader(true);

      await setDocument('expensesTransactions', expenseObj.id, expenseObj);
      let thisAccount = stateObject;
      thisAccount.balance = expenseObj.closingBalance;
      thisAccount.date = expenseObj.date;
      await updateDocument('expenses', stateObject.id, thisAccount)
        .then(() => {
          setStateObject(thisAccount);
          setShowExpenseEntry(false);
          getTransactions();
          setLoader(false);
          showToast('success', 'Transaction added successfully');
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
          showToast('error', 'Transaction addition failed');
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
      showToast('error', 'Transaction addition failed');
    }
  };
  const updateExpense = async () => {
    try {
      if (compareObjects(editOrgexpenseObj, expenseObj)) {
        setLoader(false);
        showToast('error', 'No Changes Detected');
        return;
      } else {
        setLoader(true);
        await updateDocument(
          'expensesTransactions',
          editexpenseObj.id,
          editexpenseObj,
        );
        const fetchedAmount = stateObject.balance;
        let amount = 0;
        if (
          editOrgexpenseObj.type !== editexpenseObj.type &&
          editOrgexpenseObj.amount !== editexpenseObj.amount
        ) {
          console.log('Case 1');
          if (editOrgexpenseObj.type === 'DEBIT') {
            if (fetchedAmount + parseFloat(editexpenseObj.amount) * 2 < 0) {
              amount =
                round2dec(
                  (fetchedAmount + parseFloat(editexpenseObj.amount) * 2) * -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount + parseFloat(editexpenseObj.amount) * 2,
              );
            }
          } else {
            if (fetchedAmount - parseFloat(editexpenseObj.amount) * 2 < 0) {
              amount =
                round2dec(
                  (fetchedAmount - parseFloat(editexpenseObj.amount) * 2) * -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount - parseFloat(editexpenseObj.amount) * 2,
              );
            }
          }
        } else if (
          editOrgexpenseObj.type !== editexpenseObj.type &&
          editOrgexpenseObj.amount === editexpenseObj.amount
        ) {
          console.log('Case 2');
          if (editOrgexpenseObj.type === 'DEBIT') {
            if (fetchedAmount + parseFloat(editexpenseObj.amount) * 2 < 0) {
              amount =
                round2dec(
                  (fetchedAmount + parseFloat(editexpenseObj.amount) * 2) * -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount + parseFloat(editexpenseObj.amount) * 2,
              );
            }
          } else {
            if (fetchedAmount - parseFloat(editexpenseObj.amount) * 2 < 0) {
              amount =
                round2dec(
                  (fetchedAmount - parseFloat(editexpenseObj.amount) * 2) * -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount - parseFloat(editexpenseObj.amount) * 2,
              );
            }
          }
        } else if (
          editOrgexpenseObj.type === editexpenseObj.type &&
          editOrgexpenseObj.amount !== editexpenseObj.amount
        ) {
          console.log('Case 3');
          if (editOrgexpenseObj.type === 'DEBIT') {
            if (
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) +
                parseFloat(editexpenseObj.amount) <
              0
            ) {
              amount =
                round2dec(
                  (fetchedAmount +
                    parseFloat(editOrgexpenseObj.amount) -
                    parseFloat(editexpenseObj.amount)) *
                    -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount +
                  parseFloat(editOrgexpenseObj.amount) -
                  parseFloat(editexpenseObj.amount),
              );
            }
          } else {
            if (
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) +
                parseFloat(editexpenseObj.amount) <
              0
            ) {
              amount =
                round2dec(
                  (fetchedAmount -
                    parseFloat(editOrgexpenseObj.amount) +
                    parseFloat(editexpenseObj.amount)) *
                    -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount -
                  parseFloat(editOrgexpenseObj.amount) +
                  parseFloat(editexpenseObj.amount),
              );
            }
          }
        } else {
          console.log('Case 4');
          if (editOrgexpenseObj.type === 'DEBIT') {
            if (
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) +
                parseFloat(editexpenseObj.amount) <
              0
            ) {
              amount =
                round2dec(
                  (fetchedAmount -
                    parseFloat(editOrgexpenseObj.amount) +
                    parseFloat(editexpenseObj.amount)) *
                    -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount -
                  parseFloat(editOrgexpenseObj.amount) +
                  parseFloat(editexpenseObj.amount),
              );
            }
          } else {
            if (
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) -
                parseFloat(editexpenseObj.amount) <
              0
            ) {
              amount =
                round2dec(
                  (fetchedAmount -
                    parseFloat(editOrgexpenseObj.amount) -
                    parseFloat(editexpenseObj.amount)) *
                    -1,
                ) * -1;
            } else {
              amount = round2dec(
                fetchedAmount -
                  parseFloat(editOrgexpenseObj.amount) +
                  parseFloat(editexpenseObj.amount),
              );
            }
          }
        }
        let thisAccount = stateObject;
        thisAccount.date = editexpenseObj.date;
        thisAccount.balance = amount;
        await updateDocument('expenses', stateObject.id, thisAccount);
        setStateObject(thisAccount);
        setShowExpenseEdit(false);
        getTransactions();
        setLoader(false);
        showToast('success', 'Transaction Updated successfully');
      }
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
  const delTransaction = async transaction => {
    setLoader(true);
    await deleteDocument('expensesTransactions', transaction.id);
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
    await updateDocument('expenses', stateObject.id, {
      balance:
        transaction.type === 'DEBIT'
          ? parseFloat(
              round2dec(
                parseFloat(stateObject.balance) +
                  parseFloat(transaction.amount),
              ),
            )
          : parseFloat(
              round2dec(
                parseFloat(stateObject.balance) -
                  parseFloat(transaction.amount),
              ),
            ),
      date: todayInString(),
    });

    setStateObject(thisAccount);
    showToast('success', 'Transaction deleted successfully');
    setLoader(false);
    getTransactions();
  };
  const showConfirmDialog2 = id => {
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
          await removeSource(id);
        },
      },
    ]);
  };

  const removeSource = async id => {
    setLoader(true);
    await deleteDocument('expensesources', id);
    let x = sourceState;
    x = sourceState.filter(s => s.id !== id);
    setSourceState(x);
    setAllSources(x);
    setAddSource(false);
    setLoader(false);
    showToast('success', 'Source deleted successfully');
  };
  useEffect(() => {
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    } else {
      getTransactions();
      setAccount(stateObject);
      if (sourceState.length === 0) {
        getSources();
      } else {
        const filteredSources = sourceState.filter(
          source => source.accountId === stateObject?.id,
        );
        setAllSources(filteredSources);
      }
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
          <Text style={styles.title}>EXPENSES TRANSACTIONS</Text>
          <Text style={styles.title}>
            Account Name: {stateObject.accountName}
          </Text>
          <Text style={styles.title}>
            Account Balance: ₹ {IndianFormat(stateObject?.balance)}
          </Text>
        </View>
        <View style={styles.dataView}>
          <CustomButton
            title={`Add${sourceState.length > 0 ? '/ Remove' : ''} Source`}
            onClick={() => {
              setShowExpenseEntry(false);
              setShowExpenseEdit(false);
              setAddSource(true);
            }}
          />
          <CustomButton
            title={'Add New Transaction'}
            onClick={() => {
              setShowExpenseEntry(true);
              setShowExpenseEdit(false);
            }}
          />
        </View>
        {addSource && (
          <View>
            <View style={{ padding: responsiveHeight(2) }}>
              <Text style={styles.title}>Add New Source</Text>
              <CustomTextInput
                placeholder="Enter Source Name"
                value={sources.sourceName}
                onChangeText={e => {
                  setSources({ ...sources, sourceName: e.toUpperCase() });
                }}
              />

              <CustomButton
                title="Add Source"
                disabled={sources.sourceName === ''}
                onClick={() => submitSource()}
              />

              <View style={{ marginVertical: responsiveHeight(1) }}>
                <Text style={styles.title}>Source List</Text>
                {sourceState.map(source => (
                  <View
                    key={source.id}
                    style={{
                      paddingVertical: responsiveHeight(1),
                      marginBottom: responsiveHeight(1),
                      padding: responsiveWidth(2),
                      borderRadius: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={styles.label}>{source.sourceName}</Text>
                    <TouchableOpacity
                      onPress={() => showConfirmDialog2(source.id)}
                    >
                      <Ionicons name="trash-bin" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <CustomButton
                title="Cancel"
                color={'darkred'}
                onClick={() => {
                  setAddSource(false);
                  setSources({
                    sourceName: '',
                    id: docId,
                    accountId: stateObject?.id,
                  });
                }}
              />
            </View>
          </View>
        )}
        {allTransactions.length > 0 &&
          !addSource &&
          !showExpenseEntry &&
          !showExpenseEdit && (
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
                {visibleItems < allTransactions.length && (
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
                data={allTransactions.slice(firstData, visibleItems)}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.dataView} key={index}>
                      <Text style={styles.label}>
                        SL.:{' '}
                        {allFTransactions.findIndex(i => i.id === item.id) + 1}
                      </Text>
                      <Text style={styles.label}>Date: {item.date}</Text>
                      <Text style={styles.label}>
                        Transaction Type: {item.type}
                      </Text>
                      <Text style={styles.label}>
                        Transaction Type: {item.sourceName}
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
                            setShowExpenseEntry(false);
                            setShowExpenseEdit(true);
                            setEditexpenseObj(item);
                            setEditOrgexpenseObj(item);
                            if (item.type == 'DEBIT') {
                              setIsEditEnabled(false);
                            } else {
                              setIsEditEnabled(true);
                            }
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
                {visibleItems < allTransactions.length && (
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
        {showExpenseEntry && (
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
                  onChangeText={calculateAgeOnSameDay}
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
                Select Source
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setSourceClicked(!sourceClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{sourceText}</Text>

                {sourceClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {sourceClicked ? (
                <View style={styles.dropDowArea}>
                  {sourceState.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setSourceClicked(false);
                          setSourceText(item.sourceName);
                          setExpenseObj({
                            ...expenseObj,
                            sourceName: item.sourceName,
                          });
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.sourceName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            <CustomTextInput
              title={'Opening Balance'}
              placeholder="Enter Opening balance"
              type={'number-pad'}
              value={expenseObj.openingBalance.toString()}
              editable={false}
              onChangeText={e => {
                showToast(
                  'error',
                  "Can't change the opening balance, from this section",
                );
              }}
            />

            <CustomTextInput
              title={'Purpose'}
              value={expenseObj.purpose}
              placeholder="Enter purpose"
              onChangeText={e => {
                const inpMonth = parseInt(expenseObj.date?.split('-')[1]) - 1;
                const inpYear = expenseObj.date?.split('-')[2];
                const textMonth = monthNamesWithIndex[inpMonth].monthName;
                let newId = `${textMonth}-${inpYear}`;
                const checkDuplicate = allTransactions.filter(
                  transaction => transaction.id === newId,
                );
                if (checkDuplicate.length > 0) {
                  newId = new Date().getMinutes().toString() + '-' + newId;
                }
                setExpenseObj({
                  ...expenseObj,
                  purpose: e,
                  id: e.split(' ').join('-') + '-' + newId,
                });
              }}
            />

            <CustomTextInput
              title={'Amount'}
              value={expenseObj.amount.toString()}
              placeholder="Enter amount"
              type={'number-pad'}
              onChangeText={e => {
                if (e !== '') {
                  setExpenseObj({
                    ...expenseObj,
                    amount: e,
                    closingBalance:
                      expenseObj.type === 'DEBIT'
                        ? round2dec(expenseObj.openingBalance - e)
                        : e + expenseObj.openingBalance,
                  });
                } else {
                  setExpenseObj({
                    ...expenseObj,
                    amount: '',
                    closingBalance: expenseObj.openingBalance,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Closing Balance'}
              placeholder="Enter Closing Balance"
              type={'number-pad'}
              editable={false}
              value={expenseObj.closingBalance.toString()}
              onChangeText={e => {
                showToast(
                  'error',
                  "Can't change the opening balance, from this section",
                );
              }}
            />
            <CustomButton
              title={'Submit'}
              color={'green'}
              disabled={
                expenseObj.closingBalance <= 0 ||
                expenseObj.amount === '' ||
                expenseObj.purpose === ''
              }
              onClick={() => handleExpenseSubmit()}
            />
            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={() => {
                setShowExpenseEntry(false);
                setExpenseObj({
                  id: '',
                  amount: '',
                  purpose: '',
                  sourceName: '',
                  type: 'DEBIT',
                  date: todayInString(),
                  openingBalance: stateObject?.balance,
                  closingBalance: stateObject?.balance,
                });
                setIsEnabled(false);
                setSourceClicked(false);
                setSourceText('Select Source');
              }}
            />
          </View>
        )}
        {showExpenseEdit && (
          <View style={{ marginVertical: responsiveHeight(2) }}>
            <Text style={styles.title}>Edit Transaction</Text>

            <CustomTextInput
              title={'Edit Amount'}
              value={editexpenseObj.amount.toString()}
              placeholder="Enter amount"
              type={'number-pad'}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditexpenseObj({
                    ...editexpenseObj,
                    amount: parsedAmount,
                  });
                } else {
                  setEditexpenseObj({
                    ...editexpenseObj,
                    amount: '',
                  });
                }
              }}
            />
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
            <CustomTextInput
              title={'Edit Purpose'}
              placeholder="Enter Purpose"
              value={editexpenseObj.purpose}
              onChangeText={e => {
                setEditexpenseObj({
                  ...editexpenseObj,
                  purpose: e,
                });
              }}
            />
            <CustomTextInput
              title={'PP Opening Balance'}
              placeholder="Enter PP Opening Balance"
              type={'number-pad'}
              value={editexpenseObj.openingBalance.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditexpenseObj({
                    ...editexpenseObj,
                    openingBalance: parsedAmount,
                  });
                } else {
                  setEditexpenseObj({
                    ...editexpenseObj,
                    openingBalance: '',
                  });
                }
              }}
            />
            <CustomTextInput
              title={'PP Closing Balance'}
              placeholder="Enter PP Closing Balance"
              type={'number-pad'}
              value={editexpenseObj.closingBalance.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = e;
                  setEditexpenseObj({
                    ...editexpenseObj,
                    closingBalance: parsedAmount,
                  });
                } else {
                  setEditexpenseObj({
                    ...editexpenseObj,
                    closingBalance: '',
                  });
                }
              }}
            />

            <CustomButton
              title={'Save'}
              color={'green'}
              disabled={
                expenseObj.editBalance <= 0 ||
                expenseObj.editBalance > stateObject?.balance
              }
              onClick={() => updateExpense()}
            />
            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={() => setShowExpenseEdit(false)}
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
