import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ColorPickerButton from './components/ColorPicker';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Canvas, Path  } from "@shopify/react-native-skia";

interface IPath {
  segments: string[];
  color?: string;
}



const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [color, setColor] = useState('red'); // Store the color in App.js
  const [selectedColorName, setSelectedColorName] = useState('COLORPICER');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    Animated.timing(slideAnimation, {
      toValue: isVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleColorPicker = (newColor: string): void => {
    setShowColorPicker(!showColorPicker);
    setColor(newColor);
  };
  
  const onColorSelected = (selectedColor: string, colorName: string): void => {
    setColor(selectedColor);
    setSelectedColorName(colorName);
  };
  

  const buttonTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 30],
  });

  const toolbarTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });



  const [paths, setPaths] = useState<IPath[]>([]);
  const [tpaths, setTpaths] = useState<string[][]>([]);
  const pan = Gesture.Pan()
  .onStart((g) => {
    const newPaths = [...paths];
    const newPath: IPath = {
      segments: [`M ${g.x} ${g.y}`],
      color: "#06d6a0",
    };
    newPaths.push(newPath);
    setPaths(newPaths);
    
    const newtPaths = [...tpaths]; // Create a new copy of tpaths
    const newLine = [`M ${g.x} ${g.y}`];
    newtPaths.push(newLine);
    setTpaths(newtPaths); // Update tpaths
  })
  .onUpdate((g) => {
    if (paths.length > 0) {
      const newPaths = [...paths];
      const currentPath = newPaths[newPaths.length - 1];
      currentPath.segments[1] = `L ${g.x} ${g.y}`;
      setPaths(newPaths);
  
      const newtPaths = [...tpaths];
      if (newtPaths.length > 0) {
        const currentLine = newtPaths[newtPaths.length - 1];
        currentLine.push(`L ${g.x} ${g.y}`);
      }
      setTpaths(newtPaths);
    }
  })
  
  .onEnd(() => {
    // No need to create a new path on end
  });
  return (
       <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>

          <View style={styles.dcontainer}>
          <ColorPickerButton showColorPicker={true} toggleColorPicker={toggleColorPicker}  onColorSelected={onColorSelected}/>

          <Canvas style={styles.canvas}>
            {paths.map((p, index) => (
              <Path
                key={index}
                path={p.segments.join(" ")}
                strokeWidth={5}
                style="stroke"
                color={p.color}
              />
            ))}
          </Canvas>
      <View style={styles.buttonToolbarContainer}>
        <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonTransform }] }]}>
          <TouchableOpacity style={styles.button} onPress={toggleVisibility}>
            <Text style={styles.buttonText}>{isVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.toolbarContainer, { transform: [{ translateY: toolbarTransform }] }]}>
          <View style={styles.drawingToolsContainer}>
            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolButtonText}>Brush</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolButton, { backgroundColor:color }]} // Set the background color based on the selected color
              onPress={() => toggleColorPicker(color)}
            >
                <Text style={styles.toolButtonText}>{selectedColorName}</Text>
              
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
        </View>
        
      </GestureDetector>
      
    </GestureHandlerRootView>
      
      
  
  );
};

const styles = StyleSheet.create({
  dcontainer: {
    flex: 1,
    zIndex: 1,
  },
  canvas: {
    flex: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonToolbarContainer: {
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    zIndex: 999,
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toolbarContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  drawingToolsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolButton: {
    backgroundColor: 'lightgray',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 5,
  },
  toolButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
