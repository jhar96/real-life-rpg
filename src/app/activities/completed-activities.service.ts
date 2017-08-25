import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class CompletedActivitiesService {

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
  ) {
    this.initialize();
  }

  /**
   * Initializes the service
   */
  private initialize() {
    console.log('initialize');
  }

  /**
   *
   * @returns a FirebaseListObservable that represents the completed activities of the current user in the db
   */
  public getCompletedActivities(): FirebaseListObservable<any[]> {
    console.log('getCompletedActivities');
    const uid = this.auth.getCurrentUserId();
    console.log('uid ' + uid);
    return this.db.list(`/completedActivities/${uid}`, {
      query: {
      },
    });
  }

}
