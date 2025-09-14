import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useGlobalContext } from '../context/Store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { THEME_COLOR } from '../utils/Colors';
import Toast from 'react-native-toast-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { showToast } from '../modules/Toaster';
import {
  SCHOOL_SPLASH_BENGALINAME,
  SCHOOLBENGALINAME,
} from '../modules/constants';
export default function Header() {
  const { state, setActiveTab, navState, setNavState } = useGlobalContext();

  const userDetails = state.USER;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const showConfirmDialog = () => {
    return Alert.alert('Hold On!', 'Are You Sure? You Will be Logged Out', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Cancel',
        onPress: () => showToast('success', 'User Not Logged Out'),
      }, // The "Yes" button
      {
        text: 'Yes',
        onPress: async () => {
          navigation.navigate('SignOut');
        },
      },
    ]);
  };
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: responsiveWidth(3),
          }}
          onPress={() => {
            setActiveTab(0);
            navigation.navigate('Home');
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              flexWrap: 'wrap',
              marginHorizontal: responsiveWidth(1),
            }}
            onPress={async () => {
              setNavState(!navState);
            }}
          >
            {navState ? (
              <AntDesign name="menufold" size={30} color={'blueviolet'} />
            ) : (
              <AntDesign name="menuunfold" size={30} color={'green'} />
            )}
            <Text style={{ color: THEME_COLOR }}>Menu</Text>
          </TouchableOpacity>
          <Image
            source={require('../assets/images/logo.png')}
            style={{
              width: responsiveWidth(12),
              height: responsiveWidth(12),
              marginVertical: responsiveHeight(1),
            }}
          />

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              alignSelf: 'center',
              alignContent: 'center',
              flexWrap: 'wrap',
              marginHorizontal: responsiveWidth(1),
              maxWidth: responsiveWidth(60),
            }}
          >
            <Text style={styles.logoTitle}>{SCHOOLBENGALINAME}</Text>
          </View>

          {userDetails.userType !== undefined ? (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                flexWrap: 'wrap',
                marginHorizontal: responsiveWidth(1),
              }}
              onPress={async () => {
                showConfirmDialog();
              }}
            >
              <MaterialCommunityIcons name="logout" size={30} color={'red'} />
              <Text style={{ color: 'red' }}>Log Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                flexWrap: 'wrap',
                marginHorizontal: responsiveWidth(1),
              }}
              onPress={async () => {
                navigation.navigate('Login');
              }}
            >
              <MaterialCommunityIcons name="login" size={30} color={'green'} />
              <Text style={{ color: 'green' }}>Log in</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: responsiveFontSize(2),
    color: THEME_COLOR,
    textAlign: 'center',
  },
  header: {
    width: responsiveWidth(100),
    height: responsiveHeight(8.5),
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'black',
    borderBottomLeftRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
    paddingBottom: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
    top: 0,
  },
  title: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
    color: THEME_COLOR,
  },
  logoTitle: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '400',
    paddingHorizontal: responsiveWidth(0.5),
    color: THEME_COLOR,
    fontFamily: 'sho',
  },
});
