import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
// // import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import Utils from './utils/Utils';
import {ScaledSheet} from './helper/scale.ts';
import {createOriented} from './helper/responsiveStylesSheet';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    sideMenu: {
      width: '250@s',
      color: commonColor.textColor,
      zIndex: 1,
      position: 'absolute'
    },
    barStyle: {
      color: commonColor.textColor
    },
    bottomTabsIcon: {
      fontSize: '10@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
