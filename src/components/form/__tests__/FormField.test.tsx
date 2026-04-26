import { FormField } from '@components/form/FormField';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

type TestFormValues = { field: string };
type TestFormProps = Omit<Parameters<typeof FormField<TestFormValues>>[0], 'control' | 'name' | 'variant'>;

const TestForm = (props: TestFormProps = {}) => {
  const { control } = useForm<TestFormValues>({ defaultValues: { field: '' } });
  return <FormField<TestFormValues> control={control} name="field" variant="textWithDropdown" {...props} />;
};

describe('FormField', () => {
  describe('textWithDropdown variant', () => {
    it('renders the placeholder in the text input', () => {
      render(<TestForm placeholder="Enter value" />);
      expect(screen.getByPlaceholderText('Enter value')).toBeTruthy();
    });

    it('renders label when provided', () => {
      render(<TestForm label="Amount" />);
      expect(screen.getByText('Amount')).toBeTruthy();
    });

    it('does not render label when not provided', () => {
      render(<TestForm />);
      expect(screen.queryByText('Amount')).toBeNull();
    });

    it('renders error label when errorLabel is provided', () => {
      render(<TestForm errorLabel="Please enter a value" />);
      expect(screen.getByText('Please enter a value')).toBeTruthy();
    });

    it('does not render error label when not provided', () => {
      render(<TestForm />);
      expect(screen.queryByText('Please enter a value')).toBeNull();
    });

    it('renders the right element', () => {
      render(<TestForm right={<View testID="right-element" />} />);
      expect(screen.getByTestId('right-element')).toBeTruthy();
    });

    it('applies mapTextInputChange transformation on text change', () => {
      const mapTextInputChange = (text: string) => text.replace(/,/g, '.');
      render(<TestForm placeholder="Enter value" mapTextInputChange={mapTextInputChange} />);
      const input = screen.getByPlaceholderText('Enter value');
      fireEvent.changeText(input, '1,5');
      expect(input.props.value).toBe('1.5');
    });

    it('forwards text change to the form without transformation when mapTextInputChange is not provided', () => {
      render(<TestForm placeholder="Enter value" />);
      const input = screen.getByPlaceholderText('Enter value');
      fireEvent.changeText(input, '1.5');
      expect(input.props.value).toBe('1.5');
    });
  });
});
