import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  Linking,
  ScrollView,
  Switch,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import { useIsFocused } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useGlobalContext } from '../context/Store';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
import { TELEGRAM_TEACHER_GROUP } from '../modules/constants';
import { showToast } from '../modules/Toaster';
import RNExitApp from 'react-native-exit-app';
import Banner from '../components/Banner';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeModal from 'react-native-modal';
import { getDocumentByField } from '../firebase/firestoreHelper';
const Login = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { setActiveTab, setState } = useGlobalContext();
  const [visible, setVisible] = useState(false);
  const [showPassWordText, setShowPassWordText] = useState(false);
  const [loginType, setLoginType] = useState(false);
  const [titleColor, setTitleColor] = useState('skyblue');
  const [studentID, setStudentID] = useState('');
  const [studentIDERR, setStudentIDERR] = useState('');
  const today = new Date();
  const [dob, setDob] = useState(new Date(`${today.getFullYear() - 10}-01-01`));
  const [date, setDate] = useState(
    new Date(`${today.getFullYear() - 10}-01-01`),
  );
  const [selectedDate, setSelectedDate] = useState(
    `01-01-${today.getFullYear() - 10}`,
  );
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);
  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setDob(currentSelectedDate);
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
    setSelectedDate(tarikh);
    console.log(tarikh);
    setFontColor('black');
  };
  const [inputField, setInputField] = useState({
    username: '',
    password: '',
  });
  const [errField, setErrField] = useState({
    usernameErr: '',
    passwordErr: '',
  });
  bcrypt.setRandomFallback(len => {
    const buf = new Uint8Array(len);

    return buf.map(() => Math.floor(isaac.random() * 256));
  });
  const compare = (userPassword, serverPassword) => {
    let match = bcrypt.compareSync(userPassword, serverPassword);

    return match;
  };

  const validForm = () => {
    let formIsValid = true;
    setErrField({
      usernameErr: '',
      passwordErr: '',
    });
    if (inputField.username === '') {
      formIsValid = false;
      setErrField(prevState => ({
        ...prevState,
        usernameErr: 'Please Enter Username',
      }));
    }

    if (inputField.password === '') {
      formIsValid = false;
      setErrField(prevState => ({
        ...prevState,
        passwordErr: 'Please Enter Password',
      }));
    }

    return formIsValid;
  };

  const submitTeacherData = async () => {
    if (validForm()) {
      setVisible(true);
      try {
        await getDocumentByField(
          'userTeachers',
          'username',
          inputField.username.toUpperCase(),
        )
          .then(async record => {
            if (compare(inputField.password, record.password)) {
              const loggedAt = Date.now().toString();
              await getDocumentByField('teachers', 'id', record.id)
                .then(async trecord => {
                  const Obj = {
                    name: trecord.tname,
                    desig: trecord.desig,
                    mobile: trecord.phone,
                    id: record.id,
                    username: record.username,
                    userType: 'teacher',
                  };
                  const teacherRecord = JSON.stringify(Obj);
                  setState({
                    USER: record,
                    USERTYPE: 'teacher',
                    LOGGEDAT: loggedAt,
                  });

                  await EncryptedStorage.setItem(
                    'nonverifieduid',
                    teacherRecord,
                  );

                  setVisible(false);
                  showToast(
                    'success',
                    `Congrats! ${trecord.tname} Your Data is Authenticated, Please verify Your Login!`,
                  );
                  setInputField({
                    username: '',
                    password: '',
                  });
                  setTimeout(() => navigation.navigate('VerifyLogin'), 600);
                })
                .catch(async e => {
                  // showToast('error', 'Your Account Not Found');
                  console.log(e);
                  setVisible(false);
                  showToast('error', 'Connection Error');
                });
            } else {
              setVisible(false);
              showToast('error', 'Your Account is Disabled');
            }
          })
          .catch(e => {
            setVisible(false);
            console.log(e);
            console.log(inputField);
            showToast('error', 'Invalid Username');
          });
      } catch (e) {
        setVisible(false);
        console.log(e);
        showToast('error', 'Connection Error');
      }
    } else {
      showToast('error', 'Form Is Invalid');
      setTitleColor('red');
    }
  };
  const submitStudentData = async () => {
    if (validFormStudent()) {
      try {
        setVisible(true);
        await getDocumentByField('students', 'student_id', studentID)
          .then(async record => {
            if (selectedDate === record.birthdate) {
              const Obj = {
                name: record.student_name,
                class: record.class.split(' (A)')[0],
                roll: record.roll_no,
                father_name: record.father_name,
                mother_name: record.mother_name,
                student_id: record.student_id,
                mobile: record.mobile,
                id: record.id,
                birthdate: record.birthdate,
                userType: 'student',
              };
              const studentRecord = JSON.stringify(Obj);
              const loggedAt = Date.now().toString();
              setState({
                USER: Obj,
                USERTYPE: 'student',
                ACCESS: 'student',
                LOGGEDAT: loggedAt,
              });
              showToast(
                'success',
                `Congrats! ${record.student_name}, You are succesfully Logged In!`,
              );
              await EncryptedStorage.setItem('user', studentRecord);
              await EncryptedStorage.setItem('userType', 'student');
              await EncryptedStorage.setItem('loggedAt', loggedAt);
              setTimeout(() => {
                navigation.navigate('Home');
              }, 2000);
            } else {
              setVisible(false);
              showToast('error', 'Invalid Student ID or Date of Birth');
              console.log('Invalid Student ID or Date of Birth');
            }
          })
          .catch(err => {
            setVisible(false);
            showToast('error', 'Something Went Wrong');
            console.log(err);
          });
      } catch (error) {
        showToast('error', 'Something Went Wrong when Trying');
        setVisible(false);
        console.log(error);
      }
    } else {
      setVisible(false);
      toast.error('Please fill all the required fields');
    }
  };
  const validFormStudent = () => {
    let isValid = false;
    if (studentID.length !== 14) {
      setStudentIDERR('14 Digit Student ID is required');
      isValid = false;
    } else {
      setStudentIDERR('');
      isValid = true;
    }

    return isValid;
  };

  const checkLogin = async () => {
    const user = await EncryptedStorage.getItem('user');
    const nonverifieduid = await EncryptedStorage.getItem('nonverifieduid');
    const userType = await EncryptedStorage.getItem('userType');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('parsedUser', parsedUser);
      const loggedAt = parseInt(await EncryptedStorage.getItem('loggedAt'));
      if (Date.now() - loggedAt < 60 * 60 * 24 * 1000 * 7) {
        setState({
          USER: parsedUser,
          USERTYPE: userType,
          ACCESS: userType,
          LOGGEDAT: loggedAt,
        });
        navigation.navigate('Home');
      } else {
        showToast('success', 'Your Session Expired');
        navigation.navigate('SignOut');
      }
      navigation.navigate('Home');
    }
    if (nonverifieduid) {
      navigation.navigate('VerifyLogin');
    }
  };
  useEffect(() => {}, [inputField, selectedDate]);
  useEffect(() => {
    checkLogin();
  }, [isFocused]);
  const [backPressCount, setBackPressCount] = useState(0);

  const handleBackPress = useCallback(() => {
    if (backPressCount === 0) {
      setBackPressCount(prevCount => prevCount + 1);
      setTimeout(() => setBackPressCount(0), 2000);
    } else if (backPressCount === 1) {
      RNExitApp.exitApp();
    }
    return true;
  }, [backPressCount]);

  useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return backListener.remove;
  }, [handleBackPress]);
  return (
    <ScrollView>
      <Banner />

      <View style={styles.card}>
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
            Student&#8217;s Login
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={loginType ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setLoginType(prev => !prev);
              setInputField({ ...inputField, username: '', password: '' });
              setTitleColor('black');
            }}
            value={loginType}
          />

          <Text
            selectable
            style={[
              styles.title,
              { paddingLeft: 5, fontSize: responsiveFontSize(2) },
            ]}
          >
            Teacher&#8217;s Login
          </Text>
        </View>
        {!loginType ? (
          <View>
            <Text selectable style={styles.title}>
              Student&#8217;s Login
            </Text>
            <Text selectable style={styles.label}>
              Plese Enter Your 14 Digit Student ID
            </Text>
            <CustomTextInput
              value={studentID}
              type={'number-pad'}
              title={'14 Digits of Student ID'}
              maxLength={14}
              placeholder={'Enter 14 Digits of Student ID'}
              onChangeText={text => {
                setStudentID(text);
              }}
            />
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>Enter Date of Birth</Text>
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
                  {dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}-
                  {dob.getMonth() + 1 < 10
                    ? `0${dob.getMonth() + 1}`
                    : dob.getMonth() + 1}
                  -{dob.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={dob}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
              {studentIDERR.length > 0 && (
                <Text style={styles.textErr}>{studentIDERR}</Text>
              )}
              <CustomButton title={'Submit'} onClick={submitStudentData} />
            </View>
          </View>
        ) : (
          <View>
            <Text selectable style={styles.title}>
              Teacher&#8217;s Login
            </Text>
            <CustomTextInput
              value={inputField.username}
              title={'Username'}
              color={titleColor}
              placeholder={'Enter Username'}
              onChangeText={text =>
                setInputField({ ...inputField, username: text })
              }
            />
            {errField.usernameErr.length > 0 && (
              <Text selectable style={styles.textErr}>
                {errField.usernameErr}
              </Text>
            )}
            <CustomTextInput
              secure={true}
              value={inputField.password}
              title={'Password'}
              color={titleColor}
              placeholder={'Enter Password'}
              onChangeText={text => {
                setInputField({ ...inputField, password: text });
              }}
            />
            {errField.passwordErr.length > 0 && (
              <Text selectable style={styles.textErr}>
                {errField.passwordErr}
              </Text>
            )}

            <CustomButton title="Login" onClick={submitTeacherData} />

            <View style={[styles.row, { marginTop: 20 }]}>
              <Text
                selectable
                style={{
                  color: 'black',
                  fontSize: responsiveFontSize(2.2),
                  fontFamily: 'kalpurush',
                  width: responsiveWidth(60),
                }}
              >
                আপনার পাসওয়ার্ড ভুলে গেছেন?
              </Text>
              <TouchableOpacity
                onPress={() => setShowPassWordText(true)}
                style={{
                  backgroundColor: 'chocolate',
                  padding: responsiveWidth(2),
                  borderRadius: 5,
                  marginLeft: 5,
                  width: responsiveWidth(18),
                }}
              >
                <Text selectable style={styles.account}>
                  চাপ দিন
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.row, { marginTop: 20 }]}>
              <Text
                selectable
                style={{
                  color: 'black',
                  fontSize: responsiveFontSize(2.2),
                  fontFamily: 'kalpurush',
                  width: responsiveWidth(40),
                }}
              >
                অসুবিধা বোধ করছেন?
              </Text>
              <TouchableOpacity
                onPress={async () =>
                  await Linking.openURL(TELEGRAM_TEACHER_GROUP)
                }
                style={{
                  backgroundColor: 'blueviolet',
                  padding: responsiveWidth(2),
                  borderRadius: 5,
                  marginLeft: 5,
                  width: responsiveWidth(18),
                }}
              >
                <Text selectable style={styles.account}>
                  চাপ দিন
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              paddingHorizontal: responsiveWidth(5),
            }}
            onPress={() => {
              navigation.navigate('Home');
              setActiveTab(0);
            }}
          >
            <MaterialCommunityIcons
              name="home-circle"
              color={THEME_COLOR}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ReactNativeModal
        isVisible={showPassWordText}
        onBackButtonPress={() => setShowPassWordText(false)}
        onBackdropPress={() => setShowPassWordText(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.mainView}>
            <Text selectable style={styles.title}>
              Your Default Username is Your Employeed ID and Your Default
              password is your PAN in Capital However You can Chage it anytime
              after login
            </Text>
            <View style={{ marginTop: responsiveHeight(3) }}>
              <CustomButton
                title={'Cancel'}
                color={'red'}
                size={'small'}
                onClick={() => setShowPassWordText(false)}
              />
            </View>
          </View>
        </View>
      </ReactNativeModal>
      <Loader visible={visible} />
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  banner: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
  },
  card: {
    width: responsiveWidth(90),

    backgroundColor: 'white',

    elevation: 5,
    borderRadius: responsiveWidth(5),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    marginTop: -responsiveHeight(3),
    marginBottom: responsiveHeight(3),
    paddingBottom: responsiveHeight(2),
  },
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '500',
    marginTop: responsiveHeight(1),
    color: THEME_COLOR,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '400',
    marginTop: 5,
    color: THEME_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textErr: {
    fontSize: responsiveFontSize(2),
    color: 'red',
    alignSelf: 'center',
    marginVertical: responsiveHeight(1),
  },
  account: {
    color: 'white',
    fontWeight: '500',
    fontSize: responsiveFontSize(2),
    fontFamily: 'kalpurush',
    textAlign: 'center',
  },
  modalView: {
    width: responsiveWidth(80),
    height: responsiveHeight(50),
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainView: {
    width: responsiveWidth(80),
    height: responsiveHeight(50),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: responsiveHeight(2),
  },
});
