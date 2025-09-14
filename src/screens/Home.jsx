import { StyleSheet, View, BackHandler, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalContext } from '../context/Store';
import RNExitApp from 'react-native-exit-app';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Header from '../components/Header';
import Dashboard from './Dashboard';
import Notice from './Notice';
import Settings from './Settings';
import SideBar from '../components/SideBar';
import Admission from './Admission';
import ViewAdmission from './ViewAdmission';
import MDMEntry from './MDMEntry';
import MDMAccounts from './MDMAccounts';
import MDMTransactions from './MDMTransactions';
import VECAccount from './VECAccount';
import VECTransactions from './VECTransactions';
import Expense from './Expense';
import ExpenseTransactions from './ExpenseTransactions';
import StudentList from './StudentList';
import Result from './Result';
import TeachersReturn from './TeachersReturn';
import AgeCalculator from './AgeCalculator';
import Downloads from './Downloads';
import TeacherLeaves from './TeacherLeaves';
import CreateHeroResult from './CreateHeroResult';
import AdmissionRegister from './AdmissionRegister';

export default function Home() {
  const { activeTab } = useGlobalContext();

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
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Header />
      <ScrollView
        style={{
          marginTop: responsiveHeight(9),
          alignSelf: 'center',
        }}
      >
        <View>
          {activeTab === 0 ? (
            <Dashboard />
          ) : activeTab === 1 ? (
            <Notice />
          ) : activeTab === 2 ? (
            <Settings />
          ) : activeTab === 3 ? (
            <Admission />
          ) : activeTab === 4 ? (
            <ViewAdmission />
          ) : activeTab === 5 ? (
            <MDMEntry />
          ) : activeTab === 6 ? (
            <MDMAccounts />
          ) : activeTab === 7 ? (
            <MDMTransactions />
          ) : activeTab === 8 ? (
            <VECAccount />
          ) : activeTab === 9 ? (
            <VECTransactions />
          ) : activeTab === 10 ? (
            <Expense />
          ) : activeTab === 11 ? (
            <ExpenseTransactions />
          ) : activeTab === 12 ? (
            <StudentList />
          ) : activeTab === 13 ? (
            <Result />
          ) : activeTab === 14 ? (
            <TeachersReturn />
          ) : activeTab === 15 ? (
            <AgeCalculator />
          ) : activeTab === 16 ? (
            <Downloads />
          ) : activeTab === 17 ? (
            <TeacherLeaves />
          ) : activeTab === 18 ? (
            <CreateHeroResult />
          ) : activeTab === 19 ? (
            <AdmissionRegister />
          ) : null}
        </View>
        <SideBar />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
