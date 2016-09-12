import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  NativeModules
} from 'react-native';
import Camera from 'react-native-camera';
// import request from './utils/api';

class memlyios extends Component {

  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto
      },
      isRecording: false,

      initialPosition: 'unknown',
      lastPosition: 'unknown'
    };

    this.watchID = null;

    this.takePicture = this.takePicture.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.switchType = this.switchType.bind(this);
    this.switchFlash = this.switchFlash.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert('We\'re truly sorry, but your geolocation seems to not be working correctly :('),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  takePicture() {
    if (this.camera) {
      this.camera.capture()
        .then((data) => {
          console.log(data);

          // var apiURL = 'https://thawing-fortress-62578.herokuapp.com/api/photo';
          // request.uploadPhoto('photo', data.path, apiURL, (err) => {
          //   if (err) {
          //     console.log(err);
          //     return;
          //   }
          // });


          // We created a custom module called ReadImageData in 'RCTCustom.m' and use it here
          NativeModules.ReadImageData.readImage(data.path, (image) => {
            console.log(image); // <== our data
            fetch('https://thawing-fortress-62578.herokuapp.com/api/photo', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ imageData: image }),
            })
              .then((response) => {
                console.log(response);
              })
              .catch((err) => {
                console.error(err);
              });

          })
        })
        .catch(err => console.error(err));
    }
  }

  startRecording() {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video})
        .then((data) => console.log(data))
        .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording() {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
    }
  }

  switchType() {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType
      }
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./node_modules/react-native-camera/Example/assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./node_modules/react-native-camera/Example/assets/ic_camera_front_white.png');
    }
  }

  switchFlash() {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode
      }
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./node_modules/react-native-camera/Example/assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./node_modules/react-native-camera/Example/assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./node_modules/react-native-camera/Example/assets/ic_flash_off_white.png');
    }

    return icon;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated
          hidden
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          defaultTouchToFocus
        />
        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            style={styles.typeButton}
            onPress={this.switchType}
          >
            <Image
              source={this.typeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={this.switchFlash}
          >
            <Image
              source={this.flashIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          {
            !this.state.isRecording
            &&
            <TouchableOpacity
              style={styles.captureButton}
              onPress={this.takePicture}
            >
              <Image
                source={require('./node_modules/react-native-camera/Example/assets/ic_photo_camera_36pt.png')}
              />
            </TouchableOpacity>
            ||
            null
          }
          <View style={styles.buttonSpace} />
            {
              !this.state.isRecording
              &&
              <TouchableOpacity
                style={styles.captureButton}
                onPress={this.startRecording}
              >
                <Image
                  source={require('./node_modules/react-native-camera/Example/assets/ic_videocam_36pt.png')}
                />
              </TouchableOpacity>
              ||
              <TouchableOpacity
                style={styles.captureButton}
                onPress={this.stopRecording}
              >
                <Image
                  source={require('./node_modules/react-native-camera/Example/assets/ic_stop_36pt.png')}
                />
              </TouchableOpacity>
            }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  capture: {
    flex: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#fff',
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    margin: 40
  },
  typeButton: {
    padding: 5
  },
  flashButton: {
    padding: 5
  },
  buttonsSpace: {
    width: 10
  }
});

AppRegistry.registerComponent('memlyios', () => memlyios);