import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isAuthenticated = false;

  loginIsHovered = false;

  registerIsHovered = false;

  logoutIsHovered = false;

  homeIsHovered = false;

  activitiesIsHovered = false;

  constructor(public auth: AuthService,
              private router: Router
  ) {}

  ngOnInit() {
    console.log('NavComponent ngOnInit');
    this.auth.isAuth().subscribe(
      authStatus => {
       this.isAuthenticated = authStatus;
      }
    );
  }

  toggleLoginActive() { // todo breakable
    if (this.router.url.localeCompare('/login') !== 0) {
      this.loginIsHovered = !this.loginIsHovered;
    }
  }

  toggleRegisterActive() {
    if (this.router.url.localeCompare('/register') !== 0) {
      this.registerIsHovered = !this.registerIsHovered;
    }
  }

  toggleHomeActive() {
    if (this.router.url.localeCompare('/home') !== 0) {
      this.homeIsHovered  = !this.homeIsHovered;
    }
  }

  toggleActivitiesActive() {
    if (this.router.url.localeCompare('/activities') !== 0) {
      this.activitiesIsHovered  = !this.activitiesIsHovered;
    }
  }

  toggleLogoutActive() {
    this.logoutIsHovered = !this.logoutIsHovered;
  }

  onLogout() {
    this.auth.logout();
  }
}
