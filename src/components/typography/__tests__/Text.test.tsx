import { Text } from '@components/typography/Text';
import { render, screen } from '@testing-library/react-native';

describe('Text', () => {
  it('renders children', () => {
    render(<Text variant="text">Hello</Text>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('applies the variant style', () => {
    render(<Text variant="h1">Heading</Text>);
    const element = screen.getByText('Heading');
    expect(element.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize: 28 })]));
  });

  it('merges custom style with variant style', () => {
    const customStyle = { color: 'red' };
    render(
      <Text variant="text" style={customStyle}>
        Styled
      </Text>,
    );
    const element = screen.getByText('Styled');
    expect(element.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
  });
});
