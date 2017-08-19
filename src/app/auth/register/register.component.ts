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
  registerForm: FormGroup;

  registrationError: string;

  registrationSuccess: string;

  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onRegister() {
    this.registrationError = null;
    this.registrationSuccess = null;
    this.loading = true;
    // todo for some reason the observable returned from check username has sent twice
    // I think the problem is that it queues again after we add the new username
    let sub = this.checkUsername().subscribe(usernameValid => {
      if (usernameValid) {
        sub.unsubscribe(); // otherwise it queues again after we add the new username to the db
        sub = this.checkEmail().subscribe(emailValid => {
          if (emailValid) {
            sub.unsubscribe(); // otherwise it queues again after we add the new email address to the db
            this.auth.emailRegistration(this.email.value, this.username.value, this.password.value);
            this.loading = false;
            this.registrationSuccess = 'Registration successful';
            this.registerForm.reset();
          } else {
            this.loading = false;
            this.registrationError = 'Email already taken';
          }
        });
      } else {
        this.loading = false;
        this.registrationError = 'Username already taken';
      }
    });
  }

  private checkUsername(): Observable<any> {
    return this.auth.checkUsername(this.username.value);
  }

  private checkEmail(): Observable<any> {
    return this.auth.checkEmail(this.email.value);
  }

  get email() { return this.registerForm.get('email'); }

  get username() { return this.registerForm.get('username'); }

  get password() { return this.registerForm.get('password'); }
}
