import Slider from '@react-native-community/slider'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef,  useEffect } from 'react';
import {SafeAreaView} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';


const ColorPickerButton = ({ showColorPicker, toggleColorPicker,  onColorSelected  }) => {
    const [color, setColor] = useState('');
    const name = color
    const onColorChange = color => {
      setColor(color);
    };

    useEffect(() => {
        // Call the onColorSelected function whenever the color changes
        onColorSelected(color, name);
      }, [color, name, onColorSelected]);

    return (
        <TouchableOpacity onPress={toggleColorPicker} style={[styles.button, { backgroundColor: color }]}>
        {showColorPicker && (
          <ColorPicker
            color={color}
            onColorChange={onColorChange}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
          />
        )}
      </TouchableOpacity>
          
    );
  };
  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 70,
      paddingHorizontal: 24,
      zIndex: 4,
    },
  });


export default ColorPickerButton;
