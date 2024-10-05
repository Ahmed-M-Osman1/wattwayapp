import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
// // import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import {ScaledSheet } from '../../helper/scale.ts';
import {createOriented} from '../../helper/responsiveStylesSheet';
import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    primaryButton: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primary,
    },
    primaryButtonText: {
      color: commonColor.light
    },
    outlinedButton: {
      backgroundColor: commonColor.listBackgroundHeader,
      borderColor: commonColor.textColor
    },
    outlinedButtonText: {
      color: commonColor.textColor,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  })
}
