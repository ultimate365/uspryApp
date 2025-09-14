import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useGlobalContext} from '../context/Store';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {THEME_COLOR} from '../utils/Colors';
import {titleCase} from '../modules/calculatefunctions';
import { SCHOOLNAME } from '../modules/constants';

const Dashboard = () => {
  const {state} = useGlobalContext();
  const user = state.USER;
  const userType = state.USERTYPE;
  useEffect(() => {
    // console.log("user", user);
    // console.log("state", state);
  }, []);
  return (
    <View style={styles.container}>
      {user?.name  ? (
        <View>
          {userType === 'teacher' ? (
            <Text selectable style={styles.title}>
              {`Welcome ${titleCase(user?.name)},\n${user?.desig} of\n ${titleCase(SCHOOLNAME)}`}
            </Text>
          ) : (
            <Text selectable style={styles.title}>
              {`Welcome ${titleCase(user?.name)},\n Student of ${user?.class},\n Roll: ${user?.roll}`}
            </Text>
          )}
        </View>
      ) : (
        <View>
          <Text selectable style={styles.title}>
            {`Welcome to\n ${titleCase(SCHOOLNAME)}'s\n Mobile App`}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Dashboard;

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
    marginBottom: responsiveHeight(8),
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
    flex: 1,

    width: responsiveWidth(90),
    height: responsiveWidth(30),
    padding: responsiveHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainView: {
    width: responsiveWidth(90),
    height: responsiveHeight(30),
    padding: responsiveHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    borderRadius: 10,

    backgroundColor: 'white',
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    margin: responsiveHeight(1),
    color: THEME_COLOR,
    textAlign: 'center',
  },
});
