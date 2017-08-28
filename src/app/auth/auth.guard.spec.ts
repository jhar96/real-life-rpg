
import {AuthGuard} from "./auth.guard";
import {AuthService} from "./auth.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {async, inject, TestBed} from "@angular/core/testing";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {RouterTestingModule} from "@angular/router/testing";
import {Observable} from "rxjs/Observable";
import {observable} from "rxjs/symbol/observable";
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let auth: AuthService;

  class AuthServiceStub {
    isAuth() {
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: AuthServiceStub },
      ],
    });

    guard = TestBed.get(AuthGuard);
    auth = TestBed.get(AuthService);
  });

  it('should create an instance', () => {
    expect(guard).toBeDefined();
  });

  it('#canActivate should return Observable returned from #isAuth (true case)', () => {
    const spy = spyOn(auth, 'isAuth').and.returnValue(Observable.from([true]));

    const result = guard.canActivate(null, null);

    expect(spy).toHaveBeenCalled();
    result.subscribe(value => { // todo what if obs empty.. could test that
      expect(value).toBeTruthy();
    });
  });

  it('#canActivate should return Observable returned from #isAuth (false case)', () => {
    const spy = spyOn(auth, 'isAuth').and.returnValue(Observable.from([false]));

    const result = guard.canActivate(null, null);

    expect(spy).toHaveBeenCalled();
    result.subscribe(value => { // todo what if obs empty.. could test that.. check if only one value returned
      expect(value).toBeFalsy();
    });
  });

});
