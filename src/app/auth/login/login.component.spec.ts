import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {AngularFireAuth, AngularFireAuthModule} from "angularfire2/auth";
import {ReactiveFormsModule} from "@angular/forms";
import {FirstKeyPipe} from "../../util/first-key.pipe";
import {AuthService} from "../auth.service";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {RouterModule} from "@angular/router";
import {routes} from "../../app.routes";
import {ActivitiesComponent} from "../../activities/activities.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: AuthService;


  beforeEach(() => {
    const authServiceStub = {
      login() {},
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
      ],
      declarations: [
        LoginComponent,
        FirstKeyPipe
      ],
      providers: [
        {provide: AuthService, useValue: authServiceStub }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    auth = TestBed.get(AuthService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call the AuthServices logout method with itself an arg if onLogout is called', () => {
    const spy = spyOn(auth, 'login');
    component.onLogin();
    expect(spy).toHaveBeenCalledWith(component);
  });
});
