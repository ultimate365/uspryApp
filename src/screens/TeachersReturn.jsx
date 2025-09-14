import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
  Linking,
} from 'react-native';
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
import { LAST_DAY_OF_INSPECTION, WEBSITE } from '../modules/constants';
import { showToast } from '../modules/Toaster';
import {
  getCurrentDateInput,
  monthNamesWithIndex,
  sortMonthwise,
  todayInString,
  uniqArray,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import { getCollection, setDocument } from '../firebase/firestoreHelper';
export default function TeachersReturn() {
  const { state, returnState, setReturnState, setActiveTab } =
    useGlobalContext();
  const access = state?.ACCESS;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [addRemark, setAddRemark] = useState(false);
  const [workingDays, setWorkingDays] = useState(24);
  const [editTeacher, setEditTeacher] = useState({
    cast: '',
    tname: '',
    training: '',
    education: '',
    dor: '',
    desig: '',
    rank: '',
    dojnow: '',
    dob: '',
    id: '',
    doj: '',
    clThisMonth: '',
    clThisYear: '',
    olThisMonth: '',
    olThisYear: '',
    fullPay: '',
    halfPay: '',
    WOPay: '',
    workingDays: workingDays,
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [students, setStudents] = useState({});
  const [showEditStudentData, setShowEditStudentData] = useState(false);
  const [showAvrAtt, setShowAvrAtt] = useState(false);
  const [beforeSubmit, setBeforeSubmit] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const currentDate = new Date();
  const [inspectionDate, setInspectionDate] = useState(
    new Date(getCurrentDateInput(LAST_DAY_OF_INSPECTION)),
  );
  const [date, setDate] = useState(new Date());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);
  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setInspectionDate(currentSelectedDate);
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
    setInspection({
      ...inspection,
      inspectionDate: tarikh,
    });
  };
  const month =
    monthNamesWithIndex[
      currentDate.getDate() > 10
        ? currentDate.getMonth()
        : currentDate.getMonth() === 0
        ? 11
        : currentDate.getMonth() - 1
    ].monthName;
  const year = currentDate?.getFullYear();
  const [yearArray, setYearArray] = useState([]);
  const [allEnry, setAllEnry] = useState([]);
  const [moreFilteredEntry, setMoreFilteredEntry] = useState([]);
  const [entryMonths, setEntryMonths] = useState([]);
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');

  const getID = () => {
    return `${month}-${year}`;
  };
  const [showModal, setShowModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspection, setInspection] = useState({
    inspectionDate: new Date(getCurrentDateInput(LAST_DAY_OF_INSPECTION)),
    pp: '',
    i: '',
    ii: '',
    iii: '',
    iv: '',
    v: '',
    total: '',
  });
  const id = getID();
  const entry = {
    id,
    month,
    year,
    teachers: filteredData,
    students,
    workingDays,
    inspection,
    date: todayInString(),
    remarks,
  };

  const [monthText, setMonthText] = useState('');

  const handleChange = value => {
    if (value !== '') {
      setMonthText('');
      const selectedValue = value;
      let x = [];
      let y = [];
      allEnry.map(entry => {
        const entryYear = entry?.year?.toString();
        const entryMonth = entry?.month;

        if (entryYear === selectedValue) {
          x.push(entry);
        }
        if (entryYear === selectedValue) {
          monthNamesWithIndex.map(month => {
            if (entryMonth === month.monthName) {
              y.push(month);
            }
          });
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setMoreFilteredEntry(x);
      setEntryMonths(uniqArray(y));
    } else {
      setSelectedYear('');
      setShowMonthSelection(false);
      showToast('error', 'Please select a year');
    }
  };
  const [selectedRemarks, setSelectedRemarks] = useState('');
  const [selectedWorkingDays, setSelectedWorkingDays] = useState('');
  const [selectedInspection, setSelectedInspection] = useState({
    inspectionDate: '',
    pp: '',
    i: '',
    ii: '',
    iii: '',
    iv: '',
    v: '',
    total: '',
  });
  const [selectedFilteredData, setSelectedFilteredData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedReturnMonth, setSelectedReturnMonth] = useState('');
  const [selectedReturnYear, setSelectedReturnYear] = useState('');
  const [selectedThisMonthReturnData, setSelectedThisMonthReturnData] =
    useState({});
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const handleMonthChange = month => {
    console.log(month);
    let x = [];

    allEnry.map((entry, index) => {
      const entryYear = entry.year.toString();
      const entryMonth = entry.month;
      if (entryYear === selectedYear && entryMonth === month.monthName) {
        x.push(entry);
        setSelectedRemarks(entry?.remarks);
        setSelectedWorkingDays(entry?.workingDays);
        setSelectedInspection(entry?.inspection);
        setSelectedFilteredData(entry?.teachers);
        setSelectedStudents(entry?.students);
        setSelectedReturnMonth(entry?.month);
        setSelectedReturnYear(entry?.year);
        setSelectedThisMonthReturnData(JSON.stringify(entry));
        setShowDownloadBtn(true);
        return x;
      }
    });
    setMonthText(month.monthName);
  };

  const getMonthlyData = async () => {
    setLoader(true);
    await getCollection('monthlyTeachersReturn').then(data => {
      const monthwiseSorted = sortMonthwise(data);
      setReturnState(monthwiseSorted);
      setLoader(false);
      calledData(monthwiseSorted);
      appedData(monthwiseSorted[monthwiseSorted.length - 1]);
    });
  };
  const appedData = data => {
    setTeachers(data.teachers);
    setFilteredData(data.teachers);
    setStudents(data.students);
    setInspection(data.inspection);
    setWorkingDays(data.workingDays);
    setRemarks(data.remarks);
    setShowModal(true);
  };
  const calledData = array => {
    let x = [];
    array.map(entry => {
      const entryYear = entry.id.split('-')[1];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setYearArray(x);
    setAllEnry(array);
    setLoader(false);
  };
  const getArrayLength = year => {
    let x = [];
    returnState.map(entry => {
      const entryYear = entry.id?.split('-')[1];
      if (entryYear === year) {
        x.push(entry);
      }
    });
    return x.length;
  };
  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      await setDocument('monthlyTeachersReturn', id, entry);
      setReturnState([...returnState, entry]);
      showToast('success', 'Monthly Data Submitted Successfully!');
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      showToast('error', 'Failed to Submit Monthly Data');
    }
  };
  const showConfirmDialog = entry => {
    return Alert.alert(
      'Hold On!',
      'Are you sure, you want to Submit this Data?',
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Cancel',
          onPress: () => showToast('success', 'Entry Not Submited'),
        }, // The "Yes" button
        {
          text: 'Yes',
          onPress: async () => {
            setBeforeSubmit(false);
            submitMonthlyData();
          },
        },
      ],
    );
  };
  useEffect(() => {
    if (returnState.length === 0) {
      getMonthlyData();
    } else {
      calledData(returnState);
      appedData(returnState[returnState.length - 1]);
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
      <ScrollView style={{ marginBottom: responsiveHeight(5) }}>
        {showModal && (
          <ScrollView>
            <Text style={styles.title}>Set Working Days</Text>
            <CustomTextInput
              title={'***Set Total Working Days of this Month'}
              placeholder="Enter Working Days"
              value={workingDays.toString()}
              onChangeText={e => {
                if (e !== '') {
                  setWorkingDays(parseInt(e));
                  try {
                    // Map over teachers and create the updated array
                    const myData = teachers.map(data => {
                      if (data.clThisMonth) {
                        // Update the workingDays field
                        return {
                          ...data,
                          workingDays: parseInt(e) - data.clThisMonth,
                        };
                      }
                      return data;
                    });
                    // Update the filtered data with the new array
                    setFilteredData(myData);
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setWorkingDays('');
                }
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(40),
              }}
            >
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => setShowModal(false)}
              />
            </View>
          </ScrollView>
        )}
        {!showAvrAtt &&
          !showEditForm &&
          !showDownload &&
          !beforeSubmit &&
          !showInspectionModal &&
          !showModal &&
          !addRemark &&
          !showEditForm && (
            <View>
              <Text style={styles.title}>Teachers Return</Text>
              <CustomButton
                title={'Set Working Days'}
                onClick={() => {
                  setShowModal(true);
                  setShowInspectionModal(false);
                  setShowAvrAtt(false);
                  setShowDownload(false);
                  setShowEditStudentData(false);
                }}
              />
              <CustomButton
                title={'Submit Return Data'}
                color={'purple'}
                onClick={() => {
                  setBeforeSubmit(true);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowAvrAtt(false);
                  setShowDownload(false);
                  setShowEditStudentData(false);
                }}
              />
              <CustomButton
                title={'Download Return Data'}
                color={'darkcyan'}
                onClick={() => {
                  setShowDownload(true);
                  setBeforeSubmit(false);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowAvrAtt(false);
                  setShowEditStudentData(false);
                }}
              />
              <CustomButton
                title={'Edit Inspection Section'}
                color={'seagreen'}
                onClick={() => {
                  setShowInspectionModal(true);
                  setShowModal(false);
                  setShowAvrAtt(false);
                  setShowDownload(false);
                  setShowEditStudentData(false);
                }}
              />
              <CustomButton
                title={'Edit Average Attaindance'}
                color={'chocolate'}
                onClick={() => {
                  setShowAvrAtt(true);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowDownload(false);
                  setShowEditStudentData(false);
                }}
              />
              <CustomButton
                title={'Edit Classwise Student Data'}
                color={'black'}
                onClick={() => {
                  setShowEditStudentData(true);
                  setShowAvrAtt(false);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowDownload(false);
                }}
              />
              <CustomButton
                color={'blueviolet'}
                title={addRemark ? 'Close Remark' : 'Write Remark'}
                onClick={() => {
                  setAddRemark(!addRemark);
                  setShowAvrAtt(false);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowDownload(false);
                  setShowEditStudentData(false);
                }}
              />
            </View>
          )}
        {showInspectionModal && (
          <ScrollView>
            <Text style={styles.title}>Set Inspection Days</Text>
            <View style={{ marginVertical: responsiveHeight(1) }}>
              <Text style={styles.label}>Inspection Date*</Text>
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
                  {inspectionDate.getDate() < 10
                    ? '0' + inspectionDate.getDate()
                    : inspectionDate.getDate()}
                  -
                  {inspectionDate.getMonth() + 1 < 10
                    ? `0${inspectionDate.getMonth() + 1}`
                    : inspectionDate.getMonth() + 1}
                  -{inspectionDate.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={inspectionDate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
            </View>
            <CustomTextInput
              title={'PP Attaindance'}
              placeholder={'Enter PP Attaindance'}
              type={'number-pad'}
              value={inspection?.pp.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    pp: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    pp: '',
                    total:
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class I Attaindance'}
              placeholder={'Enter Class I Attaindance'}
              type={'number-pad'}
              value={inspection?.i.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    i: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    i: '',
                    total:
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class II Attaindance'}
              placeholder={'Enter Class II Attaindance'}
              type={'number-pad'}
              value={inspection?.ii.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    ii: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    ii: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class III Attaindance'}
              placeholder={'Enter Class III Attaindance'}
              type={'number-pad'}
              value={inspection?.iii.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    iii: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    iii: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class IV Attaindance'}
              placeholder={'Enter Class IV Attaindance'}
              type={'number-pad'}
              value={inspection?.iv.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    iii: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    iii: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class V Attaindance'}
              placeholder={'Enter Class V Attaindance'}
              type={'number-pad'}
              value={inspection?.v.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    v: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    v: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Total Attaindance Attaindance'}
              placeholder={'Enter Total Attaindance Attaindance'}
              type={'number-pad'}
              value={inspection?.total.toString()}
              editable={false}
              onChangeText={e => {
                showToast('error', 'Cannot Change Total Attaindance');
              }}
            />
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
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => setShowInspectionModal(false)}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setShowInspectionModal(false)}
              />
            </View>
          </ScrollView>
        )}
        {beforeSubmit && (
          <ScrollView>
            <Text style={styles.title}>
              ***Showing Data you are Going to Submit
            </Text>
            <Text style={styles.label}>ID:{entry?.id}</Text>
            <Text style={styles.label}>Year:{entry?.year}</Text>
            <Text style={styles.label}>Month:{entry?.month}</Text>
            <Text style={styles.label}>
              InspectionDate:{entry?.inspectionDate}
            </Text>
            <Text style={styles.label}>WorkingDays:{entry?.workingDays}</Text>
            <Text style={styles.label}>Date:{entry?.date}</Text>
            <Text style={styles.label}>Remarks:{entry?.remarks}</Text>
            <View
              style={{
                flexWrap: 'wrap',
                paddingHorizontal: responsiveWidth(2),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.label}>Teachers:</Text>
              {entry?.teachers.map((teacher, index) => (
                <View key={index}>
                  <Text style={styles.bankDataText}>Name:{teacher?.tname}</Text>
                  <Text style={styles.bankDataText}>
                    Data:
                    {JSON.stringify(teacher)
                      .split(`"`)
                      .join('')
                      .split('{')
                      .join('')
                      .split('}')
                      .join('')}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                flexWrap: 'wrap',
                paddingHorizontal: responsiveWidth(2),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.label}>Students:</Text>
              <Text style={styles.label}>PP:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.pp)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class I:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.i)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class II:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.ii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class III:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.iii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class IV:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.iv)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              {entry?.students?.v?.Total !== '-' && (
                <View>
                  <Text style={styles.label}>Class V:</Text>
                  <Text style={styles.bankDataText}>
                    {JSON.stringify(entry?.students?.iv)
                      .split(`"`)
                      .join('')
                      .split('{')
                      .join('')
                      .split('}')
                      .join('')}
                  </Text>
                </View>
              )}
              <Text style={styles.label}>Total:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.total)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
            </View>
            <View
              style={{
                flexWrap: 'wrap',
                paddingHorizontal: responsiveWidth(2),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.label}>Inspection:</Text>
              <Text style={styles.bankDataText}>Date:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.inspectionDate)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>PP:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.pp)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class I:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.i)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class II:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.ii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class III:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.iii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class IV:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.iv)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              {inspection?.v?.Total !== '-' && (
                <View>
                  <Text style={styles.bankDataText}>Class V:</Text>
                  <Text style={styles.bankDataText}>
                    {JSON.stringify(inspection?.v)
                      .split(`"`)
                      .join('')
                      .split('{')
                      .join('')
                      .split('}')
                      .join('')}
                  </Text>
                </View>
              )}
              <Text style={styles.bankDataText}>Total Student:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.total)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
            </View>
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
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => showConfirmDialog()}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setBeforeSubmit(false)}
              />
            </View>
          </ScrollView>
        )}

        {addRemark && (
          <ScrollView>
            <Text style={styles.title}>Set Remarks</Text>
            <CustomTextInput
              title={'***Set Remarks for this Month'}
              size={'large'}
              placeholder="Enter Remarks"
              value={remarks}
              onChangeText={e => setRemarks(e)}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(60),
              }}
            >
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => {
                  setAddRemark(false);
                }}
              />
              {remarks.length > 0 && (
                <CustomButton
                  title={'Clear'}
                  color={'darkorange'}
                  size={'xsmall'}
                  onClick={() => {
                    setRemarks('');
                  }}
                />
              )}
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setAddRemark(false)}
              />
            </View>
          </ScrollView>
        )}
        {showAvrAtt && (
          <ScrollView>
            <Text style={styles.title}>Set Average Attaindance</Text>
            <CustomTextInput
              title={'PP'}
              type={'number-pad'}
              placeholder="Enter PP Attaindance"
              value={(students?.pp?.averageAttendance !== undefined &&
              students?.pp?.averageAttendance !== null
                ? students?.pp?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  pp: {
                    ...students?.pp,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      parseInt(value) +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class I'}
              type={'number-pad'}
              placeholder="Enter Class I Attaindance"
              value={(students?.i?.averageAttendance !== undefined &&
              students?.i?.averageAttendance !== null
                ? students?.i?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  i: {
                    ...students?.i,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      parseInt(value) +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class II'}
              type={'number-pad'}
              placeholder="Enter Class II Attaindance"
              value={(students?.ii?.averageAttendance !== undefined &&
              students?.ii?.averageAttendance !== null
                ? students?.ii?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  ii: {
                    ...students?.ii,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      parseInt(value) +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class III'}
              type={'number-pad'}
              placeholder="Enter Class III Attaindance"
              value={(students?.iii?.averageAttendance !== undefined &&
              students?.iii?.averageAttendance !== null
                ? students?.iii?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  iii: {
                    ...students?.iii,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      parseInt(value) +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class IV'}
              type={'number-pad'}
              placeholder="Enter Class IV Attaindance"
              value={(students?.iv?.averageAttendance !== undefined &&
              students?.iv?.averageAttendance !== null
                ? students?.iv?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  iv: {
                    ...students?.iv,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      parseInt(value) +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class V'}
              type={'number-pad'}
              placeholder="Enter Class V Attaindance"
              value={(students?.v?.averageAttendance !== undefined &&
              students?.v?.averageAttendance !== null
                ? students?.v?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  v: {
                    ...students?.v,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      parseInt(value),
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Total'}
              type={'number-pad'}
              placeholder="Enter Total Attaindance"
              value={(students?.total?.averageAttendance !== undefined &&
              students?.total?.averageAttendance !== null
                ? students?.total?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  total: {
                    ...students?.total, // Corrected this to use `students?.total`
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                });
              }}
            />
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
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => {
                  setShowAvrAtt(false);
                }}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setShowAvrAtt(false)}
              />
            </View>
          </ScrollView>
        )}
        {!showAvrAtt &&
          !showEditForm &&
          !beforeSubmit &&
          !showDownload &&
          !showInspectionModal &&
          !showModal &&
          !addRemark &&
          !showEditForm &&
          !showEditStudentData && (
            <ScrollView>
              <Text style={styles.title}>Edit Teacher Data</Text>
              {teachers.map((teacher, index) => (
                <View style={styles.dataView} key={index}>
                  <Text style={styles.label}>
                    SL.: {index + 1}) {teacher.tname}
                  </Text>
                  <CustomButton
                    title={'Edit'}
                    size={'xsmall'}
                    color={'orange'}
                    onClick={() => {
                      setEditTeacher(teacher);
                      setShowEditForm(true);
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          )}

        {showEditForm && (
          <ScrollView>
            <Text style={styles.title}>Edit Teacher Data</Text>
            <Text style={styles.error}>
              *** Please Set This Month&#8217;s Working Days First
            </Text>
            <Text style={styles.error}>
              *** Total Working Days of This Month is {workingDays}
            </Text>
            <View style={{ marginVertical: responsiveHeight(2) }}>
              <CustomTextInput
                title={'CL This Month'}
                placeholder={'CL This Month'}
                value={editTeacher?.clThisMonth?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      clThisMonth: parseInt(e),
                      workingDays:
                        workingDays -
                        parseInt(e) -
                        (editTeacher.olThisMonth ? editTeacher.olThisMonth : 0),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      clThisMonth: '',
                      workingDays:
                        workingDays -
                        (editTeacher.olThisMonth ? editTeacher.olThisMonth : 0),
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'CL This Year'}
                placeholder={'CL This Year'}
                value={editTeacher?.clThisYear?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      clThisYear: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      clThisYear: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Other Leave This Month'}
                placeholder={'Other Leave This Month'}
                value={editTeacher?.olThisMonth?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const leave =
                      workingDays -
                      parseInt(e) -
                      (editTeacher.clThisMonth ? editTeacher.clThisMonth : 0);
                    if (leave >= 0) {
                      setEditTeacher({
                        ...editTeacher,
                        olThisMonth: parseInt(e),
                        workingDays: leave,
                      });
                    } else {
                      setEditTeacher({
                        ...editTeacher,
                        olThisMonth: parseInt(e),
                        workingDays: 0,
                      });
                    }
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      olThisMonth: '',
                      workingDays:
                        workingDays -
                        (editTeacher.clThisMonth ? editTeacher.clThisMonth : 0),
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Other Leave This Year'}
                placeholder={'Other Leave This Year'}
                value={editTeacher?.olThisYear?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      olThisYear: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      olThisYear: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Full Pay'}
                placeholder={'Full Pay'}
                value={editTeacher?.fullPay?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      fullPay: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      fullPay: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Half Pay'}
                placeholder={'Half Pay'}
                value={editTeacher?.halfPay?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      halfPay: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      halfPay: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Without Pay'}
                placeholder={'Without Pay'}
                value={editTeacher?.WOPay?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      WOPay: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      WOPay: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Working Days'}
                placeholder={'Working Days'}
                value={editTeacher?.workingDays?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      workingDays: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      workingDays: '',
                    });
                  }
                }}
              />
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
                  title={'Save'}
                  color={'green'}
                  size={'xsmall'}
                  onClick={() => {
                    const updatedArray = filteredData
                      .map(t => (t.id === editTeacher?.id ? editTeacher : t))
                      .sort((a, b) => a.rank - b.rank);
                    setFilteredData(updatedArray);
                    setEditTeacher({
                      cast: '',
                      tname: '',
                      training: '',
                      education: '',
                      dor: '',
                      desig: '',
                      rank: '',
                      dojnow: '',
                      dob: '',
                      id: '',
                      doj: '',
                      clThisMonth: '',
                      clThisYear: '',
                      olThisMonth: '',
                      olThisYear: '',
                      fullPay: '',
                      halfPay: '',
                      WOPay: '',
                      workingDays: workingDays,
                    });
                    setShowEditForm(false);
                  }}
                />
                <CustomButton
                  title={'Close'}
                  color={'red'}
                  size={'xsmall'}
                  onClick={() => {
                    setShowEditForm(false);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        )}
        {showDownload && (
          <ScrollView>
            <Text style={styles.title}>Download Report</Text>
            <View style={{ marginVertical: responsiveHeight(2) }}>
              {yearArray.length > 0 && (
                <View style={styles.dataView}>
                  <Text selectable style={styles.bankDataText}>
                    Please Select Any Year
                  </Text>
                </View>
              )}
              <View
                style={{
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginHorizontal: responsiveWidth(1),
                  marginVertical: responsiveHeight(1),
                  flexWrap: 'wrap',
                  width: responsiveWidth(95),
                }}
              >
                {yearArray.length > 0 &&
                  yearArray.map((year, index) => (
                    <View
                      key={index}
                      style={{
                        marginHorizontal: responsiveWidth(1),
                        marginVertical: responsiveHeight(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: responsiveWidth(3),
                        padding: responsiveWidth(0.5),
                      }}
                    >
                      <CustomButton
                        title={year}
                        size={'xsmall'}
                        color={selectedYear === year ? 'green' : null}
                        fontColor={selectedYear === year ? 'seashell' : null}
                        onClick={() => handleChange(year)}
                      />
                      <View
                        key={index}
                        style={{
                          marginHorizontal: responsiveWidth(0.5),
                          marginVertical: responsiveHeight(0.5),
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          borderRadius: responsiveWidth(3),
                          backgroundColor: 'lightgoldenrodyellow',
                          padding: responsiveWidth(0.5),
                        }}
                      >
                        <Text
                          style={{
                            color: 'magenta',
                            fontSize: responsiveFontSize(1.3),
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}
                        >
                          {new Date().getFullYear() - parseInt(year) > 1
                            ? new Date().getFullYear() -
                              parseInt(year) +
                              ' Years'
                            : new Date().getFullYear() - parseInt(year) === 1
                            ? new Date().getFullYear() -
                              parseInt(year) +
                              ' Year'
                            : 'This Year'}
                        </Text>
                        <Text
                          style={{
                            color: 'blue',
                            fontSize: responsiveFontSize(1.3),
                            alignSelf: 'center',
                            textAlign: 'center',
                            marginTop: responsiveHeight(0.1),
                          }}
                        >
                          {getArrayLength(year) +
                            `${
                              getArrayLength(year) > 1 ? ' Entries' : ' Entry'
                            }`}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
              {selectedYear && showMonthSelection ? (
                <View>
                  {entryMonths.length > 0 && (
                    <Text selectable style={styles.bankDataText}>
                      Filter By Month
                    </Text>
                  )}
                </View>
              ) : null}
              {showMonthSelection && (
                <View
                  style={{
                    marginHorizontal: responsiveWidth(1),
                    marginVertical: responsiveHeight(1),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: responsiveWidth(3),
                    backgroundColor: 'lightgoldenrodyellow',
                    padding: responsiveWidth(0.5),
                  }}
                >
                  {entryMonths.length > 0 && (
                    <View
                      style={{
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        margin: responsiveWidth(1),
                        flexWrap: 'wrap',
                        width: responsiveWidth(95),
                      }}
                    >
                      {entryMonths.map((month, index) => (
                        <View
                          key={index}
                          style={{
                            marginHorizontal: responsiveWidth(0.5),
                            marginVertical: responsiveHeight(0.5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: responsiveWidth(3),
                            backgroundColor: 'lightgoldenrodyellow',
                            padding: responsiveWidth(0.5),
                            flexDirection: 'column',
                          }}
                        >
                          <CustomButton
                            title={month.monthName}
                            size={'xsmall'}
                            color={
                              month.monthName === monthText
                                ? 'mediumspringgreen'
                                : null
                            }
                            fontColor={
                              month.monthName === monthText ? 'indigo' : null
                            }
                            fontSize={responsiveFontSize(1.3)}
                            onClick={() => handleMonthChange(month)}
                          />
                          <Text
                            style={{
                              color: 'magenta',
                              fontSize: responsiveFontSize(1.3),
                              alignSelf: 'center',
                              textAlign: 'center',
                            }}
                          >
                            {moreFilteredEntry.filter(
                              m => m.month === month.monthName,
                            ).length +
                              ` ${
                                moreFilteredEntry.filter(
                                  m => m.month === month.monthName,
                                ).length > 1
                                  ? ' Entries'
                                  : ' Entry'
                              }`}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {showDownloadBtn && (
                    <View>
                      <CustomButton
                        title={`Download ${selectedReturnMonth} ${selectedReturnYear} PDF`}
                        onClick={async () => {
                          await Linking.openURL(
                            `${WEBSITE}/downloadTeachersReturn?data=${selectedThisMonthReturnData}`,
                          );
                          setShowDownloadBtn(false);
                          setShowMonthSelection(false);
                          setShowDownload(false);
                        }}
                      />

                      <CustomButton
                        title={'Close'}
                        color={'red'}
                        size={'xsmall'}
                        onClick={() => setShowDownload(false)}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        )}
        {showEditStudentData && (
          <ScrollView style={{ marginVertical: 10 }}>
            <Text style={styles.title}>
              Edit Classwise Student&#8217;s Data
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(100, 240, 245,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Total Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.total?.Boys !== undefined &&
                  students?.total?.Boys !== null
                    ? students?.total?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.total?.Girls !== undefined &&
                  students?.total?.Girls !== null
                    ? students?.total?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.total?.Total !== undefined &&
                  students?.total?.Total !== null
                    ? students?.total?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.total?.GeneralBoys !== undefined &&
                  students?.total?.GeneralBoys !== null
                    ? students?.total?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.total?.Girls !== undefined &&
                  students?.total?.Girls !== null
                    ? students?.total?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.total?.GeneralTotal !== undefined &&
                  students?.total?.GeneralTotal !== null
                    ? students?.total?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.total?.ScBoys !== undefined &&
                  students?.total?.ScBoys !== null
                    ? students?.total?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.total?.ScGirls !== undefined &&
                  students?.total?.ScGirls !== null
                    ? students?.total?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.total?.ScTotal !== undefined &&
                  students?.total?.ScTotal !== null
                    ? students?.total?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.total?.StBoys !== undefined &&
                  students?.total?.StBoys !== null
                    ? students?.total?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.total?.StGirls !== undefined &&
                  students?.total?.StGirls !== null
                    ? students?.total?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.total?.StTotal !== undefined &&
                  students?.total?.StTotal !== null
                    ? students?.total?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.total?.ObcABoys !== undefined &&
                  students?.total?.ObcABoys !== null
                    ? students?.total?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.total?.ObcAGirls !== undefined &&
                  students?.total?.ObcAGirls !== null
                    ? students?.total?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.total?.ObcATotal !== undefined &&
                  students?.total?.ObcATotal !== null
                    ? students?.total?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.total?.ObcBBoys !== undefined &&
                  students?.total?.ObcBBoys !== null
                    ? students?.total?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.total?.ObcBGirls !== undefined &&
                  students?.total?.ObcBGirls !== null
                    ? students?.total?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.total?.ObcBTotal !== undefined &&
                  students?.total?.ObcBTotal !== null
                    ? students?.total?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.total?.MinorityBoys !== undefined &&
                  students?.total?.MinorityBoys !== null
                    ? students?.total?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.total?.MinorityGirls !== undefined &&
                  students?.total?.MinorityGirls !== null
                    ? students?.total?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.total?.MinorityTotal !== undefined &&
                  students?.total?.MinorityTotal !== null
                    ? students?.total?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.total?.lastYearBoys !== undefined &&
                  students?.total?.lastYearBoys !== null
                    ? students?.total?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.total?.lastYearTotal !== undefined &&
                  students?.total?.lastYearTotal !== null
                    ? students?.total?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.total?.lastYearTotal !== undefined &&
                  students?.total?.lastYearTotal !== null
                    ? students?.total?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.total,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'rgba(99, 114, 242,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Pre Primary Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.Boys !== undefined &&
                  students?.pp?.Boys !== null
                    ? students?.pp?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.Girls !== undefined &&
                  students?.pp?.Girls !== null
                    ? students?.pp?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.pp?.Total !== undefined &&
                  students?.pp?.Total !== null
                    ? students?.pp?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.Total,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.GeneralBoys !== undefined &&
                  students?.pp?.GeneralBoys !== null
                    ? students?.pp?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.Girls !== undefined &&
                  students?.pp?.Girls !== null
                    ? students?.pp?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.pp?.GeneralTotal !== undefined &&
                  students?.pp?.GeneralTotal !== null
                    ? students?.pp?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.ScBoys !== undefined &&
                  students?.pp?.ScBoys !== null
                    ? students?.pp?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.ScGirls !== undefined &&
                  students?.pp?.ScGirls !== null
                    ? students?.pp?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.pp?.ScTotal !== undefined &&
                  students?.pp?.ScTotal !== null
                    ? students?.pp?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.StBoys !== undefined &&
                  students?.pp?.StBoys !== null
                    ? students?.pp?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.StGirls !== undefined &&
                  students?.pp?.StGirls !== null
                    ? students?.pp?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.pp?.StTotal !== undefined &&
                  students?.pp?.StTotal !== null
                    ? students?.pp?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.ObcABoys !== undefined &&
                  students?.pp?.ObcABoys !== null
                    ? students?.pp?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.ObcAGirls !== undefined &&
                  students?.pp?.ObcAGirls !== null
                    ? students?.pp?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.pp?.ObcATotal !== undefined &&
                  students?.pp?.ObcATotal !== null
                    ? students?.pp?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.ObcBBoys !== undefined &&
                  students?.pp?.ObcBBoys !== null
                    ? students?.pp?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.ObcBGirls !== undefined &&
                  students?.pp?.ObcBGirls !== null
                    ? students?.pp?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.pp?.ObcBTotal !== undefined &&
                  students?.pp?.ObcBTotal !== null
                    ? students?.pp?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.MinorityBoys !== undefined &&
                  students?.pp?.MinorityBoys !== null
                    ? students?.pp?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.pp?.MinorityGirls !== undefined &&
                  students?.pp?.MinorityGirls !== null
                    ? students?.pp?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.pp?.MinorityTotal !== undefined &&
                  students?.pp?.MinorityTotal !== null
                    ? students?.pp?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.pp?.lastYearBoys !== undefined &&
                  students?.pp?.lastYearBoys !== null
                    ? students?.pp?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.pp?.lastYearTotal !== undefined &&
                  students?.pp?.lastYearTotal !== null
                    ? students?.pp?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.pp?.lastYearTotal !== undefined &&
                  students?.pp?.lastYearTotal !== null
                    ? students?.pp?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.pp,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'rgba(187, 101, 252,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Class I Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.i?.Boys !== undefined && students?.i?.Boys !== null
                    ? students?.i?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.i?.Girls !== undefined &&
                  students?.i?.Girls !== null
                    ? students?.i?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.i?.Total !== undefined &&
                  students?.i?.Total !== null
                    ? students?.i?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.i?.GeneralBoys !== undefined &&
                  students?.i?.GeneralBoys !== null
                    ? students?.i?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.i?.Girls !== undefined &&
                  students?.i?.Girls !== null
                    ? students?.i?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.i?.GeneralTotal !== undefined &&
                  students?.i?.GeneralTotal !== null
                    ? students?.i?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.i?.ScBoys !== undefined &&
                  students?.i?.ScBoys !== null
                    ? students?.i?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.i?.ScGirls !== undefined &&
                  students?.i?.ScGirls !== null
                    ? students?.i?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.i?.ScTotal !== undefined &&
                  students?.i?.ScTotal !== null
                    ? students?.i?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.i?.StBoys !== undefined &&
                  students?.i?.StBoys !== null
                    ? students?.i?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.i?.StGirls !== undefined &&
                  students?.i?.StGirls !== null
                    ? students?.i?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.i?.StTotal !== undefined &&
                  students?.i?.StTotal !== null
                    ? students?.i?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.i?.ObcABoys !== undefined &&
                  students?.i?.ObcABoys !== null
                    ? students?.i?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.i?.ObcAGirls !== undefined &&
                  students?.i?.ObcAGirls !== null
                    ? students?.i?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.i?.ObcATotal !== undefined &&
                  students?.i?.ObcATotal !== null
                    ? students?.i?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.i?.ObcBBoys !== undefined &&
                  students?.i?.ObcBBoys !== null
                    ? students?.i?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.i?.ObcBGirls !== undefined &&
                  students?.i?.ObcBGirls !== null
                    ? students?.i?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.i?.ObcBTotal !== undefined &&
                  students?.i?.ObcBTotal !== null
                    ? students?.i?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.i?.MinorityBoys !== undefined &&
                  students?.i?.MinorityBoys !== null
                    ? students?.i?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.i?.MinorityGirls !== undefined &&
                  students?.i?.MinorityGirls !== null
                    ? students?.i?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.i?.MinorityTotal !== undefined &&
                  students?.i?.MinorityTotal !== null
                    ? students?.i?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.i?.lastYearBoys !== undefined &&
                  students?.i?.lastYearBoys !== null
                    ? students?.i?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.i?.lastYearTotal !== undefined &&
                  students?.i?.lastYearTotal !== null
                    ? students?.i?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.i?.lastYearTotal !== undefined &&
                  students?.i?.lastYearTotal !== null
                    ? students?.i?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.i,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'rgba(252, 249, 101,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Class II Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.Boys !== undefined &&
                  students?.ii?.Boys !== null
                    ? students?.ii?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.Girls !== undefined &&
                  students?.ii?.Girls !== null
                    ? students?.ii?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.ii?.Total !== undefined &&
                  students?.ii?.Total !== null
                    ? students?.ii?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.GeneralBoys !== undefined &&
                  students?.ii?.GeneralBoys !== null
                    ? students?.ii?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.Girls !== undefined &&
                  students?.ii?.Girls !== null
                    ? students?.ii?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.ii?.GeneralTotal !== undefined &&
                  students?.ii?.GeneralTotal !== null
                    ? students?.ii?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.ScBoys !== undefined &&
                  students?.ii?.ScBoys !== null
                    ? students?.ii?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.ScGirls !== undefined &&
                  students?.ii?.ScGirls !== null
                    ? students?.ii?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.ii?.ScTotal !== undefined &&
                  students?.ii?.ScTotal !== null
                    ? students?.ii?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.StBoys !== undefined &&
                  students?.ii?.StBoys !== null
                    ? students?.ii?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.StGirls !== undefined &&
                  students?.ii?.StGirls !== null
                    ? students?.ii?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.ii?.StTotal !== undefined &&
                  students?.ii?.StTotal !== null
                    ? students?.ii?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.ObcABoys !== undefined &&
                  students?.ii?.ObcABoys !== null
                    ? students?.ii?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.ObcAGirls !== undefined &&
                  students?.ii?.ObcAGirls !== null
                    ? students?.ii?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.ii?.ObcATotal !== undefined &&
                  students?.ii?.ObcATotal !== null
                    ? students?.ii?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.ObcBBoys !== undefined &&
                  students?.ii?.ObcBBoys !== null
                    ? students?.ii?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.ObcBGirls !== undefined &&
                  students?.ii?.ObcBGirls !== null
                    ? students?.ii?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.ii?.ObcBTotal !== undefined &&
                  students?.ii?.ObcBTotal !== null
                    ? students?.ii?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.MinorityBoys !== undefined &&
                  students?.ii?.MinorityBoys !== null
                    ? students?.ii?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.ii?.MinorityGirls !== undefined &&
                  students?.ii?.MinorityGirls !== null
                    ? students?.ii?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.ii?.MinorityTotal !== undefined &&
                  students?.ii?.MinorityTotal !== null
                    ? students?.ii?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.ii?.lastYearBoys !== undefined &&
                  students?.ii?.lastYearBoys !== null
                    ? students?.ii?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.ii?.lastYearTotal !== undefined &&
                  students?.ii?.lastYearTotal !== null
                    ? students?.ii?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.ii?.lastYearTotal !== undefined &&
                  students?.ii?.lastYearTotal !== null
                    ? students?.ii?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.ii,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'rgba(111, 247, 87,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Class III Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.Boys !== undefined &&
                  students?.iii?.Boys !== null
                    ? students?.iii?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.Girls !== undefined &&
                  students?.iii?.Girls !== null
                    ? students?.iii?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.iii?.Total !== undefined &&
                  students?.iii?.Total !== null
                    ? students?.iii?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.GeneralBoys !== undefined &&
                  students?.iii?.GeneralBoys !== null
                    ? students?.iii?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.Girls !== undefined &&
                  students?.iii?.Girls !== null
                    ? students?.iii?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.iii?.GeneralTotal !== undefined &&
                  students?.iii?.GeneralTotal !== null
                    ? students?.iii?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.ScBoys !== undefined &&
                  students?.iii?.ScBoys !== null
                    ? students?.iii?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.ScGirls !== undefined &&
                  students?.iii?.ScGirls !== null
                    ? students?.iii?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.iii?.ScTotal !== undefined &&
                  students?.iii?.ScTotal !== null
                    ? students?.iii?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.StBoys !== undefined &&
                  students?.iii?.StBoys !== null
                    ? students?.iii?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.StGirls !== undefined &&
                  students?.iii?.StGirls !== null
                    ? students?.iii?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.iii?.StTotal !== undefined &&
                  students?.iii?.StTotal !== null
                    ? students?.iii?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.ObcABoys !== undefined &&
                  students?.iii?.ObcABoys !== null
                    ? students?.iii?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.ObcAGirls !== undefined &&
                  students?.iii?.ObcAGirls !== null
                    ? students?.iii?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.iii?.ObcATotal !== undefined &&
                  students?.iii?.ObcATotal !== null
                    ? students?.iii?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.ObcBBoys !== undefined &&
                  students?.iii?.ObcBBoys !== null
                    ? students?.iii?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.ObcBGirls !== undefined &&
                  students?.iii?.ObcBGirls !== null
                    ? students?.iii?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.iii?.ObcBTotal !== undefined &&
                  students?.iii?.ObcBTotal !== null
                    ? students?.iii?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.MinorityBoys !== undefined &&
                  students?.iii?.MinorityBoys !== null
                    ? students?.iii?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.iii?.MinorityGirls !== undefined &&
                  students?.iii?.MinorityGirls !== null
                    ? students?.iii?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.iii?.MinorityTotal !== undefined &&
                  students?.iii?.MinorityTotal !== null
                    ? students?.iii?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.iii?.lastYearBoys !== undefined &&
                  students?.iii?.lastYearBoys !== null
                    ? students?.iii?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.iii?.lastYearTotal !== undefined &&
                  students?.iii?.lastYearTotal !== null
                    ? students?.iii?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.iii?.lastYearTotal !== undefined &&
                  students?.iii?.lastYearTotal !== null
                    ? students?.iii?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iii,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'rgba(252, 78, 78,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Class IV Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.Boys !== undefined &&
                  students?.iv?.Boys !== null
                    ? students?.iv?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.Girls !== undefined &&
                  students?.iv?.Girls !== null
                    ? students?.iv?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.iv?.Total !== undefined &&
                  students?.iv?.Total !== null
                    ? students?.iv?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.GeneralBoys !== undefined &&
                  students?.iv?.GeneralBoys !== null
                    ? students?.iv?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.Girls !== undefined &&
                  students?.iv?.Girls !== null
                    ? students?.iv?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.iv?.GeneralTotal !== undefined &&
                  students?.iv?.GeneralTotal !== null
                    ? students?.iv?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.ScBoys !== undefined &&
                  students?.iv?.ScBoys !== null
                    ? students?.iv?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.ScGirls !== undefined &&
                  students?.iv?.ScGirls !== null
                    ? students?.iv?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.iv?.ScTotal !== undefined &&
                  students?.iv?.ScTotal !== null
                    ? students?.iv?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.StBoys !== undefined &&
                  students?.iv?.StBoys !== null
                    ? students?.iv?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.StGirls !== undefined &&
                  students?.iv?.StGirls !== null
                    ? students?.iv?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.iv?.StTotal !== undefined &&
                  students?.iv?.StTotal !== null
                    ? students?.iv?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.ObcABoys !== undefined &&
                  students?.iv?.ObcABoys !== null
                    ? students?.iv?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.ObcAGirls !== undefined &&
                  students?.iv?.ObcAGirls !== null
                    ? students?.iv?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.iv?.ObcATotal !== undefined &&
                  students?.iv?.ObcATotal !== null
                    ? students?.iv?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.ObcBBoys !== undefined &&
                  students?.iv?.ObcBBoys !== null
                    ? students?.iv?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.ObcBGirls !== undefined &&
                  students?.iv?.ObcBGirls !== null
                    ? students?.iv?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.iv?.ObcBTotal !== undefined &&
                  students?.iv?.ObcBTotal !== null
                    ? students?.iv?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.MinorityBoys !== undefined &&
                  students?.iv?.MinorityBoys !== null
                    ? students?.iv?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.iv?.MinorityGirls !== undefined &&
                  students?.iv?.MinorityGirls !== null
                    ? students?.iv?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.iv?.MinorityTotal !== undefined &&
                  students?.iv?.MinorityTotal !== null
                    ? students?.iv?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.iv?.lastYearBoys !== undefined &&
                  students?.iv?.lastYearBoys !== null
                    ? students?.iv?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.iv?.lastYearTotal !== undefined &&
                  students?.iv?.lastYearTotal !== null
                    ? students?.iv?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.iv?.lastYearTotal !== undefined &&
                  students?.iv?.lastYearTotal !== null
                    ? students?.iv?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.iv,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'rgba(255, 136, 0,.2)',
                width: responsiveWidth(90),
                padding: responsiveWidth(2),
                borderRadius: responsiveWidth(2),
                marginVertical: responsiveHeight(1),
              }}
            >
              <Text
                style={[
                  styles.bankDataText,
                  { marginVertical: responsiveHeight(1) },
                ]}
              >
                Class V Students Section
              </Text>
              <CustomTextInput
                title={'Total Boys'}
                placeholder={'Total Boys'}
                type={'number-pad'}
                value={
                  students?.v?.Boys !== undefined && students?.v?.Boys !== null
                    ? students?.v?.Boys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      Boys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Girls'}
                placeholder={'Total Girls'}
                type={'number-pad'}
                value={
                  students?.v?.Girls !== undefined &&
                  students?.v?.Girls !== null
                    ? students?.v?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Total Students'}
                placeholder={'Total Students'}
                type={'number-pad'}
                value={
                  students?.v?.Total !== undefined &&
                  students?.v?.Total !== null
                    ? students?.v?.Total?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      Total: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Boys'}
                placeholder={'General Boys'}
                type={'number-pad'}
                value={
                  students?.v?.GeneralBoys !== undefined &&
                  students?.v?.GeneralBoys !== null
                    ? students?.v?.GeneralBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      GeneralBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Girls'}
                placeholder={'General Girls'}
                type={'number-pad'}
                value={
                  students?.v?.Girls !== undefined &&
                  students?.v?.Girls !== null
                    ? students?.v?.Girls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      Girls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'General Total'}
                placeholder={'General Total'}
                type={'number-pad'}
                value={
                  students?.v?.GeneralTotal !== undefined &&
                  students?.v?.GeneralTotal !== null
                    ? students?.v?.GeneralTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      GeneralTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Boys'}
                placeholder={'SC Boys'}
                type={'number-pad'}
                value={
                  students?.v?.ScBoys !== undefined &&
                  students?.v?.ScBoys !== null
                    ? students?.v?.ScBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ScBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Girls'}
                placeholder={'SC Girls'}
                type={'number-pad'}
                value={
                  students?.v?.ScGirls !== undefined &&
                  students?.v?.ScGirls !== null
                    ? students?.v?.ScGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ScGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'SC Total'}
                placeholder={'SC Total'}
                type={'number-pad'}
                value={
                  students?.v?.ScTotal !== undefined &&
                  students?.v?.ScTotal !== null
                    ? students?.v?.ScTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ScTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Boys'}
                placeholder={'ST Boys'}
                type={'number-pad'}
                value={
                  students?.v?.StBoys !== undefined &&
                  students?.v?.StBoys !== null
                    ? students?.v?.StBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      StBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Girls'}
                placeholder={'ST Girls'}
                type={'number-pad'}
                value={
                  students?.v?.StGirls !== undefined &&
                  students?.v?.StGirls !== null
                    ? students?.v?.StGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      StGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'ST Total'}
                placeholder={'ST Total'}
                type={'number-pad'}
                value={
                  students?.v?.StTotal !== undefined &&
                  students?.v?.StTotal !== null
                    ? students?.v?.StTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      StTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Boys'}
                type={'number-pad'}
                value={
                  students?.v?.ObcABoys !== undefined &&
                  students?.v?.ObcABoys !== null
                    ? students?.v?.ObcABoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ObcABoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Boys'}
                placeholder={'Obc A Girls'}
                type={'number-pad'}
                value={
                  students?.v?.ObcAGirls !== undefined &&
                  students?.v?.ObcAGirls !== null
                    ? students?.v?.ObcAGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ObcAGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc A Total'}
                placeholder={'Obc A Total'}
                type={'number-pad'}
                value={
                  students?.v?.ObcATotal !== undefined &&
                  students?.v?.ObcATotal !== null
                    ? students?.v?.ObcATotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ObcATotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Boys'}
                placeholder={'Obc B Boys'}
                type={'number-pad'}
                value={
                  students?.v?.ObcBBoys !== undefined &&
                  students?.v?.ObcBBoys !== null
                    ? students?.v?.ObcBBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ObcBBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Girls'}
                placeholder={'Obc B Girls'}
                type={'number-pad'}
                value={
                  students?.v?.ObcBGirls !== undefined &&
                  students?.v?.ObcBGirls !== null
                    ? students?.v?.ObcBGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ObcBGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Obc B Total'}
                placeholder={'Obc B Total'}
                type={'number-pad'}
                value={
                  students?.v?.ObcBTotal !== undefined &&
                  students?.v?.ObcBTotal !== null
                    ? students?.v?.ObcBTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      ObcBTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Boys'}
                placeholder={'Minority Boys'}
                type={'number-pad'}
                value={
                  students?.v?.MinorityBoys !== undefined &&
                  students?.v?.MinorityBoys !== null
                    ? students?.v?.MinorityBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      MinorityBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Girls'}
                placeholder={'Minority Girls'}
                type={'number-pad'}
                value={
                  students?.v?.MinorityGirls !== undefined &&
                  students?.v?.MinorityGirls !== null
                    ? students?.v?.MinorityGirls?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      MinorityGirls: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Minority Total'}
                placeholder={'Minority Total'}
                type={'number-pad'}
                value={
                  students?.v?.MinorityTotal !== undefined &&
                  students?.v?.MinorityTotal !== null
                    ? students?.v?.MinorityTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      MinorityTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Boys'}
                placeholder={'Last Year Boys'}
                type={'number-pad'}
                value={
                  students?.v?.lastYearBoys !== undefined &&
                  students?.v?.lastYearBoys !== null
                    ? students?.v?.lastYearBoys?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      lastYearBoys: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.v?.lastYearTotal !== undefined &&
                  students?.v?.lastYearTotal !== null
                    ? students?.v?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
              <CustomTextInput
                title={'Last Year Total'}
                placeholder={'Last Year Total'}
                type={'number-pad'}
                value={
                  students?.v?.lastYearTotal !== undefined &&
                  students?.v?.lastYearTotal !== null
                    ? students?.v?.lastYearTotal?.toString()
                    : ''
                }
                onChangeText={value => {
                  setStudents({
                    ...students,
                    total: {
                      ...students?.v,
                      lastYearTotal: value === '' ? null : parseInt(value, 10),
                    },
                  });
                }}
              />
            </View>
            <CustomButton
              title={'Save'}
              onClick={() => {
                setShowEditStudentData(false);
              }}
              color={'green'}
            />
          </ScrollView>
        )}
      </ScrollView>
      {<Loader visible={loader} />}
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
});
