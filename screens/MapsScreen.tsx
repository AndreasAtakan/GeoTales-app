import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
//import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
//import Exif from '@notech/react-native-exif';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootDrawerScreenProps } from '../types';

export default function MapsScreen({ navigation }: RootDrawerScreenProps<'Maps'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Maps</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button icon="camera" mode="contained" onPress={() => readImg()}>
        Go to profile
      </Button>
      <EditScreenInfo path="/screens/MapsScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

function readImg() {
  ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      exif: true,
      selectionLimit: 5
    })
    .then(res => {
      if(!res.canceled) {
        let i = res.assets[0];
        alert( JSON.stringify(i.exif, null, 2) );
        // NOTE: GPS dataen ligger under 'GPSLatitude' og 'GPSLongitude'
        // Her er docs for biblioteket jeg brukte: https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickerasset
      }
    })
    .catch(err => alert(err));
}
