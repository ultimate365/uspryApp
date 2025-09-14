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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useGlobalContext } from '../context/Store';
import { showToast } from '../modules/Toaster';
import { todayInString, uniqArray } from '../modules/calculatefunctions';
import AnimatedSeacrch from '../components/AnimatedSeacrch';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import { firestore } from '../firebase/firestoreHelper';
import { WEBSITE } from '../modules/constants';
import FuzzySearch from '../components/FuzzySearch';
import { Picker } from '@react-native-picker/picker';
export default function AdmissionRegister() {
  const {
    state,
    admissionRegisterState,
    setAdmissionRegisterState,
    setActiveTab,
  } = useGlobalContext();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [showTable, setShowTable] = useState(false);
  const access = state.ACCESS;
  const [docId, setDocId] = useState('');
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showViewStudent, setShowViewStudent] = useState(false);
  const [yearArray, setYearArray] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const scrollRef = useRef();
  const [firstData, setFirstData] = useState(0);
  const [visibleItems, setVisibleItems] = useState(10);
  const [pageData, setPageData] = useState(10);
  const [showDldBtn, setShowDldBtn] = useState(false);

  const [addStudent, setAddStudent] = useState({
    id: '',
    father_name: '',
    student_name: '',
    mother_name: '',
    dob: '',
    year: '',
    ref: '',
  });
  const [viewStudent, setViewStudent] = useState({
    id: '',
    father_name: '',
    student_name: '',
    mother_name: '',
    dob: '',
    year: '',
    ref: '',
  });
  const [editStudent, setEditStudent] = useState({
    id: '',
    father_name: '',
    student_name: '',
    mother_name: '',
    dob: '',
    year: '',
    ref: '',
  });
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
  const AdmissionRegisterData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, 'admissionRegister')),
    );
    const data = querySnapshot.docs.map(doc => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setShowTable(true);
    setAdmissionRegisterState(data);
    let years = [];
    data.map(item => {
      years.push(item.year);
    });
    setYearArray(uniqArray(years));
  };
  const addNewStudent = async () => {
    setShowTable(false);
    try {
      await setDoc(
        doc(firestore, 'admissionRegister', addStudent.id),
        addStudent,
      )
        .then(() => {
          showToast('success', 'New Student Added Successfully');
          setAddStudent({
            id: docId,
            father_name: '',
            student_name: '',
            mother_name: '',
            dob: '',
            year: '',
            ref: '',
          });
          setShowAdd(false);
          const newData = admissionRegisterState.concat(addStudent);
          setAdmissionRegisterState(newData);
          setData(newData);
          setFilteredData(newData);
          setYearArray(uniqArray(newData.map(item => item.year)));
          setShowTable(true);
        })
        .catch(err => {
          showToast('error', 'Failed to add New Student!');
          setShowTable(true);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      setShowTable(true);
      showToast('error', 'Something went Wrong!');
    }
  };
  const submitAdmissionRegisterData = async () => {
    setShowTable(false);
    try {
      await updateDoc(
        doc(firestore, 'admissionRegister', editStudent.id),
        editStudent,
      )
        .then(() => {
          showToast('success', 'Student Data Updated successfully');
          setEditStudent({
            id: docId,
            father_name: '',
            student_name: '',
            mother_name: '',
            dob: '',
            year: '',
            ref: '',
          });
          setShowEdit(false);
          setShowViewStudent(false);
          setViewStudent({
            id: docId,
            father_name: '',
            student_name: '',
            mother_name: '',
            dob: '',
            year: '',
            ref: '',
          });
          const newData = admissionRegisterState.map(item =>
            item.id === editStudent.id ? editStudent : item,
          );
          setAdmissionRegisterState(newData);
          setData(newData);
          setFilteredData(
            newData.filter(el => {
              return el.student_name.toLowerCase().match(search.toLowerCase());
            }),
          );
          setYearArray(uniqArray(newData.map(item => item.year)));
          setShowTable(true);
        })
        .catch(err => {
          showToast('error', 'Failed to update Student Data!');
          setShowTable(true);
        });
    } catch (error) {
      console.log(error);
      setShowTable(true);
      showToast('error', 'Something went Wrong!');
    }
  };

  const deleteStudent = async id => {
    try {
      setShowTable(false);
      await deleteDoc(doc(firestore, 'admissionRegister', id))
        .then(() => {
          const x = admissionRegisterState.filter(item => item.id !== id);
          setAdmissionRegisterState(x);
          setData(x);
          setFilteredData(x);
          setYearArray(uniqArray(x.map(item => item.year)));
          showToast('success', 'Student Deleted Successfully');
          setShowTable(true);
        })
        .catch(e => {
          showToast('error', 'Failed to delete Student!');
          setShowTable(true);
          console.log(e);
        });
    } catch (error) {
      console.log(error);
      showToast('error', 'Failed to delete Student!');
      setShowTable(true);
    }
  };

  // Generate unique ID like st1001, st1002, st1003...
  const generateUniqueId = () => {
    // Extract all existing IDs from data
    const existingIds = new Set(data.map(item => item.id));

    // Start from array length + 1001
    let num = data.length + 1001;
    let newId = `st${num}`;

    // If ID already exists, keep incrementing until unique
    while (existingIds.has(newId)) {
      num++;
      newId = `st${num}`;
    }

    // Ensure ID length remains 6 (st + 4 digits)
    // Example: st0001
    newId = `st${String(num).padStart(4, '0')}`;

    // Save in state
    setDocId(newId);
    console.log('newId:', newId);
    return newId;
  };
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
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    } else if (admissionRegisterState.length === 0) {
      AdmissionRegisterData();
    } else {
      setData(admissionRegisterState);
      setFilteredData(admissionRegisterState);
      setYearArray(uniqArray(admissionRegisterState.map(item => item.year)));
      setShowTable(true);
    }
  }, [isFocused]);

  useEffect(() => {
    generateUniqueId();
  }, [data]);
  return (
    <View style={{ flex: 1 }}>
      {showTable ? (
        <ScrollView
          ref={scrollRef}
          nestedScrollEnabled={true}
          style={{ marginVertical: responsiveHeight(2) }}
        >
          <CustomButton
            title={'Add Student'}
            color={'green'}
            onClick={() => setShowAdd(!showAdd)}
          />

          <Text style={styles.title}>Admission Register</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedYear}
              onValueChange={value => {
                setSelectedYear(value);
                if (value === '') {
                  setFilteredData(admissionRegisterState);
                } else {
                  setFilteredData(
                    admissionRegisterState.filter(item => item.year == value),
                  );
                }
              }}
            >
              <Picker.Item
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                }}
                label="Select Admission Year"
                value=""
              />
              {yearArray.map((item, ind) => (
                <Picker.Item
                  style={{
                    color: 'black',
                    backgroundColor: 'white',
                  }}
                  label={item}
                  value={item}
                  key={ind}
                />
              ))}
            </Picker>
          </View>
          {admissionRegisterState.length !== filteredData.length && (
            <CustomButton
              color={'red'}
              title={'Clear'}
              onClick={() => {
                setFilteredData(data);
                setSearch('');
                setSelectedYear('');
              }}
              size={'small'}
              fontSize={14}
            />
          )}
          <AnimatedSeacrch
            value={search}
            placeholder={'Search Student Name'}
            onChangeText={text => {
              setSearch(text);
              const result = data.filter(el => {
                return el.student_name.toLowerCase().match(text.toLowerCase());
              });
              setFilteredData(result);
              setFirstData(0);
              setVisibleItems(result.length);
            }}
            onClick={() => {
              setSearch('');
              setFilteredData(data);
              setFirstData(0);
              setVisibleItems(10);
            }}
            func={() => {
              setSearch('');
              setFilteredData(data);
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
              scrollEnabled={false} // ✅ disables nested scrolling
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.dataView}
                    key={index}
                    onPress={() => {
                      setShowViewStudent(true);
                      setViewStudent(item);
                    }}
                  >
                    <Text selectable style={styles.bankDataText}>
                      Sl:{' '}
                      {data.length === filteredData.length
                        ? data.findIndex(i => i.id === item.id) + 1
                        : index + 1}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      Student Name: {item.student_name}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      Father's Name: {item.father_name}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      Admission Year: {item.year}
                    </Text>
                    <Text selectable style={styles.bankDataText}>
                      Birth Date: {item.dob}
                    </Text>

                    <Text selectable style={styles.bankDataText}>
                      Student Ref: {item.ref}
                    </Text>
                  </TouchableOpacity>
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
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: responsiveHeight(1),
            }}
          >
            <FuzzySearch
              data={data}
              keys={['student_name']}
              title="Search Student Name"
              placeholder="Search Student Name"
              onItemClick={item => {
                setShowViewStudent(true);
                setViewStudent(item);
              }}
              renderItem={({ item, matchesForKey, HighlightMatch }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                  }}
                >
                  <Text style={[styles.dropDownText, { fontWeight: 'bold' }]}>
                    <HighlightMatch
                      text={item.student_name}
                      matches={matchesForKey('student_name')}
                    />
                  </Text>
                  <Text style={[styles.dropDownText, { color: 'gray' }]}>
                    <HighlightMatch
                      text={item.father_name}
                      matches={matchesForKey('father_name')}
                    />
                  </Text>
                  <Text style={{ fontSize: 12 }}>Ref: {item.ref}</Text>
                </View>
              )}
            />
            <FuzzySearch
              data={data}
              keys={['father_name']}
              title="Search Father Name"
              placeholder="Search Father Name"
              onItemClick={item => {
                setShowViewStudent(true);
                setViewStudent(item);
              }}
              renderItem={({ item, matchesForKey, HighlightMatch }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                  }}
                >
                  <Text style={[styles.dropDownText, { fontWeight: 'bold' }]}>
                    <HighlightMatch
                      text={item.student_name}
                      matches={matchesForKey('student_name')}
                    />
                  </Text>
                  <Text style={[styles.dropDownText, { color: 'gray' }]}>
                    <HighlightMatch
                      text={item.father_name}
                      matches={matchesForKey('father_name')}
                    />
                  </Text>
                  <Text style={{ fontSize: 12 }}>Ref: {item.ref}</Text>
                </View>
              )}
            />
          </View>
          <Modal
            onRequestClose={() => {
              setShowAdd(false);
              setAddStudent({
                id: docId,
                father_name: '',
                student_name: '',
                mother_name: '',
                dob: '',
                year: '',
                ref: '',
              });
            }}
            animationType="slide"
            visible={showAdd}
            animationIn={'fadeInUpBig'}
            animationOut={'fadeOutLeftBig'}
            animationInTiming={500}
            animationOutTiming={500}
            statusBarTranslucent={true}
            onBackdropPress={() => {
              setShowAdd(false);
              setAddStudent({
                id: docId,
                father_name: '',
                student_name: '',
                mother_name: '',
                dob: '',
                year: '',
                ref: '',
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
                <Text selectable style={styles.bankDataText}>
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
                  placeholder={'Birthday'}
                  title={'Birthday'}
                  value={addStudent.dob}
                  onChangeText={text => {
                    setAddStudent({
                      ...addStudent,
                      dob: text,
                    });
                  }}
                />

                <CustomTextInput
                  placeholder={'Student Ref'}
                  title={'Student Ref'}
                  value={addStudent.ref}
                  onChangeText={e => {
                    setAddStudent({
                      ...addStudent,
                      ref: e,
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
                        showToast('error', 'Please enter Student Name');
                      } else if (addStudent.father_name === '') {
                        showToast('error', 'Please enter Father Name');
                      } else if (addStudent.ref === '') {
                        showToast('error', 'Please enter Student ID');
                      } else {
                        setShowAdd(false);
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
                      setShowAdd(false);
                      setAddStudent({
                        id: docId,
                        father_name: '',
                        student_name: '',
                        mother_name: '',
                        dob: '',
                        year: '',
                        ref: '',
                      });
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Modal
            onRequestClose={() => {
              setShowViewStudent(false);
              setViewStudent({
                id: '',
                father_name: '',
                student_name: '',
                mother_name: '',
                dob: '',
                year: '',
                ref: '',
              });
              setShowDldBtn(false);
            }}
            animationType="slide"
            visible={showViewStudent}
            animationIn={'fadeInUpBig'}
            animationOut={'fadeOutLeftBig'}
            animationInTiming={500}
            animationOutTiming={500}
            statusBarTranslucent={true}
            onBackdropPress={() => {
              setShowViewStudent(false);
              setViewStudent({
                id: '',
                father_name: '',
                student_name: '',
                mother_name: '',
                dob: '',
                year: '',
                ref: '',
              });
              setShowDldBtn(false);
            }}
            transparent
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(90),
                height: responsiveHeight(50),
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 10,
                borderColor: '#eee',
                borderWidth: 1,
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
                  Viewing Details of {viewStudent.student_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Student's Name: {viewStudent.student_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Father's Name: {viewStudent.father_name}
                </Text>
                {viewStudent.mother_name && (
                  <Text selectable style={styles.bankDataText}>
                    Mother's Name: {viewStudent.mother_name}
                  </Text>
                )}
                <Text selectable style={styles.bankDataText}>
                  Birthday: {viewStudent.dob}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Admission Year: {viewStudent.year}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Student Ref: {viewStudent.ref}
                </Text>

                <CustomButton
                  marginTop={responsiveHeight(1)}
                  title={
                    showDldBtn
                      ? 'Hide Download Button'
                      : 'Download School Certificate'
                  }
                  color={'blueviolet'}
                  onClick={() => {
                    setShowDldBtn(!showDldBtn);
                  }}
                />
                {showDldBtn && (
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    title={'Download School Certificate'}
                    color={'green'}
                    onClick={async () => {
                      setShowDldBtn(false);
                      setShowViewStudent(false);
                      await Linking.openURL(
                        `${WEBSITE}/downloadSchoolCertificate?data=${JSON.stringify(
                          viewStudent,
                        )}`,
                      );
                    }}
                  />
                )}
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
                    title={'Edit'}
                    size={'xsmall'}
                    onClick={() => {
                      setEditStudent(viewStudent);
                      setShowEdit(true);
                      setShowViewStudent(false);
                      setShowDldBtn(false);
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    title={'Delete'}
                    size={'xsmall'}
                    color={'red'}
                    onClick={() => {
                      return Alert.alert(
                        'Hold On!',
                        'Are You Sure? This Entry Will be Deleted',
                        [
                          // The "No" button
                          // Does nothing but dismiss the dialog when tapped
                          {
                            text: 'Cancel',
                            onPress: () =>
                              showToast('success', 'Entry Not Deleted'),
                          }, // The "Yes" button
                          {
                            text: 'Yes',
                            onPress: async () => {
                              await deleteStudent(viewStudent.id);
                            },
                          },
                        ],
                      );
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    title={'Close'}
                    size={'xsmall'}
                    color={'purple'}
                    onClick={() => {
                      setShowViewStudent(false);
                      setViewStudent({
                        id: '',
                        father_name: '',
                        student_name: '',
                        mother_name: '',
                        dob: '',
                        year: '',
                        ref: '',
                      });
                      setShowDldBtn(false);
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </Modal>

          <Modal
            onRequestClose={() => {
              setShowEdit(false);
              setEditStudent({
                id: '',
                father_name: '',
                student_name: '',
                mother_name: '',
                dob: '',
                year: '',
                ref: '',
              });
            }}
            animationIn={'fadeInUpBig'}
            animationOut={'fadeOutLeftBig'}
            animationInTiming={500}
            animationOutTiming={500}
            statusBarTranslucent={true}
            onBackdropPress={() => {
              setShowEdit(false);
              setEditStudent({
                id: '',
                father_name: '',
                student_name: '',
                mother_name: '',
                dob: '',
                year: '',
                ref: '',
              });
            }}
            visible={showEdit}
            transparent
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(90),
                height: responsiveHeight(60),
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 10,
                borderColor: '#eee',
                borderWidth: 1,
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
                  Edit Details of {editStudent.student_name}
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
                  placeholder={'Birthday'}
                  title={'Birthday'}
                  value={editStudent.dob}
                  onChangeText={text => {
                    setEditStudent({
                      ...editStudent,
                      dob: text,
                    });
                  }}
                />
                <CustomTextInput
                  placeholder={'Student Ref'}
                  title={'Student Ref'}
                  value={editStudent.ref}
                  onChangeText={e => {
                    setEditStudent({
                      ...editStudent,
                      ref: e,
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
                      submitAdmissionRegisterData();
                    }}
                  />
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    title={'Close'}
                    size={'xsmall'}
                    color={'purple'}
                    onClick={() => {
                      setShowEdit(false);
                      setEditStudent({
                        id: '',
                        father_name: '',
                        student_name: '',
                        mother_name: '',
                        dob: '',
                        year: '',
                        ref: '',
                      });
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <Loader visible={!showTable} />
      )}
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

  dropDownText: {
    fontSize: responsiveFontSize(1.2),
    color: 'royalblue',
    alignSelf: 'center',
    textAlign: 'center',
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
});
