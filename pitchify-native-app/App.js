import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Button, Image, Vibration } from 'react-native';
import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import * as Animatable from 'react-native-animatable';
import VideoList from './components/VideoList';
import VideoSearch from './components/VideoSearch';

import { NGROK_WEBVIEW_URL, LOCAL_WEBVIEW_URL, PRODUCTION_URL } from '@env';

export default function App() {
  [videos, setVideos] = useState([]);
  [selectedVideoId, setSelectedVideoId] = useState('');

  currentVideos = videos.slice();
  selectedVideo = videos.slice().find((v) => v.id.videoId === selectedVideoId);
  const webViewRef = useRef();

  function handleSelect(id) {
    setSelectedVideoId(id);
    console.log('selected video id: ', id);
  }

  function handleSubmit(videos) {
    setSelectedVideoId('');
    setVideos(videos);
  }

  function handleReturnHome() {
    setSelectedVideoId('');
    setVideos([]);
  }

  if (selectedVideoId !== '') {
    return (
      <View style={styles.container}>
        <VideoSearch onSubmit={handleSubmit} onReturnHome={handleReturnHome} />
        <Text style={styles.trackTitle}>{selectedVideo ? selectedVideo.snippet.title : 'test track'}</Text>
        <Text style={styles.trackInterpreter}>{selectedVideo ? selectedVideo.snippet.channelTitle : 'test interpreter'}</Text>
        <WebView
          style={styles.webview}
          source={{ uri: PRODUCTION_URL }} // needs to be replaced with an ngrok tunnel url when we test on iphone
          ref={(ref) => (webViewRef.current = ref)}
          incognito={true}
          onMessage={(event) => {
            console.log('received Message: ', event.nativeEvent.data); // Client received data and feedbacked
          }}
          onLoad={() => webViewRef.current.postMessage(selectedVideoId)}
        />

        <Button
          color="grey"
          style={styles.debuggerButton}
          title="Go Back"
          onPress={() => {
            setSelectedVideoId('');
          }}
        />
        <StatusBar style="auto" />
      </View>
    );
  } else if (currentVideos.length > 0) {
    return (
      <View style={styles.container}>
        <VideoSearch onSubmit={handleSubmit} onReturnHome={handleReturnHome} />
        <VideoList videos={currentVideos} onSelect={handleSelect} />
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={{ backgroundColor: 'rgb(25, 25, 25)', paddingBottom: 15, flex: 1 }}>
        <Animatable.View animation={fadeIn} style={styles.container}>
          <VideoSearch onSubmit={handleSubmit} onReturnHome={handleReturnHome} />

          <Animatable.Image
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            style={styles.logo}
            source={require('./assets/pitchify-logo-truncated.png')}
          ></Animatable.Image>
          <Text style={styles.title}>Start by Searching for Tracks</Text>
          <Text style={styles.subtitle}>Find all artists and songs the web has to offer!</Text>
          {/* <Button
            color="#82fafa"
            title="Load Test Track"
            onPress={() => {
              handleSelect('use_local_track');
            }}
          ></Button> */}
          <StatusBar style="auto" />
        </Animatable.View>
      </View>
    );
  }
}

const windowsWidth = Dimensions.get('window').width;
// const windowsHeight = Dimensions.get('window').height;

const fadeIn = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(25, 25, 25)',
    alignItems: 'center',
    paddingBottom: 15,
  },
  webview: {
    flex: 1,
    width: windowsWidth,
    margin: '2%',
    backgroundColor: 'rgb(25, 25, 25)',
  },
  logo: {
    marginTop: '40%',
    width: '40%',
    height: '30%',
    resizeMode: 'stretch',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '15%',
  },
  subtitle: {
    color: 'grey',
    fontSize: 11,
    marginTop: 10,
  },

  trackTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  trackInterpreter: {
    color: 'grey',
    fontSize: 13,
    marginTop: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  debuggerButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 35,
  },
});
