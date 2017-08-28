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
import {Observable} from "rxjs/Observable";
import {ActivitiesComponent} from "../activities/activities.component";
import {LoginComponent} from "../auth/login/login.component";
import {RegisterComponent} from "../auth/register/register.component";
import {HomeComponent} from "../home/home.component";
import {AuthGuard} from "../auth/auth.guard";
import {NoAuthGuard} from "../auth/no-auth.guard";
import {FirstKeyPipe} from "../util/pipes/first-key.pipe";
import {ReactiveFormsModule} from "@angular/forms";

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let auth: AuthService;

  beforeEach(() => {
    const authServiceStub = {
      isAuth() {
        return Observable.empty();
      },
      logout() {}
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
        NavComponent,
      ],
      providers: [
        {provide: AuthService, useValue: authServiceStub }
      ]
    });

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;

    auth = TestBed.get(AuthService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('should if isAuthenticated is true', () => {
    beforeEach(() => {
      component.isAuthenticated = true;
      fixture.detectChanges();
    });

    it('have a link to the activities page', () => {
      const des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      const index = des.findIndex(de => de.properties['href'] === '/activities');
      expect(index).toBeGreaterThan(-1);
    });

    it('not have a link to the login page', () => {
      const des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      const index = des.findIndex(de => de.properties['href'] === '/login');
      expect(index).not.toBeGreaterThan(-1);
    });

    it('not have a link to the register page', () => {
      const des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      const index = des.findIndex(de => de.properties['href'] === '/register');
      expect(index).not.toBeGreaterThan(-1);
    });

    it('have a logout button', () => {
      const des = fixture.debugElement.queryAll(By.css('a'));

      const index = des.findIndex(de => de.nativeElement.innerText === 'Logout'); //todo a bit fragile
      console.log(index);
      expect(index).toBeGreaterThan(-1);
    });
  });

  describe('should if isAuthenticated is false', () => {
    beforeEach(() => {
      component.isAuthenticated = false;
      fixture.detectChanges();
    });

    it('not have a link to the activities page', () => {
      const des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      const index = des.findIndex(de => de.properties['href'] === '/activities');
      expect(index).not.toBeGreaterThan(-1);
    });

    it('have a link to the login page', () => {
      const des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      const index = des.findIndex(de => de.properties['href'] === '/login');
      expect(index).toBeGreaterThan(-1);
    });

    it('have a link to the register page', () => {
      const des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      const index = des.findIndex(de => de.properties['href'] === '/register');
      expect(index).toBeGreaterThan(-1);
    });

    it('not have a logout button', () => {
      const des = fixture.debugElement.queryAll(By.css('a'));

      const index = des.findIndex(de => de.nativeElement.innerText === 'Logout'); // todo a bit fragile
      expect(index).not.toBeGreaterThan(-1);
    });
  });

  it('should update isAuthenticated with true if returned from the AuthService', async(() => {
    spyOn(auth, 'isAuth').and
      .callFake(() => {
        return (Observable.from([true]));
      });

    component.isAuthenticated = false;
    component.ngOnInit();

     fixture.whenStable().then(() => {
       expect(component.isAuthenticated).toBe(true);
     });
  }));

  it('should update isAuthenticated with false if returned from the AuthService', async(() => {
    spyOn(auth, 'isAuth').and
      .callFake(() => {
        return (Observable.from([false]));
      });

    component.isAuthenticated = true;
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(component.isAuthenticated).toBe(false);
    });
  }));

/*  it('should toggle logoutIsActive if ' +
    'toggleLogoutActive is called (true => false)', () => {
    // component.isAuthenticated = true;
    // fixture.detectChanges();
    // let des = fixture.debugElement.queryAll(By.css('a'));
    // let logoutLink = des.find(de => de.nativeElement.innerText === 'Logout'); // todo a bit fragile
    // logoutLink.classes['active'] = true;
    // expect(logoutLink.classes['active']).toBeTruthy();
    //
    // component.toggleLogoutActive();
    // fixture.detectChanges();
    //
    // des = fixture.debugElement.queryAll(By.css('a'));
    // logoutLink = des.find(de => de.nativeElement.innerText === 'Logout'); // todo a bit fragile
    // expect(logoutLink.classes['active']).toBeFalsy();
    component.logoutIsActive = true;
    component.toggleLogoutActive();

    expect(component.logoutIsActive).toBeFalsy();
  });

  it('should toggle logoutIsActive if ' +
    'toggleLogoutActive is called (false => true)', () => {
    component.logoutIsActive = false;
    component.toggleLogoutActive();

    expect(component.logoutIsActive).toBeTruthy();
  });*/

  it('should call the AuthServices logout method if onLogout is called', () => {
    const spy = spyOn(auth, 'logout');
    component.onLogout();
    expect(spy).toHaveBeenCalled();
  });
});
