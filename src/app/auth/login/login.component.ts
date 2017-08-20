import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  loginError: string;

  loginSuccess: string;

  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    this.loginError = null;
    this.loginSuccess = null;
    this.loading = true;
    this.auth.login(this.email.value, this.password.value)
      .then(result =>  {
        if (result) {
          this.loginError = result;
        } else {
          this.loginSuccess = 'Login successful';
        }
      });
    this.loading = false;
  }

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }
}
