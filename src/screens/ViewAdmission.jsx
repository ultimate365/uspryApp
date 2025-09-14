import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Alert,
  Switch,
  BackHandler,
  Image,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import React, { useState, useEffect } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import storage from '@react-native-firebase/storage';
import Loader from '../components/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useGlobalContext } from '../context/Store';
import {
  ADMISSION_STATUS,
  classWiseAge,
  WEBSITE,
  SCHOOLBENGALIADDRESS,
  SCHOOLBENGALINAME,
} from '../modules/constants';
import { showToast } from '../modules/Toaster';
import {
  DateValueToSring,
  getCurrentDateInput,
  todayInString,
  uniqArray,
} from '../modules/calculatefunctions';
import schoolLogo from '../assets/images/logo.png';
import {
  deleteDocument,
  getCollection,
  getDocumentByField,
  updateDocument,
} from '../firebase/firestoreHelper';
export default function ViewAdmission() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { state, setStateObject, setActiveTab } = useGlobalContext();
  const access = state?.ACCESS;
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [applicationYear, setApplicationYear] = useState([]);
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [showData, setShowData] = useState(false);
  const [admissionStatus, setAdmissionStatus] = useState(true);
  const statusID = ADMISSION_STATUS;
  const [showDetails, setShowDetails] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    id: '',
    url: '',
    photoName: '',
    student_beng_name: '',
    student_eng_name: '',
    father_beng_name: '',
    father_eng_name: '',
    mother_beng_name: '',
    mother_eng_name: '',
    guardian_beng_name: '',
    guardian_eng_name: '',
    student_birthday: `01-01-${new Date().getFullYear() - 5}`,
    student_gender: '',
    student_mobile: '',
    student_aadhaar: '',
    student_religion: '',
    student_race: 'GENERAL',
    student_bpl_status: 'NO',
    student_bpl_number: '',
    student_village: 'SEHAGORI',
    student_post_office: 'KHOROP',
    student_police_station: 'JOYPUR',
    student_pin_code: '711401',
    student_addmission_class: 'PRE PRIMARY',
    student_previous_class: 'FIRST TIME ADDMISSION',
    student_previous_class_year: '',
    student_previous_school: '',
    student_previous_student_id: '',
    student_addmission_date: todayInString(),
    student_addmission_year: '',
    student_addmission_dateAndTime: Date.now(),
  });
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
  } = studentDetails;
  const calculateAge = (inputDate, students_class) => {
    const birthDate = new Date(inputDate);
    const today = new Date();

    const month = today.getMonth() + 1;
    let year = today.getFullYear();
    if (month > 3) {
      year = year + 1;
    } else {
      year = year;
    }

    const referenceDate = new Date(`${year}-01-01`);

    // Calculate the difference in years, months, and days
    let years = referenceDate.getFullYear() - birthDate.getFullYear();
    let months = referenceDate.getMonth() - birthDate.getMonth();
    let days = referenceDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        0,
      ); // Get the last day of the previous month
      days += lastMonth.getDate(); // Add the days from the last month
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    const validAge = classWiseAge.filter(
      item => item.className === students_class,
    )[0].age;
    let ageMessage;
    if (validAge === years) {
      ageMessage = `Student is Valid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    } else if (validAge - 1 === years && months >= 8) {
      ageMessage = `Student is Valid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    } else {
      ageMessage = `Student is Invalid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    }
    return ageMessage;
  };

  const getData = async () => {
    setLoader(true);
    try {
      await getCollection('admission').then(async snapshot => {
        const data = snapshot.sort(
          (a, b) =>
            a.student_addmission_dateAndTime - b.student_addmission_dateAndTime,
        );
        setAllData(data);
        setFilteredData(data);
        let x = [];
        const getYears = data.map(entry => {
          return (x = [...x, entry.student_addmission_year]);
        });
        await Promise.all(getYears).then(() => {
          x = uniqArray(x);
          x = x.sort((a, b) => b - a);
          setApplicationYear(x);
          setLoader(false);
        });
      });
    } catch (error) {
      console.error('Error getting documents: ', error);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };

  const getAdmissionStatus = async () => {
    setLoader(true);
    try {
      await getDocumentByField('admissionStatus', 'id', statusID)
        .then(async data => {
          setAdmissionStatus(data?.status);
          if (data?.status) {
            showToast('success', 'Admission is Open');
          } else {
            showToast('error', 'Admission is Closed');
          }
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
          showToast('error', e);
        });
    } catch (error) {
      showToast('error', 'Admission Not Found!');
      setLoader(false);
      console.log(error);
    }
  };
  const changeAdmissionStatus = async status => {
    setLoader(true);
    try {
      await updateDocument('admissionStatus', statusID, { status })
        .then(() => {
          if (status) {
            showToast('success', 'Admission Window Opend Successfully!');
          } else {
            showToast('success', 'Admission Window Closed Successfully!');
          }
          setLoader(false);
        })
        .catch(err => {
          console.error('Error updating document: ', err);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (error) {
      console.error('Error updating document: ', error);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const delEntry = async entry => {
    setLoader(true);
    await deleteDocument('admission', entry.id)
      .then(async () => {
        await storage()
          .ref('/studentImages/' + entry?.photoName)
          .delete()
          .then(() => {
            showToast('success', 'Application Deleted successfully');
            getData();
            setLoader(false);
          })
          .catch(e => {
            showToast('error', 'Failed to delete image');
            setLoader(false);
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
        showToast('error', 'Failed to delete Application');
      });
  };
  const showConfirmDialog = entry => {
    return Alert.alert('Hold On!', 'Are You Sure? This Entry Will be Deleted', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Cancel',
        onPress: () => showToast('success', 'Student Not Deleted'),
      }, // The "Yes" button
      {
        text: 'Yes',
        onPress: async () => {
          await delEntry(entry);
        },
      },
    ]);
  };
  useEffect(() => {
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    }
    getData();
    getAdmissionStatus();
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
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}
      >
        <Loader visible={loader} />
        {!showDetails && (
          <View>
            <Text style={styles.title}>View Admission</Text>
            <CustomButton
              title={'Add / Edit Entry'}
              size={'medium'}
              fontSize={responsiveFontSize(1.5)}
              color={'blueviolet'}
              onClick={() => {
                navigation.navigate('Home');
                setActiveTab(3);
              }}
            />
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
                Close Admission
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={admissionStatus ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setAdmissionStatus(prev => !prev);
                  changeAdmissionStatus(!admissionStatus);
                }}
                value={admissionStatus}
              />

              <Text
                selectable
                style={[
                  styles.title,
                  { paddingLeft: 5, fontSize: responsiveFontSize(2) },
                ]}
              >
                Open Admission
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveHeight(1),
                flexWrap: 'wrap',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.title}>Admission Application Data</Text>
              {applicationYear.map((year, index) => {
                return (
                  <CustomButton
                    title={year}
                    size={'small'}
                    onClick={() => {
                      let x = allData.filter(
                        entry => entry.student_addmission_year === year,
                      );
                      setFilteredData(x);
                      setShowData(true);
                      setYear(year);
                      setSearch('');
                    }}
                    key={index}
                  />
                );
              })}
            </View>
          </View>
        )}
        {showData && !showDetails && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: responsiveHeight(1),
              flexWrap: 'wrap',
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveHeight(1),
                flexWrap: 'wrap',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.title}>{`Year: ${year}`}</Text>
              <CustomTextInput
                value={search}
                placeholder="Search"
                onChangeText={text => {
                  setSearch(text);
                  if (text) {
                    let x = allData.filter(
                      entry => entry.student_addmission_year === year,
                    );
                    x = x.filter(entry =>
                      entry.student_eng_name
                        .toLowerCase()
                        .match(text.toLowerCase()),
                    );
                    setFilteredData(x);
                  } else {
                    setFilteredData(
                      allData.filter(
                        entry => entry.student_addmission_year === year,
                      ),
                    );
                  }
                }}
              />
            </View>
            <FlatList
              data={filteredData}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.dataView} key={index}>
                    <Text selectable style={styles.bankDataText}>
                      SL:{index + 1}
                    </Text>
                    <Image
                      style={{
                        width: responsiveWidth(35),
                        height: responsiveWidth(40),
                        padding: responsiveWidth(2),
                        margin: responsiveWidth(2),
                        borderRadius: responsiveWidth(2),
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        elevation: 5,
                      }}
                      source={{ uri: item?.url }}
                    />
                    <Text selectable style={styles.bankDataText}>
                      Application No: {item?.id}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      STUDENT NAME: {item?.student_eng_name}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      FATHER&#8217;S NAME: {item?.father_eng_name}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      CLASS: {item?.student_addmission_class}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      Date of Birth: {item?.student_birthday}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      VALIDATION:{'\n '}
                      {calculateAge(
                        getCurrentDateInput(item?.student_birthday),
                        item?.student_addmission_class,
                      )}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      ADMISSION DATE:{'\n '}
                      {DateValueToSring(item?.student_addmission_dateAndTime)}
                    </Text>
                    {item?.updatedAt && (
                      <Text selectable style={styles.bankDataText}>
                        Updated At:
                        {'\n '} {DateValueToSring(item?.updatedAt)}
                      </Text>
                    )}
                    <Text selectable style={styles.bankDataText}>
                      Action:
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingHorizontal: responsiveWidth(2),
                        marginBottom: responsiveHeight(1),
                      }}
                    >
                      <CustomButton
                        title={'View'}
                        color={'darkgreen'}
                        size={'small'}
                        onClick={() => {
                          setStudentDetails(item);
                          setShowDetails(true);
                          // navigation.navigate('ViewForm');
                        }}
                      />

                      <CustomButton
                        title={'Download'}
                        fontSize={responsiveFontSize(1.3)}
                        color={'chocolate'}
                        size={'small'}
                        onClick={async () => {
                          const url = `${WEBSITE}/downloadAdmissionForm?id=${item?.id}&mobile=${item?.student_mobile}`;
                          await Linking.openURL(url);
                        }}
                      />
                      <CustomButton
                        title={'Delete'}
                        color={'darkred'}
                        size={'small'}
                        onClick={() => showConfirmDialog(item)}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}
        <Modal
          animationType="slide"
          visible={showDetails}
          transparent
          onBackdropPress={() => setShowDetails(false)}
          onRequestClose={() => setShowDetails(false)}
          animationIn={'fadeInUpBig'}
          animationOut={'fadeOutLeftBig'}
          animationInTiming={500}
          animationOutTiming={500}
          statusBarTranslucent={true}
        >
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <ScrollView>
                <View style={styles.headSection}>
                  <Image
                    source={schoolLogo}
                    alt="logo"
                    style={{
                      width: responsiveWidth(15),
                      height: responsiveWidth(15),
                    }}
                  />
                  <View
                    style={[
                      styles.schView,
                      { width: responsiveWidth(60), alignSelf: 'center' },
                    ]}
                  >
                    <Text style={styles.schName}>{SCHOOLBENGALINAME}</Text>

                    <Text style={styles.schAddress}>
                      {SCHOOLBENGALIADDRESS}{' '}
                    </Text>
                  </View>

                  <Image
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?data=UTTAR SEHAGORI PRIMARY SCHOOL: STUDENT NAME:${' '}${student_eng_name}, Father's name:${' '}${father_eng_name},Mother's name:${' '}${mother_eng_name}, Mobile Number:${' '}${student_mobile}, Gender:${' '}${student_gender},  Addmission Class:${' '} ${student_addmission_class}, Application Number:${' '} ${id}, Application Date:${' '} ${student_addmission_date}`,
                    }}
                    style={{
                      width: responsiveWidth(15),
                      height: responsiveWidth(15),
                    }}
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
                    <Text style={styles.engparaText}>
                      Application Form No.: {id}
                    </Text>
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

                    <Text style={styles.paraText}>
                      জন্ম তারিখ: {student_birthday}
                    </Text>

                    {student_aadhaar !== '' && (
                      <Text style={[styles.paraText]}>
                        আধার নং: {student_aadhaar}
                      </Text>
                    )}
                    <Text style={styles.paraText}>
                      পিতার নাম (বাংলায়): {father_beng_name}
                    </Text>
                    <Text style={[styles.paraText]}>
                      (ইংরাজীতে): {father_eng_name}
                    </Text>

                    <Text style={styles.paraText}>
                      মাতার নাম (বাংলায়): {mother_beng_name}
                    </Text>
                    <Text style={[styles.paraText]}>
                      (ইংরাজীতে): {mother_eng_name}
                    </Text>

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

                    {student_previous_class !== 'FIRST TIME ADDMISSION' && (
                      <View style={styles.paraView}>
                        <Text style={styles.paraText}>
                          ছাত্র/ছাত্রীর পূর্বের শ্রেণী: {student_previous_class}
                        </Text>
                        <Text style={[styles.paraText]}>
                          ছাত্র/ছাত্রীর পূর্বের বর্ষ:{' '}
                          {student_previous_class_year}
                        </Text>
                        <Text style={[styles.paraText]}>
                          ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি:{' '}
                          {student_previous_student_id}
                        </Text>
                        <Text style={styles.paraText}>
                          ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা:{' '}
                          {student_previous_school}
                        </Text>
                      </View>
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
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: 5,
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
    height: responsiveWidth(210),
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255,.9)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainView: {
    // width: responsiveWidth(80),
    // height: responsiveWidth(80),
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
    borderRadius: responsiveWidth(3),
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
