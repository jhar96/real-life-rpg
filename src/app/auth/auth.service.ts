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

@Injectable()
export class AuthService {

  currentUser: User;

  tempUser: User;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router: Router,
  ) {
    this.initialize();
  }

  private initialize() {
    this.afAuth.authState.subscribe(auth => {
      console.log('auth has changed..');
      if (auth) {
        this.handleLogin(auth);
      } else {
        this.handleLogout(auth);
      }
    });
  }

  private handleLogin(auth) {
    console.log('handleLogin');
    // try to load user data
    this.db.object(`/users/${auth.uid}`).first().subscribe(userData => { // todo cancel sub? when todo that in gen?
      if (userData.$value) {
        // login
        console.log('user data loaded..');
        console.log('login..');
        // todo should create user here
      } else {
        // first login
        console.log('user data could not be loaded..');
        if (this.tempUser) {
          console.log('first login..');
          this.currentUser = new User(this.tempUser.emailAddress, this.tempUser.username, auth.uid);
          this.updateUserData(this.tempUser.emailAddress, this.tempUser.username);
        } else {
          console.log('temp user was empty');
        }
      }
    });
  }

  private handleLogout(auth) {
    console.log('handleLogout');
    // this.router.navigate(['/register']);
  }

  public isAuth(): Observable<boolean> { // todo change this to this.afAuth.authState?
    const state = new Subject<boolean>();
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        state.next(true);
      } else {
        state.next(false);
      }
    });
    return state.asObservable();
  }

  public emailRegistration2(reg: RegisterComponent) {
    this.registrationPreparation(reg);
    this.validateRegistration(reg)
      .subscribe(error => {
        if (error) {
          this.handleRegistrationError(reg, error);
        } else {
          this.tryEmailRegistration2(reg);
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

  private tryEmailRegistration2(reg: RegisterComponent) {
    console.log('tryEmailRegistration2');
    this.tempUser = new User(reg.email.value, reg.username.value);
    this.afAuth.auth.createUserWithEmailAndPassword(reg.email.value , reg.password.value)
      .then(() => {
        this.handleRegistrationSuccess(reg);
        this.router.navigate(['/activities']); // todo should not happen here..
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
    this.db.list('/usernames').push({username: username, uid: this.currentUser.uid});
  }

  private updateEmailAddress(emailAddress: string) {
    console.log('updating email address..');
    this.db.list('/emailAddresses').push({emailAddress: emailAddress, uid: this.currentUser.uid});
  }

  private updateUser(emailAddress: string, username: string) {
    console.log('updating user..');
    this.db.object(`/users/${this.currentUser.uid}`).update({'username': username, 'emailAddress': emailAddress});
  }

  // todo should change this like emailReg..
  public login(emailAddress: string, password: string) { // todo should decide where to handel login logout..
    console.log('logging in');
    return this.afAuth.auth.signInWithEmailAndPassword(emailAddress, password) // todo does this return a promise with auth?
      .then(() => { // todo if yes we can move the handleLogin logic here
        this.router.navigate(['/activities']); // todo but the way in initialize is recommended right?
        return null;
      })
      .catch(error => {
        return error.message;
      });
  }

  public logout() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']); // todo should decide where to handel login logout..
      });
  }

}
