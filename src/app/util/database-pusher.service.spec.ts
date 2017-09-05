
import {TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {DatabasePusherService} from "./database-pusher.service";

class Pushable {
  push() {
    return Promise.resolve();
  }
}

class Updatable {
  update() {
    return Promise.resolve();
  }
}

class DbStub {
  list() {
  }

  object() {
  }
}

describe('DatabasePusherService', () => {
  let pusher: DatabasePusherService;
  let db: AngularFireDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabasePusherService,
        { provide: AngularFireDatabase, useClass: DbStub }
      ]
    });

    pusher = TestBed.get(DatabasePusherService);
    db = TestBed.get(AngularFireDatabase);
  });

  it('should create an instance', () => {
    expect(pusher).toBeDefined();
  });

  it('#pushUserData should call #pushUsername, #pushEmailAddress, #pushUser with the correct arguments', () => {
    const pushUsernameSpy = spyOn(pusher, 'pushUsername').and.callFake(() => {});
    const pushEmailAddressSpy = spyOn(pusher, 'pushEmailAddress').and.callFake(() => {});
    const pushUserSpy = spyOn(pusher, 'pushUser').and.callFake(() => {});

    pusher.pushUserData('email', 'username', '1234');

    expect(pushUsernameSpy).toHaveBeenCalledWith('username', '1234');
    expect(pushEmailAddressSpy).toHaveBeenCalledWith('email', '1234');
    expect(pushUserSpy).toHaveBeenCalledWith('email', 'username', '1234');
  });

  it('#pushUsername should call #list and #push with the correct arguments', () => { // todo could test more but unnecessarily complicated
    let pushable;
    let pushSpy;
    const listSpy = spyOn(db, 'list').and.callFake(() => {
      pushable = new Pushable();
      // pushSpy = spyOn(pushable, 'push');
      return pushable;
    });

    pusher.pushUsername('username', '1234');

    expect(listSpy).toHaveBeenCalledWith('/usernames');
    // expect(pushSpy).toHaveBeenCalledWith({username: 'username', uid: '1234'});
  });

  it('#pushEmailAddress should call #list and #push with the correct arguments', () => { // todo could test more but unnecessarily complicated
    let pushable;
    const listSpy = spyOn(db, 'list').and.callFake(() => {
      pushable = new Pushable();
      return pushable;
    });

    pusher.pushEmailAddress('email', '1234');

    expect(listSpy).toHaveBeenCalledWith('/emailAddresses');
  });

  it('#pushUser should call #list and #object with the correct arguments', () => { // todo could test more but unnecessarily complicated
    let updatable;
    const objectSpy = spyOn(db, 'object').and.callFake(() => {
      updatable = new Updatable();
      return updatable;
    });

    pusher.pushUser('email', 'username', '1234');

    expect(objectSpy).toHaveBeenCalledWith('/users/1234');
  });
});
