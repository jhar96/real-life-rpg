import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {RegisterComponent} from "../../auth/register/register.component";
import {Observable} from "rxjs/Observable";


@Injectable()
export class AuthValidatorService {

  constructor(private db: AngularFireDatabase,
  ) {
    this.initialize();
  }

  /**
   * Initializes the service
   */
  private initialize() {
    console.log('AuthValidatorService initialize');
  }

  /**
   * Returns an observable which emits (only once) an error message if one
   * occurred or null if not and then completes
   */
  public validateRegistration(reg: RegisterComponent): Observable<string> {
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
  public validateUsername(username: string): Observable<string> {
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
  public validateUsername2(username: string): Observable<string> {
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
  } // todo working?

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
  public validateEmail(emailAddress: string): Observable<string> {
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
}
