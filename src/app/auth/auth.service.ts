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
import {AuthValidatorService} from "../util/validation/auth-validator.service";
import {DatabasePusherService} from "../util/database-pusher.service";

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
              private validator: AuthValidatorService,
              private pusher: DatabasePusherService,
  ) {
    this.initialize();
  }

  /**
   * Initializes the service
   */
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

  /**
   * Handles what should happen if the user logs in
   * @param auth: The current firebase user
   */
  private handleLogin(auth) { // todo do refactor
    console.log('handleLogin');
    this.tryLoadingUserData(auth);
  }

  /**
   * Tries to load the user data from the database
   * @param auth: The current firebase user
   */
  private tryLoadingUserData(auth) { // todo sollte hier auf keinen fall daten aus ner form ziehen. immer aus der db. falls inkonsistent
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

  /**
   * Creates the current user
   * @param userData: The user data to be used
   * @param auth: The current firebase user
   */
  private createUser(userData, auth) {
    console.log('createUser');
    this._currentUser = new User(userData.emailAddress, userData.username, auth.uid);
    console.log(this._currentUser);
  } // todo own class maybe

  /**
   * Handles what should happen if the user logs in for the first time
   * @param auth: The current firebase user
   */
  private firstLogin(auth) {
    console.log('firstLogin');
    this._currentUser = new User(this.tempUser.emailAddress, this.tempUser.username, auth.uid); // todo not elegant
    this.pusher.pushUserData(this.tempUser.emailAddress, this.tempUser.username, this._currentUser.uid);
  } // todo should this be called handle first log in? when to call a method handle?

  /**
   * Handles what should happen if the user logs outs
   * @param auth: The current firebase user
   */
  private handleLogout(auth) {
    console.log('handleLogout');
    this.router.navigate(['/login']);
  }

  /**
   * @returns {Observable<boolean>}: Observable that emits
   * true if the user is currently authenticated
   * false otherwise
   */
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

  /**
   * Registers the user per email address
   * @param reg: The RegisterComponent that initiated the registration
   */
  public emailRegistration(reg: RegisterComponent) {
    console.log('emailRegistration');
    this.registrationPreparation(reg);
    this.validator.validateRegistration(reg)
      .subscribe(error => {
        if (error) {
          this.handleRegistrationError(reg, error);
        } else {
          this.tryEmailRegistration(reg);
        }
      });
  }

  /**
   * Prepares for the registration
   * @param reg: The RegisterComponent that initiated the registration
   */
  private registrationPreparation(reg: RegisterComponent) {
    console.log('registrationPreparation');
    reg.registrationError = null; // todo why can I not call the setter in another way
    reg.registrationSuccess = null;
    reg.isLoading = true;
  }

  /**
   * Handles the occurrence of errors while the registration takes place
   * @param reg: The RegisterComponent that initiated the registration
   * @param error: The error to be handled
   */
  private handleRegistrationError(reg, error) {
    console.log('handleRegistrationError');
    reg.isLoading = false;
    reg.registrationError = error;
  } // todo could make methods like this more general

  /**
   * Handles what should happen if the registration was successful
   * @param reg: The RegisterComponent that initiated the registration
   */
  private handleRegistrationSuccess(reg) {
    console.log('handleRegistrationSuccess');
    reg.isLoading = false;
    reg.registrationSuccess = 'Registration succesful';
  } // todo could make methods like this more general

  /**
   * Tries to perform the email registration
   * @param reg: The RegisterComponent that initiated the registration
   */
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
   * Logs in the user
   * @param log: the LoginComponent that initiated the login
   */
  public login(log: LoginComponent) {
    console.log('login');
    this.loginPreparation(log);
    this.tryLogin(log);
  }

  /**
   * Prepares for the login
   * @param log: The LoginComponent that initiated the login
   */
  private loginPreparation(log: LoginComponent) {
    console.log('loginPreparation');
    log.loginError = null;
    log.loginSuccess = null;
    log.isLoading = true;
  }

  /**
   * Tries to perform the login
   * @param log: The LoginComponent that initiated the login
   */
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
  } // todo bad name? better something like perform login?

  /**
   * Handles the occurrence of errors while the login takes place
   * @param log: The LoginComponent that initiated the login
   * @param error: The error to be handled
   */
  private handleLoginError(log: LoginComponent, error: string) {
    console.log('handleLoginError');
    log.isLoading = false;
    log.loginError = error; // todo remap errors cause too detailed?
  } // todo could make methods like this more general

  /**
   * Handles what should happen if the login was successful
   * @param log: The LoginComponent that initiated the login
   */
  private handleLoginSuccess(log: LoginComponent) {
    console.log('handleLoginSuccess');
    log.isLoading = false;
    log.loginSuccess = 'Login successful';
  } // todo could make methods like this more general

  /**
   * Logs out the user
   */
  public logout() {
    this.afAuth.auth.signOut(); // todo maybe I should catch errors
  }

  /**
   * @returns {string}: the current user ID
   */
  public getCurrentUserId() {
    return this.afAuth.auth.currentUser.uid;
  }

}
