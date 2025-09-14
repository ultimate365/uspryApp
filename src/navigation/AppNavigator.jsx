import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import Login from '../screens/Login';
import SignOut from '../screens/SignOut';
import VerifyLogin from '../screens/VerifyLogin';
import NoticeDetails from '../screens/NoticeDetails';
import ViewForm from '../screens/ViewForm';
import BlankMDMEntry from '../screens/BlankMDMEntry';
import TeacherLeaves from '../screens/TeacherLeaves';
const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false, drawerItemStyle: {height: 0}}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false, drawerItemStyle: {height: 0}}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, drawerItemStyle: {height: 0}}}
        />
        <Stack.Screen
          name="SignOut"
          component={SignOut}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VerifyLogin"
          component={VerifyLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoticeDetails"
          component={NoticeDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ViewForm"
          component={ViewForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BlankMDMEntry"
          component={BlankMDMEntry}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TeacherLeaves"
          component={TeacherLeaves}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
