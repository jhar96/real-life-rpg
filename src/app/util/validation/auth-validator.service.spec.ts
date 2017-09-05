
import {TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {AuthValidatorService} from "./auth-validator.service";
import {Observable} from "rxjs/Observable";
import ArrayLike = jasmine.ArrayLike;

class DbStub {

  list(url) {
  }
}

describe('AuthValidatorService', () => {
  let validator: AuthValidatorService;
  let db: AngularFireDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthValidatorService,
        { provide: AngularFireDatabase, useClass: DbStub }
      ]
    });

    validator = TestBed.get(AuthValidatorService);
    db = TestBed.get(AngularFireDatabase);
  });

  it('should create an instance', () => {
    expect(validator).toBeDefined();
  });

  it('#testLowercaseEqual should view identical strings to be equal', () => {
    const result = validator.testLowercaseEqual('SpongeBob386', 'SpongeBob386');
    expect(result).toBeTruthy();
  });

  it('#testLowercaseEqual should view strings that only differ in case to be equal (all lower => some upper)', () => {
    const result = validator.testLowercaseEqual('xdlol123', 'xDLoL123');
    expect(result).toBeTruthy();
  });

  it('#testLowercaseEqual should view strings that only differ in case to be equal (some upper => all lower)', () => {
    const result = validator.testLowercaseEqual('Rofl123', 'rofl123');
    expect(result).toBeTruthy();
  });

  it('#testLowercaseEqual should NOT view strings that are different to be equal', () => {
    const result = validator.testLowercaseEqual('haha', 'hoho');
    expect(result).toBeFalsy();
  });

  it('#validateUsername should call #list with correct arguments', () => {
    const spy = spyOn(db, 'list').and.returnValue(Observable.empty());
    validator.validateUsername(null);
    expect(spy).toHaveBeenCalledWith('/usernames', {
      query: {
        orderByChild: 'username'
      }
    });
  });

  it('#validateUsername should map to null if username not taken yet', () => {
    spyOn(db, 'list').and.returnValue(Observable.from([[1], [2], [3]]));
    spyOn(Array.prototype, 'find').and.returnValue(false);
    validator.validateUsername(null).subscribe(error => {
      expect(error).toBeNull();
    });
  });

  it('#validateUsername should map to error message if username already taken', () => {
    spyOn(db, 'list').and.returnValue(Observable.from([[1], [2], [3]]));
    spyOn(Array.prototype, 'find').and.returnValue(true);
    validator.validateUsername(null).subscribe(error => {
      expect(error).not.toBeNull();
    });
  });

  it('#validateUsername should not return an empty observable', () => {
    spyOn(db, 'list').and.returnValue(Observable.from([[1], [2], [3]]));
    spyOn(Array.prototype, 'find').and.returnValue(true);
    const result = validator.validateUsername(null);
    expect(result).not.toEqual(Observable.empty());
  });

  it('#validateEmailAddress should call #list with correct arguments', () => {
    const spy = spyOn(db, 'list').and.returnValue(Observable.empty());
    validator.validateEmailAddress(null);
    expect(spy).toHaveBeenCalledWith('/emailAddresses', {
      query: {
        orderByChild: 'emailAddress'
      }
    });
  });

  it('#validateEmailAddress should map to null if emailAddress not taken yet', () => {
    spyOn(db, 'list').and.returnValue(Observable.from([[1], [2], [3]]));
    spyOn(Array.prototype, 'find').and.returnValue(false);
    validator.validateEmailAddress(null).subscribe(error => {
      expect(error).toBeNull();
    });
  });

  it('#validateEmailAddress should map to error message if emailAddress already taken', () => {
    spyOn(db, 'list').and.returnValue(Observable.from([[1], [2], [3]]));
    spyOn(Array.prototype, 'find').and.returnValue(true);
    validator.validateEmailAddress(null).subscribe(error => {
      expect(error).not.toBeNull();
    });
  });

  it('#validateEmailAddress should not return an empty observable', () => {
    spyOn(db, 'list').and.returnValue(Observable.from([[1], [2], [3]]));
    spyOn(Array.prototype, 'find').and.returnValue(true);
    const result = validator.validateEmailAddress(null);
    expect(result).not.toEqual(Observable.empty());
  });

// todo dont know how this is testable right now
/*  it('#validateUsername should return an observable that emits at most once', () => {
   expect(true).toBeFalsy();
   });

   it('#validateUsername should return an observable that emits at least once', () => {
   expect(true).toBeFalsy();
   });*/

});

