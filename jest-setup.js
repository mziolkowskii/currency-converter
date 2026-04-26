jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    View: require('react-native').View,
    createAnimatedComponent: Component => Component,
  },
  cancelAnimation: jest.fn(),
  withRepeat: jest.fn(v => v),
  withTiming: jest.fn(v => v),
  useSharedValue: jest.fn(initial => ({ value: initial, set: jest.fn() })),
  useAnimatedStyle: jest.fn(fn => fn()),
  useAnimatedProps: jest.fn(fn => fn()),
  interpolate: jest.fn(() => 0),
  Easing: { inOut: jest.fn(fn => fn), sin: jest.fn() },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View, ScrollView } = require('react-native');
  return {
    BottomSheetModal: React.forwardRef(function BottomSheetModal({ children }, ref) {
      return React.createElement(View, { ref }, children);
    }),
    BottomSheetView: ({ children, style, ...props }) =>
      React.createElement(View, { testID: 'bottom-sheet-view', style, ...props }, children),
    useBottomSheetScrollableCreator: jest.fn(() => ScrollView),
  };
});
