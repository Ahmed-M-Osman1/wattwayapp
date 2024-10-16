// Translation files
const translations = {
    en: require("../locals/en.json"),
    fr: require("../locals/fr.json"),
    de: require("../locals/de.json"),
    es: require("../locals/es.json"),
    pt: require("../locals/pt.json"),
    it: require("../locals/it.json"),
    cs: require("../locals/cs.json"),
} as const;

type Translation = keyof typeof translations;

const fallback = { languageTag: "en", isRTL: false };
const { languageTag, isRTL } = fallback;

// Helper to simulate RTL (for layout purposes)
const forceRTL = (isRTL: boolean) => {
    // Logic to handle RTL layout if needed
    // Can be simulated by reversing styles for example
};

// Call helper to update layout direction
forceRTL(isRTL);

const intl = {
    defaultLocale: "en",
    locale: languageTag,
    messages: translations[languageTag as Translation]
};

// I18nManager class
export default class I18nManager {
    public static currency: string;
    public static distanceUnit: string;

    public static initialize(): void {
        console.log(`Locale initialized: ${languageTag}`);
    }

    public static switchDistanceUnit(distanceUnit: string): void {
        I18nManager.distanceUnit = distanceUnit;
    }

    public static formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
        return new Intl.NumberFormat(intl.locale, options).format(value);
    }

    public static formatCurrency(value: number, currency: string = I18nManager.currency): string {
        return new Intl.NumberFormat(intl.locale, { style: "currency", currency }).format(value);
    }

    public static formatPercentage(value: number): string {
        return new Intl.NumberFormat(intl.locale, { style: "percent" }).format(value);
    }

    public static formatDateTime(value: Date | string, options?: Intl.DateTimeFormatOptions): string {
        return new Intl.DateTimeFormat(intl.locale, options).format(new Date(value));
    }

    public static formatDistance(distanceMeters: number, useMetricSystem: boolean = true): string {
        if (useMetricSystem) {
            return distanceMeters < 1000
                ? `${I18nManager.formatNumber(distanceMeters)} m`
                : `${I18nManager.formatNumber(distanceMeters / 1000, { maximumFractionDigits: 1 })} km`;
        } else {
            const distanceYards = distanceMeters * 1.09361;
            return distanceYards < 1760
                ? `${I18nManager.formatNumber(distanceYards)} yd`
                : `${I18nManager.formatNumber(distanceYards / 1760, { maximumFractionDigits: 1 })} mi`;
        }
    }

    public static formatDuration(durationSecs: number): string {
        const minutes = Math.floor(durationSecs / 60);
        const seconds = durationSecs % 60;
        return `${minutes} minute(s) ${seconds} second(s)`;
    }

    public static isLocale24Hour(): boolean {
        return ["fr", "de", "it"].includes(languageTag);
    }

    public static formatNumberWithCompacts(
        value: number,
        options: FormatNumberOptions = {},
        locale: string = intl.locale
    ): FormatNumberResult | null {
        options = { ...options };

        if (!options.currency) {
            delete options.currency;
            delete options.currencySign;
            delete options.currencyDisplay;
            if (options.style === NumberFormatStyleEnum.CURRENCY) {
                delete options.style;
            }
        }

        if (!options.unit) {
            delete options.unit;
            delete options.unitDisplay;
            if (options.style === NumberFormatStyleEnum.UNIT) {
                delete options.style;
            }
        }

        const isUnit = options.unit;
        const isPercent = options.style === NumberFormatStyleEnum.PERCENT;
        const isCurrency = options.currency;
        const shouldCompact = !options.compactThreshold || (options.compactThreshold && value > options.compactThreshold);

        if (!shouldCompact && options.notation === NumberFormatNotationEnum.COMPACT) {
            delete options.notation;
        }

        Object.keys(options).forEach(option => {
            if (options[option] === undefined || options[option] === null) {
                delete options[option];
            }
        });

        try {
            const parts = Intl.NumberFormat(locale, options).formatToParts(value);
            let compact = this.getFormatPartValue(parts, NumberFormatSymbolsEnum.COMPACT);

            if (compact && options.compactStyle === NumberFormatCompactStyleEnum.METRIC) {
                compact = this.computeMetricCompact(value);
            }

            return {
                value: this.concatenateNumberFormatParts(parts),
                ...(isCurrency && { currency: this.getFormatPartValue(parts, NumberFormatSymbolsEnum.CURRENCY) }),
                ...(isUnit && { unit: this.getFormatPartValue(parts, NumberFormatSymbolsEnum.UNIT) }),
                ...(compact && { compact }),
                ...(isPercent && { percentSign: this.getFormatPartValue(parts, NumberFormatSymbolsEnum.PERCENT_SIGN) })
            };
        } catch (e) {
            console.error('Error formatting number:', e);
            return null;
        }
    }

    public static concatenateNumberFormatParts(parts: Intl.NumberFormatPart[] = []): string {
        return parts
            .filter(part => !(part.type.toUpperCase() in NumberFormatSymbolsEnum))
            .map(part => part.value)
            .join('')
            .trim();
    }

    public static getFormatPartValue(
        parts: Intl.NumberFormatPart[],
        type: Intl.NumberFormatPartTypes
    ): string | undefined {
        return parts.find(part => part.type === type)?.value;
    }

    public static computeMetricCompact(value: number): string | null {
        if (value < 1000) {
            return null;
        }
        if (value >= 1000 && value < 1000000) {
            return MetricCompactEnum.KILO;
        }
        if (value >= 1000000 && value < 1000000000) {
            return MetricCompactEnum.MEGA;
        }
        if (value >= 1000000000 && value < 1000000000000) {
            return MetricCompactEnum.GIGA;
        }
        return MetricCompactEnum.TERA;
    }
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
    compactThreshold?: number;
    compactStyle?: NumberFormatCompactStyleEnum;
}

export enum NumberFormatCompactStyleEnum {
    METRIC = 'metric',
    FINANCE = 'finance'
}

export enum NumberFormatSymbolsEnum {
    PERCENT_SIGN = 'percentSign',
    UNIT = 'unit',
    CURRENCY = 'currency',
    COMPACT = 'compact'
}

export enum MetricCompactEnum {
    KILO = 'k',
    MEGA = 'M',
    GIGA = 'G',
    TERA = 'T'
}

export interface FormatNumberResult {
    unit?: string;
    currency?: string;
    compact?: string;
    percentSign?: string;
    value?: string;
}

export enum NumberFormatNotationEnum {
    SCIENTIFIC = 'scientific',
    ENGINEERING = 'engineering',
    COMPACT = 'compact',
    STANDARD = 'standard'
}

export enum NumberFormatStyleEnum {
    DECIMAL = 'decimal',
    CURRENCY = 'currency',
    PERCENT = 'percent',
    UNIT = 'unit'
}
