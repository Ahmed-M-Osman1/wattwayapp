import React from 'react';
import { Linking } from 'react-native';
import { t } from 'i18next';
import { Icon } from 'native-base';
import DialogModal, { DialogCommonProps } from '../DialogModal';
import { CheckVersionResponse } from 'react-native-check-version';
import computeStyleSheet from '../ModalCommonStyle';
import {scale } from '../../../helper/scale.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface Props extends DialogCommonProps {
  appVersion?: CheckVersionResponse;
}

interface State {}

export default class AppUpdateDialog extends React.Component<Props, State> {
  public static defaultProps: { isVisible: false };
  public state: State;
  public props: Props;

  public render() {
    const modalCommonStyle = computeStyleSheet();
    const { close, appVersion } = this.props;
    return (
      <DialogModal
        close={() => close?.()}
        withCloseButton={true}
        description={t('appUpdate.appUpdateDialogDescription')}
        renderIcon={(iconStyle) => <Icon size={scale(iconStyle.fontSize)} style={iconStyle} name={'update'} as={MaterialIcons} />}
        withCancel={true}
        title={t('appUpdate.appUpdateDialogTitle')}
        buttons={[
          {
            text: t('general.update'),
            action: async () => Linking.openURL(appVersion?.url ?? ''),
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            buttonStyle: modalCommonStyle.primaryButton
          }
        ]}
      />
    );
  }
}
