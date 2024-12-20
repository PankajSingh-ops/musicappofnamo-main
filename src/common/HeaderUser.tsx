import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../asyncStorage/AsyncStorage';

const {width} = Dimensions.get('window');

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnimation = React.useRef(new Animated.Value(-width)).current;

  const {logout} = useAuth();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const toggleDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: isDrawerOpen ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen(!isDrawerOpen));
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'auth'}],
    });
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Icon name="bars" size={30} color="white" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#888"
        />

        <TouchableOpacity onPress={() => navigation.navigate('UserDetails')}>
          <Icon name="user" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {isDrawerOpen && (
        <Animated.View
          style={[styles.drawer, {transform: [{translateX: drawerAnimation}]}]}>
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerHeaderContent}>
                <Text style={styles.drawerTitle}>Namo Music</Text>
              </View>

              <TouchableOpacity
                onPress={toggleDrawer}
                style={styles.closeIconContainer}>
                <Icon name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerOptions}>
              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('NewMusic')}>
                <Icon
                  name="music"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>New Music</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('TopMusic')}>
                <Icon
                  name="trophy"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Top Music</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('Artists')}>
                <Icon
                  name="microphone"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Artists</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('Albums')}>
                <Icon
                  name="book"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Albums</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('Genre')}>
                <MaterialIcon
                  name="category"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Genre</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('Downloads')}>
                <Icon
                  name="download"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Downloads</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('UserSettings')}>
                <MaterialIcon
                  name="settings"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerOption}
                onPress={() => navigation.navigate('Privacy')}>
                <MaterialIcon
                  name="privacy-tip"
                  size={20}
                  color="#fff"
                  style={styles.drawerOptionIcon}
                />
                <Text style={styles.drawerOptionText}>Privacy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerOption, styles.logoutOption]}
                onPress={handleLogout}>
                <Icon
                  name="sign-out"
                  size={20}
                  color="#ff0000"
                  style={styles.drawerOptionIcon}
                />
                <Text style={[styles.drawerOptionText, styles.logoutText]}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'black',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    color: '#fff',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height: '100%',
    backgroundColor: '#333',
    zIndex: 1000,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  drawerHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ff0000',
    marginLeft: 10,
  },
  closeIconContainer: {
    position: 'absolute',
    right: 20,
  },
  drawerOptions: {
    paddingHorizontal: 20,
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  drawerOptionIcon: {
    marginRight: 15,
  },
  drawerOptionText: {
    fontSize: 18,
    color: '#fff',
  },
  logoutOption: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff0000',
  },
  logo: {
    objectFit: 'contain',
  },
});

export default Header;