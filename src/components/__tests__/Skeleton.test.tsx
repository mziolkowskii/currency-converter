import { Skeleton } from '@components/Skeleton';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ colors }: { colors: string[] }) => {
    const { View } = require('react-native');
    return <View testID="linear-gradient" accessibilityLabel={colors.join(',')} />;
  },
}));

describe('Skeleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the container', () => {
    render(<Skeleton height={40} />);
    expect(screen.getByTestId('skeleton-container')).toBeTruthy();
  });

  it('applies the given height', () => {
    render(<Skeleton height={80} />);
    const container = screen.getByTestId('skeleton-container');
    expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ height: 80 })]));
  });

  it('defaults to full width when width is not provided', () => {
    render(<Skeleton height={40} />);
    const container = screen.getByTestId('skeleton-container');
    expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: '100%' })]));
  });

  it('applies the given width', () => {
    render(<Skeleton height={40} width={200} />);
    const container = screen.getByTestId('skeleton-container');
    expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 200 })]));
  });

  it('defaults borderRadius to 8', () => {
    render(<Skeleton height={40} />);
    const container = screen.getByTestId('skeleton-container');
    expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ borderRadius: 8 })]));
  });

  it('applies the given borderRadius', () => {
    render(<Skeleton height={40} borderRadius={16} />);
    const container = screen.getByTestId('skeleton-container');
    expect(container.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ borderRadius: 16 })]));
  });

  it('applies the given backgroundColor', () => {
    render(<Skeleton height={40} backgroundColor="#ff0000" />);
    const container = screen.getByTestId('skeleton-container');
    expect(container.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#ff0000' })]),
    );
  });

  it('passes backgroundColor and highlightColor to LinearGradient', () => {
    render(<Skeleton height={40} backgroundColor="#aabbcc" highlightColor="#ddeeff" />);
    const gradient = screen.getByTestId('linear-gradient');
    expect(gradient.props.accessibilityLabel).toBe('#aabbcc,#ddeeff,#aabbcc');
  });

  it('starts a repeating animation on mount', () => {
    render(<Skeleton height={40} />);
    expect(Reanimated.withTiming).toHaveBeenCalledWith(1, expect.any(Object));
    expect(Reanimated.withRepeat).toHaveBeenCalledWith(expect.anything(), -1, false);
  });

  it('cancels the animation on unmount', () => {
    const { unmount } = render(<Skeleton height={40} />);
    unmount();
    expect(Reanimated.cancelAnimation).toHaveBeenCalled();
  });

  it('handles layout event to update container width', () => {
    render(<Skeleton height={40} />);
    const container = screen.getByTestId('skeleton-container');
    const sharedValue = (Reanimated.useSharedValue as jest.Mock).mock.results[0].value;
    fireEvent(container, 'layout', { nativeEvent: { layout: { width: 300 } } });
    expect(sharedValue.set).toHaveBeenCalledWith(300);
  });
});
