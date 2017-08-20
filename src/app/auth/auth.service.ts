import { Injectable } from '@angular/core';
import {User} from "../user/user";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import "rxjs/add/operator/switchMap";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable()
export class AuthService {

  currentUser: User;

  tempUser: User;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router: Router,
  ) {
    this.afAuth.authState.subscribe(auth => {
      console.log('auth has changed..');
      if (auth) {
        console.log('new auth is there..');
        // try to load user data
        const sub = this.db.object(`/users/${auth.uid}`).subscribe(userData => { // todo cancel sub? when todo that in gen?
          sub.unsubscribe();
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
      } else {
        // logout
        console.log('logout..');
        // this.router.navigate(['/register']);
      }
    });
  }

  isAuth(): Observable<boolean> {
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

  emailRegistration(email: string, username: string, password: string) {
    console.log('email registration..')
    this.tempUser = new User(email, username); // todo Is there any problem with doing this if the registration fails?
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('successful email registration..');
        this.router.navigate(['/activities']);
      })
      .catch(error => console.log(error));
  }

  updateUserData(emailAddress: string, username: string) {
    console.log('updating user data..');
    this.updateUsername(username);
    this.updateEmailAddress(emailAddress);
    this.updateUser(emailAddress, username);
  }

  updateUsername(username: string) {
    console.log('updating username..');
    this.db.list('/usernames').push({username: username, uid: this.currentUser.uid});
/*    const usernameData = {};
    usernameData[username] = this.currentUser.uid;
    this.db.object(`/usernames`).update(usernameData);*/
  }

  updateEmailAddress(emailAddress: string) {
    console.log('updating email address..');
    this.db.list('/emailAddresses').push({emailAddress: emailAddress, uid: this.currentUser.uid});
/*    const emailAddressData = {};
    emailAddressData[emailAddress] = this.currentUser.uid;
    this.db.object(`/emailAddresses`).update(emailAddressData);*/
  }

  updateUser(emailAddress: string, username: string) {
    console.log('updating user..');
    this.db.object(`/users/${this.currentUser.uid}`).update({'username': username, 'emailAddress': emailAddress});
  }

  checkUsername(username: string): Observable<boolean> {
    console.log('checking username..');
    const result = this.db.list('/usernames', {
      query: {
        orderByChild: 'username',
        equalTo: username,
      },
    preserveSnapshot: true,
    });
    return result.map(snapshots => {
      console.log(snapshots);
      return snapshots.length === 0;
    });
/*    return this.db.object(`/usernames/${username}`)
      .map((usernameData => !usernameData.$value));*/
    // return Observable.from([true]);
  }

  checkEmail(emailAddress: string): Observable<boolean> {
    console.log('checking email address..');
    const result = this.db.list('/emailAddresses', {
      query: {
        orderByChild: 'emailAddress',
        equalTo: emailAddress,
      },
      preserveSnapshot: true,
    });
    return result.map(snapshots => snapshots.length === 0);
/*    return this.db.object('/emailAddresses/') // todo Problem: queues whole list..
      .map((emailAddressesData => !emailAddressesData[emailAddress]));*/
    // return Observable.from([true]);
  }

  login(emailAddress: string, password: string) {
    console.log('logging in');
    return this.afAuth.auth.signInWithEmailAndPassword(emailAddress, password)
      .then(() => {
        this.router.navigate(['/activities']);
        return null;
      })
      .catch(error => {
        return error.message;
      });
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }
}
