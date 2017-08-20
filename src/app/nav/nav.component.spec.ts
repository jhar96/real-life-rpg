import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkWithHref} from "@angular/router";
import {By} from "@angular/platform-browser";
import {AuthService} from "../auth/auth.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ NavComponent ],
      providers: [
        AuthService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the activities page', () => {
    let des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    let index = des.findIndex(de => de.properties['href'] === '/activities');
    expect(index).toBeGreaterThan(-1);
  });

  it('should have a link to the login page', () => {
    let des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    let index = des.findIndex(de => de.properties['href'] === '/login');
    expect(index).toBeGreaterThan(-1);
  });

  it('should have a link to the register page', () => {
    let des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    let index = des.findIndex(de => de.properties['href'] === '/register');
    expect(index).toBeGreaterThan(-1);
  });

  // todo Everything with displaying and not displaying buttons

  // todo logout
});
