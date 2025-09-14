'use client';
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext({
  state: {
    USER: {},
    ACCESS: null,
    LOGGEDAT: null,
    USERTYPE: null,
  },
  activeTab: 0,
  setActiveTab: () => '',
  setState: () => {},
  setStateArray: () => [],
  stateObject: {},
  setStateObject: () => {},
  applicationFormState: {
    id: '',
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
    student_addmission_date: '',
    student_addmission_dateAndTime: '',
  },
  returnState: [],
  setReturnState: () => [],
  setApplicationFormState: () => {},
  teachersState: [],
  setTeachersState: () => [],
  studentState: [],
  setStudentState: () => [],
  slideState: [],
  setSlideState: () => [],
  userState: [],
  setUserState: () => [],
  userUpdateTime: '',
  setUserUpdateTime: () => '',
  noticeState: [],
  setNoticeState: () => [],
  teacherUpdateTime: '',
  setTeacherUpdateTime: () => '',
  studentUpdateTime: '',
  setStudentUpdateTime: () => '',
  slideUpdateTime: '',
  setSlideUpdateTime: () => '',
  noticeUpdateTime: '',
  setNoticeUpdateTime: () => '',
  userUpdateTime: '',
  setUserUpdateTime: () => '',
  accountState: [],
  setAccountState: () => [],
  transactionState: [],
  setTransactionState: () => [],
  riceState: [],
  setRiceState: () => [],
  mealState: [],
  setMealState: () => [],
  monthlyReportState: [],
  setMonthlyReportState: () => [],
  expensesState: [],
  setExpensesState: () => [],
  expensesUpdateTime: '',
  setExpensesUpdateTime: () => '',
  sourceState: [],
  setSourceState: () => [],
  navState: false,
  setNavState: () => false,
  resultState: [],
  setResultState: () => [],
  StudentDataState: [],
  setStudentDataState: () => [],
  teacherLeaveState: [],
  setTeacherLeaveState: () => [],
  studentResultState: [],
  setStudentResultState: () => [],
  admissionRegisterState: [],
  setAdmissionRegisterState: () => [],
  leaveDateState: [],
  setLeaveDateState: () => [],
});
export const GlobalContextProvider = ({ children }) => {
  const [state, setState] = useState({
    USER: {},
    ACCESS: null,
    LOGGEDAT: null,
    USERTYPE: null,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [stateArray, setStateArray] = useState([]);
  const [stateObject, setStateObject] = useState({});
  const [teachersState, setTeachersState] = useState([]);
  const [userState, setUserState] = useState([]);
  const [studentState, setStudentState] = useState([]);
  const [slideState, setSlideState] = useState([]);
  const [noticeState, setNoticeState] = useState([]);
  const [teacherUpdateTime, setTeacherUpdateTime] = useState(Date.now() - 1000);
  const [studentUpdateTime, setStudentUpdateTime] = useState(Date.now() - 1000);
  const [slideUpdateTime, setSlideUpdateTime] = useState(Date.now() - 1000);
  const [noticeUpdateTime, setNoticeUpdateTime] = useState(Date.now() - 1000);
  const [userUpdateTime, setUserUpdateTime] = useState(Date.now() - 1000);
  const [accountState, setAccountState] = useState([]);
  const [transactionState, setTransactionState] = useState([]);
  const [riceState, setRiceState] = useState([]);
  const [mealState, setMealState] = useState([]);
  const [monthlyReportState, setMonthlyReportState] = useState([]);
  const [returnState, setReturnState] = useState([]);
  const [applicationFormState, setApplicationFormState] = useState({
    id: '',
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
    student_addmission_date: '',
    student_addmission_dateAndTime: '',
  });
  const [expensesState, setExpensesState] = useState([]);
  const [expensesUpdateTime, setExpensesUpdateTime] = useState(
    Date.now() - 1000,
  );
  const [sourceState, setSourceState] = useState([]);
  const [navState, setNavState] = useState(false);
  const [resultState, setResultState] = useState([]);
  const [StudentDataState, setStudentDataState] = useState([]);
  const [teacherLeaveState, setTeacherLeaveState] = useState([]);
  const [studentResultState, setStudentResultState] = useState([]);
  const [admissionRegisterState, setAdmissionRegisterState] = useState([]);
  const [leaveDateState, setLeaveDateState] = useState([]);
  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        activeTab,
        setActiveTab,
        stateArray,
        setStateArray,
        stateObject,
        setStateObject,
        teachersState,
        setTeachersState,
        studentState,
        setStudentState,
        slideState,
        setSlideState,
        userState,
        setUserState,
        noticeState,
        setNoticeState,
        teacherUpdateTime,
        setTeacherUpdateTime,
        studentUpdateTime,
        setStudentUpdateTime,
        slideUpdateTime,
        setSlideUpdateTime,
        noticeUpdateTime,
        setNoticeUpdateTime,
        userUpdateTime,
        setUserUpdateTime,
        accountState,
        setAccountState,
        transactionState,
        setTransactionState,
        riceState,
        setRiceState,
        mealState,
        setMealState,
        monthlyReportState,
        setMonthlyReportState,
        applicationFormState,
        setApplicationFormState,
        returnState,
        setReturnState,
        expensesState,
        setExpensesState,
        expensesUpdateTime,
        setExpensesUpdateTime,
        sourceState,
        setSourceState,
        navState,
        setNavState,
        resultState,
        setResultState,
        StudentDataState,
        setStudentDataState,
        teacherLeaveState,
        setTeacherLeaveState,
        studentResultState,
        setStudentResultState,
        admissionRegisterState,
        setAdmissionRegisterState,
        leaveDateState,
        setLeaveDateState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => useContext(GlobalContext);
