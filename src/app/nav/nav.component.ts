import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isAuthenticated = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.isAuth().subscribe(
      authStatus => {
       this.isAuthenticated = authStatus;
      }
    );
  }

  onLogout() {
    this.auth.logout();
  }
}
