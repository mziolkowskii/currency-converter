import { TextInput } from '@components/form/TextInput';
import { theme } from '@styles/theme';
import { render, screen } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';

describe('TextInput', () => {
  it('forwards placeholder to the underlying TextInput', () => {
    render(<TextInput placeholder="Enter value" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeTruthy();
  });

  it('renders the right element when provided', () => {
    render(<TextInput right={<View testID="right-element" />} />);
    expect(screen.getByTestId('right-element')).toBeTruthy();
  });

  it('applies error border color when error is true', () => {
    const { toJSON } = render(<TextInput error />);
    const tree = toJSON();
    const flatStyle = StyleSheet.flatten(tree.props.style);
    expect(flatStyle).toMatchObject({ borderColor: theme.colors.error });
  });

  it('uses primary border color by default', () => {
    const { toJSON } = render(<TextInput />);
    const tree = toJSON();
    const flatStyle = StyleSheet.flatten(tree.props.style);
    expect(flatStyle).toMatchObject({ borderColor: theme.colors.primary });
  });

  it('merges custom containerStyle with default container styles', () => {
    const customStyle = { marginTop: 16 };
    const { toJSON } = render(<TextInput containerStyle={customStyle} />);
    const tree = toJSON();
    const flatStyle = StyleSheet.flatten(tree.props.style);
    expect(flatStyle).toMatchObject(customStyle);
  });
});
