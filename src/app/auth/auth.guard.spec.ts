
import {AuthGuard} from "./auth.guard";
import {AuthService} from "./auth.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {async, inject, TestBed} from "@angular/core/testing";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {RouterTestingModule} from "@angular/router/testing";
import {Observable} from "rxjs/Observable";
describe('AuthGuard', () => {
/*
  let guard: AuthGuard;
  let auth: AuthService;*/


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
        AuthService
      ],
    });
  });
/*

// todo

   /!*  beforeEach(() => {
   const afAuth = new AngularFireAuth();
   const db: =AngularFireDatabase,
   private router: Router,
   spyOn(auth, 'initialize').and.callFake(() => {});
   auth = new AuthService(null, null, null);
   guard = new AuthGuard(auth);
   });*!/

   it('kjmnbvfgd',
   async(() => {
   console.log('start');
   const auth = TestBed.get(AuthService);
   const guard = new AuthGuard(auth);
   // add a spy
   const spy = spyOn(auth, 'isAuth').and.callFake(() => {
   return Observable.from([true]);
   });
   console.log('before can activate');
   guard.canActivate(null, null);
   console.log('after can activate');
   expect(spy).toHaveBeenCalled();
   })
   );

   /!*  it('should return the observable returned from the isAuth method of the AuthService (true case)', () => {
   spyOn(auth, 'isAuth').and.callFake(() => {
   return Observable.from([true]);
   });
   const result = guard.canActivate(null, null);
   expect(result).toEqual(Observable.from([true]));
   });

   it('should return the observable returned from the isAuth method of the AuthService (false case)', () => {
   spyOn(auth, 'isAuth').and.callFake(() => {
   return Observable.from([false]);
   });
   const result = guard.canActivate(null, null);
   expect(result).toEqual(Observable.from([false]));
   });*!/
   */

});
