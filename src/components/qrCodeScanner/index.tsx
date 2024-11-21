import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Modal, SafeAreaView, View, BackHandler } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { RNHoleView } from 'react-native-hole-view';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { scale } from '../../helper/scale';

interface QRCodeScannerProps {
    onCodeScanned: (data: string) => void;
    showMarker?: boolean;
    markerStyle?: object;
    cameraPermissionMessage?: string;
    reactivate?: boolean;
    reactivateTimeout?: number;
    navigation: any;  // Add navigation prop to handle back navigation
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
                                                         onCodeScanned,
                                                         markerStyle,
                                                         cameraPermissionMessage = 'Camera permission is required to scan QR codes.',
                                                         reactivate = true,
                                                         reactivateTimeout = 1000,
                                                         navigation
                                                     }) => {
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);
    const [isCameraInitialized, setIsCameraInitialized] = useState<boolean>(false);
    const [isOpen, setOpen] = useState<boolean>(true);
    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);

    // Always declare the hook `useCodeScanner`, even if the camera is not ready yet
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (data: string) => handleCodeScanned(data),
    });

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await request(PERMISSIONS.ANDROID.CAMERA);
            if (permission === RESULTS.GRANTED) {
                setCameraPermission(true);
            } else {
                Alert.alert('Permission Denied', cameraPermissionMessage);
            }
        };
        requestCameraPermission();

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setOpen(false);
            return false;
        });

        return () => backHandler.remove();
    }, []);

    const onInitialized = () => {
        setIsCameraInitialized(true);
    };

    const handleCodeScanned = (data: string) => {
        onCodeScanned(data);
        if (reactivate) {
            setTimeout(() => {
                setIsCameraInitialized(true); // Reactivate the scanner after the specified timeout
            }, reactivateTimeout);
        } else {
            setIsCameraInitialized(false); // Stop the camera if reactivation is disabled
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {cameraPermission && device && (
                <Modal presentationStyle="fullScreen" animationType="slide" visible={isOpen}>
                    <View style={[styles.cameraControls, { backgroundColor: undefined }]} />
                    <Camera
                        ref={cameraRef}
                        style={styles.fullScreenCamera}
                        device={device}
                        onInitialized={onInitialized}
                        photo={false}
                        isActive={isCameraInitialized}
                        onError={(error) => Alert.alert('Camera Error', error.message)}
                        codeScanner={codeScanner}
                    />
                    <RNHoleView
                        holes={[{ x: scale(80), y: scale(180), width: scale(200), height: scale(180), borderRadius: 10 }]}
                        style={[styles.rnholeView, markerStyle, styles.fullScreenCamera]}
                    />
                </Modal>
            )}
        </SafeAreaView>
    );
};

export const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    camera: {
        width: '100%',
        height: 200,
    },
    fullScreenCamera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        zIndex: 100,
    },
    rnholeView: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cameraControls: {
        height: '10%',
        top: 15,
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        zIndex: 1000,
    },
});

export default QRCodeScanner;
