import React from 'react';
import { ConnectionError } from './ConnectionError';

interface State {
  error: Error | null;
}

// Catches render-time errors (a Convex query throwing on the server surfaces
// through useQuery during render) and shows the connection-error screen.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('League data error:', error);
  }

  render() {
    if (this.state.error) {
      return <ConnectionError onRetry={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}
