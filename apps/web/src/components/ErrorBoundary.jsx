import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          margin: '40px auto',
          maxWidth: '800px',
          padding: '32px',
          background: '#fee2e2',
          border: '4px solid #ef4444',
          borderRadius: '16px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#991b1b'
        }}>
          <h2 style={{ marginTop: 0, fontWeight: 'bold' }}>🚨 Component Render Error</h2>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{
            background: '#fff',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '400px',
            border: '2px solid #fca5a5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo && (
            <details style={{ marginTop: '16px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Component Stack</summary>
              <pre style={{
                background: '#fff',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                maxHeight: '300px',
                border: '2px solid #fca5a5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '16px',
              padding: '8px 20px',
              background: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
