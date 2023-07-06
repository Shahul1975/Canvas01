import React, { useState } from "react";
import { View,Text, StyleSheet } from "react-native";
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

export default function Draw() {
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
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  dcontainer: {
    flex: 1,
    backgroundColor: "black",
    margin: "5%",
    marginBottom: "10%",
  },
  canvas: {
    flex: 1,
  },
});