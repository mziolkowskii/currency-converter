import { CurrencyConverter } from '@components/features/home/CurrencyConverter';
import { Screen } from '@components/Screen';
import { Text } from '@components/typography/Text';
import { BOTTOM_OFFSET } from '@constants/style';
import { useSetupContext } from '@context/SetupContext';
import { useKeyboard } from '@hooks/useKeyboard';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export const HomeScreen = () => {
  const { t } = useTranslation('home');
  const { onLayoutRootView } = useSetupContext();
  const { offset: extraKeyboardOffset } = useKeyboard();

  return (
    <Screen onLayout={onLayoutRootView}>
      <KeyboardAwareScrollView
        bottomOffset={BOTTOM_OFFSET}
        extraKeyboardSpace={extraKeyboardOffset}
        showsVerticalScrollIndicator={false}
        style={styles.keyboardScrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text variant="h1">{t('title')}</Text>
            <Text variant="text">{t('description')}</Text>
          </View>
          <CurrencyConverter />
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  keyboardScrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    gap: 40,
  },
  header: {
    gap: 8,
  },
});
