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
import { useGlobalContext } from '../context/Store';
import { showToast } from '../modules/Toaster';
import {
  compareObjects,
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

export default function VECTransactions() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { state, setActiveTab, stateObject, setStateObject } =
    useGlobalContext();
  const access = state?.ACCESS;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState(todayInString());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);

  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allFTransactions, setAllFTransactions] = useState([]);
  const [showVECEnrty, setShowVECEnrty] = useState(false);
  const [showVECEdit, setShowVECEdit] = useState(false);
  const [vecObj, setVecObj] = useState({
    id: '',
    accountNumber: stateObject?.accountNumber,
    amount: '',
    purpose: '',
    type: 'DEBIT',
    date: todayInString(),
    openingBalance: parseFloat(stateObject?.balance),
    closingBalance: parseFloat(stateObject?.balance),
    createdAt: '',
  });
  const [editVecObj, setEditVecObj] = useState({
    id: '',
    accountNumber: '',
    amount: '',
    purpose: '',
    type: '',
    date: todayInString(),
    openingBalance: '',
    closingBalance: '',
    createdAt: '',
  });
  const [orgVecObj, setOrgVecObj] = useState({
    id: '',
    accountNumber: '',
    amount: '',
    purpose: '',
    type: '',
    date: todayInString(),
    openingBalance: '',
    closingBalance: '',
    createdAt: '',
  });

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
      setVecObj({
        ...vecObj,
        type: 'CREDIT',
        closingBalance: stateObject.balance + vecObj.amount,
      });
    } else {
      setVecObj({
        ...vecObj,
        type: 'DEBIT',
        closingBalance: round2dec(stateObject.balance - vecObj.amount),
      });
    }
  };
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const toggleEditSwitch = () => {
    setIsEditEnabled(!isEditEnabled);
    if (isEditEnabled) {
      setEditVecObj({
        ...editVecObj,
        type: 'CREDIT',
        closingBalance: stateObject.balance + editVecObj.amount,
      });
    } else {
      setEditVecObj({
        ...editVecObj,
        type: 'DEBIT',
        closingBalance: round2dec(stateObject.balance - editVecObj.amount),
      });
    }
  };
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
    setVecObj({
      ...vecObj,
      date: tarikh,
      createdAt: Date.parse(getCurrentDateInput(tarikh)),
    });
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
    setEditVecObj({
      ...editVecObj,
      date: tarikh,
      createdAt: Date.parse(getCurrentDateInput(tarikh)),
    });
  };
  const getTransactions = async () => {
    setLoader(true);
    await getCollection('vectransactions').then(snapshot => {
      const data = snapshot.sort((a, b) => b.createdAt - a.createdAt);
      setLoader(false);
      setAllFTransactions(data);
      setAllTransactions(data);
      const x = data.filter(t => t.id === id);
      if (x.length > 0) {
        setId(getId() + `-${x.length}`);
      } else {
        setId(getId());
      }
      setVecObj({
        id: '',
        accountNumber: stateObject?.accountNumber,
        amount: '',
        purpose: '',
        type: 'DEBIT',
        date: todayInString(),
        openingBalance: parseFloat(stateObject?.balance),
        closingBalance: parseFloat(stateObject?.balance),
        createdAt: '',
      });
    });
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
  const handleVECSubmit = async () => {
    try {
      setLoader(true);
      await setDocument('vectransactions', vecObj.id, vecObj);

      let thisAccount = stateObject;
      thisAccount.balance = vecObj.closingBalance;
      thisAccount.date = vecObj.date;
      await updateDocument('vecaccount', stateObject.id, thisAccount);
      setStateObject(thisAccount);
      setShowVECEnrty(false);
      getTransactions();
      setLoader(false);
      showToast('success', 'Transaction added successfully');
    } catch (error) {
      setLoader(false);
      console.log(error);
      showToast('error', 'Transaction addition failed');
    }
  };
  const updateVec = async () => {
    try {
      if (compareObjects(orgVecObj, vecObj)) {
        setLoader(false);
        showToast('error', 'No Changes Detected');
        return;
      } else {
        setLoader(true);
        await updateDocument('vectransactions', editVecObj.id, editVecObj);

        await updateDocument('vecaccount', stateObject.id, thisAccount);
        let thisAccount = stateObject;

        thisAccount.balance = editVecObj.closingBalance;
        thisAccount.date = editVecObj.date;
        setStateObject(thisAccount);
        setShowVECEdit(false);
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
  const delTransaction = async transaction => {
    setLoader(true);
    await deleteDocument('vectransactions', transaction.id);
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
    await updateDocument('vecaccount', stateObject.id, {
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
  useEffect(() => {
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    } else {
      getTransactions();
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
          <Text style={styles.title}>VEC ACCOUNT TRANSACTIONS</Text>
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
              setShowVECEnrty(true);
              setShowVECEdit(false);
            }}
          />
        </View>
        {allTransactions.length > 0 && !showVECEnrty && !showVECEdit && (
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
                          setShowVECEnrty(false);
                          setShowVECEdit(true);
                          setEditVecObj(item);
                          setOrgVecObj(item);
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
        {showVECEnrty && (
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
            <CustomTextInput
              title={'Opening Balance'}
              placeholder="Enter Opening balance"
              type={'number-pad'}
              value={vecObj.openingBalance.toString()}
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
              value={vecObj.purpose}
              placeholder="Enter purpose"
              onChangeText={e => {
                const inpMonth = parseInt(vecObj.date?.split('-')[1]) - 1;
                const inpYear = vecObj.date?.split('-')[2];
                const textMonth = monthNamesWithIndex[inpMonth].monthName;
                let newId = `${textMonth}-${inpYear}`;
                const checkDuplicate = allTransactions.filter(
                  transaction => transaction.id === newId,
                );
                if (checkDuplicate.length > 0) {
                  newId = new Date().getMinutes().toString() + '-' + newId;
                }
                setVecObj({
                  ...vecObj,
                  purpose: e,
                  id: e.split(' ').join('-') + '-' + newId,
                });
              }}
            />

            <CustomTextInput
              title={'Amount'}
              value={vecObj.amount.toString()}
              placeholder="Enter amount"
              type={'number-pad'}
              onChangeText={e => {
                if (e !== '') {
                  setVecObj({
                    ...vecObj,
                    amount: parseFloat(e),
                    closingBalance:
                      vecObj.type === 'DEBIT'
                        ? parseFloat(
                            round2dec(vecObj.openingBalance - parseFloat(e)),
                          )
                        : parseFloat(e) + vecObj.openingBalance,
                  });
                } else {
                  setVecObj({
                    ...vecObj,
                    amount: '',
                    closingBalance: vecObj.openingBalance,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Closing Balance'}
              placeholder="Enter Closing Balance"
              type={'number-pad'}
              editable={false}
              value={vecObj.closingBalance.toString()}
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
                vecObj.closingBalance <= 0 ||
                vecObj.amount === '' ||
                vecObj.purpose === ''
              }
              onClick={() => handleVECSubmit()}
            />
            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={() => {
                setShowVECEnrty(false);
                setVecObj({
                  id: '',
                  accountNumber: stateObject?.accountNumber,
                  amount: '',
                  purpose: '',
                  type: 'DEBIT',
                  date: todayInString(),
                  openingBalance: parseFloat(stateObject?.balance),
                  closingBalance: parseFloat(stateObject?.balance),
                });
                setIsEnabled(false);
              }}
            />
          </View>
        )}
        {showVECEdit && (
          <View style={{ marginVertical: responsiveHeight(2) }}>
            <Text style={styles.title}>Edit Transaction</Text>

            <CustomTextInput
              title={'Edit Amount'}
              value={editVecObj.amount.toString()}
              placeholder="Enter amount"
              type={'number-pad'}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = parseFloat(e);
                  setEditVecObj({
                    ...editVecObj,
                    amount: parsedAmount,
                  });
                } else {
                  setEditVecObj({
                    ...editVecObj,
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
              value={editVecObj.purpose}
              onChangeText={e => {
                setEditVecObj({
                  ...editVecObj,
                  purpose: e,
                });
              }}
            />
            <CustomTextInput
              title={'Opening Balance'}
              placeholder="Enter Opening Balance"
              type={'number-pad'}
              value={editVecObj.openingBalance.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = parseFloat(e);
                  setEditVecObj({
                    ...editVecObj,
                    openingBalance: parsedAmount,
                  });
                } else {
                  setEditVecObj({
                    ...editVecObj,
                    openingBalance: '',
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Closing Balance'}
              placeholder="Enter Closing Balance"
              type={'number-pad'}
              value={editVecObj.closingBalance.toString()}
              onChangeText={e => {
                if (e !== '') {
                  const parsedAmount = parseFloat(e);
                  setEditVecObj({
                    ...editVecObj,
                    closingBalance: parsedAmount,
                  });
                } else {
                  setEditVecObj({
                    ...editVecObj,
                    closingBalance: '',
                  });
                }
              }}
            />

            <CustomButton
              title={'Save'}
              color={'green'}
              disabled={
                vecObj.editBalance <= 0 ||
                vecObj.editBalance > stateObject?.balance
              }
              onClick={() => updateVec()}
            />
            <CustomButton
              title={'Cancel'}
              color={'darkred'}
              onClick={() => setShowVECEdit(false)}
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
