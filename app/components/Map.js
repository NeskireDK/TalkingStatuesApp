import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Navigator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'


import MapView from 'react-native-maps';
import HomeScreen from '../index'

import CustomCallout from './CustomCallout'

styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex:1,
    position: 'absolute',
  }
});

// Map markers etc
const LATITUDE_DELTA_DEFAULT = 0.1;
const LONGITUDE_DELTA_DEFAULT = 0.1;

const statues_location = [
{latlng: {
  latitude: 52.079875,
  longitude: 4.315880},
  title: "test",
  description: "test"},
  {latlng: {
    latitude: 52.082937,
    longitude: 4.314736},
    title: "test",
    description: "test"},
    {latlng: {
      latitude: 52.080756,
      longitude: 4.312053},
      title: "test",
      description: "test"},
      {latlng: {
        latitude: 52.080173,
        longitude: 4.309923},
        title: "test",
        description: "test"},
        {latlng: {
          latitude: 52.079281,
          longitude: 4.312103},
          title: "test",
          description: "test"}
          ]

          export default class Map extends Component {

            watchID: ?number = null;

            constructor(props) {
              super(props);
              this.state = {
                markers : statues_location,
                region: {
                  latitude: 52.079875,
                  longitude: 4.314736,
                  latitudeDelta: LATITUDE_DELTA_DEFAULT,
                  longitudeDelta: LONGITUDE_DELTA_DEFAULT,
                }
              };
            }

            componentDidMount() {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  if (pos.coords.latitude && pos.coords.longitude) {
                    this.setState({
                      region : {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA_DEFAULT,
                        longitudeDelta: LONGITUDE_DELTA_DEFAULT,
                      }
                    });
                  }
                },
                (error) => alert(JSON.stringify(error)),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
                );
              this.watchID = navigator.geolocation.watchPosition((pos) => {
                if (pos.coords.latitude && pos.coords.longitude) {
                  this.setState({
                    region : new MapView.AnimatedRegion({
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                      latitudeDelta: LATITUDE_DELTA_DEFAULT,
                      longitudeDelta: LONGITUDE_DELTA_DEFAULT,
                    })
                  });
                }
                console.log("PERSONAL COORD", pos.coords, 'STATE', this.state.region)
              });
            }

            trigger_menu() {
              console.log("triggering menu")
            }

            render_map = (route, navigator) => {
              return (
                <MapView.Animated
                region={this.state.region}
                style={styles.map}
                onRegionChange={(region) => {
                  this.setState({region})
                  console.log("REGION CHANGED", this.state.region)
                }}
                onRegionChangeComplete={() => {}}
                showsUserLocation={true}
                followsUserLocation={true}
                >
                {this.state.markers.map((marker, index) => (
                  <MapView.Marker
                  key={index}
                  coordinate={marker.latlng}
                  title={marker.title}
                  description={marker.description}
                  >
                  <MapView.Callout
                  tooltip={true}
                  onPress={() =>
                   {this.props.navigator(1)}
                 }>
                 <CustomCallout>
                 <Image
                 style={{width: 50, height: 50}}
                 source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                 />
                 </CustomCallout>
                 </MapView.Callout>
                 </MapView.Marker>
                 ))}
                </MapView.Animated>
                );
            }
// Class is currently unused, semi prepared 
render(){
  return(
    <Navigator
    navigationBar={
      <Navigator.NavigationBar
      routeMapper={{
        LeftButton: (route, navigator, index, navState) => {},
        //   { return (
        //     <Icon.Button
        //     name="bars"
        //     size={25}
        //     padding={15}
        //     color="#000000"
        //     backgroundColor='rgba(31, 103, 158, 0.3)'
        //     onPress={this.trigger_menu}
        //     borderRadius={60}
        //     iconStyle={{marginLeft: 5, marginRight: 5}}
        //     />);
        // },
        RightButton: (route, navigator, index, navState) =>
        {},
        Title: (route, navigator, index, navState) =>
        {},
      }}
      style={{backgroundColor: 'rgba(0, 0, 0, 0.0)'}}
      />
    }
    renderScene={this.render_map}
    />
    );
}
}