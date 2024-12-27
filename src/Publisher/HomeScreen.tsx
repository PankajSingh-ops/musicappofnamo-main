import {StyleSheet, View} from 'react-native';
import React from 'react';
import HomeScreenSlider from './Common/HomeScreenSlider';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <HomeScreenSlider />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex:1
  },
});
