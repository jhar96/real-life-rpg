import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _loginForm: FormGroup;

  private _loginError: string;

  private _loginSuccess: string;

  private _isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    console.log('LoginComponent ngOnInit');
    this._loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  /**
   * Logs the user in with the data provided by the form
   */
  onLogin() {
    this.auth.login(this);
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get loginSuccess(): string {
    return this._loginSuccess;
  }

  get loginError(): string {
    return this._loginError;
  }

  get loginForm(): FormGroup {
    return this._loginForm;
  }

  get email() {
    return this._loginForm.get('email');
  }

  get password() {
    return this._loginForm.get('password');
  }

  set loginSuccess(value: string) {
    this._loginSuccess = value;
  }

  set loginError(value: string) {
    this._loginError = value;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

}
