import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import { t } from 'i18next';
import { EmitterSubscription, Linking } from 'react-native';

import CentralServerProvider from '../provider/CentralServerProvider';
import { HTTPError } from '../types/HTTPError';
import Constants from '../utils/Constants';
import Message from '../utils/Message';
import Utils from '../utils/Utils';

export default class DeepLinkingManager {
    public static readonly PATH_CHARGING_STATIONS = 'charging-stations';
    public static readonly PATH_TRANSACTIONS = 'transactions';
    public static readonly PATH_LOGIN = 'login';
    public static readonly PATH_INVOICES = 'invoices';
    public static readonly FRAGMENT_IN_ERROR = 'inerror';
    public static readonly FRAGMENT_ALL = 'all';
    public static readonly FRAGMENT_IN_PROGRESS = 'inprogress';
    public static readonly FRAGMENT_HISTORY = 'history';
    private static instance: DeepLinkingManager;
    private navigator: NavigationContainerRef<ReactNavigation.RootParamList>;
    private centralServerProvider: CentralServerProvider;
    private linkingSubscription: EmitterSubscription;

    private constructor() {}

    public static getInstance(): DeepLinkingManager {
        if (!DeepLinkingManager.instance) {
            DeepLinkingManager.instance = new DeepLinkingManager();
        }
        return DeepLinkingManager.instance;
    }

    public static getAuthorizedURLs(): string[] {
        return [
            ...((__DEV__ && ['http://*.localhost:45000']) || []),
            'https://*.e-mobility-group.org',
            'https://*.e-mobility-group.com',
            'https://*.e-mobility-group.eu',
            'https://*.e-mobility-labs.com',
            'https://*.e-mobility-labs.org',
            'https://*.qa-e-mobility-group.com',
        ];
    }

    public initialize(
        navigator: NavigationContainerRef<ReactNavigation.RootParamList>,
        centralServerProvider: CentralServerProvider
    ) {
        this.navigator = navigator;
        this.centralServerProvider = centralServerProvider;

        // Listen to URL changes
        this.startListening();

        // Handle the initial URL if the app is opened from a link
        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    this.handleUrl({ url });
                }
            })
            .catch((err) => {
                console.error('An error occurred', err);
            });
    }

    public startListening() {
        this.linkingSubscription = Linking.addEventListener('url', this.handleUrl);
    }

    public stopListening() {
        this.linkingSubscription?.remove();
    }

    public handleUrl = ({ url }: { url: string }) => {
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                this.evaluateUrl(url);
            }
        });
    };

    private evaluateUrl(url: string) {
        const parsedUrl = new URL(url);
        const pathname = parsedUrl.pathname;

        if (pathname.startsWith('/resetPassword/')) {
            const segments = pathname.split('/');
            this.handleResetPassword(segments[2], segments[3]);
        } else if (pathname.startsWith('/verifyAccount/')) {
            const segments = pathname.split('/');
            this.handleVerifyAccount(segments[2], segments[3], segments[4], segments[5]);
        }
        // Handle other routes as needed
    }

    private async handleResetPassword(tenant: string, hash: string) {
        if (!tenant) {
            Message.showError(t('authentication.mandatoryTenant'));
            return;
        }

        const tenantData = await this.centralServerProvider.getTenant(tenant);
        if (!tenantData) {
            Message.showError(t('authentication.unknownTenant'));
            return;
        }

        if (!hash) {
            Message.showError(t('authentication.resetPasswordHashNotValid'));
            return;
        }

        this.centralServerProvider.setAutoLoginDisabled(true);
        this.navigator.navigate('ResetPassword', {
            key: `${Utils.randomNumber()}`,
            params: { tenantSubDomain: tenant, hash },
        });
    }

    private async handleVerifyAccount(tenant: string, email: string, token: string, resetToken: string) {
        if (!tenant) {
            Message.showError(t('authentication.mandatoryTenant'));
            return;
        }

        if (!email) {
            Message.showError(t('authentication.mandatoryEmail'));
            return;
        }

        const tenantData = await this.centralServerProvider.getTenant(tenant);
        if (!tenantData) {
            Message.showError(t('authentication.unknownTenant'));
            return;
        }

        if (!token) {
            Message.showError(t('authentication.verifyAccountTokenNotValid'));
            return;
        }

        this.centralServerProvider.setAutoLoginDisabled(true);
        await this.centralServerProvider.logoff();

        this.navigator.dispatch(
            CommonActions.navigate({
                name: 'Login',
                key: `${Utils.randomNumber()}`,
                params: { tenantSubDomain: tenant, email },
            })
        );

        try {
            const result = await this.centralServerProvider.verifyEmail(tenant, email, token);
            if (result.status === Constants.REST_RESPONSE_SUCCESS) {
                Message.showSuccess(t('authentication.accountVerifiedSuccess'));

                if (resetToken && resetToken !== 'null') {
                    this.navigator.dispatch(
                        CommonActions.navigate({
                            name: 'ResetPassword',
                            key: `${Utils.randomNumber()}`,
                            params: { tenantSubDomain: tenant, hash: resetToken },
                        })
                    );
                }
            }
        } catch (error) {
            if (error.request) {
                switch (error.request.status) {
                    case HTTPError.USER_ACCOUNT_ALREADY_ACTIVE_ERROR:
                        Message.showError(t('authentication.accountAlreadyActive'));
                        break;
                    case HTTPError.INVALID_TOKEN_ERROR:
                        Message.showError(t('authentication.activationTokenNotValid'));
                        break;
                    case StatusCodes.NOT_FOUND:
                        Message.showError(t('authentication.activationEmailNotValid'));
                        break;
                    default:
                        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.activationUnexpectedError');
                }
            } else {
                Message.showError(t('authentication.activationUnexpectedError'));
            }
        }
    }
}
