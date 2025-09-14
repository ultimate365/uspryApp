import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {THEME_COLOR} from '../utils/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { SCHOOLBENGALINAME } from '../modules/constants';

export default function Banner() {
  return (
    <View style={{flexWrap:"wrap"}}>
      <Image
        source={require('../assets/images/bg.jpg')}
        style={styles.banner}
      />
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: responsiveWidth(40),
          height: responsiveWidth(40),
          alignSelf: 'center',
          position: 'absolute',
          top:responsiveHeight(1)
        }}
      />
      <Text
        selectable
        style={{
          fontFamily: 'sho',
          position: 'absolute',
          color: "blueviolet",
          top: responsiveHeight(20),
          fontSize: responsiveFontSize(3.5),
          alignSelf: 'center',
          textShadowColor: 'white',
          textShadowOffset: {
            width: responsiveWidth(0.5),
            height: responsiveWidth(0.5),
          },
          textShadowRadius: responsiveWidth(0.5),
          textAlign: 'center',
        }}>
        {SCHOOLBENGALINAME}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
  },
});
