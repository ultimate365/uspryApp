import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  writeBatch,
} from '@react-native-firebase/firestore';
import { useGlobalContext } from '../context/Store';
import { SCHOOLNAME } from '../modules/constants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { showToast } from '../modules/Toaster';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { THEME_COLOR } from '../utils/Colors';
import CustomTextInput from '../components/CustomTextInput';
import AnimatedSeacrch from '../components/AnimatedSeacrch';
import { getDocumentByField } from '../firebase/firestoreHelper';
const firestore = getFirestore();

export default function Result() {
  const { state, studentResultState, setStudentResultState, setActiveTab } =
    useGlobalContext();
  const navigation = useNavigation();
  const access = state?.ACCESS;
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [showSearchedResult, setShowSearchedResult] = useState(false);
  const [viewStudent, setViewStudent] = useState({
    id: '',
    student_id: '',
    student_name: '',
    nclass: 0,
    roll_no: 1,
    class: 'CLASS PP',
    ben1: 0,
    eng1: 0,
    math1: 0,
    health1: 0,
    work1: 0,
    envs1: 0,
    ben2: 0,
    eng2: 0,
    math2: 0,
    envs2: 0,
    health2: 0,
    work2: 0,
    ben3: 0,
    eng3: 0,
    math3: 0,
    envs3: 0,
    health3: 0,
    work3: 0,
    total: 0,
    new_roll_no: 1,
  });
  const subjects = [
    { fullName: 'Bengali', shortName: 'ben' },
    { fullName: 'English', shortName: 'eng' },
    { fullName: 'Mathematics', shortName: 'math' },
    { fullName: 'Work Education', shortName: 'work' },
    { fullName: 'Health', shortName: 'health' },
    { fullName: 'ENVS', shortName: 'envs' },
  ];
  const searchApplication = async () => {
    setLoader(true);
    try {
      await getDocumentByField('studentsResult', 'student_id', studentId)
        .then(async data => {
          if (data && data.student_id === studentId && data.roll_no == rollNo) {
            setViewStudent(data);
            setShowSearchedResult(true);
            setLoader(false);
          } else {
            setShowSearchedResult(false);
            showToast('error', 'Result Not Found!');
            setLoader(false);
          }
        })
        .catch(e => {
          setLoader(false);
          console.error('Error getting documents: ', e);
        });
    } catch (error) {
      showToast('error', 'Result Not Found!');
      setShowSearchedResult(false);
      setLoader(false);
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Loader visible={loader} />
      <ScrollView style={{ marginBottom: responsiveHeight(2) }}>
        <Text style={styles.title}>{SCHOOLNAME}</Text>
        <Text style={styles.title}>Student's Result Details</Text>

        {!showSearchedResult ? (
          <View>
            <CustomTextInput
              title={'Enter Student ID'}
              type={'numberpad'}
              placeholder="Enter 14 Digit Student ID"
              value={studentId}
              maxLength={14}
              onChangeText={text => setStudentId(text)}
            />
            <CustomTextInput
              title={'Enter Roll No'}
              type={'numberpad'}
              placeholder="Enter Roll No"
              value={rollNo}
              maxLength={2}
              onChangeText={text => setRollNo(text)}
            />
            <CustomButton
              title={'Search'}
              color={'green'}
              size={'medium'}
              disabled={studentId.length != 14 || rollNo === ''}
              onClick={searchApplication}
            />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text selectable style={styles.title}>
              Results of {viewStudent.student_name}
            </Text>
            <Text style={styles.label}>ID: {viewStudent.student_id}</Text>
            <Text style={styles.label}>Roll: {viewStudent.roll_no}</Text>
            <Text style={styles.label}>Class: {viewStudent.class}</Text>
            {[1, 2, 3].map(part => (
              <View key={part} style={{ marginBottom: responsiveHeight(1) }}>
                <Text style={styles.label}>Part {part}</Text>

                {subjects.map((sub, index) => {
                  const subjectPartKey = `${sub.shortName}${part}`;
                  const mark = viewStudent[subjectPartKey];
                  return (
                    mark !== undefined &&
                    mark !== 0 && (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: responsiveWidth(5),
                          marginVertical: responsiveHeight(0.5),
                        }}
                      >
                        <Text style={styles.label}>{sub.fullName}</Text>
                        <Text style={styles.label}>{mark}</Text>
                      </View>
                    )
                  );
                })}
                <Text style={styles.label}>
                  Total Marks:{' '}
                  {part === 1
                    ? viewStudent.ben1 +
                      viewStudent.eng1 +
                      viewStudent.math1 +
                      viewStudent.work1 +
                      viewStudent.health1 +
                      viewStudent.envs1
                    : part === 2
                    ? viewStudent.ben2 +
                      viewStudent.eng2 +
                      viewStudent.math2 +
                      viewStudent.work2 +
                      viewStudent.health2 +
                      viewStudent.envs2
                    : viewStudent.ben3 +
                      viewStudent.eng3 +
                      viewStudent.math3 +
                      viewStudent.work3 +
                      viewStudent.health3 +
                      viewStudent.envs3}
                </Text>
              </View>
            ))}
            <Text style={styles.label}>
              Gross Total Marks:{' '}
              {viewStudent.ben1 +
                viewStudent.ben2 +
                viewStudent.ben3 +
                viewStudent.eng1 +
                viewStudent.eng2 +
                viewStudent.eng3 +
                viewStudent.math1 +
                viewStudent.math2 +
                viewStudent.math3 +
                viewStudent.work1 +
                viewStudent.work2 +
                viewStudent.work3 +
                viewStudent.health1 +
                viewStudent.health2 +
                viewStudent.health3 +
                viewStudent.envs1 +
                viewStudent.envs2 +
                viewStudent.envs3}
            </Text>
            <View style={styles.bottom}>
              <CustomButton
                title={'Close'}
                color={'blueviolet'}
                size={'small'}
                onClick={() => {
                  setShowSearchedResult(false);
                  setStudentId('');
                  setRollNo('');
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
  container: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '500',
    color: THEME_COLOR,
    textAlign: 'center',
    padding: 5,
    marginHorizontal: responsiveHeight(1),
  },
  bottom: {
    marginBottom: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
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
    marginBottom: responsiveHeight(2),
  },
  picker: { width: responsiveWidth(80), borderRadius: 10 },
});
