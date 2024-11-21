import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            <LottieView
                source={require('../../../assets/splash.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    lottie: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;
