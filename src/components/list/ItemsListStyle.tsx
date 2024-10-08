import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
// // import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import {ScaledSheet } from '../../helper/scale.ts';
import {createOriented} from '../../helper/responsiveStylesSheet';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      alignItems: 'center',
      width: '100%',
      flex: 1
    },
    flatList: {
      width: '100%'
    },
    rowSeparator: {
      borderBottomColor: commonColor.listBorderColor,
      borderBottomWidth: 1
    },
    rowItem: {
      width: '100%'
    },
    rowContainer: {
      width: '100%'
    }

  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  })
}
