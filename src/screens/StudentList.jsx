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
import React, { useState, useEffect, useRef } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useGlobalContext } from '../context/Store';
import { showToast } from '../modules/Toaster';
import { todayInString } from '../modules/calculatefunctions';
import AnimatedSeacrch from '../components/AnimatedSeacrch';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import {
  deleteDocument,
  getCollection,
  setDocument,
  updateDocument,
} from '../firebase/firestoreHelper';
export default function StudentList() {
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
    setActiveTab,
  } = useGlobalContext();
  const navigation = useNavigation();
  const access = state?.ACCESS;
  const docId = uuid.v4().split('-')[0];
  const [showTable, setShowTable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [firstData, setFirstData] = useState(0);
  const [visibleItems, setVisibleItems] = useState(10);
  const [pageData, setPageData] = useState(10);
  const scrollRef = useRef();
  const [addStudent, setAddStudent] = useState({
    nclass: 0,
    mobile: '',
    id: docId,
    student_id: '',
    guardians_name: '',
    class: 'CLASS PP (A)',
    father_name: '',
    roll_no: 1,
    birthdate: todayInString(),
    student_name: '',
    mother_name: '',
    gender: 'BOYS',
    aadhaar: '',
  });
  const [editStudent, setEditStudent] = useState({
    nclass: 0,
    mobile: '',
    id: '',
    student_id: '',
    guardians_name: '',
    class: '',
    father_name: '',
    roll_no: 1,
    birthdate: todayInString(),
    student_name: '',
    mother_name: '',
    gender: 'BOYS',
    aadhaar: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  const loadPrev = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems - pageData);
    setFirstData(firstData - pageData);
    scrollToTop();
  };
  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + pageData);
    setFirstData(firstData + pageData);
    scrollToTop();
  };
  const getStudentData = async () => {
    setLoader(true);
    await getCollection('students').then(data => {
      setData(data);
      setFilteredData(data);
      setShowTable(true);
      setStudentState(data);
      setStudentUpdateTime(Date.now());
      setLoader(false);
    });
  };
  const addNewStudent = async () => {
    setLoader(true);
    try {
      await setDocument('students', addStudent.id, addStudent)
        .then(() => {
          showToast('success', 'Student added successfully');
          const newData = [...studentState, addStudent].sort((a, b) => {
            if (a.nclass < b.nclass) return -1;
            if (a.nclass > b.nclass) return 1;
            if (a.roll_no < b.roll_no) return -1;
            if (a.roll_no > b.roll_no) return 1;
            return 0;
          });
          setStudentState(newData);
          setData(newData);
          setFilteredData(newData);
          setAddStudent({
            nclass: 0,
            mobile: '',
            id: docId,
            student_id: '',
            guardians_name: '',
            class: 'CLASS PP (A)',
            father_name: '',
            roll_no: 1,
            birthdate: todayInString(),
            student_name: '',
            mother_name: '',
          });
          setStudentUpdateTime(Date.now());
          setLoader(false);
          setShowAddModal(false);
        })
        .catch(e => {
          showToast('error', 'Failed to Add Student');
          console.log(e);
          setLoader(false);
        });
    } catch (error) {
      showToast('error', 'Failed to Add Student');
      console.log(error);
      setLoader(false);
    }
  };
  const updateStudentData = async () => {
    setLoader(true);
    try {
      await updateDocument('students', editStudent.id, editStudent)
        .then(() => {
          showToast('success', 'Student Details Updated Successfully');
          const newData = studentState.map(item =>
            item.id === editStudent.id ? editStudent : item,
          );
          setStudentState(newData);
          setData(newData);
          setFilteredData(newData);
          setEditStudent({
            nclass: 0,
            mobile: '',
            id: '',
            student_id: '',
            guardians_name: '',
            class: '',
            father_name: '',
            roll_no: 1,
            birthdate: todayInString(),
            student_name: '',
            mother_name: '',
          });
          setStudentUpdateTime(Date.now());
          setLoader(false);
          setShowEditModal(false);
        })
        .catch(e => {
          showToast('error', 'Failed to Update Student Details');
          console.log(e);
          setLoader(false);
        });
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to Update Student Details');
      setLoader(false);
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
      await deleteDocument('students', entry?.id)
        .then(async () => {
          const newData = studentState.filter(item => item.id !== entry?.id);
          setStudentState(newData);
          setData(newData);
          setFilteredData(newData);
          setStudentUpdateTime(Date.now());
          setLoader(false);
          showToast('success', 'Student Deleted Successfully');
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
  useEffect(() => {
    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      getStudentData();
    } else {
      setData(studentState);
      setFilteredData(studentState);
      setShowTable(true);
    }
  }, []);
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
      <Loader visible={loader} />
      <ScrollView
        ref={scrollRef}
        style={{ marginVertical: responsiveHeight(2) }}
      >
        {access === 'teacher' && (
          <CustomButton
            title={'Add Student'}
            color={'green'}
            onClick={() => setShowAddModal(!showAddModal)}
          />
        )}
        <Text style={styles.title}>Students List</Text>
        <AnimatedSeacrch
          value={search}
          placeholder={'Search Student Name'}
          onChangeText={text => {
            const fdata = studentState.filter(item =>
              item.student_name.toLowerCase().includes(text.toLowerCase()),
            );
            setSearch(text);
            setFilteredData(fdata);
            setFirstData(0);
            setVisibleItems(fdata.length);
          }}
          onClick={() => {
            setSearch('');
            setFilteredData(studentState);
            setFirstData(0);
            setVisibleItems(10);
          }}
          func={() => {
            setSearch('');
            setFilteredData(studentState);
            setFirstData(0);
            setVisibleItems(10);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: responsiveHeight(1),
          }}
        >
          {firstData >= 10 && (
            <View>
              <CustomButton
                color={'orange'}
                title={'Previous'}
                onClick={loadPrev}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
          {visibleItems < filteredData.length && (
            <View>
              <CustomButton
                title={'Next'}
                onClick={loadMore}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
        </View>

        {filteredData.length > 0 && showTable ? (
          <FlatList
            data={filteredData.slice(firstData, visibleItems)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.dataView} key={index}>
                  <Text selectable style={styles.bankDataText}>
                    Sl: {studentState.findIndex(i => i.id === item.id) + 1}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Student Name: {item.student_name}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Class: {item.class?.split(' (A)')[0]}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Roll No.: {item.roll_no}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Father's Name: {item.father_name}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Mother's Name: {item.mother_name}
                  </Text>
                  {access && (
                    <Text selectable style={styles.bankDataText}>
                      Student ID: {item.student_id}
                    </Text>
                  )}
                  {access === 'teacher' && (
                    <View>
                      {item.mobile === '0' ? null : item.mobile ===
                        '9999999999' ? null : item.mobile ===
                        '7872882343' ? null : item.mobile ===
                        '7679230482' ? null : (
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                          }}
                          onPress={async () =>
                            await Linking.openURL(
                              `tel:${parseInt(item.mobile)}`,
                            )
                          }
                        >
                          <Text selectable style={styles.bankDataText}>
                            Mobile: {item.mobile}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <Text selectable style={styles.bankDataText}>
                        Date of Birth: {item.birthdate}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          alignSelf: 'center',
                          width: responsiveWidth(50),
                        }}
                      >
                        <CustomButton
                          title={'Edit'}
                          color={'orange'}
                          size={'xsmall'}
                          onClick={() => {
                            setEditStudent(item);
                            setShowEditModal(true);
                          }}
                        />
                        <CustomButton
                          title={'Delete'}
                          color={'red'}
                          size={'xsmall'}
                          onClick={() => {
                            showConfirmDialog(item);
                          }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <Text selectable style={styles.bankDataText}>
            No Entry found for the selected Year.
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: responsiveHeight(1),
          }}
        >
          {firstData >= 10 && (
            <View>
              <CustomButton
                color={'orange'}
                title={'Previous'}
                onClick={loadPrev}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
          {visibleItems < filteredData.length && (
            <View>
              <CustomButton
                title={'Next'}
                onClick={loadMore}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
        </View>
        <Modal
          onRequestClose={() => {
            setShowEditModal(false);
            setEditStudent({
              nclass: 0,
              mobile: '',
              id: '',
              student_id: '',
              guardians_name: '',
              class: '',
              father_name: '',
              roll_no: 1,
              birthdate: todayInString(),
              student_name: '',
              mother_name: '',
            });
          }}
          animationIn={'fadeInUpBig'}
          animationOut={'fadeOutLeftBig'}
          animationInTiming={500}
          animationOutTiming={500}
          statusBarTranslucent={true}
          onBackdropPress={() => {
            setShowEditModal(false);
            setEditStudent({
              nclass: 0,
              mobile: '',
              id: '',
              student_id: '',
              guardians_name: '',
              class: '',
              father_name: '',
              roll_no: 1,
              birthdate: todayInString(),
              student_name: '',
              mother_name: '',
            });
          }}
          visible={showEditModal}
          transparent
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: responsiveWidth(90),
              height: responsiveHeight(90),
              backgroundColor: 'white',
              borderRadius: 10,
            }}
          >
            <ScrollView
              style={{
                width: responsiveWidth(90),
                padding: 5,
              }}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text
                selectable
                style={{
                  fontSize: responsiveFontSize(2.5),
                  fontWeight: '500',
                  textAlign: 'center',
                  color: THEME_COLOR,
                }}
              >
                Edit Student Details of {editStudent.student_name}
              </Text>

              <CustomTextInput
                placeholder={"Student's Name"}
                title={"Student's Name"}
                value={editStudent.student_name}
                onChangeText={text => {
                  setEditStudent({
                    ...editStudent,
                    student_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={"Father's Name"}
                title={"Father's Name"}
                value={editStudent.father_name}
                onChangeText={text => {
                  setEditStudent({
                    ...editStudent,
                    father_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={"Mother's Name"}
                title={"Mother's Name"}
                value={editStudent.mother_name}
                onChangeText={text => {
                  setEditStudent({
                    ...editStudent,
                    mother_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={"Gurdian's Name"}
                title={"Gurdian's Name"}
                value={editStudent.guardians_name}
                onChangeText={text => {
                  setEditStudent({
                    ...editStudent,
                    guardians_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Birthday'}
                title={'Birthday'}
                value={editStudent.birthdate}
                onChangeText={text => {
                  setEditStudent({
                    ...editStudent,
                    birthdate: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Class'}
                title={'Class'}
                value={editStudent.class}
                onChangeText={text => {
                  const value = text.toUpperCase();
                  if (value === 'CLASS PP (A)') {
                    setEditStudent({
                      ...editStudent,
                      class: value,
                      nclass: 0,
                    });
                  } else if (value === 'CLASS I (A)') {
                    setEditStudent({
                      ...editStudent,
                      class: value,
                      nclass: 1,
                    });
                  } else if (value === 'CLASS II (A)') {
                    setEditStudent({
                      ...editStudent,
                      class: value,
                      nclass: 2,
                    });
                  } else if (value === 'CLASS III (A)') {
                    setEditStudent({
                      ...editStudent,
                      class: value,
                      nclass: 3,
                    });
                  } else if (value === 'CLASS IV (A)') {
                    setEditStudent({
                      ...editStudent,
                      class: value,
                      nclass: 4,
                    });
                  } else if (value === 'CLASS V (A)') {
                    setEditStudent({
                      ...editStudent,
                      class: value,
                      nclass: 5,
                    });
                  }
                  setEditStudent({ ...editStudent, class: value, nclass: 0 });
                }}
              />
              <CustomTextInput
                placeholder={'Roll No.'}
                title={'Roll No.'}
                type={'number-pad'}
                value={editStudent.roll_no.toString() || ''}
                onChangeText={e => {
                  if (e !== '') {
                    setEditStudent({
                      ...editStudent,
                      roll_no: parseInt(e),
                    });
                  } else {
                    setEditStudent({
                      ...editStudent,
                      roll_no: '',
                    });
                  }
                }}
              />

              <CustomTextInput
                placeholder={'Gender e.g. "BOYS" OR "GIRLS"'}
                title={'Gender'}
                type={'number-pad'}
                value={editStudent.gender}
                onChangeText={e => {
                  setEditStudent({
                    ...editStudent,
                    gender: e,
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Student ID'}
                title={'Student ID'}
                type={'number-pad'}
                value={editStudent.student_id}
                onChangeText={e => {
                  setEditStudent({
                    ...editStudent,
                    student_id: e,
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Mobile Number'}
                title={'Mobile Number'}
                type={'number-pad'}
                value={editStudent.mobile}
                onChangeText={e => {
                  setEditStudent({
                    ...editStudent,
                    mobile: e,
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Aadhaar No.'}
                title={'Aadhaar No.'}
                type={'number-pad'}
                value={editStudent.aadhaar}
                onChangeText={e => {
                  setEditStudent({
                    ...editStudent,
                    aadhaar: parseInt(e),
                  });
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: responsiveWidth(60),
                  marginBottom: responsiveHeight(2),
                }}
              >
                <CustomButton
                  marginTop={responsiveHeight(1)}
                  title={'Save'}
                  size={'xsmall'}
                  onClick={updateStudentData}
                />
                <CustomButton
                  marginTop={responsiveHeight(1)}
                  title={'Close'}
                  size={'xsmall'}
                  color={'purple'}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditStudent({
                      nclass: 0,
                      mobile: '',
                      id: '',
                      student_id: '',
                      guardians_name: '',
                      class: '',
                      father_name: '',
                      roll_no: 1,
                      birthdate: todayInString(),
                      student_name: '',
                      mother_name: '',
                    });
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          onRequestClose={() => {
            setShowAddModal(false);
            setAddStudent({
              nclass: 0,
              mobile: '',
              id: docId,
              student_id: '',
              guardians_name: '',
              class: '',
              father_name: '',
              roll_no: 1,
              birthdate: todayInString(),
              student_name: '',
              mother_name: '',
            });
          }}
          animationType="slide"
          visible={showAddModal}
          animationIn={'fadeInUpBig'}
          animationOut={'fadeOutLeftBig'}
          animationInTiming={500}
          animationOutTiming={500}
          statusBarTranslucent={true}
          onBackdropPress={() => {
            setShowAddModal(false);
            setAddStudent({
              nclass: 0,
              mobile: '',
              id: docId,
              student_id: '',
              guardians_name: '',
              class: '',
              father_name: '',
              roll_no: 1,
              birthdate: todayInString(),
              student_name: '',
              mother_name: '',
            });
          }}
          transparent
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: responsiveWidth(90),
              height: responsiveHeight(90),
              backgroundColor: 'white',
              borderRadius: 10,
            }}
          >
            <ScrollView
              style={{
                width: responsiveWidth(90),
                padding: 5,
              }}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text
                selectable
                style={{
                  fontSize: responsiveFontSize(2.5),
                  fontWeight: '500',
                  textAlign: 'center',
                  color: THEME_COLOR,
                }}
              >
                Add New Student
              </Text>
              <Text
                selectable
                style={{
                  fontSize: responsiveFontSize(1.5),
                  fontWeight: '500',
                  textAlign: 'center',
                  color: THEME_COLOR,
                }}
              >
                ID: {addStudent.id}
              </Text>

              <CustomTextInput
                placeholder={"Student's Name"}
                title={"Student's Name"}
                value={addStudent.student_name}
                onChangeText={text => {
                  setAddStudent({
                    ...addStudent,
                    student_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={"Father's Name"}
                title={"Father's Name"}
                value={addStudent.father_name}
                onChangeText={text => {
                  setAddStudent({
                    ...addStudent,
                    father_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={"Mother's Name"}
                title={"Mother's Name"}
                value={addStudent.mother_name}
                onChangeText={text => {
                  setAddStudent({
                    ...addStudent,
                    mother_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={"Gurdian's Name"}
                title={"Gurdian's Name"}
                value={addStudent.guardians_name}
                onChangeText={text => {
                  setAddStudent({
                    ...addStudent,
                    guardians_name: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Birthday'}
                title={'Birthday'}
                value={addStudent.birthdate}
                onChangeText={text => {
                  setAddStudent({
                    ...addStudent,
                    birthdate: text.toUpperCase(),
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Class'}
                title={'Class'}
                value={addStudent.class}
                onChangeText={text => {
                  const value = text.toUpperCase();
                  if (value === 'CLASS PP (A)') {
                    setAddStudent({
                      ...addStudent,
                      class: value,
                      nclass: 0,
                    });
                  } else if (value === 'CLASS I (A)') {
                    setAddStudent({
                      ...addStudent,
                      class: value,
                      nclass: 1,
                    });
                  } else if (value === 'CLASS II (A)') {
                    setAddStudent({
                      ...addStudent,
                      class: value,
                      nclass: 2,
                    });
                  } else if (value === 'CLASS III (A)') {
                    setAddStudent({
                      ...addStudent,
                      class: value,
                      nclass: 3,
                    });
                  } else if (value === 'CLASS IV (A)') {
                    setAddStudent({
                      ...addStudent,
                      class: value,
                      nclass: 4,
                    });
                  } else if (value === 'CLASS V (A)') {
                    setAddStudent({
                      ...addStudent,
                      class: value,
                      nclass: 5,
                    });
                  }
                  setAddStudent({ ...addStudent, class: value, nclass: 0 });
                }}
              />
              <CustomTextInput
                placeholder={'Roll No.'}
                title={'Roll No.'}
                type={'number-pad'}
                value={addStudent.roll_no.toString() || ''}
                onChangeText={e => {
                  if (e !== '') {
                    setAddStudent({
                      ...addStudent,
                      roll_no: parseInt(e),
                    });
                  } else {
                    setAddStudent({
                      ...addStudent,
                      roll_no: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                placeholder={'Student ID'}
                title={'Student ID'}
                type={'number-pad'}
                value={addStudent.student_id}
                onChangeText={e => {
                  setAddStudent({
                    ...addStudent,
                    student_id: e,
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Gender e.g. "BOYS" OR "GIRLS"'}
                title={'Gender'}
                value={addStudent.gender}
                onChangeText={e => {
                  setAddStudent({
                    ...addStudent,
                    gender: e,
                  });
                }}
              />

              <CustomTextInput
                placeholder={'Mobile Number'}
                title={'Mobile Number'}
                type={'number-pad'}
                value={addStudent.mobile}
                onChangeText={e => {
                  setAddStudent({
                    ...addStudent,
                    mobile: e,
                  });
                }}
              />
              <CustomTextInput
                placeholder={'Aadhaar No.'}
                title={'Aadhaar No.'}
                type={'number-pad'}
                value={addStudent.aadhaar}
                onChangeText={e => {
                  setAddStudent({
                    ...addStudent,
                    aadhaar: parseInt(e),
                  });
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: responsiveWidth(60),
                  marginBottom: responsiveHeight(2),
                }}
              >
                <CustomButton
                  marginTop={responsiveHeight(1)}
                  title={'Save'}
                  size={'xsmall'}
                  onClick={() => {
                    if (addStudent.student_name === '') {
                      Alert.alert('Please enter Student Name');
                    } else if (addStudent.father_name === '') {
                      Alert.alert('Please enter Father Name');
                    } else if (addStudent.mother_name === '') {
                      Alert.alert('Please enter Mother Name');
                    } else if (addStudent.guardians_name === '') {
                      Alert.alert('Please enter Guardians Name');
                    } else if (addStudent.class === '') {
                      Alert.alert('Please select Class');
                    } else if (addStudent.roll_no === '') {
                      Alert.alert('Please enter Roll No.');
                    } else if (addStudent.student_id === '') {
                      Alert.alert('Please enter Student ID');
                    } else if (addStudent.mobile === '') {
                      Alert.alert('Please enter Mobile Number');
                    } else {
                      setShowAddModal(false);
                      addNewStudent();
                    }
                  }}
                />
                <CustomButton
                  marginTop={responsiveHeight(1)}
                  title={'Close'}
                  size={'xsmall'}
                  color={'purple'}
                  onClick={() => {
                    setShowAddModal(false);
                    setAddStudent({
                      nclass: 0,
                      mobile: '',
                      id: docId,
                      student_id: '',
                      guardians_name: '',
                      class: '',
                      father_name: '',
                      roll_no: 1,
                      birthdate: todayInString(),
                      student_name: '',
                      mother_name: '',
                    });
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(3),
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
    backgroundColor: 'palegoldenrod',
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
    width: responsiveWidth(96),
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
