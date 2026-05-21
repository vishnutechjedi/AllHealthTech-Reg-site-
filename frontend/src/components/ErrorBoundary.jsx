import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
    this.setState({ errorInfo: info?.componentStack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-ice)] p-8 text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-normal text-[var(--text-primary)]">
            Something went wrong
          </h1>
          <p className="max-w-md text-[var(--text-secondary)]">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          {this.state.errorInfo && (
            <pre className="max-h-48 max-w-2xl overflow-auto rounded-[var(--radius-card)] border border-[rgba(200,0,42,0.25)] bg-[rgba(200,0,42,0.06)] p-4 text-left text-xs text-[var(--color-error)]">
              {this.state.errorInfo}
            </pre>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-gradient btn-gradient-primary px-6 py-2.5 text-[13px] font-medium"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
