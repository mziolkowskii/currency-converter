import { isDevelopment } from '@utils/common/isDevelopment';
import { Component, ErrorInfo, ReactNode } from 'react';
import { GenericErrorScreen } from './GenericErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

declare const ErrorUtils: {
  getGlobalHandler: () => ((error: Error, isFatal?: boolean) => void) | null;
  setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

export class ErrorBoundary extends Component<Props, State> {
  private originalErrorHandler?: ((error: Error, isFatal?: boolean) => void) | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  componentDidMount() {
    if (typeof ErrorUtils !== 'undefined') {
      this.originalErrorHandler = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler(this.handleGlobalError);
    }
  }

  componentWillUnmount() {
    if (typeof ErrorUtils !== 'undefined' && this.originalErrorHandler) {
      ErrorUtils.setGlobalHandler(this.originalErrorHandler);
    }
  }

  private handleGlobalError = (error: Error, isFatal?: boolean) => {
    this.handleAsyncError(error);

    if (this.originalErrorHandler) {
      this.originalErrorHandler(error, isFatal);
    }
  };

  private handleAsyncError = (error: Error) => {
    if (isDevelopment) {
      console.error('ErrorBoundary caught async error:', {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      });
    }

    this.setState({
      hasError: true,
      error,
    });

    // Can be extended to add error reporting to external service
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const componentInfo = this.extractComponentInfo(errorInfo.componentStack);

    if (isDevelopment) {
      console.error('ErrorBoundary caught an error:', {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        componentInfo,
        componentStack: errorInfo.componentStack,
      });
    }

    // Can be extended to add error reporting to external service
  }

  private extractComponentInfo(componentStack: string | null | undefined) {
    const lines = componentStack?.split('\n') || [];
    const firstLine = lines[1] || lines[0] || '';

    const componentMatch = firstLine.match(/in\s+(\w+)/);
    const component = componentMatch?.[1] ?? 'Unknown';

    const fileMatch = firstLine.match(/\(([^)]+)\)/);
    const file = fileMatch?.[1] ?? 'Unknown';

    const directory = file !== 'Unknown' ? file.split('/').slice(0, -1).join('/') : 'Unknown';

    return {
      component,
      file,
      directory,
    };
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError && error) {
      return <GenericErrorScreen onReset={this.resetError} />;
    }

    return children;
  }
}
