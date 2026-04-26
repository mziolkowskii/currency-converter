import { Screen } from '@components/Screen';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { View } from 'react-native';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style, onLayout }: React.ComponentProps<typeof View>) => (
      <View testID="safe-area-view" style={style} onLayout={onLayout}>
        {children}
      </View>
    ),
  };
});

describe('Screen', () => {
  it('renders children', () => {
    render(
      <Screen>
        <View testID="child" />
      </Screen>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('calls onLayout when layout event fires', () => {
    const onLayout = jest.fn();
    render(
      <Screen onLayout={onLayout}>
        <View />
      </Screen>,
    );
    fireEvent(screen.getByTestId('safe-area-view'), 'layout');
    expect(onLayout).toHaveBeenCalledTimes(1);
  });

  it('merges custom style with container style', () => {
    const customStyle = { backgroundColor: 'red' };
    render(
      <Screen style={customStyle}>
        <View />
      </Screen>,
    );
    const safeArea = screen.getByTestId('safe-area-view');
    expect(safeArea.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
  });
});
