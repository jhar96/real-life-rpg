import {ActivitiesService} from "./activities.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";
import {TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";

class AuthServiceStub {
  getCurrentUserId() {
    return '1337';
  }
}

class DbStub {
 list(str, obj) {
    return Observable.empty();
  }
}

describe('ActivitiesService', () => {
  let as: ActivitiesService;
  let auth: AuthService;
  let db: AngularFireDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivitiesService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: AngularFireDatabase, useClass: DbStub }
      ]
    });

    as = TestBed.get(ActivitiesService);
    auth = TestBed.get(AuthService);
    db = TestBed.get(AngularFireDatabase);
  });

  it('should create an instance', () => {
    expect(as).toBeDefined();
  });

  it('#getActivities should return Observable created with db.list and correct arguments', () => {
    const spy = spyOn(db, 'list');
    as.getActivities();
    expect(spy).toHaveBeenCalledWith(`/activities/1337`);
  });
});
