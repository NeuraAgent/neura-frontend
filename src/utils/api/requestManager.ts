/**
 * API Request Manager
 * Centralized control for all API requests
 * Handles authentication, cancellation, and request lifecycle
 */

import type { AxiosRequestConfig } from 'axios';

import { AUTH_ENDPOINT_PATTERNS, PUBLIC_ENDPOINTS } from '@/constants/api';
import { ALL_AUTH_PAGES } from '@/constants/routes';
import { useUserStore } from '@/stores/userStore';

export class RequestManager {
  private static pendingRequests = new Map<string, AbortController>();

  /**
   * Check if current page is an auth page
   */
  static isOnAuthPage(): boolean {
    const currentPath = window.location.pathname;
    return ALL_AUTH_PAGES.includes(currentPath as any);
  }

  /**
   * Check if request is an auth-related endpoint
   */
  static isAuthEndpoint(url?: string): boolean {
    if (!url) return false;

    return AUTH_ENDPOINT_PATTERNS.some(pattern => url.includes(pattern));
  }

  /**
   * Check if request should be allowed
   */
  static shouldAllowRequest(config: AxiosRequestConfig): boolean {
    const isAuthPage = this.isOnAuthPage();
    const isAuthEndpoint = this.isAuthEndpoint(config.url);

    // Allow auth endpoints even on auth pages
    if (isAuthEndpoint) {
      return true;
    }

    // Block non-auth requests on auth pages
    if (isAuthPage) {
      console.warn('⚠️ Blocking request on auth page:', config.url);
      return false;
    }

    return true;
  }

  /**
   * Check if user is authenticated
   * Uses userStore instead of cookies
   */
  static isAuthenticated(): boolean {
    return useUserStore.getState().isAuthenticated;
  }

  /**
   * Check if request requires authentication
   */
  static requiresAuth(url?: string): boolean {
    if (!url) return true;

    return !PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
  }

  /**
   * Create abort controller for request
   */
  static createAbortController(requestId: string): AbortController {
    const controller = new AbortController();
    this.pendingRequests.set(requestId, controller);
    return controller;
  }

  /**
   * Remove abort controller after request completes
   */
  static removeAbortController(requestId: string): void {
    this.pendingRequests.delete(requestId);
  }

  /**
   * Cancel specific request
   */
  static cancelRequest(requestId: string): void {
    const controller = this.pendingRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Cancel all pending requests
   */
  static cancelAllRequests(): void {
    this.pendingRequests.forEach(controller => {
      controller.abort();
    });
    this.pendingRequests.clear();
  }

  /**
   * Cancel all non-auth requests (useful during logout)
   */
  static cancelNonAuthRequests(): void {
    // This would require tracking request URLs, which we can add if needed
    this.cancelAllRequests();
  }

  /**
   * Generate unique request ID
   */
  static generateRequestId(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${Date.now()}`;
  }
}
