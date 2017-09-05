import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class DatabasePusherService {

  constructor(private db: AngularFireDatabase,
  ) {
    this.initialize();
  }

  /**
   * Initializes the service
   */
  private initialize() {
    console.log('DatabasePusherService initialize');
  }

  /**
   * Pushes the user data in the database
   * @param emailAddress to be pushed. Will be converted to lowercase
   * @param username to be pushed
   * @param uid that matches the user in the db
   */
  public pushUserData(emailAddress: string, username: string, uid: string) {
    console.log('pushing user data..');
    emailAddress = emailAddress.toLowerCase();
    this.pushUsername(username, uid);
    this.pushEmailAddress(emailAddress, uid);
    this.pushUser(emailAddress, username, uid);
  }

  /**
   * pushes the user name in the database
   * @param username to be pushed
   * @param uid that matches the user in the db
   */
  public pushUsername(username: string, uid: string) {
    console.log('pushing username..');
    this.db.list('/usernames').push({username: username, uid: uid})
      .catch(err => console.log(err, 'You dont have access!')); // todo better error handling
  }

  /**
   * pushes the email address in the database
   * @param emailAddress to be pushed
   * @param uid that matches the user in the db
   */
  public pushEmailAddress(emailAddress: string, uid: string) {
    console.log('pushing email address..');
    this.db.list('/emailAddresses').push({emailAddress: emailAddress, uid: uid})
      .catch(err => console.log(err, 'You dont have access!')); // todo better error handling
  }

  /**
   * pushes the user in the database
   * @param emailAddress to be pushed
   * @param username to be pushed
   * @param uid to find the user in the db
   */
  public pushUser(emailAddress: string, username: string, uid: string) {
    console.log('pushing user..');
    this.db.object(`/users/${uid}`).update({'username': username, 'emailAddress': emailAddress})
      .catch(err => console.log(err, 'You dont have access!')); // todo better error handling
  }
}
