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
import {
  MDM_COST_MAY_2025,
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOLNAME,
  WEBSITE,
  PREV_MDM_COST,
  STUDENTRECORD,
  VILL,
} from '../modules/constants';
import { showToast } from '../modules/Toaster';
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  todayInString,
  uniqArray,
  sortMonthwise,
  IndianFormat,
  months,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import {
  deleteDocument,
  getCollection,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';
export default function MDMEntry() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    state,
    mealState,
    setMealState,
    riceState,
    setRiceState,
    monthlyReportState,
    setMonthlyReportState,
    setActiveTab,
    StudentDataState,
    setStudentDataState,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const user = state?.USER;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [STUDENTS, setSTUDENTS] = useState({
    YEAR: '2025',
    PP_STUDENTS: 8,
    PRIMARY_STUDENTS: 38,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    TOTAL_STUDENTS: 46,
  });
  const [open, setOpen] = useState(false);
  const [pp, setPp] = useState('');
  const [pry, setPry] = useState('');
  const [showEntry, setShowEntry] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [mdmDone, setMdmDone] = useState(false);
  const [riceDone, setRiceDone] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showRiceData, setShowRiceData] = useState(false);
  const [errPP, setErrPP] = useState('');
  const [errPry, setErrPry] = useState('');
  const [docId, setDocId] = useState(todayInString());
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [moreFilteredData, setMoreFilteredData] = useState([]);
  const [thisMonthMDMAllowance, setThisMonthMDMAllowance] =
    useState(PREV_MDM_COST);
  const [ppTotalMeal, setPpTotalMeal] = useState('');
  const [pryTotalMeal, setPryTotalMeal] = useState('');
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [monthText, setMonthText] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [entryMonths, setEntryMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);
  const [riceData, setRiceData] = useState([]);
  const [filteredRiceData, setFilteredRiceData] = useState([]);
  const [riceOB, setRiceOB] = useState('');
  const [riceCB, setRiceCB] = useState('');
  const [ricePPOB, setRicePPOB] = useState('');
  const [ricePPRC, setRicePPRC] = useState('');
  const [ricePPEX, setRicePPEX] = useState('');
  const [ricePPCB, setRicePPCB] = useState('');
  const [ricePryOB, setRicePryOB] = useState('');
  const [ricePryRC, setRicePryRC] = useState('');
  const [ricePryEX, setRicePryEX] = useState('');
  const [ricePryCB, setRicePryCB] = useState('');
  const [riceGiven, setRiceGiven] = useState('');
  const [totalRiceGiven, setTotalRiceGiven] = useState('');
  const [riceExpend, setRiceExpend] = useState('');
  const [errRice, setErrRice] = useState('');
  const [showSubmitMonthlyReport, setShowSubmitMonthlyReport] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [monthToSubmit, setMonthToSubmit] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const [monthWorkingDays, setMonthWorkingDays] = useState('');
  const [totalWorkingDays, setTotalWorkingDays] = useState('');
  const [monthPPTotal, setMonthPPTotal] = useState('');
  const [monthlyPPCost, setMonthlyPPCost] = useState('');
  const [monthPRYTotal, setMonthPRYTotal] = useState('');
  const [monthlyPRYCost, setMonthlyPRYCost] = useState('');
  const [monthTotalCost, setMonthTotalCost] = useState('');
  const [thisMonthTotalCost, setThisMonthTotalCost] = useState('');
  const [monthRiceOB, setMonthRiceOB] = useState('');
  const [monthRiceGiven, setMonthRiceGiven] = useState('');
  const [monthRiceConsunption, setMonthRiceConsunption] = useState('');
  const [thisMonthTotalRiceConsumption, setThisMonthTotalRiceConsumption] =
    useState('');
  const [monthRiceCB, setMonthRiceCB] = useState('');
  const [monthYearID, setMonthYearID] = useState('');

  const [thisMonthlyData, setThisMonthlyData] = useState({
    id: '',
    month: '',
    year: '',
    financialYear: '',
    worrkingDays: '',
    totalWorkingDays: '',
    ppTotal: '',
    pryTotal: '',
    monthlyPPCost: '',
    monthlyPRYCost: '',
    totalCost: '',
    ricePPOB: '',
    ricePryOB: '',
    riceOB: '',
    ricePPRC: '',
    ricePryRC: '',
    ricePPEX: '',
    ricePryEX: '',
    ricePPCB: '',
    ricePryCB: '',
    riceCB: '',
    riceConsunption: '',
    riceGiven: '',
    ppOB: '',
    pryOB: '',
    ppRC: '',
    pryRC: '',
    ppCB: '',
    pryCB: '',
    prevPpRC: '',
    prevPryRC: '',
    prevMonthlyPPCost: '',
    prevMonthlyPRYCost: '',
    prevRicePPRC: '',
    prevRicePryRC: '',
    prevRicePPEX: '',
    prevRicePryEX: '',
    remarks: '',
    date: todayInString(),
  });
  const [mdmTransaction, setMdmTransaction] = useState({
    ppOB: '',
    pryOB: '',
    ppRC: '',
    pryRC: '',
    ppCB: '',
    pryCB: '',
    prevPpRC: '',
    prevPryRC: '',
    prevMonthlyPPCost: '',
    prevMonthlyPRYCost: '',
  });
  const [mdmRice, setMdmRice] = useState({
    prevRicePPRC: '',
    prevRicePryRC: '',
    prevRicePPEX: '',
    prevRicePryEX: '',
  });
  const [showStudentDataEntryForm, setShowStudentDataEntryForm] =
    useState(false);
  const [showStudentDataAddForm, setShowStudentDataAddForm] = useState(false);
  const [showStudentDataEditForm, setShowStudentDataEditForm] = useState(false);
  const [StudentData, setStudentData] = useState({
    PP_STUDENTS: 8,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    PRIMARY_STUDENTS: 40,
    TOTAL_STUDENTS: 46,
    YEAR: '2025',
    id: '2025',
  });
  const [StudentEditData, setStudentEditData] = useState({
    PP_STUDENTS: 8,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    PRIMARY_STUDENTS: 40,
    TOTAL_STUDENTS: 46,
    YEAR: '2025',
    id: '2025',
  });
  const [StudentEntryData, setStudentEntryData] = useState({
    PP_STUDENTS: 8,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    PRIMARY_STUDENTS: 40,
    TOTAL_STUDENTS: 46,
    YEAR: '2025',
    id: '2025',
  });
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [showBlankBtn, setShowBlankBtn] = useState(false);
  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
    const year = currentSelectedDate?.getFullYear();
    setSelectedYear(year.toString());
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
    setSelectedYear(year.toString());
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
    setDocId(tarikh);
    const filteredData = allEnry.filter(entry => entry?.date === tarikh);
    if (filteredData.length > 0) {
      const selectedDateData = filteredData[0];
      setPp(selectedDateData.pp);
      setPry(selectedDateData.pry);
    } else {
      setPp('');
      setPry('');
      showToast('error', 'No Data Found on selected Date!');
    }
  };
  const calculateAgeOnSameDay3 = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
    const year = currentSelectedDate?.getFullYear();
    setSelectedYear(year.toString());
    let month = currentSelectedDate?.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = currentSelectedDate?.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    const data = `${day}-${month}-${year}`;
    setDate(data);
    console.log(data);
    setFontColor('black');
    const Year = data.split('-')[2];
    const Month = data.split('-')[1];
    const Day = parseInt(data.split('-')[0]);
    let prevDay = Day - 1;
    if (prevDay < 10) {
      prevDay = '0' + prevDay;
    }
    const prevDate = `${prevDay}-${Month}-${Year}`;
    let beforePrevDay = Day - 2;
    if (beforePrevDay < 10) {
      beforePrevDay = '0' + beforePrevDay;
    }
    const beforePrevDate = `${beforePrevDay}-${Month}-${Year}`;
    const filteredData = riceData.filter(entry => entry?.date === prevDate);
    const filteredPrevDayData = riceData.filter(
      entry => entry?.date === beforePrevDate,
    );
    if (filteredData.length > 0) {
      setRiceOB(filteredData[0]?.riceCB);
      setRiceCB(filteredData[0]?.riceCB);
    } else if (filteredPrevDayData.length > 0) {
      setRiceOB(filteredPrevDayData[0]?.riceCB);
      setRiceCB(filteredPrevDayData[0]?.riceCB);
    } else {
      showToast('error', `Could not find entry`);
    }
  };
  const submitData = async () => {
    if (validForm()) {
      setLoader(true);
      await setDocument('mdmData', date, {
        pp: parseInt(pp),
        pry: parseInt(pry),
        date: date,
        id: date,
      })
        .then(() => {
          showToast('success', 'Data submitted successfully');
          // getMainData();
          let x = allEnry;
          x = [
            ...x,
            { pp: parseInt(pp), pry: parseInt(pry), date: date, id: date },
          ].sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date)),
          );
          setAllEnry(x);
          setMealState(x);
          setMdmDone(true);
          setPp('');
          setPry('');
          setDate(todayInString());
          setShowEntry(false);
          setLoader(false);
        })
        .catch(e => {
          showToast('error', 'Failed to submit data. Please try again');
          console.error(e);
          setLoader(false);
        });
    } else {
      showToast('error', 'Please fill all the required fields');
    }
  };
  const validForm = () => {
    let isValid = true;
    if (pp.length === 0) {
      setErrPP('PP Number is required');
      isValid = false;
    } else {
      setErrPP('');
      isValid = true;
    }
    if (pry.length === 0) {
      setErrPry('PRY Number is required');
      isValid = false;
    } else {
      setErrPry('');
      isValid = true;
    }

    return isValid;
  };

  const searchTodaysData = async () => {
    const todaysData = allEnry.filter(entry => entry?.date === todayInString());
    if (todaysData.length > 0) {
      const data = todaysData[0];
      setPp(data.pp);
      setPry(data.pry);
      setDate(getCurrentDateInput(data.date));
      setDocId(data.date);
      setShowUpdate(true);
    } else {
      setDocId(todayInString());
      showToast('error', 'Todays Enry Not Done Yet!');
      setShowUpdate(true);
    }
    setShowDataTable(false);
    setShowMonthSelection(false);
    setShowEntry(false);
    setShowMonthlyReport(false);
    setShowRiceData(false);
  };

  const updateData = async () => {
    if (validForm()) {
      setLoader(true);
      try {
        await setDocument('mdmData', docId, {
          pp: parseInt(pp),
          pp: parseInt(pp),
          pry: parseInt(pry),
          date: docId,
        })
          .then(() => {
            showToast('success', 'Data updated successfully');
            let x = [];
            x = allEnry.filter(entry => entry?.id !== docId);
            x = [
              ...x,
              { pp: parseInt(pp), pry: parseInt(pry), date: docId, id: docId },
            ].sort(
              (a, b) =>
                Date.parse(getCurrentDateInput(a.date)) -
                Date.parse(getCurrentDateInput(b.date)),
            );
            setAllEnry(x);
            setMealState(x);
            setPp('');
            setPry('');
            setDate(todayInString());
            setDocId(todayInString());
            setShowEntry(false);
            setLoader(false);
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
      showToast('error', 'Please Fillup Required Details!');
    }
  };
  const getMainData = async () => {
    setLoader(true);
    await getCollection('mdmData').then(snapshot => {
      const data = snapshot.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      );
      setLoader(false);
      setAllEnry(data);
      setMealState(data);
      findMDMEntry(data);
    });
  };
  const findMDMEntry = array => {
    if (array.filter(el => el?.id === todayInString()).length > 0) {
      setMdmDone(true);
    } else {
      setMdmDone(false);
    }
  };

  const getRiceData = async () => {
    setLoader(true);
    await getCollection('rice').then(snapshot => {
      const data = snapshot.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      );
      setLoader(false);
      setRiceData(data);
      setRiceState(data);
      setRiceOB(data[data.length - 1].riceCB);
      setRiceCB(data[data.length - 1].riceCB);
      findRiceEntry(data);
    });
  };
  const getStudentData = async () => {
    await getCollection('studentYearData').then(data => {
      setStudentDataState(data);
      setSTUDENTS(
        data.filter(st => st.YEAR === new Date().getFullYear().toString())[0],
      );
    });
  };
  const findRiceEntry = array => {
    if (array.filter(el => el?.id === todayInString()).length > 0) {
      setRiceDone(true);
      setRiceOB(array[array.length - 1].riceOB);
      setRiceCB(array[array.length - 1].riceCB);
      setRiceExpend(array[array.length - 1].riceExpend);
      setRiceGiven(array[array.length - 1].riceGiven);
    } else {
      setRiceDone(false);
    }
  };
  const getMonthlyData = async () => {
    setLoader(true);
    await getCollection('mothlyMDMData').then(data => {
      const monthwiseSorted = sortMonthwise(data);
      setMonthlyReportState(monthwiseSorted);
      const thisMonthlyData = monthwiseSorted.filter(
        data => data.id === monthYearID,
      );
      if (thisMonthlyData.length > 0) {
        filterMonthlyData(thisMonthlyData[0]);
      }
      const thisMonthIndex = monthwiseSorted.findIndex(
        data => data.id === monthYearID,
      );
      let prevMonthData = monthwiseSorted[monthwiseSorted.length - 1];
      if (thisMonthIndex !== -1) {
        prevMonthData = monthwiseSorted[monthwiseSorted.length - 1];
      } else {
        setMdmTransaction({
          ...mdmTransaction,
          ppOB: prevMonthData?.ppCB,
          pryOB: prevMonthData?.pryCB,
          prevPpRC: prevMonthData?.ppRC,
          prevPryRC: prevMonthData?.pryRC,
          prevMonthlyPPCost: prevMonthData?.monthlyPPCost,
          prevMonthlyPRYCost: prevMonthData?.monthlyPRYCost,
        });
        setMdmRice({
          ...mdmRice,
          prevRicePPRC: prevMonthData?.ricePPRC,
          prevRicePryRC: prevMonthData?.ricePryRC,
          prevRicePPEX: prevMonthData?.ricePPCB,
          prevRicePryEX: prevMonthData?.ricePryCB,
        });
        setRicePPOB(prevMonthData?.ricePPCB);
        setRicePryOB(prevMonthData?.ricePryCB);
        setMonthlyPPCost(Math.round(ppTotalMeal * thisMonthMDMAllowance));
        setMonthlyPRYCost(Math.round(pryTotalMeal * thisMonthMDMAllowance));
        setMonthTotalCost(
          Math.round(
            ppTotalMeal * thisMonthMDMAllowance +
              pryTotalMeal * thisMonthMDMAllowance,
          ),
        );
        setMonthRiceConsunption(thisMonthTotalRiceConsumption);
        setMonthRiceGiven(totalRiceGiven);
        setMonthRiceCB(
          prevMonthData?.riceCB +
            totalRiceGiven -
            thisMonthTotalRiceConsumption,
        );
      }
      setLoader(false);
    });
  };

  const filterMonthlyData = entry => {
    setMonthWorkingDays(entry?.worrkingDays);
    setTotalWorkingDays(entry?.totalWorkingDays);
    setMonthPPTotal(entry?.ppTotal);
    setMonthPRYTotal(entry?.pryTotal);
    setMonthlyPPCost(entry?.monthlyPPCost);
    setMonthlyPRYCost(entry?.monthlyPRYCost);
    setMonthTotalCost(entry?.totalCost);
    setRicePPOB(entry?.ricePPOB);
    setRicePryOB(entry?.ricePryOB);
    setMonthRiceOB(entry?.riceOB);
    setRicePPRC(entry?.ricePPRC);
    setRicePryRC(entry?.ricePryRC);
    setMonthRiceGiven(entry?.riceGiven);
    setRicePPEX(entry?.ricePPEX);
    setRicePryEX(entry?.ricePryEX);
    setMonthRiceConsunption(entry?.riceConsunption);
    setRicePPCB(entry?.ricePPCB);
    setRicePryCB(entry?.ricePryCB);
    setMonthRiceCB(entry?.riceCB);
    setRemarks(entry?.remarks);

    setMdmTransaction({
      ppOB: entry?.ppOB,
      pryOB: entry?.pryOB,
      ppRC: entry?.ppRC,
      pryRC: entry?.pryRC,
      ppCB: entry?.ppCB,
      pryCB: entry?.pryCB,
      prevPpRC: entry?.prevPpRC,
      prevPryRC: entry?.prevPryRC,
      prevMonthlyPPCost: entry?.prevMonthlyPPCost,
      prevMonthlyPRYCost: entry?.prevMonthlyPRYCost,
    });
    setMdmRice({
      prevRicePPRC: entry?.prevRicePPRC,
      prevRicePryRC: entry?.prevRicePryRC,
      prevRicePPEX: entry?.prevRicePPEX,
      prevRicePryEX: entry?.prevRicePryEX,
    });
  };

  const calledData = array => {
    let x = [];
    array.map(entry => {
      const entryYear = entry?.date.split('-')[2];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setServiceArray(x);
    let ppTotal = 0;
    let pryTotal = 0;
    array.map(entry => {
      ppTotal += entry?.pp;
      pryTotal += entry?.pry;
    });
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);

    setLoader(false);
    setAllEnry(array);
    setFilteredData(array);
    setShowEntry(false);
    setShowUpdate(false);
    setShowRiceData(false);
    setShowMonthlyReport(true);
  };
  const handleChange = value => {
    if (value !== '') {
      setMonthText('');
      const selectedValue = value;
      let x = [];
      let y = [];
      allEnry.map(entry => {
        const entryYear = entry?.date.split('-')[2];
        const entryMonth = entry?.date.split('-')[1];
        if (entryYear === selectedValue) {
          x.push(entry);
        }
        if (entryYear === selectedValue) {
          monthNamesWithIndex.map(month => {
            if (entryMonth === month.index) {
              y.push(month);
            }
          });
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredData(x);
      setMoreFilteredData(x);
      setEntryMonths(uniqArray(y));
      const findBlankEntry = monthlyReportState.filter(
        entry =>
          entry?.id ===
          `${
            monthNamesWithIndex[new Date().getMonth()].monthName
          }-${selectedYear}`,
      );
      if (findBlankEntry?.length > 0) {
        setShowBlankBtn(true);
      } else {
        setShowBlankBtn(false);
      }
    } else {
      setFilteredData([]);
      setSelectedYear('');
    }
  };
  const handleMonthChange = month => {
    let x = [];
    let y = [];
    allEnry.map(entry => {
      const entryYear = entry?.date.split('-')[2];
      const entryMonth = entry?.date.split('-')[1];
      if (entryYear === selectedYear && entryMonth === month.index) {
        return x.push(entry);
      }
    });
    riceData.map(entry => {
      const entryYear = entry?.date.split('-')[2];
      const entryMonth = entry?.date.split('-')[1];
      if (entryYear === selectedYear && entryMonth === month.index) {
        return y.push(entry);
      }
    });

    if (month.rank < 4) {
      setFinancialYear(`${parseInt(selectedYear) - 1}-${selectedYear}`);
    } else {
      setFinancialYear(`${selectedYear}-${parseInt(selectedYear) + 1}`);
    }
    const findEntry = monthlyReportState.filter(
      entry => entry?.month === month.monthName && entry?.year === selectedYear,
    );

    if (findEntry?.length > 0) {
      setThisMonthlyData(findEntry[0]);
      setShowDownloadButton(true);
      console.log('found entry');
    } else {
      setShowDownloadButton(false);
      console.log('entry not found');
    }

    setFilteredData(x);
    setFilteredRiceData(
      y.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      ),
    );

    let riceGiven = 0;
    let thisMonthRiceData = y.sort(
      (a, b) =>
        Date.parse(getCurrentDateInput(a.date)) -
        Date.parse(getCurrentDateInput(b.date)),
    );
    y.map(entry => {
      riceGiven += entry?.riceGiven;
    });
    setTotalRiceGiven(riceGiven);
    let ppTotal = 0;
    let pryTotal = 0;
    x.map(entry => {
      ppTotal += entry?.pp;
      pryTotal += entry?.pry;
    });
    let mdmCost = PREV_MDM_COST;
    const entryMonth = x[0]?.date.split('-')[1];
    if (parseInt(selectedYear) <= 2024 && parseInt(entryMonth) <= 11) {
      setThisMonthMDMAllowance(PREV_MDM_COST);
      mdmCost = PREV_MDM_COST;
    } else if (parseInt(selectedYear) === 2024 && parseInt(entryMonth) === 12) {
      setThisMonthMDMAllowance(MDM_COST);
      mdmCost = MDM_COST;
    } else if (parseInt(selectedYear) === 2025 && parseInt(entryMonth) <= 4) {
      setThisMonthMDMAllowance(MDM_COST);
      mdmCost = MDM_COST;
    } else if (parseInt(selectedYear) >= 2025 && parseInt(entryMonth) >= 5) {
      setThisMonthMDMAllowance(MDM_COST_MAY_2025);
      mdmCost = MDM_COST_MAY_2025;
    }
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);
    setMonthYearID(`${month.monthName}-${selectedYear}`);
    setMonthToSubmit(month.monthName);
    setMonthWorkingDays(x.length);
    setMonthPPTotal(ppTotal);
    setMonthPRYTotal(pryTotal);
    setMonthlyPPCost(Math.round(ppTotal * mdmCost));
    setThisMonthTotalCost(Math.round(ppTotal * mdmCost + pryTotal * mdmCost));
    setMonthlyPRYCost(
      Math.round(ppTotal * mdmCost + pryTotal * mdmCost) -
        Math.round(ppTotal * mdmCost),
    );
    setMonthRiceOB(thisMonthRiceData[0]?.riceOB);
    setMonthRiceCB(thisMonthRiceData[0]?.riceCB);
    setMonthRiceGiven(riceGiven);
    setMonthRiceCB(thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB);
    setThisMonthTotalRiceConsumption(
      thisMonthRiceData[0]?.riceOB +
        riceGiven -
        thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB,
    );
    setShowDataTable(true);
    setMonthText(month.monthName);
  };

  const submitRice = async () => {
    setLoader(true);
    try {
      await setDocument('rice', date, {
        id: date,
        date: date,
        riceOB: parseFloat(riceOB),
        riceGiven: riceGiven === '' ? 0 : parseFloat(riceGiven),
        riceExpend: parseFloat(riceExpend),
        riceCB: parseFloat(riceCB),
      })
        .then(() => {
          showToast('success', 'Rice Data added successfully');
          setRiceGiven(0);
          setRiceOB(riceCB);
          let x = riceState;
          let y = riceState.filter(item => item.id !== date);
          x = [
            ...y,
            {
              id: date,
              date: date,
              riceOB: parseFloat(riceOB),
              riceGiven: riceGiven === '' ? 0 : parseFloat(riceGiven),
              riceExpend: parseFloat(riceExpend),
              riceCB: parseFloat(riceCB),
            },
          ].sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date)),
          );
          setRiceState(x);
          setRiceData(x);
          // getRiceData();
          setDocId(todayInString());
          setDate(todayInString());
          setRiceExpend('');
          setRiceGiven('');
          setShowRiceData(false);
          setShowEntry(false);
          setShowDataTable(false);
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
          setLoader(false);
          setRiceDone(true);
        })
        .catch(e => {
          console.log(e);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      const entry = {
        id: monthYearID,
        month: monthToSubmit,
        year: selectedYear.toString(),
        financialYear: financialYear,
        worrkingDays: monthWorkingDays !== '' ? monthWorkingDays : 0,
        totalWorkingDays: totalWorkingDays !== '' ? totalWorkingDays : 0,
        ppTotal: monthPPTotal !== '' ? monthPPTotal : 0,
        pryTotal: monthPRYTotal !== '' ? monthPRYTotal : 0,
        monthlyPPCost: monthlyPPCost !== '' ? monthlyPPCost : 0,
        monthlyPRYCost: monthlyPRYCost !== '' ? monthlyPRYCost : 0,
        totalCost: monthTotalCost !== '' ? monthTotalCost : 0,
        ricePPOB: ricePPOB !== '' ? ricePPOB : 0,
        ricePryOB: ricePryOB !== '' ? ricePryOB : 0,
        riceOB: monthRiceOB !== '' ? monthRiceOB : 0,
        ricePPRC: ricePPRC !== '' ? ricePPRC : 0,
        ricePryRC: ricePryRC !== '' ? ricePryRC : 0,
        ricePPEX: ricePPEX !== '' ? ricePPEX : 0,
        ricePryEX: ricePryEX !== '' ? ricePryEX : 0,
        ricePPCB: ricePPCB !== '' ? ricePPCB : 0,
        ricePryCB: ricePryCB !== '' ? ricePryCB : 0,
        riceCB: monthRiceCB !== '' ? monthRiceCB : 0,
        riceConsunption: monthRiceConsunption !== '' ? monthRiceConsunption : 0,
        riceGiven: monthRiceGiven !== '' ? monthRiceGiven : 0,
        ppOB: mdmTransaction.ppOB !== '' ? mdmTransaction.ppOB : 0,
        pryOB: mdmTransaction.pryOB !== '' ? mdmTransaction.pryOB : 0,
        ppRC: mdmTransaction.ppRC !== '' ? mdmTransaction.ppRC : 0,
        pryRC: mdmTransaction.pryRC !== '' ? mdmTransaction.pryRC : 0,
        ppCB: mdmTransaction.ppCB !== '' ? mdmTransaction.ppCB : 0,
        pryCB: mdmTransaction.pryCB !== '' ? mdmTransaction.pryCB : 0,
        prevPpRC: mdmTransaction.prevPpRC !== '' ? mdmTransaction.prevPpRC : 0,
        prevPryRC:
          mdmTransaction.prevPryRC !== '' ? mdmTransaction.prevPryRC : 0,
        prevMonthlyPPCost:
          mdmTransaction.prevMonthlyPPCost !== ''
            ? mdmTransaction.prevMonthlyPPCost
            : 0,
        prevMonthlyPRYCost:
          mdmTransaction.prevMonthlyPRYCost !== ''
            ? mdmTransaction.prevMonthlyPRYCost
            : 0,
        prevRicePPRC: mdmRice.prevRicePPRC !== '' ? mdmRice.prevRicePPRC : 0,
        prevRicePryRC: mdmRice.prevRicePryRC !== '' ? mdmRice.prevRicePryRC : 0,
        prevRicePPEX: mdmRice.prevRicePPEX !== '' ? mdmRice.prevRicePPEX : 0,
        prevRicePryEX: mdmRice.prevRicePryEX !== '' ? mdmRice.prevRicePryEX : 0,
        remarks: remarks,
        ppStudent: StudentData.PP_STUDENTS,
        pryStudent: StudentData.PRIMARY_STUDENTS,
        totalStudent: StudentData.TOTAL_STUDENTS,
        date: todayInString(),
      };
      await setDocument('mothlyMDMData', monthYearID, entry)
        .then(() => {
          showToast('success', 'Monthly MDM Data Submitted successfully');
          setLoader(false);
          let z = monthlyReportState.filter(item => item.id !== monthYearID);
          z = [...z, entry];
          setMonthlyReportState(sortMonthwise(z));
          setShowSubmitMonthlyReport(false);
        })
        .catch(e => {
          console.log(e);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
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
          await delEntry(entry);
        },
      },
    ]);
  };

  const delEntry = async entry => {
    try {
      setLoader(true);
      await deleteDocument('mdmData', entry?.id)
        .then(async () => {
          try {
            await deleteDocument('rice', entry?.id)
              .then(() => {
                const filteredEntry = riceState.filter(
                  el => el.id !== entry?.id,
                );
                const thisEntry = riceState.filter(
                  el => el.id === entry?.id,
                )[0];
                setRiceState(filteredEntry);
                setRiceOB(thisEntry?.riceOB);
                setRiceCB(thisEntry?.riceOB);
                setRiceState(filteredEntry);
                setRiceData(filteredEntry);
              })
              .catch(err => {
                console.log('Rice Data not Found', err);
                showToast('error', 'Rice Data not Found');
              });
          } catch (error) {
            console.log('Rice Data not Found', error);
            showToast('error', 'Rice Data not Found');
          }
          setLoader(false);
          showToast('success', 'MDM Data Deleted successfully');
          const filteredEntry = mealState.filter(el => el.id !== entry?.id);
          setMealState(filteredEntry);
          setAllEnry(filteredEntry);
          findRiceEntry(filteredEntry);
          setMoreFilteredData(
            moreFilteredData.filter(el => el.id !== entry?.id),
          );
          setFilteredData(filteredData.filter(el => el.id !== entry?.id));
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
          setShowDataTable(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };

  const showConfirmDialog2 = entry => {
    return Alert.alert(
      'Hold On!',
      `Are you sure you want to delete student data for ${entry?.YEAR}`,
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Cancel',
          onPress: () => showToast('success', 'Student data Not deleted'),
        }, // The "Yes" button
        {
          text: 'Yes',
          onPress: async () => {
            await deleteStudentData(entry?.id);
          },
        },
      ],
    );
  };
  const deleteStudentData = async id => {
    try {
      setLoader(true);
      await deleteDocument('studentYearData', id)
        .then(async () => {
          showToast('success', 'Student Data Deleted successfully');
          const filteredEntry = StudentDataState.filter(el => el.id !== id);
          setStudentDataState(filteredEntry);
          setLoader(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const handleStudentDataEditSubmit = async () => {
    setLoader(true);
    await updateDocument(
      'studentYearData',
      StudentEntryData.id,
      StudentEntryData,
    )
      .then(() => {
        showToast('success', 'Student Data Updated successfully');
        setStudentEditData({
          PP_STUDENTS: 8,
          PRIMARY_BOYS: 21,
          PRIMARY_GIRLS: 25,
          PRIMARY_STUDENTS: 40,
          TOTAL_STUDENTS: 46,
          YEAR: '2025',
          id: '2025',
        });
        const filteredEntry = StudentDataState.filter(
          el => el.id !== StudentEntryData.id,
        );
        const updatedEntry = [...filteredEntry, StudentEntryData];
        setStudentDataState(updatedEntry);
        setShowStudentDataEditForm(false);
        setLoader(false);
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
        showToast('error', 'Something went Wrong!');
      });
  };
  const handleStudentDataNewAddSubmit = async () => {
    setLoader(true);
    await setDocument(
      'studentYearData',
      StudentEntryData.YEAR,
      StudentEntryData,
    )
      .then(() => {
        showToast('success', 'Student Data Added successfully');
        const updatedEntry = [...StudentDataState, StudentEntryData];
        setStudentDataState(updatedEntry);
        setLoader(false);
        setShowStudentDataAddForm(false);
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
        showToast('error', 'Something went Wrong!');
      });
  };
  const getArrayLength = year => {
    let x = [];
    allEnry.map(entry => {
      const entryYear = entry?.id?.split('-')[2];
      if (entryYear === year) {
        x.push(entry);
      }
    });
    return x.length;
  };
  useEffect(() => {}, [
    allEnry,
    filteredData,
    pp,
    pry,
    date,
    ppTotalMeal,
    pryTotalMeal,
    docId,
    riceOB,
    monthYearID,
    financialYear,
    monthlyPPCost,
    monthlyPRYCost,
    filteredRiceData,
  ]);
  useEffect(() => {
    if (riceState.length === 0) {
      getRiceData();
    } else {
      setRiceData(riceState);
      setRiceOB(riceState[riceState.length - 1].riceCB);
      setRiceCB(riceState[riceState.length - 1].riceCB);
      findRiceEntry(riceState);
      setLoader(false);
    }
    if (mealState.length === 0) {
      getMainData();
    } else {
      setAllEnry(mealState);
      findMDMEntry(mealState);
      setLoader(false);
    }
    if (monthlyReportState.length === 0) {
      getMonthlyData();
    } else {
      setLoader(false);
    }
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    }
    setSelectedYear(new Date().getFullYear().toString());
    if (StudentDataState.length === 0) {
      getStudentData();
    } else {
      setSTUDENTS(
        StudentDataState.filter(
          st => st.YEAR === new Date().getFullYear().toString(),
        )[0],
      );
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
  useEffect(() => {
    setSTUDENTS(StudentDataState.filter(st => st.YEAR === selectedYear)[0]);
  }, [selectedYear]);
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={loader} />
      <Text style={styles.title}>MDM DATA OF {SCHOOLNAME}</Text>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}
      >
        {!showEntry && !showUpdate && !showMonthlyReport && !showRiceData && (
          <View>
            <CustomButton
              title={'Coverage Entry'}
              color={mdmDone ? 'red' : 'green'}
              onClick={() => {
                allEnry.map(entry => {
                  if (entry?.date === todayInString()) {
                    showToast('error', 'Todays Entry Already Done!');
                    setPp(entry?.pp);
                    setPry(entry?.pry);
                  } else {
                    setPp('');
                    setPry('');
                    setErrPP('');
                    setErrPry('');
                  }
                });
                setShowEntry(true);
                setShowUpdate(false);
                setShowMonthlyReport(false);
                setDate(todayInString());
                setShowDataTable(false);
                setShowMonthSelection(false);
                setShowRiceData(false);
              }}
            />
            <CustomButton
              color={!mdmDone ? 'red' : 'green'}
              title={'Coverage Update'}
              onClick={() => {
                searchTodaysData();
              }}
            />
            <CustomButton
              title={'Monthly Report'}
              onClick={() => calledData(allEnry)}
            />
            <CustomButton
              title={'Rice Data'}
              color={riceDone ? 'red' : 'green'}
              onClick={() => {
                if (riceDone) {
                  showToast('error', 'Todays Rice Entry Already Done!');
                }
                setShowRiceData(true);
                setShowMonthlyReport(false);
                setShowDataTable(false);
                setShowMonthSelection(false);
                setShowEntry(false);
                setShowUpdate(false);
                setDate(todayInString());
                setDocId(todayInString());
              }}
            />
            <CustomButton
              title={'Student Data Entry'}
              color={'purple'}
              onClick={() => {
                setShowStudentDataEntryForm(true);
                setShowRiceData(false);
                setShowMonthlyReport(false);
                setShowDataTable(false);
                setShowMonthSelection(false);
                setShowEntry(false);
                setShowUpdate(false);
              }}
            />
          </View>
        )}
        {showEntry && (
          <ScrollView>
            <Text style={styles.title}>Coverage Entry</Text>
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
            <CustomTextInput
              title={'PP'}
              type={'number-pad'}
              placeholder={`Max Limit: ${STUDENTS?.PP_STUDENTS}`}
              value={pp.toString()}
              editable={STUDENTS?.PRIMARY_STUDENTS !== undefined}
              onChangeText={text => {
                if (text.length) {
                  if (text > STUDENTS?.PP_STUDENTS) {
                    showToast('error', 'PP Limit Exceeded!');
                    setPp(STUDENTS?.PP_STUDENTS);
                  } else {
                    setPp(parseInt(text));
                  }
                } else {
                  setPp('');
                }
              }}
            />
            {errPP && <Text style={styles.error}>{errPP}</Text>}
            <CustomTextInput
              title={'Primary'}
              type={'number-pad'}
              placeholder={`Max Limit: ${STUDENTS?.PRIMARY_STUDENTS}`}
              value={pry.toString()}
              editable={STUDENTS?.PRIMARY_STUDENTS !== undefined}
              onChangeText={text => {
                if (text.length) {
                  if (text > STUDENTS?.PRIMARY_STUDENTS) {
                    showToast('error', 'Primary Limit Exceeded!');
                    setPry(STUDENTS?.PRIMARY_STUDENTS);
                  } else {
                    setPry(parseInt(text));
                  }
                } else {
                  setPry('');
                }
              }}
            />
            {errPry && <Text style={styles.error}>{errPry}</Text>}
            <CustomButton
              title={'Submit'}
              onClick={() => {
                setShowEntry(false);
                submitData();
              }}
            />
            <CustomButton
              title={'Cancel'}
              color={'red'}
              onClick={() => {
                setShowEntry(false);
              }}
            />
          </ScrollView>
        )}
        {showUpdate && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}
          >
            <Text style={styles.title}>Coverage Update</Text>
            <View style={{ marginVertical: responsiveHeight(1) }}>
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
                title={'PP'}
                placeholder={`Max Limit: ${STUDENTS?.PP_STUDENTS}`}
                value={pp.toString()}
                editable={STUDENTS?.PP_STUDENTS !== undefined}
                onChangeText={text => {
                  if (text.length) {
                    if (text > STUDENTS?.PP_STUDENTS) {
                      showToast('error', 'PP Limit Exceeded!');
                      setPp(STUDENTS?.PP_STUDENTS);
                    } else {
                      setPp(parseInt(text));
                    }
                  } else {
                    setPp('');
                  }
                }}
              />
              {errPP && <Text style={styles.error}>{errPP}</Text>}
              <CustomTextInput
                title={'Primary'}
                placeholder={`Max Limit: ${STUDENTS?.PRIMARY_STUDENTS}`}
                value={pry.toString()}
                editable={STUDENTS?.PRIMARY_STUDENTS !== undefined}
                onChangeText={text => {
                  if (text.length) {
                    if (text > STUDENTS?.PRIMARY_STUDENTS) {
                      showToast('error', 'Primary Limit Exceeded!');
                      setPry(STUDENTS?.PRIMARY_STUDENTS);
                    } else {
                      setPry(parseInt(text));
                    }
                  } else {
                    setPry('');
                  }
                }}
              />
              {errPry && <Text style={styles.error}>{errPry}</Text>}
              <CustomButton
                title={'Submit'}
                onClick={() => {
                  setShowEntry(false);
                  updateData();
                }}
              />
              <CustomButton
                title={'Cancel'}
                color={'red'}
                onClick={() => {
                  setShowUpdate(false);
                  setDocId(todayInString());
                  setPp('');
                  setPry('');
                  setDate(todayInString());
                }}
              />
            </View>
          </ScrollView>
        )}
        {showMonthlyReport && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}
          >
            <Text style={styles.title}>Monthly Report</Text>
            {serviceArray.length > 0 && (
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
              {serviceArray.length > 0 &&
                serviceArray.map((year, index) => (
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
                      onClick={() => {
                        handleChange(year);
                        if (showMonthSelection) {
                          setShowMonthSelection(false);
                          setShowDataTable(false);
                        }
                      }}
                    />
                    <View
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
                          ? new Date().getFullYear() - parseInt(year) + ' Years'
                          : new Date().getFullYear() - parseInt(year) === 1
                          ? new Date().getFullYear() - parseInt(year) + ' Year'
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
                          `${getArrayLength(year) > 1 ? ' Entries' : ' Entry'}`}
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
                          // flexWrap: 'wrap',
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
                          {moreFilteredData.filter(
                            m => m.date.split('-')[1] === month.index,
                          ).length +
                            ` ${
                              moreFilteredData.filter(
                                m => m.date.split('-')[1] === month.index,
                              ).length > 1
                                ? ' Entries'
                                : ' Entry'
                            }`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {new Date().getDate() >= 20 &&
                  moreFilteredData.filter(
                    m => m.date.split('-')[1] == new Date().getMonth() + 1,
                  ).length === 0 && (
                    <View>
                      <CustomButton
                        title={'Blank Entry'}
                        size={'small'}
                        color={'black'}
                        fontSize={responsiveFontSize(1.5)}
                        onClick={() => navigation.navigate('BlankMDMEntry')}
                      />
                      {showBlankBtn && (
                        <CustomButton
                          marginTop={responsiveHeight(1)}
                          color={'blueviolet'}
                          title={`Download ${
                            monthNamesWithIndex[new Date().getMonth()].monthName
                          }-${selectedYear} MDM PDF`}
                          onClick={async () => {
                            const data = {
                              thisMonthlyData: monthlyReportState.filter(
                                entry =>
                                  entry?.id ===
                                  `${
                                    monthNamesWithIndex[new Date().getMonth()]
                                      .monthName
                                  }-${selectedYear}`,
                              )[0],
                            };
                            await Linking.openURL(
                              `${WEBSITE}/downloadMDMReport?data=${JSON.stringify(
                                data,
                              )}`,
                            );
                          }}
                        />
                      )}
                    </View>
                  )}
              </View>
            )}

            {showDataTable && (
              <ScrollView
                style={{
                  marginBottom: responsiveHeight(2),
                }}
              >
                <Text
                  style={[
                    styles.title,
                    { marginVertical: responsiveHeight(1) },
                  ]}
                >
                  Mothly MDM Report of {monthText}' {selectedYear}
                </Text>
                {showDownloadButton && (
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    color={'blueviolet'}
                    title={`Download ${monthToSubmit} ${selectedYear} MDM PDF`}
                    onClick={async () => {
                      const data = {
                        thisMonthlyData: thisMonthlyData,
                      };
                      await Linking.openURL(
                        `${WEBSITE}/downloadMDMReport?data=${JSON.stringify(
                          data,
                        )}`,
                      );
                    }}
                  />
                )}
                {filteredData.length > 0 ? (
                  <FlatList
                    data={filteredData}
                    renderItem={({ item, index }) => {
                      const findRiceData = filteredRiceData.filter(
                        r => r.id === item.id,
                      );
                      const foundRData = findRiceData[0];
                      return (
                        <React.Fragment key={index}>
                          <View style={styles.dataView}>
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Text selectable style={styles.bankDataText}>
                                Day: {index + 1}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Date: {item?.date}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                PP: {item?.pp}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Primary: {item?.pry}
                              </Text>
                              {findRiceData.length > 0 && (
                                <View>
                                  <Text selectable style={styles.bankDataText}>
                                    Rice Opening: {foundRData?.riceOB} Kg.
                                  </Text>
                                  {foundRData?.riceGiven > 0 && (
                                    <Text
                                      selectable
                                      style={styles.bankDataText}
                                    >
                                      Rice Received: {foundRData?.riceGiven}{' '}
                                      Kg.,
                                    </Text>
                                  )}
                                  <Text selectable style={styles.bankDataText}>
                                    Rice Expenses: {foundRData?.riceExpend} Kg.
                                  </Text>
                                  <Text selectable style={styles.bankDataText}>
                                    Rice Closing: {foundRData?.riceCB} Kg.
                                  </Text>
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
                                <View
                                  style={{
                                    marginHorizontal: responsiveWidth(2),
                                  }}
                                >
                                  <CustomButton
                                    title={'Edit'}
                                    size={'xsmall'}
                                    color={'darkorange'}
                                    onClick={() => {
                                      setPp(item?.pp);
                                      setPry(item?.pry);
                                      setDate(getCurrentDateInput(item?.date));
                                      setCurrentDate(
                                        new Date(
                                          getCurrentDateInput(item?.date),
                                        ),
                                      );
                                      setDocId(item?.date);
                                      setLoader(false);
                                      setShowEntry(false);
                                      setShowUpdate(true);
                                      setShowMonthlyReport(false);
                                      setShowDataTable(false);
                                      setShowMonthSelection(false);
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    marginHorizontal: responsiveWidth(2),
                                  }}
                                >
                                  <CustomButton
                                    title={'Delete'}
                                    size={'xsmall'}
                                    color={'red'}
                                    onClick={() => showConfirmDialog(item)}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                          {filteredData.length === index + 1 && (
                            <View
                              style={[
                                styles.dataView,
                                { backgroundColor: 'lightgoldenrodyellow' },
                              ]}
                            >
                              <Text selectable style={styles.bankDataText}>
                                Total
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Total MDM Days:{' '}
                                {filteredData.length > 1
                                  ? `${filteredData.length} Days`
                                  : `${filteredData.length} Day`}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                PP Total Meal: {ppTotalMeal}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Primary Total Meal: {pryTotalMeal}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Total Meal- {ppTotalMeal + pryTotalMeal}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                MDM Cost ={' '}
                                {`${ppTotalMeal} X ₹ ${thisMonthMDMAllowance} + ${pryTotalMeal} X ₹${thisMonthMDMAllowance} = `}
                                ₹ {IndianFormat(thisMonthTotalCost)}
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Total Rice Given: {totalRiceGiven}Kg.
                              </Text>
                              <Text selectable style={styles.bankDataText}>
                                Rice Consumption:{' '}
                                {thisMonthTotalRiceConsumption}
                                Kg.
                              </Text>
                            </View>
                          )}
                        </React.Fragment>
                      );
                    }}
                  />
                ) : (
                  <Text selectable style={styles.bankDataText}>
                    No Entry found for the selected Year.
                  </Text>
                )}
                <View style={{ marginVertical: responsiveHeight(1) }}>
                  {!showSubmitMonthlyReport ? (
                    <CustomButton
                      title={'Submit Monthly Report'}
                      color={'green'}
                      onClick={() => {
                        setShowSubmitMonthlyReport(true);
                        const thisMonthlyData = monthlyReportState.filter(
                          data => data.id === monthYearID,
                        );
                        if (thisMonthlyData.length > 0) {
                          filterMonthlyData(thisMonthlyData[0]);
                        } else {
                          const thisMonthIndex = monthlyReportState.findIndex(
                            data => data.id === monthYearID,
                          );
                          let prevMonthData =
                            monthlyReportState[monthlyReportState.length - 1];
                          if (thisMonthIndex !== -1) {
                            prevMonthData =
                              monthlyReportState[monthlyReportState.length - 1];
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppOB: prevMonthData?.ppCB,
                              pryOB: prevMonthData?.pryCB,
                              prevPpRC: prevMonthData?.ppRC,
                              prevPryRC: prevMonthData?.pryRC,
                              prevMonthlyPPCost: prevMonthData?.monthlyPPCost,
                              prevMonthlyPRYCost: prevMonthData?.monthlyPRYCost,
                            });
                            setMdmRice({
                              ...mdmRice,
                              prevRicePPRC: prevMonthData?.ricePPRC,
                              prevRicePryRC: prevMonthData?.ricePryRC,
                              prevRicePPEX: prevMonthData?.ricePPCB,
                              prevRicePryEX: prevMonthData?.ricePryCB,
                            });
                            setRicePPOB(prevMonthData?.ricePPCB);
                            setRicePryOB(prevMonthData?.ricePryCB);
                            setRiceOB(prevMonthData?.riceCB);
                            setMonthlyPPCost(
                              Math.round(ppTotalMeal * thisMonthMDMAllowance),
                            );
                            setMonthlyPRYCost(
                              Math.round(pryTotalMeal * thisMonthMDMAllowance),
                            );
                            setMonthTotalCost(
                              Math.round(
                                ppTotalMeal * thisMonthMDMAllowance +
                                  pryTotalMeal * thisMonthMDMAllowance,
                              ),
                            );
                            setMonthRiceConsunption(
                              thisMonthTotalRiceConsumption,
                            );
                            setMonthRiceGiven(totalRiceGiven);
                            setMonthRiceCB(
                              prevMonthData?.riceCB +
                                totalRiceGiven -
                                thisMonthTotalRiceConsumption,
                            );
                          }
                        }
                      }}
                    />
                  ) : (
                    <View style={{ marginVertical: responsiveHeight(2) }}>
                      <Text style={styles.title}>Submit Monthly Report</Text>
                      <CustomTextInput
                        title={'Month Name'}
                        placeholder={`Enter Month Name`}
                        value={monthToSubmit}
                        onChangeText={text => {
                          setMonthToSubmit(text);
                        }}
                      />
                      <CustomTextInput
                        title={'Total MDM Days'}
                        type={'number-pad'}
                        placeholder={`Enter Total MDM Days`}
                        value={monthWorkingDays.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthWorkingDays(parseInt(text));
                          } else {
                            setMonthWorkingDays('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Working Days'}
                        type={'number-pad'}
                        placeholder={`Enter Total Working Days`}
                        value={totalWorkingDays.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setTotalWorkingDays(parseInt(text));
                          } else {
                            setTotalWorkingDays('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total PP Meals'}
                        type={'number-pad'}
                        placeholder={`Enter Total PP Meals`}
                        value={monthPPTotal.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthPPTotal(parseInt(text));
                          } else {
                            setMonthPPTotal('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Primary Meals'}
                        type={'number-pad'}
                        placeholder={`Enter Total Primary Meals`}
                        value={monthPRYTotal.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthPRYTotal(parseInt(text));
                          } else {
                            setMonthPRYTotal('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total PP MDM Cost'}
                        type={'number-pad'}
                        placeholder={`Enter Total PP MDM Cost`}
                        value={monthlyPPCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthlyPPCost(parseInt(text));
                          } else {
                            setMonthlyPPCost('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total PRIMARY MDM Cost'}
                        type={'number-pad'}
                        placeholder={`Enter Total PRIMARY MDM Cost`}
                        value={monthlyPRYCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthlyPRYCost(parseInt(text));
                          } else {
                            setMonthlyPRYCost('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total MDM Cost'}
                        type={'number-pad'}
                        placeholder={`Enter Total MDM Cost`}
                        value={monthTotalCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthTotalCost(parseInt(text));
                          } else {
                            setMonthTotalCost('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'This Month PP A/C Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PP A/C OB This Month`}
                        value={mdmTransaction.ppOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppOB: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppOB: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'This Month PRIMARY A/C Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PRIMARY A/C OB This Month`}
                        value={mdmTransaction.pryOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              pryOB: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              pryOB: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'This Month This Month PP A/C Total Credit'}
                        type={'number-pad'}
                        placeholder={`Enter PP A/C Total Credit This Month`}
                        value={mdmTransaction.ppRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppRC: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppRC: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'This Month This Month PRIMARY A/C Total Credit'}
                        type={'number-pad'}
                        placeholder={`Enter PRIMARY A/C Total Credit This Month`}
                        value={mdmTransaction.pryRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              pryRC: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              pryRC: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'This Month This Month PP A/C Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PP A/C Closing Balance This Month`}
                        value={mdmTransaction.ppCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppCB: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              ppCB: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={
                          'This Month This Month PRIMARY A/C Closing Balance'
                        }
                        type={'number-pad'}
                        placeholder={`Enter PRIMARY A/C Closing Balance This Month`}
                        value={mdmTransaction.pryCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              pryCB: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              pryCB: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PP A/C Total Credit'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PP A/C Total Credit`}
                        value={mdmTransaction.prevPpRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevPpRC: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevPpRC: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PRIMARY A/C Total Credit'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PRIMARY A/C Total Credit`}
                        value={mdmTransaction.prevPryRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevPryRC: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevPryRC: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PP Expense'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PP Expense`}
                        value={mdmTransaction.prevMonthlyPPCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevMonthlyPPCost: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevMonthlyPPCost: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PRIMARY Expense'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PRIMARY Expense`}
                        value={mdmTransaction.prevMonthlyPRYCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevMonthlyPRYCost: text,
                            });
                          } else {
                            setMdmTransaction({
                              ...mdmTransaction,
                              prevMonthlyPRYCost: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Opening Balance`}
                        value={ricePPOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPOB(parseInt(text));
                          } else {
                            setRicePPOB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Opening Balance`}
                        value={ricePryOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryOB(parseInt(text));
                          } else {
                            setRicePryOB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Opening Balance`}
                        value={monthRiceOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceOB(parseInt(text));
                          } else {
                            setMonthRiceOB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Received`}
                        value={ricePPRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPRC(parseInt(text));
                          } else {
                            setRicePPRC('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Received`}
                        value={ricePryRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryRC(parseInt(text));
                          } else {
                            setRicePryRC('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Received`}
                        value={monthRiceGiven.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceGiven(parseInt(text));
                          } else {
                            setMonthRiceGiven('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Consumption'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Consumption`}
                        value={ricePPEX.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPEX(parseInt(text));
                          } else {
                            setRicePPEX('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Consumption'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Consumption`}
                        value={ricePryEX.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryEX(parseInt(text));
                          } else {
                            setRicePryEX('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Consumption'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Consumption`}
                        value={monthRiceConsunption.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceConsunption(parseInt(text));
                          } else {
                            setMonthRiceConsunption('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Closing Balance`}
                        value={ricePPCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPCB(parseInt(text));
                          } else {
                            setRicePPCB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Closing Balance`}
                        value={ricePryCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryCB(parseInt(text));
                          } else {
                            setRicePryCB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Closing Balance`}
                        value={monthRiceCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceCB(parseInt(text));
                          } else {
                            setMonthRiceCB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PP Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PP Rice Received`}
                        value={mdmRice.prevRicePPRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePPRC: text,
                            });
                          } else {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePPRC: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PRIMARY Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PRIMARY Rice Received`}
                        value={mdmRice.prevRicePryRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePryRC: text,
                            });
                          } else {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePryRC: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PP Rice Expense'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PP Rice Expense`}
                        value={mdmRice.prevRicePPEX.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePPEX: text,
                            });
                          } else {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePPEX: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Previous Month PRIMARY Rice Expense'}
                        type={'number-pad'}
                        placeholder={`Enter Previous Month PRIMARY Rice Expense`}
                        value={mdmRice.prevRicePryEX.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePryEX: text,
                            });
                          } else {
                            setMdmRice({
                              ...mdmRice,
                              prevRicePryEX: '',
                            });
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Remarks'}
                        size={'large'}
                        placeholder={`Enter Remarks`}
                        value={remarks}
                        onChangeText={text => {
                          setRemarks(text);
                        }}
                      />
                      <CustomButton
                        marginTop={responsiveHeight(1)}
                        color={'green'}
                        title={'Submit'}
                        onClick={() => submitMonthlyData()}
                      />
                      <CustomButton
                        marginTop={responsiveHeight(1)}
                        color={'red'}
                        title={'Cancel'}
                        onClick={() => setShowSubmitMonthlyReport(false)}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
            <CustomButton
              marginTop={responsiveHeight(1)}
              color={'red'}
              title={'Close'}
              onClick={() => setShowMonthlyReport(false)}
            />
          </ScrollView>
        )}
        {showRiceData && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}
          >
            <Text style={styles.title}>Rice Data</Text>
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
                  onChange={calculateAgeOnSameDay3}
                />
              )}
            </View>
            <Text style={styles.label}>Rice Opening Balance {riceOB} Kg.</Text>
            <CustomTextInput
              title={'Rice Opening Balance (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Opening Balance (in Kg.)`}
              value={riceOB.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceOB(text);
                  setRiceCB(
                    text +
                      (riceGiven === '' ? 0 : riceGiven) -
                      (riceExpend === '' ? 0 : riceExpend),
                  );
                } else {
                  setRiceOB('');
                }
              }}
            />
            <CustomTextInput
              title={'Rice Expenditure (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Expenditure (in Kg.)`}
              value={riceExpend.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceExpend(text);
                  setRiceCB(riceOB - (riceGiven === '' ? 0 : riceGiven) - text);
                } else {
                  setRiceExpend('');
                }
              }}
            />
            {errRice && <Text style={styles.error}>{errRice}</Text>}
            <CustomTextInput
              title={'Rice Received (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Received (in Kg.)`}
              value={riceGiven.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceGiven(text);
                  setRiceCB(riceOB + text - riceExpend);
                } else {
                  setRiceGiven('');
                  setRiceCB(riceOB - riceExpend);
                }
              }}
            />

            <CustomTextInput
              title={'Rice Closing Balance (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Closing Balance (in Kg.)`}
              value={riceCB.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceCB(text);
                } else {
                  setRiceCB('');
                }
              }}
            />
            <Text style={styles.label}>Closing Balance {riceCB} Kg.</Text>

            <CustomButton
              marginTop={responsiveHeight(1)}
              color={'green'}
              title={'Submit'}
              onClick={() => {
                if (riceExpend === '') {
                  setErrRice('Please Enter Rice Expenditure');
                  return;
                }
                setErrRice('');
                submitRice();
              }}
            />
            <CustomButton
              marginTop={responsiveHeight(1)}
              color={'red'}
              title={'Close'}
              onClick={() => {
                setShowRiceData(false);
              }}
            />
          </ScrollView>
        )}
        {showStudentDataEntryForm && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}
          >
            <Text style={styles.title}>Student Data Entry</Text>
            <CustomButton
              title={'New Entry'}
              fontSize={responsiveFontSize(1.4)}
              size={'xsmall'}
              onClick={() => {
                setShowStudentDataAddForm(true);
              }}
            />
            {StudentDataState.map((student, index) => {
              return (
                <React.Fragment key={index}>
                  <View style={styles.dataView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        width: responsiveWidth(80),
                        alignSelf: 'center',
                      }}
                    >
                      <CustomButton
                        title={'Edit'}
                        color={'chocolate'}
                        size={'xsmall'}
                        onClick={() => {
                          setStudentEditData(student);
                          setShowStudentDataEditForm(true);
                        }}
                      />
                      <View style={{ flexGrow: 1 }}>
                        <Text selectable style={styles.bankDataText}>
                          Sl: {index + 1}
                        </Text>
                        <Text selectable style={styles.bankDataText}>
                          Year: {student.YEAR}
                        </Text>
                        <Text selectable style={styles.bankDataText}>
                          PP: {student.PP_STUDENTS}
                        </Text>
                        <Text selectable style={styles.bankDataText}>
                          Primary: {student.PRIMARY_STUDENTS}
                        </Text>
                        <Text selectable style={styles.bankDataText}>
                          Total: {student.TOTAL_STUDENTS}
                        </Text>
                        <Text selectable style={styles.bankDataText}>
                          Boys: {student.PRIMARY_BOYS}
                        </Text>
                        <Text selectable style={styles.bankDataText}>
                          Girls: {student.PRIMARY_GIRLS}
                        </Text>
                      </View>
                      <CustomButton
                        title={'Delete'}
                        color={'red'}
                        size={'xsmall'}
                        onClick={() => {
                          showConfirmDialog2(student);
                        }}
                      />
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
            <View style={{ marginTop: responsiveHeight(1) }}>
              {showStudentDataEditForm && (
                <View>
                  <Text style={styles.title}>Student Data Edit</Text>
                  <CustomTextInput
                    title={'Year'}
                    type={'text'}
                    value={StudentEditData.YEAR}
                    onChangeText={text => {
                      setStudentEditData({
                        ...StudentEditData,
                        YEAR: text,
                      });
                    }}
                  />
                  <CustomTextInput
                    title={'PP Students'}
                    type={'number-pad'}
                    value={
                      StudentEditData.PP_STUDENTS
                        ? StudentEditData.PP_STUDENTS?.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEditData({
                          ...StudentEditData,
                          PP_STUDENTS: parseInt(text),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PP_STUDENTS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Primary Students'}
                    type={'number-pad'}
                    value={
                      StudentEditData.PRIMARY_STUDENTS
                        ? StudentEditData.PRIMARY_STUDENTS?.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_STUDENTS: parseInt(text),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_STUDENTS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Total Students'}
                    type={'number-pad'}
                    value={
                      StudentEditData.TOTAL_STUDENTS
                        ? StudentEditData.TOTAL_STUDENTS?.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEditData({
                          ...StudentEditData,
                          TOTAL_STUDENTS: parseInt(text),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          TOTAL_STUDENTS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Primary Boys'}
                    type={'number-pad'}
                    value={
                      StudentEditData.PRIMARY_BOYS
                        ? StudentEditData.PRIMARY_BOYS.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_BOYS: parseInt(text),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_BOYS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Primary Girls'}
                    type={'number-pad'}
                    value={
                      StudentEditData.PRIMARY_GIRLS
                        ? StudentEditData.PRIMARY_GIRLS.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_GIRLS: parseInt(text),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_GIRLS: '',
                        });
                      }
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    color={'green'}
                    title={'Update'}
                    onClick={() => {
                      handleStudentDataEditSubmit();
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    color={'red'}
                    title={'Close Form'}
                    onClick={() => {
                      setShowStudentDataEditForm(false);
                    }}
                  />
                </View>
              )}
            </View>
            <View style={{ marginTop: responsiveHeight(1) }}>
              {showStudentDataAddForm && (
                <View>
                  <Text style={styles.title}>Student Data Add</Text>
                  <CustomTextInput
                    title={'Year'}
                    type={'text'}
                    value={StudentEntryData.YEAR}
                    onChangeText={text => {
                      setStudentEntryData({
                        ...StudentEntryData,
                        YEAR: text,
                        id: text,
                      });
                    }}
                  />
                  <CustomTextInput
                    title={'PP Students'}
                    type={'number-pad'}
                    value={
                      StudentEntryData.PP_STUDENTS
                        ? StudentEntryData.PP_STUDENTS?.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PP_STUDENTS: parseInt(text),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PP_STUDENTS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Primary Students'}
                    type={'number-pad'}
                    value={
                      StudentEntryData.PRIMARY_STUDENTS
                        ? StudentEntryData.PRIMARY_STUDENTS?.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_STUDENTS: parseInt(text),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_STUDENTS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Total Students'}
                    type={'number-pad'}
                    value={
                      StudentEntryData.TOTAL_STUDENTS
                        ? StudentEntryData.TOTAL_STUDENTS?.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEntryData({
                          ...StudentEntryData,
                          TOTAL_STUDENTS: parseInt(text),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          TOTAL_STUDENTS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Primary Boys'}
                    type={'number-pad'}
                    value={
                      StudentEntryData.PRIMARY_BOYS
                        ? StudentEntryData.PRIMARY_BOYS.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_BOYS: parseInt(text),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_BOYS: '',
                        });
                      }
                    }}
                  />
                  <CustomTextInput
                    title={'Primary Girls'}
                    type={'number-pad'}
                    value={
                      StudentEntryData.PRIMARY_GIRLS
                        ? StudentEntryData.PRIMARY_GIRLS.toString()
                        : ''
                    }
                    onChangeText={text => {
                      if (text.trim()) {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_GIRLS: parseInt(text),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_GIRLS: '',
                        });
                      }
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    color={'green'}
                    title={'Add'}
                    onClick={() => {
                      handleStudentDataNewAddSubmit();
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    color={'red'}
                    title={'Close Form'}
                    onClick={() => {
                      setShowStudentDataAddForm(false);
                    }}
                  />
                </View>
              )}
              <CustomButton
                marginTop={responsiveHeight(1)}
                color={'blueviolet'}
                title={'Close'}
                onClick={() => {
                  setShowStudentDataEntryForm(false);
                  setShowStudentDataEditForm(false);
                  setShowStudentDataAddForm(false);
                }}
              />
            </View>
          </ScrollView>
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
