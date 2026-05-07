import { Injectable } from '@angular/core';

export interface AuthUser {
  id: number;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageKey = 'auth_user';

  // =========================
  // SET USER (after login)
  // =========================
  setUser(user: AuthUser): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  // =========================
  // GET USER
  // =========================
  getUser(): AuthUser | null {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  // =========================
  // GET USER ID
  // =========================
  getUserId(): number | null {
    return this.getUser()?.id ?? null;
  }

  // =========================
  // GET ROLE
  // =========================
  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  // =========================
  // CHECK LOGIN
  // =========================
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}