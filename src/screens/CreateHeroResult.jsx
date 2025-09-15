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
const firestore = getFirestore();

export default function CreateHeroResult() {
  const { state, studentResultState, setStudentResultState, setActiveTab } =
    useGlobalContext();
  const navigation = useNavigation();
  const access = state?.ACCESS;
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [viewResult, setViewResult] = useState(false);
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
  const [showEdit, setShowEdit] = useState(false);
  const [editStudentMarks, setEditStudentMarks] = useState({
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

  // Selection states
  const [selectPart, setSelectPart] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFullSubject, setSelectedFullSubject] = useState('');
  const [isPartSelected, setIsPartSelected] = useState(false);
  const [isClassSelected, setIsClassSelected] = useState(false);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);

  // Marks input state
  const [marksInput, setMarksInput] = useState([]);

  const subjects = [
    { fullName: 'Bengali', shortName: 'ben' },
    { fullName: 'English', shortName: 'eng' },
    { fullName: 'Mathematics', shortName: 'math' },
    { fullName: 'Work Education', shortName: 'work' },
    { fullName: 'Health', shortName: 'health' },
    { fullName: 'ENVS', shortName: 'envs' },
  ];

  const studentData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, 'studentsResult')),
    );
    const data = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setLoader(false);
    setStudentResultState(data);
  };
  // When subject is selected, initialize marks input
  useEffect(() => {
    if (isSubjectSelected) {
      const partNumber = selectPart.split(' ')[1];
      const subjectPartKey = `${selectedSubject}${partNumber}`;
      const studentsInClass = data.filter(
        student => student.class === selectedClass,
      );
      const initialMarks = studentsInClass.map(student => ({
        id: student.id,
        mark: student[subjectPartKey] || 0,
      }));
      setMarksInput(initialMarks);
    }
  }, [isSubjectSelected, selectedClass, selectedSubject, selectPart, data]);

  const handleMarkChange = (id, value) => {
    if (value) {
      setMarksInput(prev =>
        prev.map(item =>
          item.id === id ? { ...item, mark: parseInt(value) || 0 } : item,
        ),
      );
    } else {
      setMarksInput(prev =>
        prev.map(item => (item.id === id ? { ...item, mark: '' } : item)),
      );
    }
  };

  const handleSaveMarks = async () => {
    setShowAddMarks(false);
    setLoader(true);
    const partNumber = selectPart.split(' ')[1];
    const subjectPartKey = `${selectedSubject}${partNumber}`;

    try {
      const batch = writeBatch(firestore);

      for (const item of marksInput) {
        const studentRef = doc(firestore, 'studentsResult', item.id);
        batch.update(studentRef, {
          [subjectPartKey]: item.mark,
        });
      }

      await batch.commit();

      // Update local state
      const updatedData = data.map(student => {
        const markItem = marksInput.find(item => item.id === student.id);
        if (markItem) {
          return {
            ...student,
            [subjectPartKey]: markItem.mark,
          };
        }
        return student;
      });

      setData(updatedData);
      setStudentResultState(updatedData);
      setFilteredData(updatedData);
      showToast('success', 'Marks updated successfully');
      setSelectPart('');
      setIsPartSelected(false);
      setSelectedClass('');
      setIsClassSelected(false);
      setSelectedSubject('');
      setSelectedFullSubject('');
      setIsSubjectSelected(false);
    } catch (error) {
      showToast('error', 'Error updating marks');
      console.error('Error updating marks:', error);
    } finally {
      setLoader(false);
    }
  };

  const updateStudentResult = async () => {
    setLoader(true);
    await updateDoc(
      doc(firestore, 'studentsResult', editStudentMarks.id),
      editStudentMarks,
    )
      .then(() => {
        const newData = studentResultState.map(item =>
          item.id === editStudentMarks.id ? editStudentMarks : item,
        );
        setData(newData);
        setStudentResultState(newData);
        setFilteredData(newData);
        showToast('success', 'Marks updated successfully');
        setLoader(false);
      })
      .catch(e => {
        showToast('error', 'Failed to update Student Data!');
        setLoader(false);
      });
  };
  // Render item for FlatList
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.dataView}
      onPress={() => {
        setViewStudent(item);
        setViewResult(true);
      }}
    >
      <Text style={styles.dataText}>Sl: {index + 1}</Text>
      <Text style={styles.dataText}>ID: {item.student_id}</Text>
      <Text style={styles.dataText}>Name: {item.student_name}</Text>
      <Text style={styles.dataText}>Roll: {item.roll_no}</Text>
      <Text style={styles.dataText}>Class: {item.class}</Text>
      <Text style={styles.dataText}>
        Total Marks:{' '}
        {(item.ben1 ? item.ben1 : 0) +
          (item.ben2 ? item.ben2 : 0) +
          (item.ben3 ? item.ben3 : 0) +
          (item.eng1 ? item.eng1 : 0) +
          (item.eng2 ? item.eng2 : 0) +
          (item.eng3 ? item.eng3 : 0) +
          (item.math1 ? item.math1 : 0) +
          (item.math2 ? item.math2 : 0) +
          (item.math3 ? item.math3 : 0) +
          (item.work1 ? item.work1 : 0) +
          (item.work2 ? item.work2 : 0) +
          (item.work3 ? item.work3 : 0) +
          (item.health1 ? item.health1 : 0) +
          (item.health2 ? item.health2 : 0) +
          (item.health3 ? item.health3 : 0) +
          (item.envs1 ? item.envs1 : 0) +
          (item.envs2 ? item.envs2 : 0) +
          (item.envs3 ? item.envs3 : 0)}
      </Text>
    </TouchableOpacity>
  );
  useEffect(() => {
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    }
    if (studentResultState.length === 0) {
      studentData();
    } else {
      setData(studentResultState);
    }
  }, [isFocused]);

  useEffect(() => {
    const result = data.filter(el =>
      el.student_name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredData(result);
  }, [search, data]);
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
    <View style={styles.container}>
      <Loader visible={loader} />
      <ScrollView style={{ marginBottom: responsiveHeight(2) }}>
        <Text style={styles.title}>{SCHOOLNAME}</Text>
        {!showAddMarks && !viewResult && !showEdit && (
          <ScrollView style={{ marginBottom: responsiveHeight(2) }}>
            <CustomButton
              title={'Enter Marks'}
              color={'green'}
              size={'medium'}
              onClick={() => {
                setShowAddMarks(true);
                setViewResult(false);
                setShowEdit(false);
              }}
            />
            <Text style={styles.title}>Student's Result Details</Text>
            <AnimatedSeacrch
              title={'Search by student name'}
              placeholder="Search by student name"
              value={search}
              onChangeText={text => setSearch(text)}
            />
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              scrollEnabled={false} // ✅ disables nested scrolling
            />
          </ScrollView>
        )}
        {showAddMarks && (
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text selectable style={styles.title}>
              Add Student Marks
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={selectPart}
                onValueChange={value => {
                  setSelectPart(value);
                  setIsPartSelected(!!value);
                  setIsClassSelected(false);
                  setIsSubjectSelected(false);
                  setSelectedClass('');
                  setSelectedSubject('');
                  setSelectedFullSubject('');
                }}
              >
                <Picker.Item
                  style={{
                    color: 'black',
                    backgroundColor: 'white',
                  }}
                  label="Select Part"
                  value=""
                />
                <Picker.Item
                  style={{
                    color: 'black',
                    backgroundColor: 'white',
                  }}
                  label="Part 1"
                  value="PART 1"
                />
                <Picker.Item
                  style={{
                    color: 'black',
                    backgroundColor: 'white',
                  }}
                  label="Part 2"
                  value="PART 2"
                />
                <Picker.Item
                  style={{
                    color: 'black',
                    backgroundColor: 'white',
                  }}
                  label="Part 3"
                  value="PART 3"
                />
              </Picker>
            </View>
            {isPartSelected && (
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedClass}
                  onValueChange={value => {
                    setSelectedClass(value);
                    setIsClassSelected(!!value);
                  }}
                >
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="Select Class"
                    value=""
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="CLASS PP"
                    value="CLASS PP"
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="CLASS I"
                    value="CLASS I"
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="CLASS II"
                    value="CLASS II"
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="CLASS III"
                    value="CLASS III"
                  />
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="CLASS IV"
                    value="CLASS IV"
                  />
                </Picker>
              </View>
            )}
            {isClassSelected && (
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedSubject}
                  onValueChange={value => {
                    setSelectedSubject(value);
                    setIsSubjectSelected(!!value);
                    setSelectedFullSubject(
                      subjects.find(sub => sub.shortName === value).fullName,
                    );
                  }}
                >
                  <Picker.Item
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    label="Select Subject"
                    value=""
                  />
                  {subjects.map((sub, index) => {
                    if (selectedClass === 'CLASS PP' && index < 3) {
                      return (
                        <Picker.Item
                          style={{
                            color: 'black',
                            backgroundColor: 'white',
                          }}
                          key={index}
                          label={sub.fullName}
                          value={sub.shortName}
                        />
                      );
                    } else if (
                      (selectedClass === 'CLASS I' ||
                        selectedClass === 'CLASS II') &&
                      index < 5
                    ) {
                      return (
                        <Picker.Item
                          style={{
                            color: 'black',
                            backgroundColor: 'white',
                          }}
                          key={index}
                          label={sub.fullName}
                          value={sub.shortName}
                        />
                      );
                    } else if (
                      selectedClass === 'CLASS III' ||
                      selectedClass === 'CLASS IV'
                    ) {
                      return (
                        <Picker.Item
                          style={{
                            color: 'black',
                            backgroundColor: 'white',
                          }}
                          key={index}
                          label={sub.fullName}
                          value={sub.shortName}
                        />
                      );
                    }
                    return null;
                  })}
                </Picker>
              </View>
            )}
            {isSubjectSelected && (
              <View style={{ marginBottom: responsiveHeight(2) }}>
                <Text selectable style={styles.title}>
                  Entering marks for {selectedClass} - {selectedFullSubject} -{' '}
                  {selectPart}
                </Text>
                {data
                  .filter(student => student.class === selectedClass)
                  .sort((a, b) => a.roll_no - b.roll_no)
                  .map(student => {
                    const markItem = marksInput.find(
                      item => item.id == student.id,
                    );
                    const mark = markItem ? markItem.mark : 0;

                    return (
                      <View key={student.id} style={styles.markInputContainer}>
                        <CustomTextInput
                          title={`${student.student_name} (Roll: ${student.roll_no})`}
                          type={'numberpad'}
                          placeholder="Enter Marks"
                          value={mark.toString()}
                          onChangeText={value => {
                            handleMarkChange(student.id, value);
                          }}
                        />
                      </View>
                    );
                  })}
              </View>
            )}
            <View style={styles.bottom}>
              {isSubjectSelected && (
                <CustomButton
                  title={'Save'}
                  color={'green'}
                  size={'small'}
                  onClick={handleSaveMarks}
                />
              )}
              {isPartSelected && (
                <CustomButton
                  title={'Reset'}
                  color={'darkred'}
                  size={'small'}
                  onClick={() => {
                    setSelectPart('');
                    setIsPartSelected(false);
                    setSelectedClass('');
                    setIsClassSelected(false);
                    setSelectedSubject('');
                    setSelectedFullSubject('');
                    setIsSubjectSelected(false);
                  }}
                />
              )}
              <CustomButton
                title={'Cancel'}
                color={'red'}
                size={'small'}
                onClick={() => {
                  setShowAddMarks(false);
                  setSelectPart('');
                  setIsPartSelected(false);
                  setSelectedClass('');
                  setIsClassSelected(false);
                  setSelectedSubject('');
                  setSelectedFullSubject('');
                  setIsSubjectSelected(false);
                }}
              />
            </View>
          </ScrollView>
        )}
        {viewResult && !showEdit && !loader && (
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
                title={'Edit'}
                color={'green'}
                size={'small'}
                onClick={() => {
                  setViewResult(false);
                  setShowEdit(true);
                  setEditStudentMarks(viewStudent);
                }}
              />
              <CustomButton
                title={'Cancel'}
                color={'red'}
                size={'small'}
                onClick={() => setViewResult(false)}
              />
            </View>
          </ScrollView>
        )}
        {showEdit && !viewResult && !loader && (
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text selectable style={styles.title}>
              Edit Marks of {editStudentMarks.student_name}
            </Text>
            <Text style={styles.label}>ID: {editStudentMarks.student_id}</Text>
            <Text style={styles.label}>Roll: {editStudentMarks.roll_no}</Text>
            <Text style={styles.label}>Class: {editStudentMarks.class}</Text>
            {[1, 2, 3].map(part => (
              <View key={part} style={{ marginBottom: responsiveHeight(1) }}>
                <Text style={styles.label}>Part {part}</Text>

                {subjects.map((subject, index) => {
                  const mark = editStudentMarks[`${subject.shortName}${part}`];
                  if (editStudentMarks.class === 'CLASS PP' && index < 3) {
                    return (
                      <CustomTextInput
                        title={`${subject.fullName} Marks`}
                        type={'numberpad'}
                        placeholder="Enter Marks"
                        value={mark.toString()}
                        onChangeText={value => {
                          const parsedValue = parseInt(value, 10);
                          setEditStudentMarks({
                            ...editStudentMarks,
                            [`${subject.shortName}${part}`]: isNaN(parsedValue)
                              ? ''
                              : parsedValue,
                          });
                        }}
                      />
                    );
                  } else if (
                    (editStudentMarks.class === 'CLASS I' ||
                      editStudentMarks.class === 'CLASS II') &&
                    index < 5
                  ) {
                    return (
                      <CustomTextInput
                        title={`${subject.fullName} Marks`}
                        type={'numberpad'}
                        placeholder="Enter Marks"
                        value={mark.toString()}
                        onChangeText={value => {
                          const parsedValue = parseInt(value, 10);
                          setEditStudentMarks({
                            ...editStudentMarks,
                            [`${subject.shortName}${part}`]: isNaN(parsedValue)
                              ? ''
                              : parsedValue,
                          });
                        }}
                      />
                    );
                  } else if (
                    editStudentMarks.class === 'CLASS III' ||
                    editStudentMarks.class === 'CLASS IV'
                  ) {
                    return (
                      <CustomTextInput
                        title={`${subject.fullName} Marks`}
                        type={'numberpad'}
                        placeholder="Enter Marks"
                        value={mark.toString()}
                        onChangeText={value => {
                          const parsedValue = parseInt(value, 10);
                          setEditStudentMarks({
                            ...editStudentMarks,
                            [`${subject.shortName}${part}`]: isNaN(parsedValue)
                              ? ''
                              : parsedValue,
                          });
                        }}
                      />
                    );
                  }
                })}
                <Text style={styles.label}>
                  Total Marks:{' '}
                  {part === 1
                    ? (editStudentMarks.ben1 ? editStudentMarks.ben1 : 0) +
                      (editStudentMarks.eng1 ? editStudentMarks.eng1 : 0) +
                      (editStudentMarks.math1 ? editStudentMarks.math1 : 0) +
                      (editStudentMarks.work1 ? editStudentMarks.work1 : 0) +
                      (editStudentMarks.health1
                        ? editStudentMarks.health1
                        : 0) +
                      (editStudentMarks.envs1 ? editStudentMarks.envs1 : 0)
                    : part === 2
                    ? (editStudentMarks.ben2 ? editStudentMarks.ben2 : 0) +
                      (editStudentMarks.eng2 ? editStudentMarks.eng2 : 0) +
                      (editStudentMarks.math2 ? editStudentMarks.math2 : 0) +
                      (editStudentMarks.work2 ? editStudentMarks.work2 : 0) +
                      (editStudentMarks.health2
                        ? editStudentMarks.health2
                        : 0) +
                      (editStudentMarks.envs2 ? editStudentMarks.envs2 : 0)
                    : (editStudentMarks.ben3 ? editStudentMarks.ben3 : 0) +
                      (editStudentMarks.eng3 ? editStudentMarks.eng3 : 0) +
                      (editStudentMarks.math3 ? editStudentMarks.math3 : 0) +
                      (editStudentMarks.work3 ? editStudentMarks.work3 : 0) +
                      (editStudentMarks.health3
                        ? editStudentMarks.health3
                        : 0) +
                      (editStudentMarks.envs3 ? editStudentMarks.envs3 : 0)}
                </Text>
              </View>
            ))}
            <Text style={styles.label}>
              Gross Total Marks:{' '}
              {(editStudentMarks.ben1 ? editStudentMarks.ben1 : 0) +
                (editStudentMarks.ben2 ? editStudentMarks.ben2 : 0) +
                (editStudentMarks.ben3 ? editStudentMarks.ben3 : 0) +
                (editStudentMarks.eng1 ? editStudentMarks.eng1 : 0) +
                (editStudentMarks.eng2 ? editStudentMarks.eng2 : 0) +
                (editStudentMarks.eng3 ? editStudentMarks.eng3 : 0) +
                (editStudentMarks.math1 ? editStudentMarks.math1 : 0) +
                (editStudentMarks.math2 ? editStudentMarks.math2 : 0) +
                (editStudentMarks.math3 ? editStudentMarks.math3 : 0) +
                (editStudentMarks.work1 ? editStudentMarks.work1 : 0) +
                (editStudentMarks.work2 ? editStudentMarks.work2 : 0) +
                (editStudentMarks.work3 ? editStudentMarks.work3 : 0) +
                (editStudentMarks.health1 ? editStudentMarks.health1 : 0) +
                (editStudentMarks.health2 ? editStudentMarks.health2 : 0) +
                (editStudentMarks.health3 ? editStudentMarks.health3 : 0) +
                (editStudentMarks.envs1 ? editStudentMarks.envs1 : 0) +
                (editStudentMarks.envs2 ? editStudentMarks.envs2 : 0) +
                (editStudentMarks.envs3 ? editStudentMarks.envs3 : 0)}
            </Text>
            <View style={styles.bottom}>
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'small'}
                onClick={() => {
                  setShowEdit(false);
                  updateStudentResult();
                }}
              />
              <CustomButton
                title={'Cancel'}
                color={'red'}
                size={'small'}
                onClick={() => setShowEdit(false)}
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
