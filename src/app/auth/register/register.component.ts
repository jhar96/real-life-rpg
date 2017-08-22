///<reference path="../auth.service.ts"/>
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import {register} from "ts-node/dist";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private _registerForm: FormGroup;

  private _registrationError: string;

  private _registrationSuccess: string;

  private _isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this._registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onRegister() { // todo clicks beschränken? bzw dass man nichts anderes tun kann währenddessen?
    console.log('onRegister has been called');
    this.auth.emailRegistration2(this);
  }

  get registerForm(): FormGroup {
    return this._registerForm;
  }

  get email() {
    return this._registerForm.get('email');
  }

  get username() {
    return this._registerForm.get('username');
  }

  get password() {
    return this._registerForm.get('password');
  }

  get registrationError(): string {
    return this._registrationError;
  }

  set registrationError(value: string) {
    this._registrationError = value;
  }

  get registrationSuccess(): string {
    return this._registrationSuccess;
  }

  set registrationSuccess(value: string) {
    this._registrationSuccess = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }
}
