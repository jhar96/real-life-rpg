import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {FirstKeyPipe} from "../../util/first-key.pipe";
import {By} from "@angular/platform-browser";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        RegisterComponent,
        FirstKeyPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an email input', () => {
    const des = fixture.debugElement.queryAll(By.css('input'));

    const index = des.findIndex(de => de.attributes['formControlName'] === 'email');
    expect(index).toBeGreaterThan(-1);
  });

  it('should have an username input', () => {
    const des = fixture.debugElement.queryAll(By.css('input'));

    const index = des.findIndex(de => de.attributes['formControlName'] === 'username');
    expect(index).toBeGreaterThan(-1);
  });

  it('should have a password input', () => {
    const des = fixture.debugElement.queryAll(By.css('input'));

    const index = des.findIndex(de => de.attributes['formControlName'] === 'password');
    expect(index).toBeGreaterThan(-1);
  });

  it('should have a submit button', () => {
    const des = fixture.debugElement.queryAll(By.css('button'));

    const index = des.findIndex(de => de.attributes['type'] === 'submit');
    expect(index).toBeGreaterThan(-1);
  });

});
