import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import AssetsImageSplash from './assets/splash.png'

export default function App() {
  return (
   <AnimatedSplashScreen imagePath={AssetsImageSplash}>
      <View style={styles.container}>
        <Text>Hello World!!!!!!!</Text>
        <StatusBar style="auto" />
      </View>
   </AnimatedSplashScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
