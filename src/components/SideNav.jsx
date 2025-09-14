import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { THEME_COLOR } from '../utils/Colors';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/Store';

const SideNav = () => {
  const { activeTab, setActiveTab, setNavState, state } = useGlobalContext();
  const user = state.USER;
  const userType = state.USERTYPE;
  const navigation = useNavigation();
  useEffect(() => {}, [activeTab]);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          borderTopLeftRadius: responsiveWidth(2),
          borderTopRightRadius: responsiveWidth(2),
          paddingVertical: responsiveWidth(2),
          marginBottom: responsiveHeight(0.5),
        }}
        contentContainerStyle={{
          alignItems: 'flex-start',
          alignSelf: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <View
          style={{
            backgroundColor: 'lightyellow',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: responsiveFontSize(1.2),
              color: 'mediumseagreen',
            }}
          >
            Visitor's Section
          </Text>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(12);
              navigation.navigate('Home');
              setNavState(false);
            }}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingVertical: responsiveWidth(2),
              flexDirection: 'row',
              width: responsiveWidth(55),
              paddingLeft: responsiveWidth(2),
            }}
          >
            <FontAwesome5
              name="user-graduate"
              size={20}
              color={activeTab == 12 ? 'purple' : THEME_COLOR}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  color: activeTab == 12 ? 'purple' : THEME_COLOR,
                  textAlign: 'center',
                },
              ]}
            >
              Student List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(3);
              navigation.navigate('Home');
              setNavState(false);
            }}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingVertical: responsiveWidth(2),
              flexDirection: 'row',
              width: responsiveWidth(55),
              paddingLeft: responsiveWidth(2),
            }}
          >
            <MaterialIcons
              name="add-home-work"
              size={20}
              color={activeTab == 3 ? 'purple' : THEME_COLOR}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  color: activeTab == 3 ? 'purple' : THEME_COLOR,
                  textAlign: 'center',
                },
              ]}
            >
              Admission
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(15);
              navigation.navigate('Home');
              setNavState(false);
            }}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingVertical: responsiveWidth(2),
              flexDirection: 'row',
              width: responsiveWidth(55),
              paddingLeft: responsiveWidth(2),
            }}
          >
            <FontAwesome6
              name="calendar-days"
              size={20}
              color={activeTab == 15 ? 'purple' : THEME_COLOR}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  color: activeTab == 15 ? 'purple' : THEME_COLOR,
                  textAlign: 'center',
                },
              ]}
            >
              Age Calculator
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(1);
              navigation.navigate('Home');
              setNavState(false);
            }}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingVertical: responsiveWidth(2),
              flexDirection: 'row',
              width: responsiveWidth(55),
              paddingLeft: responsiveWidth(2),
            }}
          >
            <FontAwesome5
              name="bullhorn"
              size={20}
              color={activeTab == 1 ? 'purple' : THEME_COLOR}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  color: activeTab == 1 ? 'purple' : THEME_COLOR,
                  textAlign: 'center',
                },
              ]}
            >
              Notice
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(16);
              navigation.navigate('Home');
              setNavState(false);
            }}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingVertical: responsiveWidth(2),
              flexDirection: 'row',
              width: responsiveWidth(55),
              paddingLeft: responsiveWidth(2),
            }}
          >
            <Entypo
              name="download"
              size={20}
              color={activeTab == 16 ? 'purple' : THEME_COLOR}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  color: activeTab == 16 ? 'purple' : THEME_COLOR,
                  textAlign: 'center',
                },
              ]}
            >
              Downloads
            </Text>
          </TouchableOpacity>
        </View>
        {userType && (
          <View
            style={{
              backgroundColor: 'lavenderblush',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: responsiveFontSize(1.2),
                color: 'turquoise',
              }}
            >
              Student's Section
            </Text>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(12);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome5
                name="user-graduate"
                size={20}
                color={activeTab == 12 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 12 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Student List
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {userType === 'teacher' && (
          <View
            style={{
              backgroundColor: 'mintcream',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                fontSize: responsiveFontSize(1.2),
                color: 'green',
              }}
            >
              Teacher's Section
            </Text>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(19);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome5
                name="clipboard-list"
                size={20}
                color={activeTab == 19 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 19 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Admission Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(4);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <MaterialCommunityIcons
                name="archive-eye"
                size={20}
                color={activeTab == 4 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 4 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                View Admission
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(18);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome6
                name="file-signature"
                size={20}
                color={activeTab == 18 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 18 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Enter Result
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(13);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome6
                name="ranking-star"
                size={20}
                color={activeTab == 13 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 13 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Result
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(5);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <MaterialIcons
                name="set-meal"
                size={20}
                color={activeTab == 5 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 5 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                MDM Entry
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(14);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome6
                name="file-invoice-dollar"
                size={20}
                color={activeTab == 14 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 14 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Teacher's Return
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(17);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome6
                name="user-clock"
                size={20}
                color={activeTab == 17 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 17 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Teacher Leaves
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(6);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <MaterialIcons
                name="food-bank"
                size={26}
                color={activeTab == 6 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 6 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                MDM Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(8);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome
                name="bank"
                size={20}
                color={activeTab == 8 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 8 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                VEC Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveTab(10);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome6
                name="indian-rupee-sign"
                size={20}
                color={activeTab == 10 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 10 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Expenses
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab(2);
                navigation.navigate('Home');
                setNavState(false);
              }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: responsiveWidth(2),
                flexDirection: 'row',
                width: responsiveWidth(55),
                paddingLeft: responsiveWidth(2),
              }}
            >
              <FontAwesome6
                name="user-gear"
                size={20}
                color={activeTab == 2 ? 'purple' : THEME_COLOR}
              />
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: activeTab == 2 ? 'purple' : THEME_COLOR,
                    textAlign: 'center',
                  },
                ]}
              >
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SideNav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bottomText: {
    fontSize: responsiveFontSize(1.5),
    color: THEME_COLOR,
    textAlign: 'center',
    paddingLeft: responsiveWidth(2),
  },
});
