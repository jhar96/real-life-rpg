import { Injectable } from '@angular/core';
import {User} from "../user/user";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import "rxjs/add/operator/switchMap";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

@Injectable()
export class AuthService {

  currentUser: User;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase
  ) {
    this.afAuth.authState.switchMap(auth => {
      if (auth) {
        this.currentUser = new User(auth);
        return this.db.object(`/users/${auth.uid}`);
      } else {
        return [];
      }
    })
      .subscribe(user => {
        this.currentUser.username = user.username;
        this.currentUser.emailAddress = user.emailAddress;
      });
  }

  emailRegistration(email: string, username: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        const emailAddresses = this.db.list(`emailAddresses`);
        const usernames = this.db.list(`usernames`);
        emailAddresses.push({emailAddress: email});
        usernames.push({username: username});
        // todo push user with all its data itself
        console.log('successful email registration');
/*        emailAddresses.subscribe(data => { // todo what this is doing
          console.log('successful email registration');
          console.log(data);
      });*/
      })
      .catch(error => console.log(error));
  }

  checkUsername(username: string): Observable<boolean> {
    username = username.toLowerCase();
    const result = this.db.list('/usernames', {
      query: {
        orderByChild: 'username',
        equalTo: username,
      },
    preserveSnapshot: true,
    });
    return result.map(snapshots => snapshots.length === 0);
  }

  checkEmail(emailAddress: string): Observable<boolean> {
    emailAddress = emailAddress.toLowerCase();
    const result = this.db.list('/emailAddresses', {
      query: {
        orderByChild: 'emailAddress',
        equalTo: emailAddress,
      },
      preserveSnapshot: true,
    });
    return result.map(snapshots => snapshots.length === 0);
  }

  updateUsername(username: string) {
    // todo should think about the data model and how I can queue with it (checkUsername..)
  }
}
