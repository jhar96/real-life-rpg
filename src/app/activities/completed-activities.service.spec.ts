import {ActivitiesService} from "./activities.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";
import {TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {CompletedActivitiesService} from "./completed-activities.service";

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

describe('CompletedActivitiesService', () => {
  let cas: CompletedActivitiesService;
  let auth: AuthService;
  let db: AngularFireDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompletedActivitiesService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: AngularFireDatabase, useClass: DbStub }
      ]
    });

    cas = TestBed.get(CompletedActivitiesService);
    auth = TestBed.get(AuthService);
    db = TestBed.get(AngularFireDatabase);
  });

  it('should create an instance', () => {
    expect(cas).toBeDefined();
  });

  it('#getCompletedActivities should return Observable created with db.list and correct arguments', () => {
    const spy = spyOn(db, 'list');
    cas.getCompletedActivities();
    expect(spy).toHaveBeenCalledWith(`/completedActivities/1337`);
  });
});
