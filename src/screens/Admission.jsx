import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  BackHandler,
  Clipboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { Image as Img } from 'react-native-compressor';
import Loader from '../components/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useGlobalContext } from '../context/Store';
import { ADMISSION_STATUS, SCHOOLNAME, WEBSITE } from '../modules/constants';
import { showToast } from '../modules/Toaster';
import {
  compareObjects,
  DateValueToSring,
  getCurrentDateInput,
  getRandomAlphabet,
  todayInString,
  validateEmptyValues,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  deleteDocument,
  getCollection,
  getDocumentByField,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';
export default function Admission() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    setStateObject,
    setApplicationFormState,
    applicationFormState,
    stateObject,
    setActiveTab,
  } = useGlobalContext();
  const [admissionID, setAdmissionID] = useState('');
  const today = new Date();
  const month = today.getMonth() + 1;
  const YEAR = month > 10 ? today.getFullYear() + 1 : today.getFullYear();
  const [dob, setDob] = useState(new Date(`${today.getFullYear() - 5}-01-01`));
  const [date, setDate] = useState(
    new Date(`${today.getFullYear() - 5}-01-01`),
  );
  const [selectedDate, setSelectedDate] = useState(
    `01-01-${today.getFullYear() - 10}`,
  );
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);

  const [inputField, setInputField] = useState({
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
    student_addmission_year: YEAR,
    student_addmission_dateAndTime: Date.now(),
  });
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
    setInputField({ ...inputField, student_birthday: tarikh });
    setFontColor('black');
  };
  const [errInputField, setErrInputField] = useState({
    student_photo: '',
    student_beng_name: '',
    student_eng_name: '',
    father_beng_name: '',
    father_eng_name: '',
    mother_beng_name: '',
    mother_eng_name: '',
    guardian_beng_name: '',
    guardian_eng_name: '',
    student_gender: '',
    student_mobile: '',
    student_aadhaar: '',
    student_religion: '',
    student_race: '',
    student_bpl_status: '',
    student_bpl_number: '',
    student_village: '',
    student_post_office: '',
    student_police_station: '',
    student_pin_code: '',
    student_addmission_class: '',
    student_previous_class_year: '',
    student_previous_school: '',
    student_previous_student_id: '',
  });
  const [path, setPath] = useState('');
  const [imageName, setImageName] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [applicationNo, setAplicationNo] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showErr, setShowErr] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSearchedResult, setShowSearchedResult] = useState(false);
  const statusID = ADMISSION_STATUS;
  const [admissionStatus, setAdmissionStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchedApplicationNo, setSearchedApplicationNo] = useState({
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
    student_birthday: '',
    student_gender: '',
    student_mobile: '',
    student_aadhaar: '',
    student_religion: '',
    student_race: '',
    student_bpl_status: '',
    student_bpl_number: '',
    student_village: '',
    student_post_office: '',
    student_police_station: '',
    student_pin_code: '',
    student_addmission_class: '',
    student_previous_class: '',
    student_previous_class_year: '',
    student_previous_school: '',
    student_previous_student_id: '',
    student_addmission_date: '',
    student_addmission_dateAndTime: '',
  });
  const [searchedOrgApplicationNo, setSearchedOrgApplicationNo] = useState({
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
    student_birthday: '',
    student_gender: '',
    student_mobile: '',
    student_aadhaar: '',
    student_religion: '',
    student_race: '',
    student_bpl_status: '',
    student_bpl_number: '',
    student_village: '',
    student_post_office: '',
    student_police_station: '',
    student_pin_code: '',
    student_addmission_class: '',
    student_previous_class: '',
    student_previous_class_year: '',
    student_previous_school: '',
    student_previous_student_id: '',
    student_addmission_date: '',
    student_addmission_dateAndTime: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [isclicked, setIsclicked] = useState(false);
  const genderInput = [
    { gender: 'লিঙ্গ বেছে নিন', value: '' },
    { gender: 'ছেলে', value: 'BOYS' },
    { gender: 'মেয়ে', value: 'GIRLS' },
    { gender: 'অন্যান্য', value: 'OTHER' },
  ];
  const [genderText, setGenderText] = useState('লিঙ্গ বেছে নিন');
  const [relClicked, setRelClicked] = useState(false);
  const religionInput = [
    { religion: 'ধর্ম বেছে নিন', value: '' },
    { religion: 'হিন্দু', value: 'HINDU' },
    { religion: 'ইসলাম', value: 'ISLAM' },
    { religion: 'অন্যান্য', value: 'OTHER' },
  ];
  const [religionText, setReligionText] = useState('ধর্ম বেছে নিন');
  const [castClicked, setCastClicked] = useState(false);
  const castInput = [
    { cast: 'জাতি বেছে নিন', value: '' },
    { cast: 'GENERAL', value: 'GENERAL' },
    { cast: 'OBC-A', value: 'OBC-A' },
    { cast: 'OBC-B', value: 'OBC-B' },
    { cast: 'SC', value: 'SC' },
    { cast: 'ST', value: 'ST' },
  ];
  const [castText, setCastText] = useState('জাতি বেছে নিন');
  const [bplClicked, setBplClicked] = useState(false);
  const bplInput = [
    { bpl_status: 'বি.পি.এল. কিনা?', value: '' },
    { bpl_status: 'হ্যাঁ', value: 'YES' },
    { bpl_status: 'না', value: 'NO' },
  ];
  const [bplText, setBplText] = useState('বি.পি.এল. কিনা?');
  const [admClassClicked, setAdmClassClicked] = useState(false);
  const admClassInput = [
    { adm_class: 'প্রাক প্রাথমিক', value: 'PRE PRIMARY' },
    { adm_class: 'প্রথম শ্রেনী', value: 'CLASS I' },
    { adm_class: 'দ্বিতীয় শ্রেনী', value: 'CLASS II' },
    { adm_class: 'তৃতীয় শ্রেনী', value: 'CLASS III' },
    { adm_class: 'চতুর্থ শ্রেনী', value: 'CLASS IV' },
  ];
  const [admClassText, setAdmClassText] = useState('প্রাক প্রাথমিক');
  const [reAdClassClicked, setReAdClassClicked] = useState(false);
  const reAdmClassInput = [
    { adm_class: 'শ্রেণী বেছে নিন', value: 'FIRST TIME ADDMISSION' },
    { adm_class: 'প্রাক প্রাথমিক', value: 'PRE PRIMARY' },
    { adm_class: 'প্রথম শ্রেনী', value: 'CLASS I' },
    { adm_class: 'দ্বিতীয় শ্রেনী', value: 'CLASS II' },
    { adm_class: 'তৃতীয় শ্রেনী', value: 'CLASS III' },
    { adm_class: 'চতুর্থ শ্রেনী', value: 'CLASS IV' },
  ];
  const [reAdClassText, setReAdClassText] = useState('শ্রেণী বেছে নিন');
  const validForm = () => {
    let formIsValid = true;
    setErrInputField({
      student_photo: '',
      student_beng_name: '',
      student_eng_name: '',
      father_beng_name: '',
      father_eng_name: '',
      mother_beng_name: '',
      mother_eng_name: '',
      guardian_beng_name: '',
      guardian_eng_name: '',
      student_gender: '',
      student_mobile: '',

      student_religion: '',
      student_race: '',
      student_bpl_number: '',
      student_village: '',
      student_post_office: '',
      student_police_station: '',
      student_pin_code: '',
      student_addmission_class: '',
      student_previous_class_year: '',
      student_previous_school: '',
      student_previous_student_id: '',
    });
    if (imageName === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_photo: 'দয়া করে ছাত্র/ছাত্রীর ফটো সিলেক্ট করুন',
      }));
    }
    if (inputField.student_beng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_beng_name: 'দয়া করে ছাত্র/ছাত্রীর বাংলা নাম লিখুন',
      }));
    }
    if (inputField.student_eng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_eng_name: 'দয়া করে ছাত্র/ছাত্রীর ইংরাজী নাম লিখুন',
      }));
    }
    if (inputField.father_beng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        father_beng_name: 'দয়া করে বাবার বাংলা নাম লিখুন',
      }));
    }
    if (inputField.father_eng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        father_eng_name: 'দয়া করে বাবার ইংরাজী নাম লিখুন',
      }));
    }
    if (inputField.mother_beng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        mother_beng_name: 'দয়া করে মাতার বাংলা নাম লিখুন',
      }));
    }
    if (inputField.mother_eng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        mother_eng_name: 'দয়া করে মাতার ইংরাজী নাম লিখুন',
      }));
    }
    if (inputField.guardian_beng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        guardian_beng_name: 'দয়া করে অভিভাবকের বাংলা নাম লিখুন',
      }));
    }
    if (inputField.guardian_eng_name === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        guardian_eng_name: 'দয়া করে অভিভাবকের ইংরাজী নাম লিখুন',
      }));
    }
    if (inputField.student_gender === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_gender: 'দয়া করে ছাত্র/ছাত্রীর লিঙ্গ বেছে নিন',
      }));
    }
    if (
      inputField.student_mobile === '' ||
      inputField.student_mobile.length !== 10
    ) {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_mobile: 'দয়া করে অভিভাবকের মোবাইল নাম্বার লিখুন',
      }));
    }
    if (inputField.student_religion === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_religion: 'দয়া করে ছাত্র/ছাত্রীর ধর্ম বেছে নিন',
      }));
    }
    if (inputField.student_race === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_race: 'দয়া করে ছাত্র/ছাত্রীর জাতি বেছে নিন',
      }));
    }
    if (inputField.student_bpl_status === 'YES') {
      if (inputField.student_bpl_number === '') {
        formIsValid = false;
        setErrInputField(prevState => ({
          ...prevState,
          student_bpl_number: 'দয়া করে ছাত্র/ছাত্রীর BPL নাম্বার লিখুন',
        }));
      }
    }
    if (inputField.student_village === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_village: 'দয়া করে ছাত্র/ছাত্রীর গ্রামের নাম লিখুন',
      }));
    }
    if (inputField.student_post_office === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_post_office: 'দয়া করে ছাত্র/ছাত্রীর পোস্ট অফিসের নাম লিখুন',
      }));
    }
    if (inputField.student_police_station === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_police_station:
          'দয়া করে ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম লিখুন',
      }));
    }
    if (inputField.student_pin_code === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_pin_code: 'দয়া করে ছাত্র/ছাত্রীর পিনকোড লিখুন',
      }));
    }
    if (inputField.student_addmission_class === '') {
      formIsValid = false;
      setErrInputField(prevState => ({
        ...prevState,
        student_addmission_class:
          'দয়া করে ছাত্র/ছাত্রীর ভর্তি হওয়ার শ্রেনী বেছে নিন',
      }));
    }
    if (inputField.student_previous_class !== 'FIRST TIME ADDMISSION') {
      if (inputField.student_previous_class_year === '') {
        formIsValid = false;
        setErrInputField(prevState => ({
          ...prevState,
          student_previous_class_year:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের শ্রেনীর বছর লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (inputField.student_previous_student_id === '') {
        formIsValid = false;
        setErrInputField(prevState => ({
          ...prevState,
          student_previous_student_id:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের ১৪ সংখ্যার স্টুডেন্ট আইডিটি লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (inputField.student_previous_school === '') {
        formIsValid = false;
        setErrInputField(prevState => ({
          ...prevState,
          student_previous_school:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
    }
    return formIsValid;
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
  const submitData = async () => {
    if (validForm()) {
      //submit
      try {
        setLoader(true);

        await getCollection('admission').then(async data => {
          const dataLength = data.length;
          let countLength = dataLength;
          if (dataLength <= 9) {
            countLength = '0' + (countLength + 1);
          } else {
            countLength = countLength + 1;
          }
          let genID = `USPRYS-ONLINE-${YEAR}-${countLength}`;
          const checkDuplicate = data.filter(entry => entry.id === genID);
          if (checkDuplicate.length > 0) {
            genID = genID + '-' + getRandomAlphabet();
          }
          setAdmissionID(genID);
          const reference = storage().ref(
            `/studentImages/${genID}-${imageName}`,
          );
          const result = await Img.compress(path, {
            progressDivider: 10,
            downloadProgress: progress => {
              console.log('downloadProgress: ', progress);
            },
          });
          const pathToFile = result;

          // uploads file
          await reference.putFile(pathToFile);
          const url = await storage()
            .ref(`/studentImages/${genID}-${imageName}`)
            .getDownloadURL();
          const entry = {
            id: genID,
            url: url,
            photoName: `${genID}-${imageName}`,
            student_beng_name: inputField.student_beng_name,
            student_eng_name: inputField.student_eng_name.toUpperCase(),
            father_beng_name: inputField.father_beng_name,
            father_eng_name: inputField.father_eng_name.toUpperCase(),
            mother_beng_name: inputField.mother_beng_name,
            mother_eng_name: inputField.mother_eng_name.toUpperCase(),
            guardian_beng_name: inputField.guardian_beng_name,
            guardian_eng_name: inputField.guardian_eng_name.toUpperCase(),
            student_birthday: inputField.student_birthday,
            student_gender: inputField.student_gender,
            student_mobile: inputField.student_mobile,
            student_aadhaar: inputField.student_aadhaar,
            student_religion: inputField.student_religion,
            student_race: inputField.student_race,
            student_bpl_status: inputField.student_bpl_status,
            student_bpl_number: inputField.student_bpl_number,
            student_village: inputField.student_village.toUpperCase(),
            student_post_office: inputField.student_post_office.toUpperCase(),
            student_police_station:
              inputField.student_police_station.toUpperCase(),
            student_pin_code: inputField.student_pin_code,
            student_addmission_class: inputField.student_addmission_class,
            student_previous_class: inputField.student_previous_class,
            student_previous_class_year: inputField.student_previous_class_year,
            student_previous_school:
              inputField.student_previous_school.toUpperCase(),
            student_previous_student_id: inputField.student_previous_student_id,
            student_addmission_date: todayInString(),
            student_addmission_year: YEAR,
            student_addmission_dateAndTime: Date.now(),
          };
          await setDocument('admission', genID, entry)
            .then(() => {
              setLoader(false);
              showToast(
                'success',
                'Congrats! Form Has Been Submitted to Us Successfully!',
              );
              setFormSubmitted(true);
              setShowForm(false);
              setStateObject(entry);
              setImageName('');
              setPath('');
              setInputField({
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
                student_addmission_year: YEAR,
                student_addmission_dateAndTime: Date.now(),
              });
            })

            .catch(error => {
              setLoader(false);
              showToast('error', 'Something went Wrong');
              console.log(error);
            });
        });
      } catch (e) {
        setLoader(false);
        showToast('error', 'Something went Wrong');
        console.log(e);
      }
    } else {
      setLoader(false);
      showToast('error', 'Please Fillup Required Details!');
    }
  };
  const searchApplication = async () => {
    setLoader(true);
    try {
      await getDocumentByField('admission', 'id', applicationNo)
        .then(async data => {
          if (data && data.student_mobile === mobileNumber) {
            setSearchedApplicationNo(data);
            setApplicationFormState(data);
            setShowSearchedResult(true);
            setShowUpdateForm(false);
            setLoader(false);
          } else {
            setShowSearchedResult(false);
            showToast('error', 'Application Not Found!');
            setLoader(false);
          }
        })
        .catch(e => {
          setLoader(false);
          console.error('Error getting documents: ', e);
        });
    } catch (error) {
      showToast('error', 'Application Not Found!');
      setShowSearchedResult(false);
      setLoader(false);
      console.log(error);
    }
  };
  const [editInputField, setEditInputField] = useState({
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
    student_birthday: ``,
    student_gender: '',
    student_mobile: '',
    student_aadhaar: '',
    student_religion: '',
    student_race: '',
    student_bpl_status: '',
    student_bpl_number: '',
    student_village: '',
    student_post_office: '',
    student_police_station: '',
    student_pin_code: '',
    student_addmission_class: '',
    student_previous_class: '',
    student_previous_class_year: '',
    student_previous_school: '',
    student_previous_student_id: '',
    student_addmission_date: '',
    student_addmission_dateAndTime: '',
    student_updatation_dateAndTime: Date.now(),
  });

  const [errEditInputField, setErrEditInputField] = useState({
    id: '',
    student_beng_name: '',
    student_eng_name: '',
    father_beng_name: '',
    father_eng_name: '',
    mother_beng_name: '',
    mother_eng_name: '',
    guardian_beng_name: '',
    guardian_eng_name: '',
    student_gender: '',
    student_mobile: '',
    student_aadhaar: '',
    student_religion: '',
    student_race: '',
    student_bpl_status: '',
    student_bpl_number: '',
    student_village: '',
    student_post_office: '',
    student_police_station: '',
    student_pin_code: '',
    student_addmission_class: '',
    student_previous_class_year: '',
    student_previous_school: '',
    student_previous_student_id: '',
  });
  const updateData = async () => {
    if (validEditForm()) {
      if (!compareObjects(searchedOrgApplicationNo, editInputField)) {
        setLoader(true);
        try {
          await updateDocument('admission', editInputField.id, editInputField)
            .then(() => {
              showToast('success', 'Form Has Been Updated Successfully!');
              setShowEditForm(false);
              setLoader(false);
              setEditInputField({
                id: '',
                student_beng_name: '',
                student_eng_name: '',
                father_beng_name: '',
                father_eng_name: '',
                mother_beng_name: '',
                mother_eng_name: '',
                guardian_beng_name: '',
                guardian_eng_name: '',
                student_birthday: ``,
                student_gender: '',
                student_mobile: '',
                student_aadhaar: '',
                student_religion: '',
                student_race: '',
                student_bpl_status: '',
                student_bpl_number: '',
                student_village: '',
                student_post_office: '',
                student_police_station: '',
                student_pin_code: '',
                student_addmission_class: '',
                student_previous_class: '',
                student_previous_class_year: '',
                student_previous_school: '',
                student_previous_student_id: '',
                student_addmission_date: '',
                student_addmission_dateAndTime: '',
              });
            })
            .catch(e => {
              console.log(e);
              setLoader(false);
              showToast('error', 'Something went Wrong!');
            });
        } catch (error) {
          console.log(error);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        }
      } else {
        showToast('error', 'No Changes Detected!');
      }
    } else {
      showToast('error', 'Please Fillup Required Details!');
    }
  };
  const validEditForm = () => {
    let formIsValid = true;
    setErrEditInputField({
      student_beng_name: '',
      student_eng_name: '',
      father_beng_name: '',
      father_eng_name: '',
      mother_beng_name: '',
      mother_eng_name: '',
      guardian_beng_name: '',
      guardian_eng_name: '',
      student_gender: '',
      student_mobile: '',

      student_religion: '',
      student_race: '',
      student_bpl_number: '',
      student_village: '',
      student_post_office: '',
      student_police_station: '',
      student_pin_code: '',
      student_addmission_class: '',
      student_previous_class_year: '',
      student_previous_school: '',
      student_previous_student_id: '',
    });
    if (editInputField.student_beng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_beng_name: 'দয়া করে ছাত্র/ছাত্রীর বাংলা নাম লিখুন',
      }));
    }
    if (editInputField.student_eng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_eng_name: 'দয়া করে ছাত্র/ছাত্রীর ইংরাজী নাম লিখুন',
      }));
    }
    if (editInputField.father_beng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        father_beng_name: 'দয়া করে বাবার বাংলা নাম লিখুন',
      }));
    }
    if (editInputField.father_eng_name === '') {
      formIsValid = false;
      editInputField(prevState => ({
        ...prevState,
        father_eng_name: 'দয়া করে বাবার ইংরাজী নাম লিখুন',
      }));
    }
    if (editInputField.mother_beng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        mother_beng_name: 'দয়া করে মাতার বাংলা নাম লিখুন',
      }));
    }
    if (editInputField.mother_eng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        mother_eng_name: 'দয়া করে মাতার ইংরাজী নাম লিখুন',
      }));
    }
    if (editInputField.guardian_beng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        guardian_beng_name: 'দয়া করে অভিভাবকের বাংলা নাম লিখুন',
      }));
    }
    if (editInputField.guardian_eng_name === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        guardian_eng_name: 'দয়া করে অভিভাবকের ইংরাজী নাম লিখুন',
      }));
    }
    if (editInputField.student_gender === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_gender: 'দয়া করে ছাত্র/ছাত্রীর লিঙ্গ বেছে নিন',
      }));
    }
    if (editInputField.student_mobile === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_mobile: 'দয়া করে অভিভাবকের মোবাইল নাম্বার লিখুন',
      }));
    }
    if (editInputField.student_religion === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_religion: 'দয়া করে ছাত্র/ছাত্রীর ধর্ম বেছে নিন',
      }));
    }
    if (editInputField.student_race === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_race: 'দয়া করে ছাত্র/ছাত্রীর জাতি বেছে নিন',
      }));
    }
    if (editInputField.student_bpl_status === 'YES') {
      if (editInputField.student_bpl_number === '') {
        formIsValid = false;
        setErrEditInputField(prevState => ({
          ...prevState,
          student_bpl_number: 'দয়া করে ছাত্র/ছাত্রীর BPL নাম্বার লিখুন',
        }));
      }
    }
    if (editInputField.student_village === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_village: 'দয়া করে ছাত্র/ছাত্রীর গ্রামের নাম লিখুন',
      }));
    }
    if (editInputField.student_post_office === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_post_office: 'দয়া করে ছাত্র/ছাত্রীর পোস্ট অফিসের নাম লিখুন',
      }));
    }
    if (editInputField.student_police_station === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_police_station:
          'দয়া করে ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম লিখুন',
      }));
    }
    if (editInputField.student_pin_code === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_pin_code: 'দয়া করে ছাত্র/ছাত্রীর পিনকোড লিখুন',
      }));
    }
    if (editInputField.student_addmission_class === '') {
      formIsValid = false;
      setErrEditInputField(prevState => ({
        ...prevState,
        student_addmission_class:
          'দয়া করে ছাত্র/ছাত্রীর ভর্তি হওয়ার শ্রেনী বেছে নিন',
      }));
    }
    if (editInputField.student_previous_class !== 'FIRST TIME ADDMISSION') {
      if (editInputField.student_previous_class_year === '') {
        formIsValid = false;
        setErrEditInputField(prevState => ({
          ...prevState,
          student_previous_class_year:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের শ্রেনীর বছর লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (editInputField.student_previous_school === '') {
        formIsValid = false;
        setErrEditInputField(prevState => ({
          ...prevState,
          student_previous_school:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (editInputField.student_previous_student_id === '') {
        formIsValid = false;
        setErrEditInputField(prevState => ({
          ...prevState,
          student_previous_student_id:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের ১৪ সংখ্যার স্টুডেন্ট আইডিটি লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
    }
    return formIsValid;
  };
  const showConfirmDialog = entry => {
    return Alert.alert('Hold On!', 'Are You Sure? Your Entry Will be Deleted', [
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
  const delEntry = async entry => {
    setLoader(true);
    await deleteDocument('admission', entry.id)
      .then(async () => {
        await storage()
          .ref('/studentImages/' + entry?.photoName)
          .delete()
          .then(() => {
            showToast('success', 'You Application Deleted successfully');
            setShowSearchedResult(false);
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
  useEffect(() => {}, [
    inputField,
    editInputField,
    errEditInputField,
    errInputField,
    applicationFormState,
    admissionID,
  ]);
  useEffect(() => {
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
      <Text style={[styles.title, { fontFamily: 'times' }]}>
        WELCOME TO {SCHOOLNAME}
      </Text>
      <Text style={[styles.title, { fontFamily: 'times' }]}>
        ADMISSION SECTION
      </Text>

      {admissionStatus && (
        <CustomButton
          title={showForm ? 'Close Form' : 'Fillup Form'}
          onClick={() => {
            setShowForm(!showForm);
            setShowUpdateForm(false);
            setAplicationNo('');
            setShowSearchedResult(false);
            setShowEditForm(false);
          }}
        />
      )}
      <CustomButton
        title={showUpdateForm ? 'Close Form' : 'Edit / Print Filled Form'}
        color={showUpdateForm ? 'darkyellow' : 'navy'}
        onClick={() => {
          setShowUpdateForm(!showUpdateForm);
          setShowForm(false);
          setShowSearchedResult(false);
          setShowEditForm(false);
          setAplicationNo('');
          setMobileNumber('');
        }}
      />
      {showForm && admissionStatus && (
        <ScrollView
          style={{ marginBottom: responsiveHeight(10) }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={[styles.label, { color: 'red' }]}>
              * চিহ্ন দেওয়া অংশগুলি আবশ্যিক।
            </Text>
            <Text style={[styles.label, { color: 'red' }]}>
              *** যে অংশগুলি বাংলায় বলা আছে শুধুমাত্র সেইগুলিই বাংলায় করবেন বাকি
              সমস্ত অংশ ইংরাজীতে লিখবেন।
            </Text>
            <Text style={[styles.label, { color: 'red' }]}>
              *** ফর্ম ফিলাপের পর প্রদত্ত অ্যাপ্লিকেশন নাম্বার অবশ্যই আপনার কাছে
              সংরক্ষিত রাখবেন।
            </Text>
            <Text style={[styles.title, { fontFamily: 'times' }]}>
              ADMISSION FORM
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: responsiveHeight(2),
            }}
          >
            <View
              style={{
                marginTop: responsiveHeight(1),
                marginBottom: responsiveHeight(4),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text selectable style={[styles.label, { marginBottom: 5 }]}>
                Upload Student Picture
              </Text>

              {path == '' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={async () => {
                      await ImagePicker.openCamera({
                        height: 450,
                        width: 350,
                        cropping: true,
                        mediaType: 'photo',
                      })
                        .then(image => {
                          setPath(image.path);
                          setImageName(
                            image.path.split(
                              '/react-native-image-crop-picker/',
                            )[1],
                          );
                        })
                        .catch(async e => {
                          console.log(e);
                          await ImagePicker.clean()
                            .then(() => {
                              console.log(
                                'removed all tmp images from tmp directory',
                              );
                            })
                            .catch(e => {
                              console.log(e);
                            });
                        });
                    }}
                  >
                    <Image
                      source={require('../assets/images/camera.png')}
                      style={{
                        width: responsiveWidth(10),
                        height: responsiveWidth(10),
                        alignSelf: 'center',
                        tintColor: THEME_COLOR,
                      }}
                    />
                    <Text selectable style={styles.label}>
                      Open Camera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      await ImagePicker.openPicker({
                        height: 450,
                        width: 350,
                        cropping: true,
                        mediaType: 'photo',
                      })
                        .then(image => {
                          setPath(image.path);
                          setImageName(
                            image.path.substring(
                              image.path.lastIndexOf('/') + 1,
                            ),
                          );
                        })
                        .catch(async e => {
                          console.log(e);
                          await ImagePicker.clean()
                            .then(() => {
                              console.log(
                                'removed all tmp images from tmp directory',
                              );
                            })
                            .catch(e => {
                              console.log(e);
                            });
                        });
                    }}
                    style={{ paddingLeft: responsiveWidth(10) }}
                  >
                    <Image
                      source={require('../assets/images/gallery.png')}
                      style={{
                        width: responsiveWidth(10),
                        height: responsiveWidth(10),
                        alignSelf: 'center',
                        tintColor: THEME_COLOR,
                      }}
                    />
                    <Text selectable style={styles.label}>
                      Open Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    width: responsiveWidth(20),
                    height: responsiveHeight(3),

                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    setPath('');
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Image
                        source={{ uri: path }}
                        style={{
                          width: 50,
                          height: 50,
                          alignSelf: 'center',
                          borderRadius: 5,
                        }}
                      />
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => setPath('')}>
                        <Text selectable style={{ color: 'red' }}>
                          <MaterialIcons name="cancel" size={20} />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {errInputField.student_photo.length > 0 && (
                <Text style={styles.error}>{errInputField.student_photo}</Text>
              )}
            </View>
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর বাংলায় নাম*'}
              placeholder={'ছাত্র/ছাত্রীর বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.student_beng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_beng_name: text,
                })
              }
            />
            {errInputField.student_beng_name.length > 0 && (
              <Text style={styles.error}>
                {errInputField.student_beng_name}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর ইংরাজীতে নাম*'}
              placeholder={'ছাত্র/ছাত্রীর ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.student_eng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_eng_name: text,
                })
              }
            />
            {errInputField.student_eng_name.length > 0 && (
              <Text style={styles.error}>{errInputField.student_eng_name}</Text>
            )}
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>ছাত্র/ছাত্রীর জন্ম তারিখ*</Text>
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
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
            </View>
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর আধার নাম্বার'}
              placeholder={'ছাত্র/ছাত্রীর আধার নাম্বার'}
              fontFamily={'kalpurush'}
              type={'number-pad'}
              maxLength={12}
              value={inputField.student_aadhaar}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_aadhaar: text,
                })
              }
            />

            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর লিঙ্গ*
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setIsclicked(!isclicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{genderText}</Text>

                {isclicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {isclicked ? (
                <View style={styles.dropDowArea}>
                  {genderInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setIsclicked(false);
                          setInputField({
                            ...inputField,
                            student_gender: item.value,
                          });
                          setGenderText(item.gender);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.gender}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errInputField.student_gender.length > 0 && (
                <Text style={styles.error}>{errInputField.student_gender}</Text>
              )}
            </View>
            <CustomTextInput
              title={'অভিভাবকের মোবাইল নাম্বার*'}
              placeholder={'অভিভাবকের মোবাইল নাম্বার*'}
              fontFamily={'kalpurush'}
              type={'number-pad'}
              maxLength={10}
              value={inputField.student_mobile}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_mobile: text,
                })
              }
            />
            {errInputField.student_mobile.length > 0 && (
              <Text style={styles.error}>{errInputField.student_mobile}</Text>
            )}
            <CustomTextInput
              title={'পিতার বাংলায় নাম*'}
              placeholder={'পিতার বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.father_beng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  father_beng_name: text,
                  guardian_beng_name: text,
                })
              }
            />
            {errInputField.father_beng_name.length > 0 && (
              <Text style={styles.error}>{errInputField.father_beng_name}</Text>
            )}
            <CustomTextInput
              title={'পিতার ইংরাজীতে নাম*'}
              placeholder={'পিতার ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.father_eng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  father_eng_name: text,
                  guardian_eng_name: text,
                })
              }
            />
            {errInputField.father_eng_name.length > 0 && (
              <Text style={styles.error}>{errInputField.father_eng_name}</Text>
            )}
            <CustomTextInput
              title={'মাতার বাংলায় নাম*'}
              placeholder={'মাতার বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.mother_beng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  mother_beng_name: text,
                })
              }
            />
            {errInputField.mother_beng_name.length > 0 && (
              <Text style={styles.error}>{errInputField.mother_beng_name}</Text>
            )}
            <CustomTextInput
              title={'মাতার ইংরাজীতে নাম*'}
              placeholder={'মাতার ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.mother_eng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  mother_eng_name: text,
                })
              }
            />
            {errInputField.mother_eng_name.length > 0 && (
              <Text style={styles.error}>{errInputField.mother_eng_name}</Text>
            )}
            <CustomTextInput
              title={'অভিভাবকের বাংলায় নাম*'}
              placeholder={'অভিভাবকের বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.guardian_beng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  guardian_beng_name: text,
                })
              }
            />
            {errInputField.guardian_beng_name.length > 0 && (
              <Text style={styles.error}>
                {errInputField.guardian_beng_name}
              </Text>
            )}
            <CustomTextInput
              title={'অভিভাবকের ইংরাজীতে নাম*'}
              placeholder={'অভিভাবকের ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={inputField.guardian_eng_name}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  guardian_eng_name: text,
                })
              }
            />
            {errInputField.guardian_eng_name.length > 0 && (
              <Text style={styles.error}>
                {errInputField.guardian_eng_name}
              </Text>
            )}
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর ধর্ম*
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setRelClicked(!relClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{religionText}</Text>

                {relClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {relClicked ? (
                <View style={styles.dropDowArea}>
                  {religionInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setRelClicked(false);
                          setInputField({
                            ...inputField,
                            student_religion: item.value,
                          });
                          setReligionText(item.religion);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.religion}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errInputField.student_religion.length > 0 && (
                <Text style={styles.error}>
                  {errInputField.student_religion}
                </Text>
              )}
            </View>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর জাতি*
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setCastClicked(!castClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{castText}</Text>

                {castClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {castClicked ? (
                <View style={styles.dropDowArea}>
                  {castInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setCastClicked(false);
                          setInputField({
                            ...inputField,
                            student_race: item.value,
                          });
                          setCastText(item.cast);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.cast}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errInputField.student_race.length > 0 && (
                <Text style={styles.error}>{errInputField.student_race}</Text>
              )}
            </View>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রী বি.পি.এল. কিনা? *
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setBplClicked(!bplClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{bplText}</Text>

                {bplClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {bplClicked ? (
                <View style={styles.dropDowArea}>
                  {bplInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setBplClicked(false);
                          setInputField({
                            ...inputField,
                            student_bpl_status: item.value,
                          });
                          setBplText(item.bpl_status);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.bpl_status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            {inputField.student_bpl_status === 'YES' && (
              <CustomTextInput
                title={'অভিভাবকের বি.পি.এল. নাম্বার *'}
                placeholder={'অভিভাবকের বি.পি.এল. নাম্বার *'}
                fontFamily={'kalpurush'}
                value={inputField.student_bpl_number}
                onChangeText={text =>
                  setInputField({
                    ...inputField,
                    student_bpl_number: text,
                  })
                }
              />
            )}

            <CustomTextInput
              title={'ছাত্র/ছাত্রীর গ্রামের নাম *'}
              placeholder={'ছাত্র/ছাত্রীর গ্রামের নাম *'}
              fontFamily={'kalpurush'}
              value={inputField.student_village}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_village: text,
                })
              }
            />
            {errInputField.student_village.length > 0 && (
              <Text style={styles.error}>{errInputField.student_village}</Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *'}
              placeholder={'ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *'}
              fontFamily={'kalpurush'}
              value={inputField.student_post_office}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_post_office: text,
                })
              }
            />
            {errInputField.student_post_office.length > 0 && (
              <Text style={styles.error}>
                {errInputField.student_post_office}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *'}
              placeholder={'ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *'}
              fontFamily={'kalpurush'}
              value={inputField.student_police_station}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_police_station: text,
                })
              }
            />
            {errInputField.student_police_station.length > 0 && (
              <Text style={styles.error}>
                {errInputField.student_police_station}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর পিনকোড*'}
              placeholder={'ছাত্র/ছাত্রীর পিনকোড*'}
              fontFamily={'kalpurush'}
              type={'number-pad'}
              maxLength={6}
              value={inputField.student_pin_code}
              onChangeText={text =>
                setInputField({
                  ...inputField,
                  student_pin_code: text,
                })
              }
            />
            {errInputField.student_pin_code.length > 0 && (
              <Text style={styles.error}>{errInputField.student_pin_code}</Text>
            )}
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী *
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setAdmClassClicked(!admClassClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{admClassText}</Text>

                {admClassClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {admClassClicked ? (
                <View style={styles.dropDowArea}>
                  {admClassInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setAdmClassClicked(false);
                          setInputField({
                            ...inputField,
                            student_addmission_class: item.value,
                          });
                          setAdmClassText(item.adm_class);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.adm_class}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errInputField.student_addmission_class.length > 0 && (
                <Text style={styles.error}>
                  {errInputField.student_addmission_class}
                </Text>
              )}
            </View>
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(0.2),
                backgroundColor: 'darkred',
                marginTop: responsiveHeight(2),
              }}
            ></View>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                color: 'red',
                alignSelf: 'center',
                textAlign: 'center',
                fontFamily: 'sho',
                marginVertical: responsiveHeight(0.5),
              }}
            >
              *** এই অংশ যদি ছাত্র/ছাত্রী অন্য স্কুল থেকে ট্রান্সফার নিয়ে আসে
              সেটির জন্য
            </Text>
            <View
              style={{
                backgroundColor: 'mistyrose',
                width: responsiveWidth(90),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(0.5),
              }}
            >
              <View style={{ marginVertical: responsiveHeight(1) }}>
                <Text style={[styles.label, { textAlign: 'center' }]}>
                  ছাত্র/ছাত্রীর পূর্বের শ্রেণী *
                </Text>
                <TouchableOpacity
                  style={[styles.dropDownnSelector, { marginTop: 5 }]}
                  onPress={() => {
                    setReAdClassClicked(!reAdClassClicked);
                  }}
                >
                  <Text style={styles.dropDownTextTransfer}>
                    {reAdClassText}
                  </Text>

                  {reAdClassClicked ? (
                    <AntDesign name="up" size={30} color={THEME_COLOR} />
                  ) : (
                    <AntDesign name="down" size={30} color={THEME_COLOR} />
                  )}
                </TouchableOpacity>
                {reAdClassClicked ? (
                  <View style={styles.dropDowArea}>
                    {reAdmClassInput.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.AdminName}
                          onPress={() => {
                            setReAdClassClicked(false);
                            setInputField({
                              ...inputField,
                              student_previous_class: item.value,
                            });
                            setReAdClassText(item.adm_class);
                          }}
                        >
                          <Text style={styles.dropDownTextTransfer}>
                            {item.adm_class}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              <CustomTextInput
                title={'ছাত্র/ছাত্রীর পূর্বের বর্ষ *'}
                placeholder={'ছাত্র/ছাত্রীর পূর্বের বর্ষ *'}
                fontFamily={'kalpurush'}
                type={'number-pad'}
                maxLength={4}
                value={inputField.student_previous_class_year}
                onChangeText={text =>
                  setInputField({
                    ...inputField,
                    student_previous_class_year: text,
                  })
                }
              />
              {errInputField.student_previous_class_year.length > 0 && (
                <Text style={styles.error}>
                  {errInputField.student_previous_class_year}
                </Text>
              )}
              <CustomTextInput
                title={'ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি *'}
                placeholder={'ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি *'}
                fontFamily={'kalpurush'}
                type={'number-pad'}
                maxLength={14}
                value={inputField.student_previous_student_id}
                onChangeText={text =>
                  setInputField({
                    ...inputField,
                    student_previous_student_id: text,
                  })
                }
              />
              {errInputField.student_previous_student_id.length > 0 && (
                <Text style={styles.error}>
                  {errInputField.student_previous_student_id}
                </Text>
              )}
              <CustomTextInput
                title={'ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা *'}
                placeholder={'ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা *'}
                fontFamily={'kalpurush'}
                size={'large'}
                value={inputField.student_previous_school}
                onChangeText={text =>
                  setInputField({
                    ...inputField,
                    student_previous_school: text,
                  })
                }
              />
              {errInputField.student_previous_school.length > 0 && (
                <Text style={styles.error}>
                  {errInputField.student_previous_school}
                </Text>
              )}
            </View>
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(0.2),
                backgroundColor: 'darkred',
                marginVertical: responsiveHeight(1),
              }}
            ></View>
            <CustomButton
              title={'Submit'}
              size={'small'}
              color={'darkgreen'}
              onClick={() => submitData()}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(60),
              }}
            >
              <CustomButton
                title={'Clear'}
                color={'red'}
                size={'xsmall'}
                onClick={async () => {
                  setInputField({
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
                    student_addmission_year: YEAR,
                    student_addmission_dateAndTime: Date.now(),
                  });
                  setAdmClassText('প্রাক প্রাথমিক');
                  setGenderText('লিঙ্গ বেছে নিন');
                  setReligionText('ধর্ম বেছে নিন');
                  setCastText('জাতি বেছে নিন');
                  setBplText('বি.পি.এল. কিনা?');
                  setReAdClassText('শ্রেণী বেছে নিন');
                  setPath('');
                  setImageName('');
                  await ImagePicker.clean()
                    .then(() => {
                      console.log('removed all tmp images from tmp directory');
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }}
              />
              <CustomButton
                title={'Close'}
                color={'purple'}
                size={'xsmall'}
                onClick={async () => {
                  setShowForm(false);
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}
      {formSubmitted && (
        <ScrollView
          style={{ marginBottom: responsiveHeight(10) }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              padding: responsiveWidth(3),
            }}
          >
            <Text style={[styles.label, { color: 'green' }]}>
              Congrats! আপনার ফর্মটি সাফল্যের সাথে আমাদের কাছে জমা পড়ে গেছে!
            </Text>
            <Text style={[styles.label, { color: 'blue' }]}>
              অনুগ্রহ করে লিখে রাখবেন আপনার অ্যাপ্লিকেশন নাম্বারটি হলো।
            </Text>
            <Text
              selectable
              style={{
                fontSize: responsiveFontSize(3),
                fontWeight: '500',
                textAlign: 'center',
                color: THEME_COLOR,
              }}
            >
              {admissionID}
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginBottom: responsiveHeight(2),
              }}
              onPress={() => {
                console.log('Copied successfully');
                try {
                  Clipboard.setString(admissionID);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                  console.log('Copied successfully');
                  showToast(
                    'success',
                    'Your Admission ID has been copied successfully',
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              {copied ? (
                <Text
                  style={{ color: 'green', fontSize: responsiveFontSize(2) }}
                >
                  Copied to Clipboard
                </Text>
              ) : (
                <Text
                  style={{
                    color: 'purple',
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Copy to Clipboard
                </Text>
              )}
            </TouchableOpacity>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <CustomButton
                title={'View Form'}
                color={'green'}
                onClick={() => {
                  navigation.navigate('ViewForm');
                }}
              />
              <CustomButton
                title={'Download Form'}
                fontSize={responsiveFontSize(1.3)}
                color={'blue'}
                onClick={async () => {
                  const url = `${WEBSITE}/downloadAdmissionForm?id=${stateObject?.id}&mobile=${stateObject?.student_mobile}`;
                  await Linking.openURL(url);
                }}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                onClick={() => {
                  setShowForm(false);
                  setShowUpdateForm(false);
                  setAplicationNo('');
                  setShowSearchedResult(false);
                  setShowEditForm(false);
                  setFormSubmitted(false);
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}
      {showUpdateForm && (
        <ScrollView
          style={{ marginBottom: responsiveHeight(10) }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text selectable={true} style={[styles.label, { color: 'red' }]}>
              *** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনাকে প্রদত্ত ছাত্র/ছাত্রীর
              প্রদত্ত অ্যাপ্লিকেশন নাম্বারটি নিজের কাছে রাখুন। e.g.
              USPRYS-ONLINE-2024-01
            </Text>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <CustomTextInput
                title={'অ্যাপ্লিকেশন নাম্বার লিখুন*'}
                placeholder={'অ্যাপ্লিকেশন নাম্বার লিখুন'}
                fontFamily={'kalpurush'}
                value={applicationNo}
                onChangeText={text => setAplicationNo(text)}
              />
              <CustomTextInput
                title={'অ্যাপ্লিকেশনে দেওয়া মোবাইল নাম্বার লিখুন*'}
                placeholder={'অ্যাপ্লিকেশনে দেওয়া মোবাইল নাম্বার লিখুন*'}
                fontFamily={'kalpurush'}
                type={'number-pad'}
                maxLength={10}
                value={mobileNumber}
                onChangeText={text => setMobileNumber(text)}
              />
            </View>
            {showErr && (
              <Text style={styles.error}>
                দয়া করে অ্যাপ্লিকেশন নাম্বার ও মোবাইল নাম্বার লিখুন
              </Text>
            )}
            <CustomButton
              title={'Search'}
              color={'darkgreen'}
              onClick={() => {
                setShowErr(true);
                if (applicationNo.length > 0 || mobileNumber.length > 0) {
                  searchApplication();
                  setShowErr(false);
                } else {
                  setShowErr(true);
                }
              }}
            />
          </View>
        </ScrollView>
      )}
      {showSearchedResult && (
        <ScrollView
          style={{ marginBottom: responsiveHeight(10) }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>Application No.</Text>
              <Text style={styles.result}>{searchedApplicationNo?.id}</Text>
              <Text style={styles.label}>ছাত্র/ছাত্রীর নাম</Text>
              <Text style={styles.result}>
                {searchedApplicationNo?.student_eng_name}
              </Text>
              <Text style={styles.label}>পিতার নাম</Text>
              <Text style={styles.result}>
                {searchedApplicationNo?.father_eng_name}
              </Text>
              <Text style={styles.label}>ফর্ম জমা দেওয়ার তারিখ</Text>
              <Text style={styles.result}>
                {DateValueToSring(
                  searchedApplicationNo?.student_addmission_dateAndTime,
                )}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: responsiveHeight(1),
                flexWrap: 'wrap',
              }}
            >
              <CustomButton
                title={'Edit'}
                color={'blueviolet'}
                size={'small'}
                onClick={() => {
                  setEditInputField(searchedApplicationNo);
                  setSearchedOrgApplicationNo(searchedApplicationNo);
                  setShowEditForm(true);
                  setShowSearchedResult(false);
                  setShowUpdateForm(false);
                  setDob(
                    new Date(
                      getCurrentDateInput(
                        searchedApplicationNo?.student_birthday,
                      ),
                    ),
                  );
                  setGenderText(searchedApplicationNo?.student_gender);
                  setReligionText(searchedApplicationNo?.student_religion);
                  setCastText(searchedApplicationNo?.student_race);
                  setBplText(
                    searchedApplicationNo?.student_bpl_number ? 'হ্যাঁ' : 'না',
                  );
                  setAdmClassText(
                    searchedApplicationNo?.student_addmission_class,
                  );
                  setReAdClassText(
                    searchedApplicationNo?.student_previous_class,
                  );
                }}
              />
              <CustomButton
                title={'View'}
                color={'darkgreen'}
                size={'small'}
                onClick={() => {
                  setStateObject(searchedApplicationNo);
                  navigation.navigate('ViewForm');
                }}
              />

              <CustomButton
                title={'Download'}
                color={'chocolate'}
                size={'small'}
                onClick={async () => {
                  const url = `${WEBSITE}/downloadAdmissionForm?id=${searchedApplicationNo?.id}&mobile=${searchedApplicationNo?.student_mobile}`;
                  await Linking.openURL(url);
                }}
              />
              <CustomButton
                title={'Delete'}
                color={'darkred'}
                size={'small'}
                onClick={() => showConfirmDialog(searchedApplicationNo)}
              />
            </View>
          </View>
        </ScrollView>
      )}
      {showEditForm && (
        <ScrollView
          style={{ marginBottom: responsiveHeight(10) }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={[styles.label, { color: 'red' }]}>
              * চিহ্ন দেওয়া অংশগুলি আবশ্যিক।
            </Text>
            <Text style={[styles.label, { color: 'red' }]}>
              *** যে অংশগুলি বাংলায় বলা আছে শুধুমাত্র সেইগুলিই বাংলায় করবেন বাকি
              সমস্ত অংশ ইংরাজীতে লিখবেন।
            </Text>
            <Text style={[styles.label, { color: 'red' }]}>
              *** ফর্ম ফিলাপের পর প্রদত্ত অ্যাপ্লিকেশন নাম্বার অবশ্যই আপনার কাছে
              সংরক্ষিত রাখবেন।
            </Text>
            <Text style={[styles.title, { fontFamily: 'times' }]}>
              UPDATE ADMISSION FORM
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: responsiveHeight(2),
            }}
          >
            <Image
              source={{ uri: editInputField.url }}
              alt="studentImage"
              style={{
                width: 350,
                height: 450,
              }}
            />
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর বাংলায় নাম*'}
              placeholder={'ছাত্র/ছাত্রীর বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.student_beng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_beng_name: text,
                })
              }
            />
            {errEditInputField.student_beng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_beng_name}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর ইংরাজীতে নাম*'}
              placeholder={'ছাত্র/ছাত্রীর ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.student_eng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_eng_name: text,
                })
              }
            />
            {errEditInputField.student_eng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_eng_name}
              </Text>
            )}
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>ছাত্র/ছাত্রীর জন্ম তারিখ*</Text>
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
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
            </View>
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর আধার নাম্বার'}
              placeholder={'ছাত্র/ছাত্রীর আধার নাম্বার'}
              fontFamily={'kalpurush'}
              type={'number-pad'}
              maxLength={12}
              value={editInputField.student_aadhaar}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_aadhaar: text,
                })
              }
            />

            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর লিঙ্গ*
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setIsclicked(!isclicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{genderText}</Text>

                {isclicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {isclicked ? (
                <View style={styles.dropDowArea}>
                  {genderInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setIsclicked(false);
                          setEditInputField({
                            ...editInputField,
                            student_gender: item.value,
                          });
                          setGenderText(item.gender);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.gender}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errEditInputField.student_gender.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_gender}
                </Text>
              )}
            </View>
            <CustomTextInput
              title={'অভিভাবকের মোবাইল নাম্বার*'}
              placeholder={'অভিভাবকের মোবাইল নাম্বার*'}
              fontFamily={'kalpurush'}
              type={'number-pad'}
              maxLength={10}
              value={editInputField.student_mobile}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_mobile: text,
                })
              }
            />
            {errEditInputField.student_mobile.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_mobile}
              </Text>
            )}
            <CustomTextInput
              title={'পিতার বাংলায় নাম*'}
              placeholder={'পিতার বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.father_beng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  father_beng_name: text,
                  guardian_beng_name: text,
                })
              }
            />
            {errEditInputField.father_beng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.father_beng_name}
              </Text>
            )}
            <CustomTextInput
              title={'পিতার ইংরাজীতে নাম*'}
              placeholder={'পিতার ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.father_eng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  father_eng_name: text,
                  guardian_eng_name: text,
                })
              }
            />
            {errEditInputField.father_eng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.father_eng_name}
              </Text>
            )}
            <CustomTextInput
              title={'মাতার বাংলায় নাম*'}
              placeholder={'মাতার বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.mother_beng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  mother_beng_name: text,
                })
              }
            />
            {errEditInputField.mother_beng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.mother_beng_name}
              </Text>
            )}
            <CustomTextInput
              title={'মাতার ইংরাজীতে নাম*'}
              placeholder={'মাতার ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.mother_eng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  mother_eng_name: text,
                })
              }
            />
            {errEditInputField.mother_eng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.mother_eng_name}
              </Text>
            )}
            <CustomTextInput
              title={'অভিভাবকের বাংলায় নাম*'}
              placeholder={'অভিভাবকের বাংলায় নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.guardian_beng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  guardian_beng_name: text,
                })
              }
            />
            {errEditInputField.guardian_beng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.guardian_beng_name}
              </Text>
            )}
            <CustomTextInput
              title={'অভিভাবকের ইংরাজীতে নাম*'}
              placeholder={'অভিভাবকের ইংরাজীতে নাম*'}
              fontFamily={'kalpurush'}
              value={editInputField.guardian_eng_name}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  guardian_eng_name: text,
                })
              }
            />
            {errEditInputField.guardian_eng_name.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.guardian_eng_name}
              </Text>
            )}
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর ধর্ম*
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setRelClicked(!relClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{religionText}</Text>

                {relClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {relClicked ? (
                <View style={styles.dropDowArea}>
                  {religionInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setRelClicked(false);
                          setEditInputField({
                            ...editInputField,
                            student_religion: item.value,
                          });
                          setReligionText(item.religion);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.religion}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errEditInputField.student_religion.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_religion}
                </Text>
              )}
            </View>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর জাতি*
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setCastClicked(!castClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{castText}</Text>

                {castClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {castClicked ? (
                <View style={styles.dropDowArea}>
                  {castInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setCastClicked(false);
                          setEditInputField({
                            ...editInputField,
                            student_race: item.value,
                          });
                          setCastText(item.cast);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.cast}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errEditInputField.student_race.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_race}
                </Text>
              )}
            </View>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রী বি.পি.এল. কিনা? *
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setBplClicked(!bplClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{bplText}</Text>

                {bplClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {bplClicked ? (
                <View style={styles.dropDowArea}>
                  {bplInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setBplClicked(false);
                          setEditInputField({
                            ...editInputField,
                            student_bpl_status: item.value,
                          });
                          setBplText(item.bpl_status);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.bpl_status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            {editInputField.student_bpl_status === 'YES' && (
              <CustomTextInput
                title={'অভিভাবকের বি.পি.এল. নাম্বার *'}
                placeholder={'অভিভাবকের বি.পি.এল. নাম্বার *'}
                fontFamily={'kalpurush'}
                value={editInputField.student_bpl_number}
                onChangeText={text =>
                  setEditInputField({
                    ...editInputField,
                    student_bpl_number: text,
                  })
                }
              />
            )}

            <CustomTextInput
              title={'ছাত্র/ছাত্রীর গ্রামের নাম *'}
              placeholder={'ছাত্র/ছাত্রীর গ্রামের নাম *'}
              fontFamily={'kalpurush'}
              value={editInputField.student_village}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_village: text,
                })
              }
            />
            {errEditInputField.student_village.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_village}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *'}
              placeholder={'ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *'}
              fontFamily={'kalpurush'}
              value={editInputField.student_post_office}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_post_office: text,
                })
              }
            />
            {errEditInputField.student_post_office.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_post_office}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *'}
              placeholder={'ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *'}
              fontFamily={'kalpurush'}
              value={editInputField.student_police_station}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_police_station: text,
                })
              }
            />
            {errEditInputField.student_police_station.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_police_station}
              </Text>
            )}
            <CustomTextInput
              title={'ছাত্র/ছাত্রীর পিনকোড*'}
              placeholder={'ছাত্র/ছাত্রীর পিনকোড*'}
              fontFamily={'kalpurush'}
              type={'number-pad'}
              maxLength={6}
              value={editInputField.student_pin_code}
              onChangeText={text =>
                setEditInputField({
                  ...editInputField,
                  student_pin_code: text,
                })
              }
            />
            {errEditInputField.student_pin_code.length > 0 && (
              <Text style={styles.error}>
                {errEditInputField.student_pin_code}
              </Text>
            )}
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={[styles.label, { textAlign: 'center' }]}>
                ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী *
              </Text>
              <TouchableOpacity
                style={[styles.dropDownnSelector, { marginTop: 5 }]}
                onPress={() => {
                  setAdmClassClicked(!admClassClicked);
                }}
              >
                <Text style={styles.dropDownTextTransfer}>{admClassText}</Text>

                {admClassClicked ? (
                  <AntDesign name="up" size={30} color={THEME_COLOR} />
                ) : (
                  <AntDesign name="down" size={30} color={THEME_COLOR} />
                )}
              </TouchableOpacity>
              {admClassClicked ? (
                <View style={styles.dropDowArea}>
                  {admClassInput.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.AdminName}
                        onPress={() => {
                          setAdmClassClicked(false);
                          setEditInputField({
                            ...editInputField,
                            student_addmission_class: item.value,
                          });
                          setAdmClassText(item.adm_class);
                        }}
                      >
                        <Text style={styles.dropDownTextTransfer}>
                          {item.adm_class}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {errEditInputField.student_addmission_class.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_addmission_class}
                </Text>
              )}
            </View>
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(0.2),
                backgroundColor: 'darkred',
                marginTop: responsiveHeight(2),
              }}
            ></View>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                color: 'red',
                alignSelf: 'center',
                textAlign: 'center',
                fontFamily: 'sho',
                marginVertical: responsiveHeight(0.5),
              }}
            >
              *** এই অংশ যদি ছাত্র/ছাত্রী অন্য স্কুল থেকে ট্রান্সফার নিয়ে আসে
              সেটির জন্য
            </Text>
            <View
              style={{
                backgroundColor: 'mistyrose',
                width: responsiveWidth(90),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(0.5),
              }}
            >
              <View style={{ marginVertical: responsiveHeight(1) }}>
                <Text style={[styles.label, { textAlign: 'center' }]}>
                  ছাত্র/ছাত্রীর পূর্বের শ্রেণী *
                </Text>
                <TouchableOpacity
                  style={[styles.dropDownnSelector, { marginTop: 5 }]}
                  onPress={() => {
                    setReAdClassClicked(!reAdClassClicked);
                  }}
                >
                  <Text style={styles.dropDownTextTransfer}>
                    {reAdClassText}
                  </Text>

                  {reAdClassClicked ? (
                    <AntDesign name="up" size={30} color={THEME_COLOR} />
                  ) : (
                    <AntDesign name="down" size={30} color={THEME_COLOR} />
                  )}
                </TouchableOpacity>
                {reAdClassClicked ? (
                  <View style={styles.dropDowArea}>
                    {reAdmClassInput.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.AdminName}
                          onPress={() => {
                            setReAdClassClicked(false);
                            setEditInputField({
                              ...editInputField,
                              student_previous_class: item.value,
                            });
                            setReAdClassText(item.adm_class);
                          }}
                        >
                          <Text style={styles.dropDownTextTransfer}>
                            {item.adm_class}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              <CustomTextInput
                title={'ছাত্র/ছাত্রীর পূর্বের বর্ষ *'}
                placeholder={'ছাত্র/ছাত্রীর পূর্বের বর্ষ *'}
                fontFamily={'kalpurush'}
                type={'number-pad'}
                maxLength={4}
                value={editInputField.student_previous_class_year}
                onChangeText={text =>
                  setEditInputField({
                    ...editInputField,
                    student_previous_class_year: text,
                  })
                }
              />
              {errEditInputField.student_previous_class_year.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_previous_class_year}
                </Text>
              )}
              <CustomTextInput
                title={'ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি *'}
                placeholder={'ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি *'}
                fontFamily={'kalpurush'}
                type={'number-pad'}
                maxLength={14}
                value={editInputField.student_previous_student_id}
                onChangeText={text =>
                  setEditInputField({
                    ...editInputField,
                    student_previous_student_id: text,
                  })
                }
              />
              {errEditInputField.student_previous_student_id.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_previous_student_id}
                </Text>
              )}
              <CustomTextInput
                title={'ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা *'}
                placeholder={'ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা *'}
                fontFamily={'kalpurush'}
                size={'large'}
                value={editInputField.student_previous_school}
                onChangeText={text =>
                  setEditInputField({
                    ...editInputField,
                    student_previous_school: text,
                  })
                }
              />
              {errEditInputField.student_previous_school.length > 0 && (
                <Text style={styles.error}>
                  {errEditInputField.student_previous_school}
                </Text>
              )}
            </View>
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(0.2),
                backgroundColor: 'darkred',
                marginVertical: responsiveHeight(1),
              }}
            ></View>
            <CustomButton
              title={'Update'}
              color={'darkgreen'}
              onClick={() => updateData()}
            />
            <CustomButton
              title={'Clear'}
              color={'darkred'}
              onClick={() => {
                setEditInputField({
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
                  student_addmission_year: YEAR,
                  student_addmission_dateAndTime: Date.now(),
                });
                setShowEditForm(false);
                setAdmClassText('প্রাক প্রাথমিক');
                setGenderText('লিঙ্গ বেছে নিন');
                setReligionText('ধর্ম বেছে নিন');
                setCastText('জাতি বেছে নিন');
                setBplText('বি.পি.এল. কিনা?');
                setReAdClassText('শ্রেণী বেছে নিন');
              }}
            />
          </View>
        </ScrollView>
      )}
      <Loader visible={loader} />
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
});
