// TrafficLight.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Draggable from 'react-native-draggable';
import axios from "axios";

const TrafficLight = ({ id, onClose }) => {
  const [currentLight, setCurrentLight] = useState(null);

  const lightColors = {
    red: "red",
    orange: "orange",
    green: "green",
  };

  const [red, setRed] = useState(null);
  const [orange, setOrange] = useState(null);
  const [green, setGreen] = useState(null);

  const setColorsBasedOnLight = useCallback((newCurrentLight) => {
    switch (newCurrentLight) {
      case "red":
        setRed(styles.red);
        setOrange(styles.transparent); // Set to transparent
        setGreen(styles.transparent); // Set to transparent
        setCurrentLight("red");
        break;
      case "orange":
        setOrange(styles.orange);
        setRed(styles.transparent); // Set to transparent
        setGreen(styles.transparent); // Set to transparent
        setCurrentLight("orange");
        break;
      case "green":
        setGreen(styles.green);
        setRed(styles.transparent); // Set to transparent
        setOrange(styles.transparent); // Set to transparent
        setCurrentLight("green");
        break;
      default:
        setRed(styles.transparent); // Set to transparent
        setOrange(styles.transparent); // Set to transparent
        setGreen(styles.transparent); // Set to transparent
        setCurrentLight(null);
    }
  }, [styles.red, styles.orange, styles.green, styles.transparent]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.43.135:5000/traffic/${id}`);
      const newCurrentLight = response.data.color;
      if (newCurrentLight !== undefined) {
        setCurrentLight(newCurrentLight);
        setColorsBasedOnLight(newCurrentLight);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching current light data:", error.message);
    }
  };

  const handleColorChange = async (color) => {
    try {
      await axios.post(`http://192.168.43.135:5000/api/change-sequence-${color}`);
    } catch (error) {
      console.error("Error changing sequence:", error.message);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 500);

    return () => clearInterval(intervalId);
  }, [setColorsBasedOnLight]);

  return (
    <Draggable x={-7} y={-30}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <View style={[styles.square, red]} onTouchEnd={() => handleColorChange("red")}></View>
        <View style={[styles.square, orange]} onTouchEnd={() => handleColorChange("orange")}></View>
        <View style={[styles.square, green]} onTouchEnd={() => handleColorChange("green")}></View>
        {currentLight !== null ? (
          <Text style={styles.lightText}>Current Light: {currentLight}</Text>
        ) : (
          <Text>Waiting.....</Text>
        )}
      </View>
    </Draggable>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: '-30%',
    left: '-7%',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 3,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "#555",
    borderRadius: 100,
    marginTop: 10,
  },
  lightText: {
    marginTop: 10,
  },
  red: {
    backgroundColor: 'red',
  },
  orange: {
    backgroundColor: 'orange',
  },
  green: {
    backgroundColor: 'green',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});

export default TrafficLight;
