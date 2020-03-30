import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BarcodeMask from 'react-native-barcode-mask';

class CameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back
        };
    }

    async componentWillMount() {
        const { status } = await Camera.requestPermissionsAsync();
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    takePicture = async () => {
        if (this.camera) {
          let image = await this.camera.takePictureAsync();
          this.uploadPhoto(image.uri);
        }
    }

    uploadPhoto =  async (imageUri) => {
        let formData = new FormData();
        var image = {
            name: 'card',
            type: 'image/jpeg', 
            uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', '')
        };
        formData.append('image', image);

        // const url = 'http://192.168.1.198:3000/uploadPhoto'; 172.20.10.2
        const url = 'http://172.20.10.2:5000/pic';
        const options = { method: 'POST', body: formData };
        const request = new Request(url, options);

        await fetch(request)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.props.navigation.navigate('Card', { cardDetails: data });
        })
        .catch(error => console.log(error))
    }

    render() {
        const { hasCameraPermission, type } = this.state;
        
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>
        }
        else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera 
                        style={{ flex: 1 }} 
                        type={type}
                        flashMode="auto"
                        ref={ref => { this.camera = ref }}
                    >
                        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                            <BarcodeMask width={300} height={190} showAnimatedLine={false}/>
                            <View style={{ alignSelf: 'center', position: 'absolute', top: 80 }}>
                                <Text style={{ fontWeight: '400', fontSize: 22, color: 'white' }}>Scan Credit Card</Text>
                            </View>
                            <View style={{ alignSelf: 'center', position: 'absolute', bottom: 30 }}>
                                <TouchableOpacity onPress={this.takePicture}>
                                    <MaterialCommunityIcons name="circle-slice-8" style={{ color: 'white', fontSize: 100 }}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Camera>
                </View>
            )
        }
    }
}

export default CameraScreen;
