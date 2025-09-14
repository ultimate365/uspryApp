import React, {Component} from 'react';
import {View} from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import {THEME_COLOR} from '../utils/Colors';

const Indicator = ({pattern, size, color}) => {
  return (
    <View style={{flex: 1}}>
      {pattern === 'Ball' ? (
        <BallIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Bar' ? (
        <BarIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Dot' ? (
        <DotIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Material' ? (
        <MaterialIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Pacman' ? (
        <PacmanIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Pulse' ? (
        <PulseIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Skype' ? (
        <SkypeIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'UIActivity' ? (
        <UIActivityIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : pattern === 'Wave' ? (
        <WaveIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      ) : (
        <SkypeIndicator
          size={size ? size : 40}
          color={color ? color : THEME_COLOR}
        />
      )}
    </View>
  );
};

export default Indicator;
