import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { requestNotifications } from 'react-native-permissions';
import { getApplicationName, getBundleId, getVersion } from 'react-native-device-info';
import Message from '../utils/Message';
import { t } from 'i18next';
import SecuredStorage from '../utils/SecuredStorage';
let ProviderFactory;
import CentralServerProvider from '../provider/CentralServerProvider';
import { Notification } from '../types/UserNotifications';

export default class Notifications {
  private static centralServerProvider: CentralServerProvider;
  private static token: string;

  public static async initialize(): Promise<void> {
    if (!ProviderFactory) {
      ProviderFactory = require('../provider/ProviderFactory').default;
    }
    this.centralServerProvider = await ProviderFactory.getProvider();

    try {
      await messaging().registerDeviceForRemoteMessages();
      const response = await requestNotifications(['alert', 'sound']);

      if (response?.status === 'granted') {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          this.token = fcmToken;
        }
      }
    } catch (error) {
      console.error('Error during FCM initialization:', error);
    }
  }

  public static getToken(): string {
    return this.token;
  }

  public static async onTokenRefresh(newToken: string): Promise<void> {
    if (this.centralServerProvider.isUserConnected()) {
      try {
        await this.centralServerProvider.saveUserMobileData(this.centralServerProvider.getUserInfo().id, {
          mobileToken: newToken,
          mobileOS: Platform.OS,
          mobileAppName: getApplicationName(),
          mobileBundleID: getBundleId(),
          mobileVersion: getVersion(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  public static async canHandleNotificationOpenedApp(remoteMessage: Notification): Promise<boolean> {
    const canHandleNotification = await this.canHandleNotification(remoteMessage);
    if (canHandleNotification) {
      const notificationSubdomain = remoteMessage.data.tenantSubdomain;
      if (!this.centralServerProvider.isUserConnectionValid()) {
        try {
          const userCredentials = await SecuredStorage.getUserCredentials(notificationSubdomain);
          if (userCredentials?.password && userCredentials?.email && userCredentials?.tenantSubDomain) {
            await this.centralServerProvider.login(userCredentials.email, userCredentials.password, true, userCredentials.tenantSubDomain);
          } else {
            return false;
          }
        } catch (error) {
          if (__DEV__) {
            console.log(error);
          }
          return false;
        }
      }
      const currentSubdomain = this.centralServerProvider.getUserInfo()?.tenantSubdomain;
      if (notificationSubdomain !== currentSubdomain) {
        Message.showError(t('authentication.wrongOrganization'));
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  public static async canHandleNotification(remoteMessage: Notification): Promise<boolean> {
    if (!remoteMessage?.data?.deepLink) {
      return false;
    }
    if (!remoteMessage?.notification) {
      return false;
    }
    const tenantSubdomain = remoteMessage.data.tenantSubdomain;
    if (!tenantSubdomain) {
      Message.showError(t('general.tenantMissing'));
      return false;
    }
    const tenant = await this.centralServerProvider.getTenant(tenantSubdomain);
    if (!tenant) {
      Message.showError(t('general.tenantUnknown', { tenantSubdomain }));
      return false;
    }
    return true;
  }
}
