import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
// // import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import {ScaledSheet } from '../../../../helper/scale.ts';
import {createOriented} from '../../../../helper/responsiveStylesSheet';
import Utils from '../../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    visibleContainer: {
      justifyContent: 'flex-start',
      backgroundColor: commonColor.containerBgColor
    },
    visibleExpandedContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    visibleExpandedIcon: {
      fontSize: '25@s',
      color: commonColor.textColor
    },
    filterButtonText: {
      fontSize: "15@s",
      color: commonColor.textColor,
      textAlign: 'right'
    },
    filterButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%'
    },
    filterButtonIcon: {
      fontSize: '25@s',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  })
}
