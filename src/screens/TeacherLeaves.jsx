import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
  Linking,
  FlatList,
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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { showToast } from '../modules/Toaster';
import {
  monthNamesWithIndex,
  todayInString,
  uniqArray,
  sortMonthwise,
  months,
  DDMMYYYYtoNewDate,
} from '../modules/calculatefunctions';
import {
  deleteDocument,
  firestore,
  getCollection,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker';
import ReactNativeModal from 'react-native-modal';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import { deleteDoc, doc, setDoc } from '@react-native-firebase/firestore';
export default function TeacherLeaves() {
  const {
    state,
    teacherLeaveState,
    setTeacherLeaveState,
    leaveDateState,
    setLeaveDateState,
    setActiveTab,
  } = useGlobalContext();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const access = state?.ACCESS;
  const isHT = state.USER.desig === 'HT' ? true : false;

  const docId = uuid.v4().split('-')[0].substring(0, 6);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [yearArray, setYearArray] = useState([]);
  const [allEnry, setAllEnry] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredEntry, setFilteredEntry] = useState([]);
  const [entryMonths, setEntryMonths] = useState('');
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const leavesArray = [
    {
      desig: 'HT',
      rank: 1,
      clThisYear: 0,
      tname: 'SK MAIDUL ISLAM',
      id: 'teachers381',
      clThisMonth: 0,
      olThisMonth: 0,
      olThisYear: 0,
    },
    {
      id: 'teachers382',
      clThisMonth: 0,
      olThisMonth: 0,
      olThisYear: 0,
      desig: 'AT',
      rank: 2,
      clThisYear: 0,
      tname: 'MALLIKA GAYEN',
    },
    {
      id: 'teachers383',
      tname: 'SURASHREE SADHUKHAN SAHA',
      olThisMonth: 0,
      olThisYear: 0,
      desig: 'AT',
      rank: 3,
      clThisYear: 0,
      clThisMonth: 0,
    },
    {
      rank: 4,
      olThisMonth: 0,
      olThisYear: 0,
      clThisYear: 0,
      id: 'teachers384',
      clThisMonth: 0,
      tname: 'ABDUS SALAM MOLLICK',
      desig: 'AT',
    },
  ];
  const [addData, setAddData] = useState({
    id: 'January-2025',
    month: 'January',
    year: 2025,
    leaves: leavesArray,
  });
  const [date, setDate] = useState(new Date());
  const [techLeaves, setTechLeaves] = useState(leavesArray);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [addLeaveDateData, setAddLeaveDateData] = useState({
    id: docId,
    techID: '',
    month: '',
    year: '',
    leaveType: '',
    date: todayInString(),
    sl: '',
  });
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [showCLAdd, setShowCLAdd] = useState(false);
  const [showClDel, setShowClDel] = useState(false);
  const [clDelObj, setClDelObj] = useState({
    id: '',
    value: '',
    field: '',
    tname: '',
    cl: [],
  });
  const [olDelObj, setOlDelObj] = useState({
    id: '',
    value: '',
    field: '',
    tname: '',
    ol: [],
  });

  const [selectedDelDate, setSelectedDelDate] = useState('');
  const [clDelId, setClDelId] = useState('');
  const [showOlAdd, setShowOlAdd] = useState(false);
  const [showOlDel, setShowOlDel] = useState(false);
  const [olDelId, setOlDelId] = useState('');

  const [editLeaveDateObj, setEditLeaveDateObj] = useState({
    year: 2025,
    techID: '',
    leaveType: '',
    id: '',
    month: '',
    sl: '',
    date: `01-01-2025`,
  });
  const [showEditLeaveDateData, setShowEditLeaveDateData] = useState(false);
  const [showData, setShowData] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const currentDate = new Date();
  const monthName =
    monthNamesWithIndex[
      currentDate.getDate() > 10
        ? currentDate.getMonth()
        : currentDate.getMonth() === 0
        ? 11
        : currentDate.getMonth() - 1
    ].monthName;
  const yearName = currentDate.getFullYear();
  const getMonth = () => {
    return `${month.toUpperCase()} of ${year}`;
  };
  const [dob, setDob] = useState(new Date());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);
  const calculateDate = (event, selectedDate) => {
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
    setAddLeaveDateData({ ...addLeaveDateData, date: tarikh });
    setFontColor('black');
  };
  const calculateEditDate = (event, selectedDate) => {
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
    setEditLeaveDateObj({ ...editLeaveDateObj, date: tarikh });
    setFontColor('black');
  };
  const handleChange = year => {
    const selectedValue = year;
    let x = [];
    let y = [];
    let cl1 = 0;
    let cl2 = 0;
    let cl3 = 0;
    let cl4 = 0;
    let ol1 = 0;
    let ol2 = 0;
    let ol3 = 0;
    let ol4 = 0;
    let t = leavesArray;
    allEnry.map(entry => {
      const entryYear = entry.id.split('-')[1];
      const entryMonth = entry.id.split('-')[0];

      if (entryYear == selectedValue) {
        x.push(entry);
        y.push(entryMonth);
        entry.leaves.map(el => {
          if (el.rank === 1) {
            cl1 += el.clThisMonth;
            ol1 += el.olThisMonth;
          } else if (el.rank === 2) {
            cl2 += el.clThisMonth;
            ol2 += el.olThisMonth;
          } else if (el.rank === 3) {
            cl3 += el.clThisMonth;
            ol3 += el.olThisMonth;
          } else {
            cl4 += el.clThisMonth;
            ol4 += el.olThisMonth;
          }
        });

        t[0].clThisYear = cl1;
        t[0].olThisYear = ol1;
        t[1].clThisYear = cl2;
        t[1].olThisYear = ol2;
        t[2].clThisYear = cl3;
        t[2].olThisYear = ol3;
        t[3].clThisYear = cl4;
        t[3].olThisYear = ol4;
      }
    });
    setTechLeaves(t);
    setSelectedYear(selectedValue);
    setShowMonthSelection(true);
    setFilteredEntry(x);
    setEntryMonths(uniqArray(y));
    const fLDate = leaveDateState.filter(el => el.year === selectedValue);
    setFilteredLeaveData(fLDate);
    setAddLeaveDateData({
      ...addLeaveDateData,
      year: parseInt(selectedValue),
    });
  };
  const handleMonthChange = month => {
    console.log(month);
    let x = [];

    allEnry.map(entry => {
      const entryYear = entry.id.split('-')[1];
      const entryMonth = entry.id.split('-')[0];
      if (entryYear == selectedYear && entryMonth === month) {
        x.push(entry);
        setShowData(true);
        setFilteredData(entry?.leaves);
        const fLDate = leaveDateState.filter(
          el => el.year == selectedYear && el.month == month,
        );
        setFilteredLeaveData(fLDate);
        setAddLeaveDateData({ ...addLeaveDateData, month });
        setMonth(entry?.month);
        setYear(entry?.year);

        return x;
      }
    });
    setFilteredEntry(x);
  };
  const getMonthlyData = async () => {
    setLoader(true);
    await getCollection('teachersLeaves').then(data => {
      const monthwiseSorted = sortMonthwise(data);
      setTeacherLeaveState(monthwiseSorted);
      calledData(monthwiseSorted);
    });
    await getCollection('leaveDates').then(data => {
      const monthwiseSorted2 = sortLeaves(data);
      setLeaveDateState(monthwiseSorted2);
      setFilteredLeaveData(monthwiseSorted2);
      setLoader(false);
    });
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

    setLoader(false);
    setAllEnry(array);
    setFilteredEntry(array);
  };
  const addLeaveData = async () => {
    if (!addData.id || !addData.month || !addData.year) {
      showToast('error', 'Please fill all the fields');
      return;
    }
    setShowAddModal(false);
    setLoader(true);
    try {
      await setDocument('teachersLeaves', addData.id, addData)
        .then(() => {
          setLoader(false);
          setShowAddModal(false);
          setShowData(true);
          showToast('success', 'Teachers Leave Data Added Successfully');
          setTeacherLeaveState(prev => {
            const updatedData = [...prev, addData];
            return sortMonthwise(updatedData);
          });
          calledData(sortMonthwise([...allEnry, addData]));
          setFilteredEntry(prev => {
            const updatedData = [...prev, addData];
            return sortMonthwise(updatedData);
          });
          setEntryMonths(prev => {
            const updatedMonths = uniqArray([...prev, addData.month]).sort(
              (a, b) =>
                monthNamesWithIndex.indexOf(a) - monthNamesWithIndex.indexOf(b),
            );
            return updatedMonths;
          });
        })
        .catch(error => {
          setLoader(false);
          showToast('error', 'Error adding data: ' + error.message);
        });
    } catch (error) {
      setLoader(false);
      showToast('error', 'Error adding data: ' + error.message);
    }
  };
  const updateLeaveData = async (id, value, field, isDecrement = false) => {
    setLoader(true);
    const updatedValue = isDecrement ? value - 1 : value + 1;
    const updatedData = filteredData.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          [field]: updatedValue,
          clThisYear:
            field === 'clThisMonth'
              ? entry.clThisYear + (isDecrement ? -1 : 1)
              : entry.clThisYear,
          olThisYear:
            field === 'olThisMonth'
              ? entry.olThisYear + (isDecrement ? -1 : 1)
              : entry.olThisYear,
        };
      }
      return entry;
    });
    await updateDocument('teachersLeaves', month + '-' + year, {
      leaves: updatedData,
    })
      .then(async () => {
        if (field === 'clThisMonth' && !isDecrement) {
          await setDoc(
            doc(firestore, 'leaveDates', addLeaveDateData.id),
            addLeaveDateData,
          ).then(() => {
            showToast('success', 'Teachers Cl Added Successfully');
            const x = [...leaveDateState, addLeaveDateData];
            const monthwiseSorted = sortLeaves(x);
            setLeaveDateState(monthwiseSorted);
            const y = monthwiseSorted.filter(
              el => el.year == selectedYear && el.month == month,
            );
            setFilteredLeaveData(y);
          });
        } else if (field === 'clThisMonth' && isDecrement) {
          await deleteDoc(doc(firestore, 'leaveDates', clDelId)).then(() => {
            const x = leaveDateState.filter(el => el.id !== clDelId);
            const y = x.filter(
              el => el.year == selectedYear && el.month == month,
            );
            setLeaveDateState(x);
            setFilteredLeaveData(y);
            setSelectedDelDate('');
            setClDelId('');
            showToast('success', 'Teachers Cl Deleted Successfully');
          });
        } else if (field === 'olThisMonth' && !isDecrement) {
          await setDoc(
            doc(firestore, 'leaveDates', addLeaveDateData.id),
            addLeaveDateData,
          ).then(() => {
            showToast('success', 'Teachers Cl Added Successfully');
            const x = [...leaveDateState, addLeaveDateData];
            const monthwiseSorted = sortLeaves(x);
            setLeaveDateState(monthwiseSorted);
            const y = monthwiseSorted.filter(
              el => el.year == selectedYear && el.month == month,
            );
            setFilteredLeaveData(y);
          });
        } else if (field === 'olThisMonth' && isDecrement) {
          await deleteDoc(doc(firestore, 'leaveDates', olDelId)).then(() => {
            const x = leaveDateState.filter(el => el.id !== clDelId);
            const y = x.filter(
              el => el.year == selectedYear && el.month == month,
            );
            setLeaveDateState(x);
            setFilteredLeaveData(y);
            setSelectedDelDate('');
            setOlDelId('');
            showToast('success', 'Teachers Cl Deleted Successfully');
          });
        }
        showToast('success', 'Teachers Leave Data Updated Successfully');
        let x = techLeaves;
        x.map(el => {
          if (el.id === id) {
            field === 'clThisMonth'
              ? (el.clThisYear = isDecrement
                  ? el.clThisYear - 1
                  : el.clThisYear + 1)
              : (el.olThisYear = isDecrement
                  ? el.olThisYear - 1
                  : el.olThisYear + 1);
          }
        });
        setTechLeaves(x);
        setFilteredEntry(updatedData);
        setFilteredData(updatedData);
        setTeacherLeaveState(prev => {
          const updatedNewData = prev.map(entry => {
            if (entry.id === month + '-' + year) {
              return {
                ...entry,
                leaves: updatedData,
              };
            }
            return entry;
          });
          return sortMonthwise(updatedNewData);
        });
        calledData(sortMonthwise(teacherLeaveState));
      })
      .catch(error => {
        showToast('error', 'Error updating data: ' + error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const updateLeaveDate = async () => {
    setLoader(true);
    setShowEditLeaveDateData(false);
    await updateDoc(
      doc(firestore, 'leaveDates', editLeaveDateObj.id),
      editLeaveDateObj,
    )
      .then(() => {
        toast.success('Teachers Leave Date Updated Successfully');
        const x = leaveDateState.filter(el => el.id !== editLeaveDateObj.id);
        const y = [...x, editLeaveDateObj];
        const monthwiseSorted = sortLeaves(y);
        setLeaveDateState(monthwiseSorted);
        const z =
          monthwiseSorted.filter(
            el => el.year == selectedYear && el.month == month,
          ) || [];
        setFilteredLeaveData(z);
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        toast.error('Error updating data: ' + e.message);
      });
  };
  const deleteLeaveDate = async () => {
    setLoader(true);
    setShowEditLeaveDateData(false);
    await deleteDoc(doc(firestore, 'leaveDates', editLeaveDateObj.id))
      .then(() => {
        toast.success('Teachers Leave Date Deleted Successfully');
        const x = leaveDateState.filter(el => el.id !== editLeaveDateObj.id);
        const y = x.filter(
          el =>
            el.year == editLeaveDateObj.year &&
            el.month == editLeaveDateObj.month,
        );
        setLeaveDateState(x);
        setFilteredLeaveData(y);
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        toast.error('Error deleting data: ' + e.message);
      });
  };
  function sortLeaves(leaves) {
    const monthOrder = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    return leaves.sort((a, b) => {
      // 1. Year (descending)
      if (a.year !== b.year) {
        return b.year - a.year;
      }

      // 2. Month (descending)
      if (a.month !== b.month) {
        return monthOrder[b.month] - monthOrder[a.month];
      }

      // 3. Date (descending, extract day from dd-mm-yyyy)
      const dayA = parseInt(a.date.split('-')[0], 10);
      const dayB = parseInt(b.date.split('-')[0], 10);
      if (dayA !== dayB) {
        return dayA - dayB;
      }

      // 4. techID (ascending)
      if (a.techID !== b.techID) {
        return a.techID.localeCompare(b.techID);
      }

      // 5. techID (ascending)
      if (a.leaveType !== b.leaveType) {
        return b.leaveType.localeCompare(a.leaveType);
      }

      // 6. sl (ascending)
      return a.sl - b.sl;
    });
  }
  useEffect(() => {
    if (teacherLeaveState.length === 0) {
      getMonthlyData();
    } else {
      calledData(teacherLeaveState);
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
  useEffect(() => {}, [filteredEntry, techLeaves]);

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={loader} />
      <Text style={styles.title}>Teacher Leaves</Text>

      {isHT && (
        <CustomButton
          title={'Add Month'}
          size={'small'}
          color={'green'}
          fontSize={responsiveFontSize(1.5)}
          onClick={() => {
            setShowAddModal(true);
            setShowData(false);
            setAddData({
              ...addData,
              id: `${monthName}-${yearName}`,
              month: monthName,
              year: yearName,
              leaves: allEnry[allEnry.length - 1]?.leaves.map(el => {
                return {
                  ...el,
                  clThisMonth: 0,
                  olThisMonth: 0,
                };
              }),
            });
            teacherLeaveState.filter(
              item => item.id === `${monthName}-${yearName}`,
            ).length > 0 &&
              showToast('error', 'Data for this month already exists.');
          }}
        />
      )}
      {showAddModal && (
        <ScrollView
          style={{
            marginVertical: responsiveHeight(2),
            backgroundColor: 'white',
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.itemView}>
            <Text style={styles.label}>Month</Text>
            <CustomTextInput
              value={addData.month}
              onChangeText={text => setAddData({ ...addData, month: text })}
              placeholder={'Enter Month'}
              title={'Enter Month'}
            />
            <Text style={styles.label}>Year</Text>
            <CustomTextInput
              value={addData.year.toString()}
              type={'number-pad'}
              onChangeText={text =>
                setAddData({ ...addData, year: text ? text : '' })
              }
              title={'Enter Year'}
              placeholder={'Enter Year'}
            />
            <Text style={styles.label}>ID</Text>
            <CustomTextInput
              value={addData.id}
              onChangeText={text => setAddData({ ...addData, id: text })}
              placeholder={'Enter ID (e.g., January-2025)'}
              title={'Enter ID'}
            />
            <View
              style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}
            >
              <View style={{ marginRight: responsiveWidth(1) }}>
                <CustomButton
                  title={'Add Data'}
                  fontSize={responsiveFontSize(1.8)}
                  color={'green'}
                  size={'medium'}
                  disabled={
                    teacherLeaveState.filter(item => item.id === addData.id)
                      .length > 0
                  }
                  onClick={() => addLeaveData()}
                />
              </View>
              <CustomButton
                title={'Cancel'}
                fontSize={responsiveFontSize(1.8)}
                color={'red'}
                size={'small'}
                onClick={() => setShowAddModal(false)}
              />
            </View>
          </View>
        </ScrollView>
      )}
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}
      >
        <Text style={styles.label}>Select Year</Text>
        {yearArray.map((year, index) => (
          <CustomButton
            key={index}
            title={year}
            size={'xsmall'}
            color={selectedYear == year ? 'green' : 'blue'}
            onClick={() => handleChange(year)}
          />
        ))}
        {selectedYear && showMonthSelection && (
          <View style={{ marginTop: responsiveHeight(2) }}>
            {entryMonths.length > 1 && (
              <Text style={styles.label}>Select Month</Text>
            )}
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: responsiveHeight(1),
            alignSelf: 'center',
          }}
        >
          {showMonthSelection &&
            entryMonths.map((monthy, index) => (
              <CustomButton
                key={index}
                title={monthy}
                size={'small'}
                color={monthy === month ? 'blueviolet' : 'blue'}
                fontSize={responsiveFontSize(1.5)}
                onClick={() => handleMonthChange(monthy)}
              />
            ))}
        </View>
        {showData && (
          <View style={styles.mainView}>
            <Text style={styles.heading}>
              {getMonth()} Teacher Leave Details
            </Text>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => item.id + index}
              renderItem={({ item, index }) => {
                const techLDates = filteredLeaveData.filter(
                  el => el.techID === item.id,
                );
                return (
                  <View style={styles.itemView}>
                    <Text style={styles.label}>{item.tname}</Text>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: responsiveWidth(0.3),
                        flexDirection: 'row',
                      }}
                    >
                      {isHT && (
                        <TouchableOpacity
                          style={{ marginHorizontal: responsiveWidth(2) }}
                          onPress={() => {
                            // updateLeaveData(
                            //   item.id,
                            //   item.clThisMonth,
                            //   "clThisMonth"
                            // );
                            setShowCLAdd(true);
                            setAddLeaveDateData({
                              ...addLeaveDateData,
                              techID: item.id,
                              leaveType: 'CL',
                              sl:
                                techLDates.filter(el => el.leaveType === 'CL')
                                  .length + 1,
                              date:
                                selectedYear == new Date().getFullYear() &&
                                month ===
                                  monthNamesWithIndex[new Date().getMonth()]
                                    .monthName
                                  ? todayInString()
                                  : DDMMYYYYtoNewDate(
                                      `01-${(months.indexOf(month) + 1)
                                        .toString()
                                        .padStart(2, '0')}-${selectedYear}`,
                                    ),
                            });
                            setSelectedTeacher(item.tname);
                            setDob(
                              selectedYear == new Date().getFullYear() &&
                                month ===
                                  monthNamesWithIndex[new Date().getMonth()]
                                    .monthName
                                ? new Date()
                                : DDMMYYYYtoNewDate(
                                    `01-${(months.indexOf(month) + 1)
                                      .toString()
                                      .padStart(2, '0')}-${selectedYear}`,
                                  ),
                            );
                          }}
                        >
                          <FontAwesome6
                            name="circle-plus"
                            size={30}
                            color={'purple'}
                          />
                        </TouchableOpacity>
                      )}
                      <Text style={styles.result}>
                        CL This Month: {item.clThisMonth}
                      </Text>
                      {item.clThisMonth > 0 && isHT && (
                        <TouchableOpacity
                          style={{ marginHorizontal: responsiveWidth(2) }}
                          onPress={() => {
                            // updateLeaveData(
                            //   item.id,
                            //   item.clThisMonth,
                            //   "clThisMonth",
                            //   true
                            // );
                            setShowClDel(true);
                            setClDelObj({
                              id: item.id,
                              value: item.clThisMonth,
                              field: 'clThisMonth',
                              tname: item.tname,
                              cl: techLDates.filter(
                                el => el.leaveType === 'CL',
                              ),
                            });
                          }}
                        >
                          <FontAwesome6
                            name="circle-minus"
                            size={30}
                            color={'purple'}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {techLDates.filter(el => el.leaveType === 'CL').length >
                      0 &&
                      techLDates
                        .filter(el => el.leaveType === 'CL')
                        .map((el, ind) => (
                          <TouchableOpacity
                            onPress={() => {
                              if (isHT) {
                                setEditLeaveDateObj(el);
                                setShowEditLeaveDateData(true);
                                setDate(DDMMYYYYtoNewDate(el.date));
                              }
                            }}
                            key={ind}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingVertical: responsiveWidth(0.3),
                              flexWrap: 'wrap',
                            }}
                          >
                            <Text style={styles.label}>{el.date}</Text>
                          </TouchableOpacity>
                        ))}
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingVertical: responsiveWidth(0.3),
                      }}
                    >
                      {isHT && (
                        <TouchableOpacity
                          style={{ marginHorizontal: responsiveWidth(2) }}
                          onPress={() => {
                            // updateLeaveData(
                            //   item.id,
                            //   item.olThisMonth,
                            //   "olThisMonth"
                            // );
                            setShowOlAdd(true);
                            setAddLeaveDateData({
                              ...addLeaveDateData,
                              techID: item.id,
                              leaveType: 'OL',
                              sl:
                                techLDates.filter(el => el.leaveType === 'OL')
                                  .length + 1,
                              date:
                                selectedYear == new Date().getFullYear() &&
                                month ===
                                  monthNamesWithIndex[new Date().getMonth()]
                                    .monthName
                                  ? todayInString()
                                  : DDMMYYYYtoNewDate(
                                      `01-${(months.indexOf(month) + 1)
                                        .toString()
                                        .padStart(2, '0')}-${selectedYear}`,
                                    ),
                            });
                            setDob(
                              selectedYear == new Date().getFullYear() &&
                                month ===
                                  monthNamesWithIndex[new Date().getMonth()]
                                    .monthName
                                ? new Date()
                                : DDMMYYYYtoNewDate(
                                    `01-${(months.indexOf(month) + 1)
                                      .toString()
                                      .padStart(2, '0')}-${selectedYear}`,
                                  ),
                            );
                            setSelectedTeacher(item.tname);
                          }}
                        >
                          <FontAwesome6
                            name="circle-plus"
                            size={30}
                            color={'purple'}
                          />
                        </TouchableOpacity>
                      )}
                      <Text style={styles.result}>
                        OL This Month: {item.olThisMonth}
                      </Text>

                      {item.olThisMonth > 0 && isHT && (
                        <TouchableOpacity
                          style={{ marginHorizontal: responsiveWidth(2) }}
                          onPress={() => {
                            // updateLeaveData(
                            //   item.id,
                            //   item.olThisMonth,
                            //   "olThisMonth",
                            //   true
                            // )
                            setShowOlDel(true);
                            setOlDelObj({
                              id: item.id,
                              value: item.olThisMonth,
                              field: 'olThisMonth',
                              tname: item.tname,
                              ol: techLDates.filter(
                                el => el.leaveType === 'OL',
                              ),
                            });
                          }}
                        >
                          <FontAwesome6
                            name="circle-minus"
                            size={30}
                            color={'purple'}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {techLDates.filter(el => el.leaveType === 'OL').length >
                      0 &&
                      techLDates
                        .filter(el => el.leaveType === 'OL')
                        .map((el, ind) => (
                          <TouchableOpacity
                            onPress={() => {
                              if (isHT) {
                                setEditLeaveDateObj(el);
                                setShowEditLeaveDateData(true);
                              }
                            }}
                            key={ind}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingVertical: responsiveWidth(0.3),
                              flexWrap: 'wrap',
                            }}
                          >
                            <Text style={styles.label}>{el.date}</Text>
                          </TouchableOpacity>
                        ))}
                    <Text style={styles.result}>
                      CL Till This Month: {item.clThisYear}
                    </Text>

                    <Text style={styles.result}>
                      OL Till This Month: {item.olThisYear}
                    </Text>

                    <Text style={styles.result}>
                      Total CL This Year: {techLeaves[index].clThisYear}
                    </Text>
                    <Text style={styles.result}>
                      Total OL This Year: {techLeaves[index].olThisYear}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        )}

        <ReactNativeModal
          isVisible={showCLAdd}
          onBackButtonPress={() => setShowCLAdd(false)}
          onBackdropPress={() => setShowCLAdd(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text selectable style={styles.title}>
                Add CL{' '}
                {`${addLeaveDateData.sl} of ${addLeaveDateData.month}-${addLeaveDateData.year} of ${selectedTeacher}`}
              </Text>
              <CustomTextInput
                value={addLeaveDateData?.id}
                onChangeText={text =>
                  setAddLeaveDateData({
                    ...addLeaveDateData,
                    id: text,
                  })
                }
                placeholder="ID"
                title={'ID'}
              />
              <CustomTextInput
                value={
                  addLeaveDateData?.sl ? addLeaveDateData?.sl.toString() : ''
                }
                onChangeText={text =>
                  setAddLeaveDateData({
                    ...addLeaveDateData,
                    sl: text ? parseInt(text) : '',
                  })
                }
                placeholder="Sl"
                title={'Sl'}
              />
              <View style={{ marginVertical: responsiveHeight(1) }}>
                <Text style={styles.label}>Select Date</Text>
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
                    onChange={calculateDate}
                  />
                )}
              </View>

              <View
                style={{
                  marginTop: responsiveHeight(3),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <CustomButton
                  title={'Save'}
                  color={'green'}
                  size={'small'}
                  disabled={
                    addLeaveDateData.id === '' ||
                    addLeaveDateData.date === '' ||
                    addLeaveDateData.sl === ''
                  }
                  onClick={() => {
                    updateLeaveData(
                      addLeaveDateData.techID,
                      addLeaveDateData.sl - 1,
                      'clThisMonth',
                      false,
                    );
                    setShowCLAdd(false);
                  }}
                />
                <CustomButton
                  title={'Cancel'}
                  color={'red'}
                  size={'small'}
                  onClick={() => setShowCLAdd(false)}
                />
              </View>
            </View>
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={showClDel}
          onBackButtonPress={() => setShowClDel(false)}
          onBackdropPress={() => setShowClDel(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text selectable style={styles.title}>
                Delete CL of {clDelObj.tname}
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={
                    selectedDelDate ? `${clDelId}+${selectedDelDate}` : ''
                  }
                  onValueChange={value => {
                    if (value) {
                      setClDelId(value.split('+')[0]);
                      setSelectedDelDate(value.split('+')[1]);
                    } else {
                      showToast('error', 'Please Select A Date');
                    }
                  }}
                >
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="Select Date"
                    value=""
                  />
                  {clDelObj?.cl?.map((item, index) => (
                    <Picker.Item
                      key={index}
                      style={{
                        color: 'black',
                        backgroundColor: 'white',
                      }}
                      label={item.date}
                      value={item.id + '+' + item.date}
                    />
                  ))}
                </Picker>
              </View>
              {selectedDelDate && (
                <Text style={styles.label}>
                  You are about to delete CL of {selectedDelDate}
                </Text>
              )}

              <View
                style={{
                  marginTop: responsiveHeight(3),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <CustomButton
                  title={'Delete'}
                  color={'red'}
                  size={'small'}
                  onClick={() => {
                    updateLeaveData(
                      clDelObj.id,
                      clDelObj.value,
                      'clThisMonth',
                      true,
                    );
                    setShowClDel(false);
                    setSelectedDelDate('');
                    setClDelId('');
                  }}
                />
                <CustomButton
                  title={'Cancel'}
                  color={'darkred'}
                  size={'small'}
                  onClick={() => {
                    setShowClDel(false);
                    setSelectedDelDate('');
                    setClDelId('');
                  }}
                />
              </View>
            </View>
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={showOlAdd}
          onBackButtonPress={() => setShowOlAdd(false)}
          onBackdropPress={() => setShowOlAdd(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text selectable style={styles.title}>
                Add OL{' '}
                {`${addLeaveDateData.sl} of ${addLeaveDateData.month}-${addLeaveDateData.year} of ${selectedTeacher}`}
              </Text>
              <CustomTextInput
                value={addLeaveDateData?.id}
                onChangeText={text =>
                  setAddLeaveDateData({
                    ...addLeaveDateData,
                    id: text,
                  })
                }
                placeholder="ID"
                title={'ID'}
              />
              <CustomTextInput
                value={
                  addLeaveDateData?.sl ? addLeaveDateData?.sl.toString() : ''
                }
                onChangeText={text =>
                  setAddLeaveDateData({
                    ...addLeaveDateData,
                    sl: text ? parseInt(text) : '',
                  })
                }
                placeholder="Sl"
                title={'Sl'}
              />
              <View style={{ marginVertical: responsiveHeight(1) }}>
                <Text style={styles.label}>Select Date</Text>
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
                    onChange={calculateDate}
                  />
                )}
              </View>

              <View
                style={{
                  marginTop: responsiveHeight(3),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <CustomButton
                  title={'Save'}
                  color={'green'}
                  size={'small'}
                  disabled={
                    addLeaveDateData.id === '' ||
                    addLeaveDateData.date === '' ||
                    addLeaveDateData.sl === ''
                  }
                  onClick={() => {
                    updateLeaveData(
                      addLeaveDateData.techID,
                      addLeaveDateData.sl - 1,
                      'olThisMonth',
                      false,
                    );
                    setShowOlAdd(false);
                  }}
                />
                <CustomButton
                  title={'Cancel'}
                  color={'red'}
                  size={'small'}
                  onClick={() => setShowOlAdd(false)}
                />
              </View>
            </View>
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={showOlDel}
          onBackButtonPress={() => setShowOlDel(false)}
          onBackdropPress={() => setShowOlDel(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text selectable style={styles.title}>
                Delete OL of {olDelObj.tname}
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={olDelId ? `${olDelId}+${selectedDelDate}` : ''}
                  onValueChange={value => {
                    if (value) {
                      setOlDelId(value.split('+')[0]);
                      setSelectedDelDate(value.split('+')[1]);
                    } else {
                      showToast('error', 'Please Select A Date');
                    }
                  }}
                >
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="Select Date"
                    value=""
                  />
                  {olDelObj?.ol?.map((item, index) => (
                    <Picker.Item
                      key={index}
                      style={{
                        color: 'black',
                        backgroundColor: 'white',
                      }}
                      label={item.date}
                      value={item.id + '+' + item.date}
                    />
                  ))}
                </Picker>
              </View>
              {selectedDelDate && (
                <Text style={styles.label}>
                  You are about to delete OL of {selectedDelDate}
                </Text>
              )}

              <View
                style={{
                  marginTop: responsiveHeight(3),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <CustomButton
                  title={'Delete'}
                  color={'red'}
                  size={'small'}
                  onClick={() => {
                    updateLeaveData(
                      olDelObj.id,
                      olDelObj.value,
                      'olThisMonth',
                      true,
                    );
                    setShowOlDel(false);
                    setSelectedDelDate('');
                    setOlDelId('');
                  }}
                />
                <CustomButton
                  title={'Cancel'}
                  color={'darkred'}
                  size={'small'}
                  onClick={() => {
                    setShowOlDel(false);
                    setSelectedDelDate('');
                    setOlDelId('');
                  }}
                />
              </View>
            </View>
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={showEditLeaveDateData}
          onBackButtonPress={() => setShowEditLeaveDateData(false)}
          onBackdropPress={() => setShowEditLeaveDateData(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.mainView}>
              <Text selectable style={styles.title}>
                Edit {editLeaveDateObj.leaveType} of{' '}
                {
                  leavesArray.filter(el => el.id === editLeaveDateObj.techID)[0]
                    ?.tname
                }
              </Text>
              <View style={{ marginVertical: responsiveHeight(1) }}>
                <Text style={styles.label}>Select Date</Text>
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
                    onChange={calculateEditDate}
                  />
                )}
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={
                    editLeaveDateObj.leaveType ? editLeaveDateObj.leaveType : ''
                  }
                  onValueChange={value => {
                    if (value) {
                      setEditLeaveDateObj({
                        ...editLeaveDateObj,
                        leaveType: value,
                      });
                    } else {
                      showToast('error', 'Please Select A Leave Type');
                    }
                  }}
                >
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="Select Leave Type"
                    value=""
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="CL"
                    value="CL"
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="OL"
                    value="OL"
                  />
                </Picker>
              </View>
              <View
                style={{
                  marginTop: responsiveHeight(3),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <CustomButton
                  title={'Update'}
                  color={'green'}
                  size={'small'}
                  onClick={() => {
                    updateLeaveDate();
                    setShowEditLeaveDateData(false);
                  }}
                />
                <CustomButton
                  title={'Delete'}
                  color={'red'}
                  size={'small'}
                  onClick={() => {
                    deleteLeaveDate();
                    setShowEditLeaveDateData(false);
                  }}
                />
                <CustomButton
                  title={'Cancel'}
                  color={'darkred'}
                  size={'small'}
                  onClick={() => setShowEditLeaveDateData(false)}
                />
              </View>
            </View>
          </View>
        </ReactNativeModal>
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    marginVertical: responsiveHeight(1),
  },
  dropDownTextTransfer: {
    fontSize: responsiveFontSize(1.8),
    color: THEME_COLOR,
    alignSelf: 'center',
    textAlign: 'center',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: responsiveHeight(2),
    width: responsiveWidth(90),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  picker: {
    width: responsiveWidth(80),
    borderRadius: 10,
  },
  modalView: {
    maxHeight: '90%', // allow scroll when content exceeds this height
    width: responsiveWidth(90),
    padding: responsiveHeight(2),
    alignSelf: 'center',
    justifyContent: 'flex-start', // don’t center vertically, otherwise scrolling breaks
  },

  mainView: {
    width: '100%',
    padding: responsiveWidth(2),
    borderRadius: 10,
    backgroundColor: 'white',
  },

  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    margin: responsiveHeight(0.5),
    color: THEME_COLOR,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: responsiveHeight(2),
  },
  picker: { width: responsiveWidth(80), borderRadius: 10 },
});
