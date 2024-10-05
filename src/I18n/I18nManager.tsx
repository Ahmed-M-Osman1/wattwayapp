import { createIntl, createIntlCache } from '@formatjs/intl';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/cs';
import 'moment/locale/pt-br';
import { I18nManager as I18nReactNativeManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

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
const { languageTag, isRTL } =
 fallback;

// Update layout direction based on RTL languages
I18nReactNativeManager.forceRTL(isRTL);

const intl = createIntl(
    {
      defaultLocale: "en",
      locale: languageTag,
      messages: translations[languageTag as Translation],
    },
    createIntlCache()
);

// Initialize I18nManager
export default class I18nManager {
  public static currency: string;
  public static distanceUnit: string;

  public static initialize(): void {
    moment.locale(languageTag);
  }
  public static switchDistanceUnit(distanceUnit: string): void {
    I18nManager.distanceUnit = distanceUnit;
  }

  public static formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
    return new Intl.NumberFormat(intl.locale, options).format(value);
  }

  public static formatCurrency(value: number, currency?: string): string {
    return new Intl.NumberFormat(intl.locale, { style: "currency", currency }).format(value);
  }

  public static formatPercentage(value: number): string {
    return new Intl.NumberFormat(intl.locale, { style: "percent" }).format(value);
  }

  public static formatDateTime(value: Date | string, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(intl.locale, options).format(new Date(value));
  }

  public static formatDistance(distanceMeters: number, useMetricSystem?: boolean): string {
    const isMetricSystem = useMetricSystem ?? RNLocalize.usesMetricSystem();
    if (isMetricSystem) {
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
    return moment.duration(durationSecs, "seconds").humanize();
  }

  public static isLocale24Hour(): boolean {
    return RNLocalize.uses24HourClock();
  }
}
