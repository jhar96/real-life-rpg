import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class ActivitiesService {

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
  ) {
    this.initialize();
  }

  /**
   * Initializes the service
   */
  private initialize() {
    console.log('ActivitiesService initialize');
/*    const uid = this.auth.currentUser.uid;
    console.log('uid ' + uid);
    return this.db.list(`/activities/${uid}`).push({text: 'doing a back flip'});*/
  }

  /**
   *
   * @returns a FirebaseListObservable that represents the activities of the current user in the db
   */
  public getActivities(): FirebaseListObservable<any[]> {
    console.log('getActivities');
    const uid = this.auth.getCurrentUserId();
    console.log('uid ' + uid);
    return this.db.list(`/activities/${uid}`, {
      query: {
      },
    });
  }
}
