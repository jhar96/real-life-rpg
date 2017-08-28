import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterOutlet} from "@angular/router";
import {NavComponent} from "./nav/nav.component";
import {AuthService} from "./auth/auth.service";
import {Observable} from "rxjs/Observable";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const authServiceStub = {
      isAuth() {
        return Observable.empty();
      },
      logout() {}
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        AppComponent,
        NavComponent,
      ],
      providers: [
        {provide: AuthService, useValue: authServiceStub }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should have a nav bar', () => {
    let de = fixture.debugElement.query(By.css('app-nav'));

    expect(de).not.toBeNull();
  });

  it('should have a router outlet', () => {
    let de = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(de).not.toBeNull();
  });

});
