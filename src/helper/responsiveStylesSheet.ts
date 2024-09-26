import { StyleSheet, Dimensions } from 'react-native';

const VALID_DIRECTIONS = [
    'min-width',
    'max-width',
    'min-height',
    'max-height',
    'min-direction',
    'max-direction',
];

export function create(styles: { [key: string]: any }) {
    return StyleSheet.create(styles);
}

// Create sheet based on size increments for a certain direction
export function createSized(
    direction: string,
    map: { [size: string]: { [key: string]: any } }
) {
    if (VALID_DIRECTIONS.indexOf(direction) === -1) {
        throw new TypeError('direction must equal ' + VALID_DIRECTIONS.join(' or '));
    }

    const sizes = Object.keys(map).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    const stylesheets = sizes.reduce((result: { [size: string]: any }, size) => {
        const stylesheet = map[size];
        result[size] = StyleSheet.create(stylesheet);
        return result;
    }, {});

    const styleNames = sizes.reduce((names: string[], size) => {
        return names.concat(Object.keys(map[size]));
    }, []);

    const sheet: { [key: string]: any } = {};

    styleNames.forEach((styleName) => {
        if (sheet[styleName]) return;

        Object.defineProperty(sheet, styleName, {
            get: function getStyles() {
                const valid = validSizes(direction, sizes);

                return valid.reduce((styles: any[], size: string) => {
                    const stylesheet = stylesheets[size];
                    const style = stylesheet[styleName];

                    if (!style) return styles;
                    return styles.concat(style);
                }, []);
            },
            enumerable: true,
            configurable: true,
        });
    });

    return sheet;
}

// Creates sheet based on landscape or portrait orientation
export function createOriented(map: { landscape?: any; portrait?: any }) {
    const landscapeStyles = map.landscape || {};
    const portraitStyles = map.portrait || {};

    const landscapeStylesheet = StyleSheet.create(landscapeStyles);
    const portraitStylesheet = StyleSheet.create(portraitStyles);

    const stylesheets = {
        landscape: landscapeStylesheet,
        portrait: portraitStylesheet,
    };

    const styleNames = Array.from(
        new Set([...Object.keys(landscapeStyles), ...Object.keys(portraitStyles)])
    );

    const sheet: { [key: string]: any } = {};

    styleNames.forEach((styleName) => {
        if (sheet[styleName]) return;

        Object.defineProperty(sheet, styleName, {
            get: function getStyle() {
                const orientation = getOrientation();
                return stylesheets[orientation][styleName];
            },
            enumerable: true,
            configurable: true,
        });
    });

    return sheet;
}

function validSizes(direction: string, sizes: string[]) {
    const dimensions = Dimensions.get('window');
    const width = dimensions.width;
    const height = dimensions.height;

    const dimensionName = direction.slice(4);
    let dimension: number;
    if (dimensionName === 'direction') {
        dimension = Math.min(width, height);
    } else {
        dimension = (dimensions as any)[dimensionName] as number;
    }

    const directionName = direction.slice(0, 3);
    const greater = directionName === 'min';

    const styles = sizes.filter((size) => {
        const parsed = parseInt(size, 10);
        return greater ? dimension >= parsed : dimension <= parsed;
    });

    return greater ? styles : styles.reverse();
}

function getOrientation() {
    const dimensions = Dimensions.get('window');
    return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
}
