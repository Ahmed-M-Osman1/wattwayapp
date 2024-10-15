import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
// // import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import {ScaledSheet } from '../../helper/scale.ts';
import {createOriented} from '../../helper/responsiveStylesSheet';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonStyles = ScaledSheet.create({
    map: {
      width: '100%',
      height: '100%',
    },
    mapOverlay: {
      width: '50@s',
      position: 'absolute',
      zIndex: 1,
      height: '100%'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  })
}
