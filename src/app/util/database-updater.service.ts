import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class DatabaseUpdaterService {

  constructor(private db: AngularFireDatabase,
  ) {
    this.initialize();
  }

  /**
   * Initializes the service
   */
  private initialize() {
    console.log('DatabaseUpdaterService initialize');
  }

  /**
   * Updates the user data in the database
   * @param emailAddress to be updated
   * @param username to be updated
   * @param uid that matches the user in the db
   */
  public updateUserData(emailAddress: string, username: string, uid: string) { // todo error handling?
    console.log('updating user data..');
    this.updateUsername(username, uid);
    this.updateEmailAddress(emailAddress, uid);
    this.updateUser(emailAddress, username, uid);
  }

  /**
   * Updates the user name in the database
   * @param username to be updated
   * @param uid that matches the user in the db
   */
  public updateUsername(username: string, uid: string) {
    console.log('updating username..');
    this.db.list('/usernames').push({username: username, uid: uid});
  }

  /**
   * Updates the email address in the database
   * @param emailAddress to be updated
   * @param uid that matches the user in the db
   */
  public updateEmailAddress(emailAddress: string, uid: string) {
    console.log('updating email address..');
    this.db.list('/emailAddresses').push({emailAddress: emailAddress, uid: uid});
  }

  /**
   * Updates the user in the database
   * @param emailAddress to be updated
   * @param username to be updated
   * @param uid to find the user in the db
   */
  public updateUser(emailAddress: string, username: string, uid: string) {
    console.log('updating user..');
    this.db.object(`/users/${uid}`).update({'username': username, 'emailAddress': emailAddress});
  }
}
