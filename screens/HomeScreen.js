import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  TouchableHighlight, Alert, Modal,
  Image
} from 'react-native';

import MapView, {
  ProviderPropType,
  Marker,
  Callout,
  AnimatedRegion,
  PROVIDER_GOOGLE,
  CalloutSubview
} from 'react-native-maps';

import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import isEqual from 'lodash/isEqual';
import colors from '../utils/colors';
import logo from '../assets/logo.png';
import { customStyle } from '../utils/customStyle';
import * as Application from 'expo-application';
import { Button } from 'react-native';
import IconButton from '../components/IconButton';

import { bool } from 'yup';
import { auth } from '../components/Firebase/firebase';
import { Colors } from 'react-native/Libraries/NewAppScreen';



const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.1022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ANCHOR = { x: 0.5, y: 0.5 };
let id = 0;
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }),
      modalVisible: false,
      markers: [],
      markerSelect: false,

    };
  }






  animate() {

    const { coordinate } = this.state;

    const newCoordinate = {
      latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
      longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }




  componentDidMount() {

    this.mounted = true;
    // If you supply a coordinate prop, we won't try to track location automatically
    if (this.props.coordinate) {
      return;
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        if (granted && this.mounted) {
          this.watchLocation();
        }
      });
    } else {
      this.watchLocation();
    }
  }




  async watchLocation() {
    Location.installWebGeolocationPolyfill();

    let { status } = await Location.requestForegroundPermissionsAsync();

    this.watchID = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High },
      position => {
        const myLastPosition = { latitude: position.latitude, longitude: position.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };
        const myPosition = position.coords;
        if (!isEqual(myPosition, myLastPosition)) {
          this.setState({ myPosition });
        }
      },
      null,
      this.props.geolocationOptions
    );


  }

  show() {
    this.marker2.showCallout();
  }

  hide() {
    this.marker2.hideCallout();
  }


  componentWillUnmount() {
    this.mounted = false;
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  onMapPress(e) {
    if (this.state.markerSelect) {
      const coordinates = e.nativeEvent.coordinate;
      console.log(coordinates);
      this.setState({markerSelect: !this.state.markerSelect});
      this.props.navigation.navigate("FoodPost", { coordinates: coordinates})
      this.setState({
        markers: [...this.state.markers,
        {
          key: id++,
          coordinate: e.nativeEvent.coordinate,
          color: Colors.black,
          name: this.name,
          description: this.description
        }]
      })
    }

  }


  render() {

    let { heading, coordinate } = this.props;
    if (!coordinate) {
      const { myPosition } = this.state;
      if (!myPosition) {
        return null;
      }
      coordinate = myPosition;
      heading = myPosition.heading;

      const location = coordinate;

      const { route } = this.props;



      return (
        <View style={styles.container}>



          <MapView
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            customMapStyleString={JSON.stringify(customStyle)}
            showsMyLocationButton={true}
            followsUserLocation={true}

            onPress={e => this.onMapPress(e)}

            initialRegion={location}

            minZoomLevel={1}
            maxZoomLevel={16}

            showsUserLocation={true} >

            {this.state.markerSelect ? <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.setState({ markers: [] })}
                style={styles.bubble}
              >
                <Text>Tap the location of pick-up</Text>
              </TouchableOpacity>
            </View> : <View style={styles.addFoodButton}>

              <TouchableOpacity
                activeOpacity={0.7}
                disabled={this.markerSelect}
                onPress={() => { auth.currentUser.uid ? this.setState({markerSelect : !this.markerSelect}) : this.props.navigation.navigate("Register") }}
                style={styles.touchableOpacityStyle}>
                <Image
                  //We are making FAB using TouchableOpacity with an image
                  //We are using online image here
                  source={require('../assets/new-food.png')} onError={(error) => console.log(error)}
                  //You can use you project image Example below
                  //source={require('./images/float-add-icon.png')}
                  style={styles.floatingButtonStyle}
                />
              </TouchableOpacity>
            </View>}





            {this.state.markers.map(marker =>
            (
              <Marker
                key={marker.key}
                pinColor={marker.color}
                name={this.name}
                description={this.description}
                onPress={() => this.setState({ marker2: !this.state.marker1 })}
                onCalloutPress={() => this.calloutPress()}
                coordinate={marker.coordinate}
                title={this.name}

              >
                <Callout style={styles.plainView} title={this.name} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}  >

                  <CalloutSubview onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>

                    <Text>{this.description}</Text>
                    <TouchableHighlight
                      style={styles.openButton}
                      onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                      <Text style={styles.textStyle}>Show More</Text>
                    </TouchableHighlight>
                  </CalloutSubview>
                </Callout>
              </Marker>
            ))}





            <View style={styles.logoView}>
              <Image source={logo} style={styles.logo} height={60} width={160} resizeMode={'contain'}></Image>
            </View>

            <View style={styles.advertisement}>
              <Text style={styles.paragraph}>{coordinate.latitude}</Text>
            </View>









          </MapView>

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Hello World!</Text>

                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>


          </View>
        </View >

      );
    }
  }
}


HomeScreen.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },

  restaurantName: {
    color: colors.black,
    fontWeight: 'bold'

  },
  restaurantFood: {
    color: colors.black,

  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  logoView: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.1
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  paragraph: {
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',


  },
  addFoodButton: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    bottom: '1%',
    marginLeft: 10,
    height: 100,
    width: 100,
    padding: 10

  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: "1%",
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default function (props) {
  const route = useRoute();

  return <HomeScreen {...props} route={route} />;
}