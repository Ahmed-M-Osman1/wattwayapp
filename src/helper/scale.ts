import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const deepMap = (obj, fn) => {
    const deepMapper = val => (isObject(val)) ? deepMap(val, fn) : fn(val);
    if (Array.isArray(obj)) {
        return obj.map(deepMapper);
    }
    if (isObject(obj)) {
        return mapObject(obj, deepMapper);
    }
    return obj;
};

const mapObject = (obj, fn) => Object.keys(obj).reduce(
    (res, key) => {
        res[key] = fn(obj[key]);
        return res;
    }, {});

const isObject = myVar => myVar && typeof myVar === 'object';

export default deepMap;

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = size => shortDimension / guidelineBaseWidth * size;
export const verticalScale = size => longDimension / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
export const moderateVerticalScale = (size, factor = 0.5) => size + (verticalScale(size) - size) * factor;

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;


const validScaleSheetRegex = /^(\-?\d+(?:\.\d{1,3})?)@(mv?s(\d+(?:\.\d{1,2})?)?|s|vs)r?$/;

const scaleByAnnotation = (scale, verticalScale, moderateScale, moderateVerticalScale) => (value) => {
    if (!validScaleSheetRegex.test(value)) {
        return value;
    }

    const regexExecResult = validScaleSheetRegex.exec(value);

    const size = parseFloat(regexExecResult[1]);
    let scaleFunc = regexExecResult[2];
    const scaleFactor = regexExecResult[3]; // string or undefined

    if (scaleFactor)
        scaleFunc = scaleFunc.slice(0, - scaleFactor.length); // Remove the factor from it

    const shouldRound = value.endsWith('r');

    let result;

    switch (scaleFunc) {
        case 's':
            result = scale(size);
            break;
        case 'vs':
            result = verticalScale(size);
            break;
        case 'ms':
            result = moderateScale(size, scaleFactor);
            break;
        case 'mvs':
            result = moderateVerticalScale(size, scaleFactor);
            break;
    }
    console.log('======', result)
    return shouldRound ? Math.round(result) : result;
};

    const scaledSheetCreator = (scale, verticalScale, moderateScale, moderateVerticalScale) => {
    const scaleFunc = scaleByAnnotation(scale, verticalScale, moderateScale, moderateVerticalScale);
    return {
        create: styleSheet => StyleSheet.create(deepMap(styleSheet, scaleFunc))
    };
};

export const ScaledSheet = scaledSheetCreator(scale, verticalScale, moderateScale, moderateVerticalScale);

