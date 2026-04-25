import { Screen } from '@components/Screen';
import { useSetupContext } from '@context/SetupContext';
import { View } from 'react-native';

const HomeScreenRoute = () => {
  const { onLayoutRootView } = useSetupContext();
  return (
    <Screen onLayout={onLayoutRootView}>
      <View />
    </Screen>
  );
};

export default HomeScreenRoute;
