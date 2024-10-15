import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { RNHoleView } from 'react-native-hole-view';
import HeaderComponent from '../../components/header/HeaderComponent';
import { t } from 'i18next';
import Utils from '../../utils/Utils';
import SecuredStorage from '../../utils/SecuredStorage';
import Message from '../../utils/Message';

interface TenantQrCodeProps {
    navigation: any;
}

interface TenantQRCode {
    tenantSubDomain: string;
    tenantName: string;
    endpoint: string;
}

const TenantQrCode: React.FC<TenantQrCodeProps> = ({ navigation }) => {
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);
    const [isCameraInitialized, setIsCameraInitialized] = useState<boolean>(false);
    const [tenants, setTenants] = useState<TenantQRCode[]>([]);
    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        const fetchPermissionsAndData = async () => {
            const permission = await request(PERMISSIONS.ANDROID.CAMERA);
            if (permission === RESULTS.GRANTED) {
                setCameraPermission(true);
            } else {
                Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
            }

            const endpointClouds = await Utils.getEndpointClouds();
            const savedTenants = await SecuredStorage.getTenants();
            setTenants(savedTenants);
        };

        fetchPermissionsAndData();
    }, []);

    const onInitialized = () => {
        setIsCameraInitialized(true);
    };

    const handleCodeScanned = (codes: { value: string }[]) => {
        if (codes.length > 0 && codes[0]?.value) {
            checkQrCodeDataAndNavigate(codes[0].value);
        }
    };

    const checkQrCodeDataAndNavigate = async (qrCodeData: string) => {
        try {
            const decodedQrCodeData: TenantQRCode = JSON.parse(atob(qrCodeData)); // Decodes Base64
            const { tenantSubDomain, tenantName, endpoint } = decodedQrCodeData;

            if (!tenantSubDomain || !tenantName || !endpoint) {
                Message.showError(t('qrCode.invalidQRCode'));
                return;
            }

            const newTenantEndpointCloud = tenants.find((cloud) => cloud.id === endpoint);
            if (!newTenantEndpointCloud) {
                Message.showError(t('qrCode.unknownEndpoint', { endpoint }));
                return;
            }

            const existingTenant = await Utils.getTenant(tenantSubDomain);
            if (!existingTenant) {
                createTenant(decodedQrCodeData);
            } else {
                Message.showError(t('general.subdomainAlreadyUsed', { tenantName: existingTenant.name }));
            }
        } catch (error) {
            Alert.alert('Error', 'Invalid QR code data.');
        }
    };

    const createTenant = async (tenantQrCode: TenantQRCode) => {
        const newTenant = {
            subdomain: tenantQrCode.tenantSubDomain,
            name: tenantQrCode.tenantName,
            endpoint: tenantQrCode.endpoint,
        };

        const updatedTenants = [...tenants, newTenant];
        setTenants(updatedTenants);

        try {
            await SecuredStorage.saveTenants(updatedTenants);
            Message.showSuccess(t('qrCode.scanTenantQrCodeSuccess', { tenantName: newTenant.name }));
            navigation.navigate('Tenants', { newTenantSubdomain: newTenant.subdomain });
        } catch (error) {
            Message.showError(t('qrCode.saveOrganizationError'));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent navigation={navigation} title={t('qrCode.scanTenantQrCodeTitle')} />
            {cameraPermission && device && (
                <Modal presentationStyle="fullScreen" animationType="slide" visible={true}>
                    <Camera
                        ref={cameraRef}
                        style={styles.camera}
                        device={device}
                        onInitialized={onInitialized}
                        photo={false}
                        isActive={isCameraInitialized}
                        onError={(error) => Alert.alert('Camera Error', error.message)}
                        codeScanner={useCodeScanner({ codeTypes: ['qr'], onCodeScanned: handleCodeScanned })}
                    />
                    <RNHoleView
                        holes={[{ x: 50, y: 100, width: 200, height: 200, borderRadius: 10 }]}
                        style={styles.holeView}
                    />
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    camera: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    holeView: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute' },
});

export default TenantQrCode;
