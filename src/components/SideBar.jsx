import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import {THEME_COLOR} from '../utils/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import SideNav from './SideNav';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCHOOLBENGALINAME, SCHOOLNAME, WEBSITE} from '../modules/constants';
const SideBar = () => {
  const {state, navState, setNavState} = useGlobalContext();
  const user = state.USER;
  const userType = state.USERTYPE;
  useEffect(() => {}, [navState]);
  return (
    <View style={{flex: 1}}>
      <Modal
        isVisible={navState}
        animationIn={'bounceInLeft'}
        animationOut={'bounceOutLeft'}
        onBackdropPress={() => setNavState(false)}
        backdropOpacity={0.5}
        onBackButtonPress={() => setNavState(false)}>
        <View
          style={{
            width: responsiveWidth(65),
            height: responsiveHeight(90),

            borderTopRightRadius: responsiveWidth(10),
            borderBottomRightRadius: responsiveWidth(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: responsiveWidth(56),
              height: responsiveHeight(88),
              backgroundColor: 'white',
              borderRadius: responsiveWidth(10),
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: responsiveWidth(15),
                height: responsiveWidth(15),
                marginTop: responsiveHeight(11),
              }}
            />
            <Text
              style={{
                color: THEME_COLOR,

                fontSize: responsiveFontSize(1.8),
                fontFamily: 'sho',
              }}>
              {SCHOOLBENGALINAME}
            </Text>
            <View style={{marginTop: responsiveHeight(12)}}>
              <ScrollView style={{marginBottom: responsiveHeight(10)}}>
                <SideNav />
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              width: responsiveWidth(70),
              height: responsiveHeight(30),
              position: 'absolute',
              top: responsiveHeight(8),
            }}>
            {user.name ? (
              <View
                style={{
                  width: '100%',
                  height: responsiveHeight(12),
                  backgroundColor: 'cornsilk',
                  borderTopRightRadius: responsiveWidth(5),
                  borderTopLeftRadius: responsiveWidth(5),
                  borderWidth: responsiveWidth(0.5),
                  borderColor: 'darkslategrey',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => setNavState(false)}
                  style={{paddingRight: responsiveWidth(2)}}>
                  <AntDesign name="leftcircle" size={25} color={THEME_COLOR} />
                </TouchableOpacity>

                <View style={{paddingLeft: responsiveWidth(2)}}>
                  <Text
                    style={{
                      color: THEME_COLOR,
                      fontWeight: 'bold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    {user?.name}
                  </Text>
                  {userType === 'teacher' ? (
                    <Text
                      style={{
                        color: THEME_COLOR,
                        fontSize: responsiveFontSize(1.8),
                        marginLeft: responsiveWidth(6),
                      }}>
                      @{user?.username}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: THEME_COLOR,
                        fontSize: responsiveFontSize(1.8),
                      }}>
                      {user?.class}
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: -responsiveWidth(2),
                    }}>
                    <Entypo name="mobile" color={THEME_COLOR} size={15} />
                    {userType === 'teacher' ? (
                      <Text
                        style={{
                          color: THEME_COLOR,
                          fontSize: responsiveFontSize(1.8),
                        }}>
                        {user?.mobile}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: THEME_COLOR,
                          fontSize: responsiveFontSize(1.8),
                        }}>
                        {user?.mobile}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: responsiveHeight(12),
                  backgroundColor: 'cornsilk',
                  borderTopRightRadius: responsiveWidth(5),
                  borderTopLeftRadius: responsiveWidth(5),
                  borderWidth: responsiveWidth(0.5),
                  borderColor: 'darkslategrey',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: THEME_COLOR,
                    fontSize: responsiveFontSize(1.8),
                  }}>
                  Welcome Anonymous User
                </Text>
              </View>
            )}
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: -responsiveHeight(0.5),
              }}>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: responsiveWidth(5),
                  borderRightWidth: responsiveWidth(5),
                  borderBottomWidth: responsiveWidth(5),
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'darkslategrey',
                  transform: [{rotate: '45deg'}],
                }}></View>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: responsiveWidth(5),
                  borderRightWidth: responsiveWidth(5),
                  borderBottomWidth: responsiveWidth(5),
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'darkslategrey',
                  transform: [{rotate: '-45deg'}],
                }}></View>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: responsiveHeight(6),
              backgroundColor: 'cornsilk',
              borderBottomLeftRadius: responsiveWidth(5),
              borderBottomRightRadius: responsiveWidth(5),
              borderWidth: responsiveWidth(0.5),
              borderColor: 'darkslategrey',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              padding: responsiveWidth(1),
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: THEME_COLOR,
                borderRadius: responsiveWidth(5),
                justifyContent: 'center',
                alignItems: 'center',
                padding: responsiveWidth(1),
              }}
              onPress={async () => await Linking.openURL(WEBSITE)}>
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveFontSize(1.5),
                  textAlign: 'center',
                  flexWrap: 'wrap',
                }}>
                Visit us @{'  '}
                {WEBSITE}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: THEME_COLOR,
                fontSize: responsiveFontSize(1.2),
                textAlign: 'center',
                flexWrap: 'wrap',
              }}>
              <AntDesign name="copyright" size={10} color={THEME_COLOR} />{' '}
              {`${SCHOOLNAME}, ${new Date().getFullYear()}`}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SideBar;
