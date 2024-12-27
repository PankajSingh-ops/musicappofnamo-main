import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';

const {width} = Dimensions.get('window');

const slideData = [
  {
    id: '1',
    title: 'Earning',
    value: 'Rs. 79,879 /-',
    image: require('../../../assests/logo/slider/slide1.png'),
  },
  {
    id: '2',
    title: 'Plays',
    value: '87,879',
    image: require('../../../assests/logo/slider/slide2.png'),
  },
  {
    id: '3',
    title: 'Songs',
    value: '67',
    image: require('../../../assests/logo/slider/slide3.png'),
  },
  {
    id: '4',
    title: 'Downloads',
    value: '676',
    image: require('../../../assests/logo/slider/slide4.png'),
  },
  {
    id: '5',
    title: 'Share',
    value: '8,768',
    image: require('../../../assests/logo/slider/slide5.png'),
  },
];

const HomeScreenSlider = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;

    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % slideData.length;
      slideRef.current?.scrollTo({
        x: currentIndex * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {slideData.map((item) => (
          <View key={item.id} style={styles.slide}>
            <View style={styles.content}>
              <View style={styles.innerContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
                <Image source={item.image} style={styles.image} />
              </View>

              <View style={styles.pagination}>
                {slideData.map((_, dotIndex) => {
                  const inputRange = [
                    (dotIndex - 1) * width,
                    dotIndex * width,
                    (dotIndex + 1) * width,
                  ];

                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 16, 8],
                    extrapolate: 'clamp',
                  });

                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View
                      key={dotIndex}
                      style={[styles.dot, {width: dotWidth, opacity}]}
                    />
                  );
                })}
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreenSlider;

const styles = StyleSheet.create({
  container: {
    height: 120,
  },
  slide: {
    width: width - 32,
    marginHorizontal: 16,
  },
  content: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    padding: 16,
    height: 100,
    justifyContent: 'space-between',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
  value: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  image: {
    width: 80,
    height: 60,
    marginLeft: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
});
