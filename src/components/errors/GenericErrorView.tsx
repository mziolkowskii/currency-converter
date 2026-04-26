import { Button } from '@components/Button';
import { Text } from '@components/typography/Text';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

type GenericErrorViewProps = {
  refetch?: () => void;
  error?: string;
};

export const GenericErrorView = memo(({ refetch, error }: GenericErrorViewProps) => {
  const { t } = useTranslation(['errors', 'common']);
  return (
    <View style={styles.errorContainer}>
      <Text variant="text">{error ?? t('generic')}</Text>
      {refetch ? <Button label={t('common:retry')} variant="primary" onPress={refetch} /> : null}
    </View>
  );
});

GenericErrorView.displayName = 'GenericErrorView';

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: 'center',
    gap: 32,
    paddingVertical: 24,
  },
});
