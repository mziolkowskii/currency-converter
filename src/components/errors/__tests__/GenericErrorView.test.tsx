import { GenericErrorView } from '@components/errors/GenericErrorView';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('GenericErrorView', () => {
  it('renders the default generic error message when no error prop is provided', () => {
    const { getByText } = render(<GenericErrorView />);

    expect(getByText('generic')).toBeTruthy();
  });

  it('renders a custom error message when the error prop is provided', () => {
    const customMessage = 'Failed to fetch data';
    const { getByText } = render(<GenericErrorView error={customMessage} />);

    expect(getByText(customMessage)).toBeTruthy();
  });

  it('renders the retry button and calls refetch when pressed', () => {
    const mockRefetch = jest.fn();
    const { getByText } = render(<GenericErrorView refetch={mockRefetch} />);

    const retryButton = getByText('common:retry');
    fireEvent.press(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('does not render the retry button if refetch is not provided', () => {
    const { queryByText } = render(<GenericErrorView />);

    expect(queryByText('common:retry')).toBeNull();
  });
});
