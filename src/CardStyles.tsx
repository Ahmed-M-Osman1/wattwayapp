import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import {ScaledSheet} from './helper/scale.ts';
import {createOriented} from './helper/responsiveStylesSheet';
import Utils from './utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    cards: {
      padding: '10@s',
      backgroundColor: commonColor.headerBgColor
    },
    card: {
      backgroundColor: commonColor.headerBgColor
    },
    cardItem: {
      backgroundColor: commonColor.headerBgColor
    },
    cardIcon: {
      textAlign: 'center',
      fontSize: '50@s',
      width: '55@s',
      color: commonColor.textColor
    },
    cardText: {
      fontSize: '20@s',
      color: commonColor.textColor
    },
    cardNote: {
      fontStyle: 'italic',
      fontSize: '12@s',
      color: commonColor.subTextColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
        portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  })
}
