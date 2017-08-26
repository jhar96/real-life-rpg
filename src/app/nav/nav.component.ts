import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

/*  get loginIsActive(): boolean {
    return this._loginIsActive;
  }

  set loginIsActive(value: boolean) {
    this._loginIsActive = value;
  }

  get registerIsActive(): boolean {
    return this._registerIsActive;
  }

  set registerIsActive(value: boolean) {
    this._registerIsActive = value;
  }

  get logoutIsActive(): boolean {
    return this._logoutIsActive;
  }

  set logoutIsActive(value: boolean) {
    this._logoutIsActive = value;
  }

  get homeIsActive(): boolean {
    return this._homeIsActive;
  }

  set homeIsActive(value: boolean) {
    this._homeIsActive = value;
  }

  get activitiesIsActive(): boolean {
    return this._activitiesIsActive;
  }

  set activitiesIsActive(value: boolean) {
    this._activitiesIsActive = value;
  }*/

  private _isAuthenticated = false;

/*  private _loginIsActive = false;

  private _registerIsActive = false;

  private _logoutIsActive = false;

  private _homeIsActive = false;

  private _activitiesIsActive = false;*/

  constructor(private auth: AuthService,
              private router: Router
  ) {}

  ngOnInit() {
    console.log('NavComponent ngOnInit');
    this.auth.isAuth().subscribe(
      authStatus => {
       this._isAuthenticated = authStatus;
      }
    );
  }

/*  toggleLoginActive() { // todo breakable
    if (this.router.url.localeCompare('/login') !== 0) {
      this._loginIsActive = !this._loginIsActive;
    }
  }

  toggleRegisterActive() {
    if (this.router.url.localeCompare('/register') !== 0) {
      this._registerIsActive = !this._registerIsActive;
    }
  }

  toggleHomeActive() {
    if (this.router.url.localeCompare('/home') !== 0) {
      this._homeIsActive  = !this._homeIsActive;
    }
  }

  toggleActivitiesActive() {
    if (this.router.url.localeCompare('/activities') !== 0) {
      this._activitiesIsActive  = !this._activitiesIsActive;
    }
  }

  /!**
   * Toggles logoutIsActive so that the "active" class of the login link is toggled
   *!/
  toggleLogoutActive() {
    this._logoutIsActive = !this._logoutIsActive;
  }*/

  /**
   * Logs the user out
   */
  onLogout() {
    this.auth.logout();
  }
}
