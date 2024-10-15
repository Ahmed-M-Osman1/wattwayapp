import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Modal, SafeAreaView, View } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { RNHoleView } from 'react-native-hole-view';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

interface QRCodeScannerProps {
    onCodeScanned: (data: string) => void;
    showMarker?: boolean;
    markerStyle?: object;
    cameraPermissionMessage?: string;
    reactivate?: boolean;
    reactivateTimeout?: number;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
                                                         onCodeScanned,
                                                         showMarker = true,
                                                         markerStyle,
                                                         cameraPermissionMessage = 'Camera permission is required to scan QR codes.',
                                                         reactivate = true,
                                                         reactivateTimeout = 1000,
                                                     }) => {
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);
    const [isCameraInitialized, setIsCameraInitialized] = useState<boolean>(false);
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
                <Modal presentationStyle="fullScreen" animationType="slide" visible={true}>
                    <View style={[styles.cameraControls, {backgroundColor: undefined}]} />
                    <Camera
                        ref={cameraRef}
                        style={styles.fullScreenCamera}
                        device={device}
                        onInitialized={onInitialized}
                        photo={false}
                        isActive={isCameraInitialized}
                        onError={(error) => Alert.alert('Camera Error', error.message)}
                        codeScanner={codeScanner} // Now used unconditionally
                    />
                    <RNHoleView
                        holes={[{ x: 50, y: 100, width: 200, height: 200, borderRadius: 10 }]}
                        style={[styles.rnholeView, styles.fullScreenCamera]}
                    />
                    {showMarker && (
                        <RNHoleView
                            holes={[{ x: 50, y: 100, width: 200, height: 200, borderRadius: 10 }]}
                            style={[styles.holeView, markerStyle]}
                        />
                    )}
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
