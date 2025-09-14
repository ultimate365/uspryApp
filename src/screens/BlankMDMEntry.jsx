import { StyleSheet, Text, View, ScrollView, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
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
import { useGlobalContext } from '../context/Store';
import { showToast } from '../modules/Toaster';
import {
  todayInString,
  sortMonthwise,
  GetMonthName,
} from '../modules/calculatefunctions';
import { getCollection, setDocument } from '../firebase/firestoreHelper';

export default function BlankMDMEntry() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { monthlyReportState, setMonthlyReportState, setActiveTab } =
    useGlobalContext();
  const [loader, setLoader] = useState(false);
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
    ppStudent: '',
    pryStudent: '',
    totalStudent: '',
    date: todayInString(),
  });
  const today = new Date();
  const monthIndex = today.getMonth();
  const thisYear = today.getFullYear();
  const financialYear =
    monthIndex > 3
      ? thisYear + '-' + (thisYear + 1)
      : thisYear - 1 + '-' + thisYear;
  const monthName = GetMonthName(monthIndex);

  const calledData = array => {
    let lastMonth = array[array.length - 1];
    if (lastMonth.id === `${monthName}-${thisYear}`) {
      showToast('error', 'Monthly data already submitted for this month');
      setThisMonthlyData(lastMonth);
    } else {
      setThisMonthlyData({
        riceConsunption: 0,
        monthlyPPCost: 0,
        financialYear: financialYear,
        riceGiven: 0,
        riceCB: lastMonth.riceCB,
        ppStudent: lastMonth.ppStudent,
        prevRicePPRC: lastMonth.ricePPRC,
        id: `${monthName}-${thisYear}`,
        pryStudent: lastMonth.pryStudent,
        year: thisYear.toString(),
        prevMonthlyPRYCost: lastMonth.monthlyPRYCost,
        ricePryOB: lastMonth.ricePryCB,
        ricePPCB: lastMonth.ricePPCB,
        prevRicePryEX: lastMonth.ricePryEX,
        totalStudent: lastMonth.totalStudent,
        remarks: '',
        ppRC: 0,
        ricePPOB: lastMonth.ricePPCB,
        monthlyPRYCost: 0,
        ricePPRC: 0,
        riceOB: lastMonth.riceCB,
        prevPryRC: lastMonth.pryRC,
        ricePryCB: lastMonth.ricePryCB,
        ricePPEX: 0,
        totalWorkingDays: 0,
        prevRicePryRC: lastMonth.ricePryRC,
        prevPpRC: lastMonth.ppRC,
        month: monthName,
        prevRicePPEX: lastMonth.ricePPEX,
        ricePryEX: 0,
        pryOB: lastMonth.pryCB,
        ppTotal: 0,
        totalCost: 0,
        ricePryRC: 0,
        pryTotal: 0,
        prevMonthlyPPCost: lastMonth.monthlyPPCost,
        pryRC: 0,
        worrkingDays: 0,
        ppCB: lastMonth.ppCB,
        pryCB: lastMonth.pryCB,
        date: todayInString(),
        ppOB: lastMonth.ppCB,
      });
    }
  };
  const getMonthlyData = async () => {
    setLoader(true);
    await getCollection('mothlyMDMData').then(data => {
      const monthwiseSorted = sortMonthwise(data);
      setMonthlyReportState(monthwiseSorted);
      setLoader(false);
      calledData(monthwiseSorted);
    });
  };
  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      const entry = {
        id: thisMonthlyData.id,
        month: thisMonthlyData.month,
        year: thisMonthlyData.year,
        financialYear: thisMonthlyData.financialYear,
        worrkingDays: parseInt(thisMonthlyData.worrkingDays),
        totalWorkingDays: parseInt(thisMonthlyData.totalWorkingDays),
        ppTotal: parseInt(thisMonthlyData.ppTotal),
        pryTotal: parseInt(thisMonthlyData.pryTotal),
        monthlyPPCost: parseFloat(thisMonthlyData.monthlyPPCost),
        monthlyPRYCost: parseFloat(thisMonthlyData.monthlyPRYCost),
        totalCost: parseFloat(thisMonthlyData.totalCost),
        ricePPOB: parseFloat(thisMonthlyData.ricePPOB),
        ricePryOB: parseFloat(thisMonthlyData.ricePryOB),
        riceOB: parseFloat(thisMonthlyData.riceOB),
        ricePPRC: parseFloat(thisMonthlyData.ricePPRC),
        ricePryRC: parseFloat(thisMonthlyData.ricePryRC),
        ricePPEX: parseFloat(thisMonthlyData.ricePPEX),
        ricePryEX: parseFloat(thisMonthlyData.ricePryEX),
        ricePPCB: parseFloat(thisMonthlyData.ricePPCB),
        ricePryCB: parseFloat(thisMonthlyData.ricePryCB),
        riceCB: parseFloat(thisMonthlyData.riceCB),
        riceConsunption: parseFloat(thisMonthlyData.riceConsunption),
        riceGiven: parseFloat(thisMonthlyData.riceGiven),
        ppOB: parseFloat(thisMonthlyData.ppCB),
        pryOB: parseFloat(thisMonthlyData.pryCB),
        ppRC: parseFloat(thisMonthlyData.ppRC),
        pryRC: parseFloat(thisMonthlyData.pryRC),
        ppCB: parseFloat(thisMonthlyData.ppCB),
        pryCB: parseFloat(thisMonthlyData.pryCB),
        prevPpRC: parseFloat(thisMonthlyData.prevPpRC),
        prevPryRC: parseFloat(thisMonthlyData.prevPryRC),
        prevMonthlyPPCost: parseFloat(thisMonthlyData.prevMonthlyPPCost),
        prevMonthlyPRYCost: parseFloat(thisMonthlyData.prevMonthlyPRYCost),
        prevRicePPRC: parseFloat(thisMonthlyData.prevRicePPRC),
        prevRicePryRC: parseFloat(thisMonthlyData.prevRicePryRC),
        prevRicePPEX: parseFloat(thisMonthlyData.prevRicePPEX),
        prevRicePryEX: parseFloat(thisMonthlyData.prevRicePryEX),
        remarks: thisMonthlyData.remarks,
        ppStudent: parseInt(thisMonthlyData.ppStudent),
        pryStudent: parseInt(thisMonthlyData.pryStudent),
        totalStudent: parseInt(thisMonthlyData.totalStudent),
        date: thisMonthlyData.year.toString(),
      };
      await setDocument('mothlyMDMData', thisMonthlyData.id, entry)
        .then(() => {
          showToast('success', 'Monthly MDM Data Submitted successfully');
          setLoader(false);
          let z = monthlyReportState.filter(
            item => item.id !== thisMonthlyData.id,
          );
          z = [...z, entry];
          setMonthlyReportState(sortMonthwise(z));
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
  useEffect(() => {
    if (monthlyReportState.length === 0) {
      getMonthlyData();
    } else {
      calledData(monthlyReportState);
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
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}
      >
        <Text style={styles.title}>
          Submit MDM RETURN of {thisMonthlyData?.month.toUpperCase()}{' '}
          {thisMonthlyData?.year}
        </Text>
        <View style={{ marginHorizontal: responsiveHeight(2) }}>
          {JSON.stringify(thisMonthlyData)
            .split(`"`)
            .join('')
            .split('{')
            .join('')
            .split('}')
            .join('')
            .split(',')
            .map((item, index) => (
              <View key={index}>
                <CustomTextInput
                  title={item.split(':')[0].toUpperCase()}
                  placeholder={item.split(':')[0]}
                  size={item.length >= 30 ? 'large' : undefined}
                  value={item.split(':')[1]}
                  onChangeText={e => {
                    setThisMonthlyData({
                      ...thisMonthlyData,
                      [item.split(':')[0]]: e,
                    });
                  }}
                />
              </View>
            ))}
          {thisMonthlyData.id !== '' && (
            <View>
              <CustomButton
                title={'Submit Data'}
                onClick={() => submitMonthlyData()}
              />
              <CustomButton
                title={'Back'}
                color={'red'}
                onClick={() => {
                  navigation.navigate('Home');
                  setActiveTab(0);
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <Loader visible={loader} />
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
