import {Alert, BackHandler, Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {THEME_COLOR} from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import {TELEGRAM_TEACHER_GROUP, WEBSITE} from '../modules/constants';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../components/Loader';
import {showToast} from '../modules/Toaster';
import CustomTextInput from '../components/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import {useGlobalContext} from '../context/Store';
const VerifyLogin = () => {
  const navigation = useNavigation();
  const {setState,setActiveTab} = useGlobalContext();
  const [phone, setPhone] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [name, setName] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [mobileOTP, setMobileOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const getDetails = async () => {
    const user = await EncryptedStorage.getItem('nonverifieduid');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserDetails(parsedUser);
      setName(parsedUser.name);
      setPhone(parsedUser.mobile);
    }
  };
  const sendVerificationOTP = async (phone, name) => {
    setDisplayLoader(true);
    const res = await axios.post(`${WEBSITE}/api/sendMobileOTP`, {
      phone,
      name,
    });
    const record = res.data;
    if (record.success) {
      showToast('success', 'OTP sent to your Mobile Number!');
      setDisplayLoader(false);
      setOtpSent(true);
      setShowRetryBtn(false);
      setTimeout(() => {
        setShowRetryBtn(true);
      }, 30000);
    } else {
      setShowRetryBtn(true);
      showToast('error', 'Failed to send OTP!');
      setDisplayLoader(false);
    }
  };
  const verifyOTP = async e => {
    if (mobileOTP !== '' && mobileOTP.length === 6) {
      setDisplayLoader(true);
      const res = await axios.post(`${WEBSITE}/api/verifyMobileOTP`, {
        phone,
        phoneCode: mobileOTP,
        name: name,
      });
      const record = res.data;
      if (record.success) {
        showToast('success', 'Your Mobile Number is successfully verified!');
        setDisplayLoader(false);
        await EncryptedStorage.clear('nonverifieduid');
        await EncryptedStorage.setItem('user', JSON.stringify(userDetails));
        await EncryptedStorage.setItem('userType', 'teacher');
        await EncryptedStorage.setItem('loggedAt', Date.now().toString());
        setState({
          USER: userDetails,
          LOGGEDAT: Date.now(),
          USERTYPE: userDetails?.userType,
          ACCESS: userDetails?.userType,
        });
        setTimeout(() => {
          navigation.navigate('Home');
        }, 500);
      } else {
        toast.error('Please enter a Valid 6 Digit OTP');
        setDisplayLoader(false);
      }
    } else {
      toast.error('Please enter a Valid 6 Digit OTP');
      setDisplayLoader(false);
    }
  };
  const openURI = async () => {
    const url = TELEGRAM_TEACHER_GROUP;
    await Linking.openURL(url); // It will open the URL on browser.
  };
  useEffect(() => {
    getDetails();
  }, []);
  useEffect(() => {
  }, [phone, name, userDetails]);
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Header />
      <Text style={styles.title}>Verify Login</Text>
      {!otpSent ? (
        <CustomButton
          title={'Send OTP'}
          onClick={() => {
            sendVerificationOTP(phone, name);
          }}
        />
      ) : (
        <View style={styles.bottom}>
          <Text style={styles.title}>
            Hello, {name}! Please check your phone +91-
            {`${phone?.slice(0, 4)}XXXX${phone?.slice(8, 10)}`} for an OTP.
          </Text>
          <CustomButton title={'Open Telegram'} onClick={() => openURI()} />
          <CustomTextInput
            placeholder={'Enter OTP'}
            type={'number-pad'}
            title={'OTP'}
            value={mobileOTP}
            maxLength={6}
            onChangeText={text => setMobileOTP(text)}
          />
          <CustomButton
            title={'Verify OTP'}
            onClick={() => {
              verifyOTP();
            }}
          />
          {showRetryBtn && (
            <CustomButton
              title={'Retry'}
              onClick={() => {
                sendVerificationOTP(phone, name);
              }}
            />
          )}
        </View>
      )}

      <Loader visible={displayLoader} />
    </View>
  );
};

export default VerifyLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: THEME_COLOR,
    textAlign: 'center',
    padding: 5,
    marginHorizontal: responsiveHeight(1),
  },
  bottom: {
    marginBottom: responsiveHeight(8),
  },
  dataView: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    marginTop: responsiveHeight(1),
    borderRadius: 10,
    padding: 10,
    width: responsiveWidth(90),
  },
  dataText: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    color: THEME_COLOR,
    textAlign: 'center',
    padding: 5,
  },
  bankDataText: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.5),
    color: THEME_COLOR,
    textAlign: 'center',
    padding: 1,
  },
  modalView: {
    flex: 1,

    width: responsiveWidth(90),
    height: responsiveWidth(30),
    padding: responsiveHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainView: {
    width: responsiveWidth(90),
    height: responsiveHeight(30),
    padding: responsiveHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    borderRadius: 10,

    backgroundColor: 'white',
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    margin: responsiveHeight(1),
    color: THEME_COLOR,
    textAlign: 'center',
  },
});
