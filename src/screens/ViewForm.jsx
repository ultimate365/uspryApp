import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useEffect } from 'react';
import { SCHOOLBENGALIADDRESS, SCHOOLBENGALINAME } from '../modules/constants';
import { DateValueToSring } from '../modules/calculatefunctions';
import schoolLogo from '../assets/images/logo.png';
import { useGlobalContext } from '../context/Store';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
const ViewForm = () => {
  const navigation = useNavigation();
  const { stateObject, setActiveTab } = useGlobalContext();
  const {
    id,
    url,
    photoName,
    student_beng_name,
    student_eng_name,
    father_beng_name,
    father_eng_name,
    mother_beng_name,
    mother_eng_name,
    guardian_beng_name,
    guardian_eng_name,
    student_birthday,
    student_gender,
    student_mobile,
    student_aadhaar,
    student_religion,
    student_race,
    student_bpl_status,
    student_bpl_number,
    student_village,
    student_post_office,
    student_police_station,
    student_pin_code,
    student_addmission_class,
    student_previous_class,
    student_previous_class_year,
    student_previous_school,
    student_addmission_date,
    student_addmission_dateAndTime,
    updatedAt,
    student_previous_student_id,
  } = stateObject;
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          marginBottom: responsiveHeight(1),
          padding: responsiveWidth(2),
        }}
      >
        <View style={styles.headSection}>
          <Image
            source={schoolLogo}
            alt="logo"
            style={{ width: responsiveWidth(15), height: responsiveWidth(15) }}
          />
          <View
            style={[
              styles.schView,
              { width: responsiveWidth(60), alignSelf: 'center' },
            ]}
          >
            <Text style={styles.schName}>{SCHOOLBENGALINAME}</Text>

            <Text style={styles.schAddress}>{SCHOOLBENGALIADDRESS} </Text>
          </View>

          <Image
            source={{
              uri: `https://api.qrserver.com/v1/create-qr-code/?data=UTTAR SEHAGORI PRIMARY SCHOOL: STUDENT NAME:${' '}${student_eng_name}, Father's name:${' '}${father_eng_name},Mother's name:${' '}${mother_eng_name}, Mobile Number:${' '}${student_mobile}, Gender:${' '}${student_gender},  Addmission Class:${' '} ${student_addmission_class}, Application Number:${' '} ${id}, Application Date:${' '} ${student_addmission_date}`,
            }}
            style={{ width: responsiveWidth(15), height: responsiveWidth(15) }}
            alt="qr-code"
          />
        </View>

        <View style={styles.admView}>
          <Text style={styles.admText}>
            ভর্তির আবেদন পত্র (Online Admission)
          </Text>
          <View style={styles.paraView}>
            <Image
              style={{
                width: responsiveWidth(35),
                height: responsiveWidth(40),
                padding: responsiveWidth(2),
                margin: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
              }}
              source={{ uri: url }}
            />
            <Text style={styles.engparaText}>Application Form No.: {id}</Text>
            <Text style={[styles.engparaText]}>
              Application Date:{' '}
              {DateValueToSring(student_addmission_dateAndTime)}
            </Text>
            <Text style={styles.paraText}>
              ছাত্র / ছাত্রীর নাম (বাংলায়): {student_beng_name}
            </Text>
            <Text style={[styles.paraText]}>
              (ইংরাজীতে): {student_eng_name}
            </Text>

            <Text style={styles.paraText}>
              অভিভাবকের মোবাইল নাম্বার: {student_mobile}
            </Text>
            <Text style={[styles.paraText]}>
              ছাত্র/ছাত্রীর লিঙ্গ: {student_gender}
            </Text>

            <Text style={styles.paraText}>জন্ম তারিখ: {student_birthday}</Text>
            <Text style={[styles.paraText]}>আধার নং: {student_aadhaar}</Text>

            <Text style={styles.paraText}>
              পিতার নাম (বাংলায়): {father_beng_name}
            </Text>
            <Text style={[styles.paraText]}>(ইংরাজীতে): {father_eng_name}</Text>

            <Text style={styles.paraText}>
              মাতার নাম (বাংলায়): {mother_beng_name}
            </Text>
            <Text style={[styles.paraText]}>(ইংরাজীতে): {mother_eng_name}</Text>

            <Text style={styles.paraText}>
              অভিভাবকের নাম (বাংলায়): {guardian_beng_name}
            </Text>
            <Text style={[styles.paraText]}>
              (ইংরাজীতে): {guardian_eng_name}
            </Text>

            <Text style={styles.paraText}>
              ছাত্র/ছাত্রীর ধর্ম: {student_religion}
            </Text>
            <Text style={[styles.paraText]}>
              ছাত্র/ছাত্রীর জাতি: {student_race}
            </Text>

            <Text style={styles.paraText}>
              ছাত্র/ছাত্রী বি.পি.এল. কিনা?: {student_bpl_status}
            </Text>
            {student_bpl_status === 'YES' && (
              <Text style={[styles.paraText]}>
                অভিভাবকের বি.পি.এল. নাম্বার: {student_bpl_number}
              </Text>
            )}

            <Text style={styles.paraText}>
              ছাত্র/ছাত্রীর ঠিকানা: Vill.: {student_village},P.O.:{' '}
              {student_post_office},P.S.: {student_police_station}, PIN:
              {student_pin_code}
            </Text>

            <Text style={styles.paraText}>
              ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী:{' '}
              {student_addmission_class}
            </Text>

            {student_previous_class !== '' && (
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  ছাত্র/ছাত্রীর পূর্বের শ্রেণী: {student_previous_class}
                </Text>
                <Text style={[styles.paraText]}>
                  ছাত্র/ছাত্রীর পূর্বের বর্ষ: {student_previous_class_year}
                </Text>
              </View>
            )}
            {student_previous_class !== '' && (
              <Text style={[styles.paraText]}>
                ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি:{' '}
                {student_previous_student_id}
              </Text>
            )}
            {student_previous_class !== '' && (
              <Text style={styles.paraText}>
                ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা:{' '}
                {student_previous_school}
              </Text>
            )}
            {updatedAt !== undefined && (
              <Text style={styles.paraText}>
                Updated At: {DateValueToSring(updatedAt)}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewForm;

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    padding: 10,
    width: responsiveWidth(100),
  },
  headSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: responsiveHeight(0.5),
  },
  schView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',

    textAlign: 'center',
    marginBottom: 20,
  },
  schName: {
    fontSize: responsiveFontSize(2.5),
    color: 'black',
    fontFamily: 'kalpurush',
    textAlign: 'center',
  },
  schAddress: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontFamily: 'kalpurush',
    textAlign: 'center',
  },

  admView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    width: responsiveWidth(92),
  },
  admText: {
    fontSize: responsiveFontSize(2.5),
    color: 'black',
    fontFamily: 'kalpurush',
    textAlign: 'center',
  },
  paraView: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    marginVertical: 1,
    alignSelf: 'flex-start',
    alignContent: 'center',
  },
  paraText: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontFamily: 'kalpurush',
    textAlign: 'center',
  },
  engparaText: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontFamily: 'times',
    textAlign: 'center',
  },
});
