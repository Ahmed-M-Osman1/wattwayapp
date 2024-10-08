import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
// // import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import {ScaledSheet } from '../../../../helper/scale.ts';
import {createOriented} from '../../../../helper/responsiveStylesSheet';
import Utils from '../../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modal: {
      width: '100%',
      height: '100%',
      margin: 0
    },
    modalContent: {
      width: '100%',
      height: '100%',
      paddingHorizontal: '10@s',
      paddingTop: '1%',
      alignItems: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    safeArea: {
      width: '100%',
      height: '100%'
    },
    closeIcon: {
      color: commonColor.textColor
    },
    buttonsContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      flex: 1,
      alignItems: 'flex-end',
      paddingBottom: '10@s'
    },
    buttonContainer: {
      width: '48%',
      borderRadius: '18@s'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '20@s'
    },
    title: {
      color: commonColor.textColor,
      fontSize: '22@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  })
}
