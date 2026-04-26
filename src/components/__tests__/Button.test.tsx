import { Button } from '@components/Button';
import { fireEvent, render, screen } from '@testing-library/react-native';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Press me" onPress={() => {}} variant="primary" />);
    expect(screen.getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button label="Press me" onPress={onPress} variant="primary" />);
    fireEvent.press(screen.getByText('Press me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
