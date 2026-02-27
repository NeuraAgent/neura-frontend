/**
 * Toast Service - User-friendly error and success messages
 * Replaces console.log/error with visual feedback
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
}

class ToastService {
  private container: HTMLDivElement | null = null;
  private toasts: Map<string, HTMLDivElement> = new Map();

  constructor() {
    this.initContainer();
  }

  private initContainer() {
    if (typeof window === 'undefined') return;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  private getIcon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  }

  private getColors(type: ToastType): {
    bg: string;
    border: string;
    text: string;
    icon: string;
  } {
    switch (type) {
      case 'success':
        return {
          bg: '#10b981',
          border: '#059669',
          text: '#ffffff',
          icon: '#ffffff',
        };
      case 'error':
        return {
          bg: '#ef4444',
          border: '#dc2626',
          text: '#ffffff',
          icon: '#ffffff',
        };
      case 'warning':
        return {
          bg: '#f59e0b',
          border: '#d97706',
          text: '#ffffff',
          icon: '#ffffff',
        };
      case 'info':
        return {
          bg: '#3b82f6',
          border: '#2563eb',
          text: '#ffffff',
          icon: '#ffffff',
        };
      default:
        return {
          bg: '#6b7280',
          border: '#4b5563',
          text: '#ffffff',
          icon: '#ffffff',
        };
    }
  }

  show(options: ToastOptions) {
    if (!this.container) {
      this.initContainer();
    }

    const { message, type, duration = 5000 } = options;
    const id = `toast-${Date.now()}-${Math.random()}`;
    const colors = this.getColors(type);
    const icon = this.getIcon(type);

    const toast = document.createElement('div');
    toast.id = id;
    toast.style.cssText = `
      background: ${colors.bg};
      color: ${colors.text};
      border: 2px solid ${colors.border};
      border-radius: 8px;
      padding: 12px 16px;
      min-width: 300px;
      max-width: 500px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      gap: 12px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    `;

    toast.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
        flex-shrink: 0;
      ">
        ${icon}
      </div>
      <div style="flex: 1; word-break: break-word;">
        ${this.escapeHtml(message)}
      </div>
      <button style="
        background: transparent;
        border: none;
        color: ${colors.text};
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
        font-size: 18px;
        line-height: 1;
        flex-shrink: 0;
      " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        ×
      </button>
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    if (!document.getElementById('toast-styles')) {
      style.id = 'toast-styles';
      document.head.appendChild(style);
    }

    // Close button handler
    const closeButton = toast.querySelector('button');
    closeButton?.addEventListener('click', () => {
      this.remove(id);
    });

    this.container?.appendChild(toast);
    this.toasts.set(id, toast);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  remove(id: string) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        toast.remove();
        this.toasts.delete(id);
      }, 300);
    }
  }

  success(message: string, duration?: number) {
    return this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number) {
    return this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number) {
    return this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number) {
    return this.show({ message, type: 'info', duration });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  clear() {
    this.toasts.forEach((_, id) => this.remove(id));
  }
}

// Export singleton instance
export const toastService = new ToastService();
export default toastService;
