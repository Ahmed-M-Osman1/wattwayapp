import React from 'react';
import {Image, ImageStyle, Text, View, ViewStyle} from 'react-native';
import BaseProps from '../../types/BaseProps';
import computeStyleSheet from './AuthStyles';
import {scale} from '../../helper/scale.ts';
export interface Props extends BaseProps {
  tenantName?: string;
  tenantLogo?: string;
  containerStyle?: ViewStyle;
}

interface State {}

export default class AuthHeader extends React.Component<Props, State>{
  public state: State;
  public props: Props;

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { tenantName, tenantLogo, containerStyle } = this.props;
    const imageSource = tenantLogo ? {uri: tenantLogo} : require('../../../assets/logo.png');
    return (
      <View style={[style.header, (containerStyle || {})]}>
        <View style={{padding: scale(10)}}>
          <Image style={style.tenantLogo as ImageStyle} source={imageSource} />
          <Text style={style.tenantName}>WattWay</Text>
        </View>
      </View>
    );
  }
}
