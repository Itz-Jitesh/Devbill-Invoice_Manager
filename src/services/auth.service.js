/**
 * Authentication Service
 * @description Centralized logic for interacting with the backend auth endpoints
 * and managing the 'devbill_auth' localStorage object.
 *
 * Key change from Vite: API_URL (`import.meta.env.VITE_API_URL`) is replaced
 * with relative paths (`/api/...`) since the API now lives on the same origin
 * as the Next.js frontend.
 */
const authService = {
  /**
   * Register a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  async signup(name, email, password) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  /**
   * Authenticate an existing user
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Success: store token and user info as a single object
    if (data.token) {
      localStorage.setItem('devbill_auth', JSON.stringify({
        token: data.token,
        user: data.user,
      }));
    }

    return data;
  },

  /**
   * Remove authentication data from storage
   */
  logout() {
    localStorage.removeItem('devbill_auth');
  },

  /**
   * Retrieve the current auth state from localStorage
   */
  getStoredAuth() {
    const auth = localStorage.getItem('devbill_auth');
    return auth ? JSON.parse(auth) : null;
  },
};

export default authService;
