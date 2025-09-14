import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Image,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { THEME_COLOR } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import { useGlobalContext } from '../context/Store';
import AnimatedSeacrch from '../components/AnimatedSeacrch';
import { getCollection } from '../firebase/firestoreHelper';

export default function Result() {
  const { setActiveTab, resultState, setResultState } = useGlobalContext();
  const navigation = useNavigation();
  const [showTable, setShowTable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [firstData, setFirstData] = useState(0);
  const [visibleItems, setVisibleItems] = useState(10);
  const [pageData, setPageData] = useState(10);
  const scrollRef = useRef();

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
    await getCollection('result').then(data => {
      setData(data);
      setFilteredData(data);
      setShowTable(true);
      setResultState(data);
      setLoader(false);
    });
  };
  useEffect(() => {
    if (resultState.length === 0) {
      getStudentData();
    } else {
      setData(resultState);
      setFilteredData(resultState);
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
        <Text style={styles.title}>Students List</Text>
        <AnimatedSeacrch
          value={search}
          placeholder={'Search Student Name'}
          onChangeText={text => {
            const fdata = resultState.filter(item =>
              item.name.toLowerCase().includes(text.toLowerCase()),
            );
            setSearch(text);
            setFilteredData(fdata);
            setFirstData(0);
            setVisibleItems(fdata.length);
          }}
          onClick={() => {
            setSearch('');
            setFilteredData(resultState);
            setFirstData(0);
            setVisibleItems(10);
          }}
          func={() => {
            setSearch('');
            setFilteredData(resultState);
            setFirstData(0);
            setVisibleItems(10);
          }}
        />
        {filteredData.length > 0 && (
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
        )}

        {filteredData.length > 0 && showTable ? (
          <FlatList
            data={filteredData.slice(firstData, visibleItems)}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.dataView} key={index}>
                  <Image
                    source={require('../assets/images/logo.png')}
                    style={{
                      width: responsiveWidth(50),
                      height: responsiveWidth(50),
                      position: 'absolute',
                      alignSelf: 'center',
                      opacity: 0.2,
                      zIndex: -1,
                    }}
                  />
                  <Text selectable style={styles.bankDataText}>
                    Sl: {resultState.findIndex(i => i.id === item.id) + 1}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Student Name: {item.name}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Class: {item.class}
                  </Text>
                  <Text selectable style={styles.bankDataText}>
                    Roll No.: {item.roll}
                  </Text>
                  <View>
                    <Text selectable style={styles.benTitle}>
                      প্রাপ্ত নম্বর
                    </Text>
                    {item.class === 'PP' ? (
                      <View>
                        <Text selectable style={styles.label}>
                          বাংলা: {item.s1}
                        </Text>
                        <Text selectable style={styles.label}>
                          ইংরাজী: {item.s2}
                        </Text>
                        <Text selectable style={styles.label}>
                          গণিত: {item.s3}
                        </Text>
                        <Text selectable style={styles.label}>
                          মোট প্রাপ্ত নম্বর: {item.total}
                        </Text>
                        <Text selectable style={styles.label}>
                          শতকরা: {item.percent}%
                        </Text>
                        <Text selectable style={styles.label}>
                          গ্রেড: {item.grade}
                        </Text>
                      </View>
                    ) : item.class === 'CLASS I' ||
                      item.class === 'CLASS II' ? (
                      <View>
                        <Text selectable style={styles.label}>
                          সংযোগ স্থাপনে সক্ষমতা: {item.s1}
                        </Text>
                        <Text selectable style={styles.label}>
                          সমন্বয় সাধনে সক্ষমতা: {item.s2}
                        </Text>
                        <Text selectable style={styles.label}>
                          সমস্যা সমাধানে সক্ষমতা: {item.s3}
                        </Text>
                        <Text selectable style={styles.label}>
                          মানসিক ও শারীরিক সমন্বয় সাধন: {item.s4}
                        </Text>
                        <Text selectable style={styles.label}>
                          হাতের কাজ: {item.s5}
                        </Text>
                        <Text selectable style={styles.label}>
                          মোট প্রাপ্ত নম্বর: {item.total}
                        </Text>
                        <Text selectable style={styles.label}>
                          শতকরা: {item.percent}%
                        </Text>
                        <Text selectable style={styles.label}>
                          গ্রেড: {item.grade}
                        </Text>
                      </View>
                    ) : item.class === 'CLASS III' ||
                      item.class === 'CLASS IV' ? (
                      <View>
                        <Text selectable style={styles.label}>
                          বাংলা: {item.s1}
                        </Text>
                        <Text selectable style={styles.label}>
                          ইংরাজী: {item.s2}
                        </Text>
                        <Text selectable style={styles.label}>
                          গণিত: {item.s3}
                        </Text>
                        <Text selectable style={styles.label}>
                          আমাদের পরিবেশ: {item.s4}
                        </Text>
                        <Text selectable style={styles.label}>
                          স্বাস্থ্য ও শারীরশিক্ষা: {item.s5}
                        </Text>
                        <Text selectable style={styles.label}>
                          হাতের কাজ: {item.s6}
                        </Text>
                        <Text selectable style={styles.label}>
                          মোট প্রাপ্ত নম্বর: {item.total}
                        </Text>
                        <Text selectable style={styles.label}>
                          শতকরা: {item.percent}%
                        </Text>
                        <Text selectable style={styles.label}>
                          গ্রেড: {item.grade}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Text selectable style={styles.bankDataText}>
            No Entry found for the selected Year.
          </Text>
        )}
        {filteredData.length > 0 && (
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
        )}
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
  benTitle: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '500',
    paddingLeft: responsiveWidth(4),
    color: THEME_COLOR,
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.5),
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
    width: responsiveWidth(90),
    elevation: 5,
    zIndex: 1,
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
