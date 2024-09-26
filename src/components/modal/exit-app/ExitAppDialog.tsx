import React from 'react';
import { t } from 'i18next';
import { BackHandler } from 'react-native';
import DialogModal, { DialogCommonProps } from '../DialogModal';
import computeStyleSheet from '../ModalCommonStyle';

interface State {}

export interface Props extends DialogCommonProps {}

export default class ExitAppDialog extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public render() {
    const modalCommonStyle = computeStyleSheet();
    return (
      <DialogModal
        title={t('general.exitApp')}
        description={t('general.exitAppConfirm')}
        buttons={[
          {
            text: t('general.yes'),
            action: () => BackHandler.exitApp(),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          },
          {
            text: t('general.no'),
            action: () => this.props.close?.(),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          }
        ]}
      />
    );
  }
}
