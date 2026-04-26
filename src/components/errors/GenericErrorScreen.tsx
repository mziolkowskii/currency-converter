import { Button } from '@components/Button';
import { Screen } from '@components/Screen';
import { Text } from '@components/typography/Text';
import { useBottomOffset } from '@hooks/useBottomOffset';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

type GenericErrorScreenProps = {
  onReset?: () => void;
  error?: string;
};

export const GenericErrorScreen = memo(({ onReset, error }: GenericErrorScreenProps) => {
  const { t } = useTranslation(['errors', 'common']);
  const bottomOffset = useBottomOffset();

  const screenStyles = useMemo(() => [styles.screen, { paddingBottom: bottomOffset }], [bottomOffset]);

  return (
    <Screen style={screenStyles}>
      <View style={styles.contentContainer}>
        <Text variant="h1">{t('error')}</Text>
        <Text variant="text">{error ?? t('generic')}</Text>
      </View>
      {onReset ? <Button label={t('common:reset')} onPress={onReset} variant="primary" /> : null}
    </Screen>
  );
});

GenericErrorScreen.displayName = 'GenericErrorScreen';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
});
