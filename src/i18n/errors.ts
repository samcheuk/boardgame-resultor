import type { Translate } from './LocaleContext';
import type { TranslationKey } from './locales/en';

const knownErrors: Record<string, TranslationKey> = {
  'Not authorized': 'auth.notAuthorized',
  'Firebase is not configured.': 'auth.firebaseNotConfigured',
  'Firestore is not configured.': 'errors.firestoreNotConfigured',
  'Failed to load records': 'records.loadFailed',
  'Failed to delete record': 'records.deleteFailed',
  'Failed to save record': 'records.saveFailed',
  'Failed to load form data': 'records.formLoadFailed',
  'Failed to load whitelist': 'whitelist.loadFailed',
};

export function localizeError(
  error: unknown,
  t: Translate,
  fallbackKey: TranslationKey,
): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const knownKey = knownErrors[message.replace(/\.$/, '')] ?? knownErrors[message];
  if (knownKey) {
    return t(knownKey);
  }
  if (message.startsWith('Firebase is not configured.')) {
    return t('auth.firebaseNotConfigured');
  }
  if (message.includes('VITE_GOOGLE_CLIENT_ID')) {
    return t('auth.googleClientIdMissing');
  }
  if (
    message.includes('Google Identity Services') ||
    message.includes('Failed to load Google Identity Services')
  ) {
    return t('auth.googleServicesUnavailable');
  }
  if (message.toLowerCase().includes('cancel')) {
    return t('auth.signInCancelled');
  }
  return t(fallbackKey);
}
