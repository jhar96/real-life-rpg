import { Injectable } from '@angular/core';
import {User} from "../user/user";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import "rxjs/add/operator/switchMap";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  get authState(): Observable<firebase.User> {
    return this._authState;
  }

  get currentUser(): User {
    return this._currentUser;
  }

  private _currentUser: User;

  private tempUser: User;

  private _authState: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router: Router,
  ) {
    this.initialize();
  }

  public initialize() {
    console.log('AuthService initialize');
    this._authState = this.afAuth.authState;
    this.afAuth.authState.subscribe(auth => {
      console.log('auth has changed..');
      if (auth) {
        this.handleLogin(auth);
      } else {
        this.handleLogout(auth);
      }
    });
  }

  private handleLogin(auth) { // todo do refactor
    console.log('handleLogin');
    this.tryLoadingUserData(auth);
  }

  private tryLoadingUserData(auth) {
    console.log('tryLoadingUserData');
    console.log(auth.uid);
    this.db.object(`/users/${auth.uid}`).first().subscribe(userData => {
      console.log(userData);
      if (userData.emailAddress) {
        console.log('user data loaded..');
        this.createUser(userData, auth); // todo should I use a promise and then here?
        this.router.navigate(['/activities']);
      } else {
        console.log('user data could not be loaded..');
        if (this.tempUser) {
          this.firstLogin(auth); // todo should I use a promise and then here?
          this.router.navigate(['/activities']);
        } else {
          console.log('temp user was empty');
        }
      }
    });
  }

  private createUser(userData, auth) {
    console.log('createUser');
    this._currentUser = new User(userData.emailAddress, userData.username, auth.uid);
    console.log(this._currentUser);
  }

  private firstLogin(auth) {
    console.log('firstLogin');
    this._currentUser = new User(this.tempUser.emailAddress, this.tempUser.username, auth.uid);
    this.updateUserData(this.tempUser.emailAddress, this.tempUser.username);
  }

  private handleLogout(auth) {
    console.log('handleLogout');
    this.router.navigate(['/login']);
  }

  public isAuth(): Observable<boolean> { // todo change this to this.afAuth.authState?
    const state = new Subject<boolean>(); // todo understand this code
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        state.next(true);
      } else {
        state.next(false);
      }
    });
    return state.asObservable();
  }

  public emailRegistration(reg: RegisterComponent) {
    console.log('emailRegistration');
    this.registrationPreparation(reg);
    this.validateRegistration(reg)
      .subscribe(error => {
        if (error) {
          this.handleRegistrationError(reg, error);
        } else {
          this.tryEmailRegistration(reg);
        }
      });
  }

  private registrationPreparation(reg: RegisterComponent) {
    console.log('registrationPreparation');
    reg.registrationError = null; // todo why can I not call the setter in another way
    reg.registrationSuccess = null;
    reg.isLoading = true;
  }

  private handleRegistrationError(reg, error) {
    console.log('handleRegistrationError');
    reg.isLoading = false;
    reg.registrationError = error;
  }

  private handleRegistrationSuccess(reg) {
    console.log('handleRegistrationSuccess');
    reg.isLoading = false;
    reg.registrationSuccess = 'Registration succesful';
  }

  private tryEmailRegistration(reg: RegisterComponent) {
    console.log('tryEmailRegistration');
    this.tempUser = new User(reg.email.value, reg.username.value);
    this.afAuth.auth.createUserWithEmailAndPassword(reg.email.value , reg.password.value)
      .then(() => {
        this.handleRegistrationSuccess(reg);
      })
      .catch(registrationError => {
        console.log('failed email registration');
        console.log(registrationError.message);
        this.handleRegistrationError(reg, registrationError.message);
      });
  }

  /**
   * Returns an observable which emits (only once) an error message if one
   * occurred or null if not and then completes
   */
  private validateRegistration(reg: RegisterComponent): Observable<string> {
    const validateEmailObs = this.validateEmail(reg.email.value);
    const validateUsernameObs = this.validateUsername(reg.username.value);
    return Observable.combineLatest(validateEmailObs, validateUsernameObs,
      (emailAddressValidationError, usernameValidationError) => {
        if (emailAddressValidationError) {
          console.log('there was an email validation error');
          return emailAddressValidationError;
        } else {
          if (usernameValidationError) {
            console.log('there was an username validation error');
            return usernameValidationError;
          } else {
            console.log('there was no validation error');
            return null;
          }
        }
      }); // todo is first here necessary?
  }

  /**
    * Returns an observable which emits (only once) an error message if one
    * occurred or null if not and then completes
    */
  private validateUsername(username: string): Observable<string> {
    console.log('checking username..');
    const result = this.db.list('/usernames', {
      query: {
        orderByChild: 'username',
        equalTo: username,
      },
      preserveSnapshot: true,
    });
    return result.first().map(snapshots => {
      console.log(snapshots);
      if (snapshots.length === 0) {
        return null;
      } else {
        return 'Username already taken';
      }
    });
  }

  /**
   * Returns an observable which emits (only once) an error message if one
   * occurred or null if not and then completes
   */
  private validateUsername2(username: string): Observable<string> {
    console.log('checking username..');
    const result = this.db.list('/usernames', {
      query: {
        orderByChild: 'username'
      }
    });
    return result.first().map((usernames: Array<any>) => {
      console.log(usernames);
      const finding = usernames.find(usernameWrapper => this.findEqualUsername(usernameWrapper, username));
      console.log(finding);
      if (finding) {
        return 'Username already taken';
      }
      return null;
    });
  }

  /**
   * Returns true if the wrapper contains a username
   * that is considered equal to the provided username
   * Returns false otherwise
   */
  private findEqualUsername(usernameWrapper, username: string) { // todo debug
    return usernameWrapper.username.toLowerCase().localeCompare(username.toLowerCase());
  }

  /**
   * Returns an observable which emits (only once) an error message if one
   * occurred or null if not and then completes
   */
  private validateEmail(emailAddress: string): Observable<string> {
    console.log('checking email address..');
    const result = this.db.list('/emailAddresses', {
      query: {
        orderByChild: 'emailAddress',
        equalTo: emailAddress,
      },
      preserveSnapshot: true,
    });
    return result.first().map(snapshots => {
      console.log(snapshots);
      if (snapshots.length === 0) {
        return null;
      } else {
        return 'Email already taken';
      }
    });
  }

  private updateUserData(emailAddress: string, username: string) {
    console.log('updating user data..');
    this.updateUsername(username);
    this.updateEmailAddress(emailAddress);
    this.updateUser(emailAddress, username);
  }

  private updateUsername(username: string) {
    console.log('updating username..');
    this.db.list('/usernames').push({username: username, uid: this._currentUser.uid});
  }

  private updateEmailAddress(emailAddress: string) {
    console.log('updating email address..');
    this.db.list('/emailAddresses').push({emailAddress: emailAddress, uid: this._currentUser.uid});
  }

  private updateUser(emailAddress: string, username: string) {
    console.log('updating user..');
    this.db.object(`/users/${this._currentUser.uid}`).update({'username': username, 'emailAddress': emailAddress});
  }

  public login(log: LoginComponent) {
    console.log('login');
    this.loginPreparation(log);
    this.tryLogin(log);
  }

  private loginPreparation(log: LoginComponent) {
    console.log('loginPreparation');
    log.loginError = null;
    log.loginSuccess = null;
    log.isLoading = true;
  }

  private tryLogin(log: LoginComponent) {
    this.afAuth.auth.signInWithEmailAndPassword(log.email.value, log.password.value)
      .then(() => {
        console.log('log in successful');
        this.handleLoginSuccess(log);
      })
      .catch(loginError => {
        console.log('failed email registration');
        console.log(loginError.message);
        this.handleLoginError(log, loginError.message);
      });
  }

  private handleLoginError(log: LoginComponent, error: string) {
    console.log('handleLoginError');
    log.isLoading = false;
    log.loginError = error; // todo remap errors cause too detailed?
  }

  private handleLoginSuccess(log: LoginComponent) {
    console.log('handleLoginSuccess');
    log.isLoading = false;
    log.loginSuccess = 'Login successful';
  }

  public logout() {
    this.afAuth.auth.signOut(); // todo maybe I should catch errors
  }

  public getCurrentUserId() {
    return this.afAuth.auth.currentUser.uid;
  }

}
