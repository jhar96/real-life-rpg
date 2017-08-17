import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
      ]],
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],
    });
  }

  onRegister() {
    // todo
  }

  get email() { return this.registerForm.get('email'); }

  get username() { return this.registerForm.get('username'); }

  get password() { return this.registerForm.get('password'); }
}
