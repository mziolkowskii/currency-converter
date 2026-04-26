import 'i18next';
import type { I18nNamespaces } from './config';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: I18nNamespaces;
  }
}
