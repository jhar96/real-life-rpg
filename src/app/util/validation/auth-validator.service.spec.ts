
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AngularFireDatabase, AngularFireDatabaseModule} from "angularfire2/database";
import {AuthValidatorService} from "./auth-validator.service";
import {Observable} from "rxjs/Observable";
import ArrayLike = jasmine.ArrayLike;
import {RegisterComponent} from "../../auth/register/register.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../../environments/environment";
import {AngularFireAuthModule} from "angularfire2/auth";
import {FirstKeyPipe} from "../pipes/first-key.pipe";
import {AuthService} from "../../auth/auth.service";
import Spy = jasmine.Spy;

class DbStub {

  list(url) {
  }
}

describe('AuthValidatorService', () => {
  let validator: AuthValidatorService;
  let db: AngularFireDatabase;

  let reg: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const authServiceStub = {
  };

  beforeEach(() => {
/*
    TestBed.configureTestingModule({
      providers: [
        AuthValidatorService,
        { provide: AngularFireDatabase, useClass: DbStub },
      ]
    });*/

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
      ],
      declarations: [
        RegisterComponent,
        FirstKeyPipe
      ],
      providers: [
        {provide: AuthService, useValue: authServiceStub },
        AuthValidatorService,
        { provide: AngularFireDatabase, useClass: DbStub },
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    reg = fixture.componentInstance;

    fixture.detectChanges();

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

  describe('#validateRegistration', () => {

    let validateEmailAddressSpy;
    let validateUsernameSpy: Spy;

    beforeEach(() => {
    });

    it('should call #validateEmailAddress', () => {
      validateEmailAddressSpy = spyOn(validator, 'validateEmailAddress').and.returnValue(Observable.empty());
      validateUsernameSpy = spyOn(validator, 'validateUsername').and.returnValue(Observable.empty());
      validator.validateRegistration(reg);
      expect(validateEmailAddressSpy).toHaveBeenCalled();
    });

    it('should call #validateUsername', () => {
      validateEmailAddressSpy = spyOn(validator, 'validateEmailAddress').and.returnValue(Observable.empty());
      validateUsernameSpy = spyOn(validator, 'validateUsername').and.returnValue(Observable.empty());
      validator.validateRegistration(reg);
      expect(validateUsernameSpy).toHaveBeenCalled();
    });

    it('should return null if no errors occurred', () => {
      let result;
      validateEmailAddressSpy = spyOn(validator, 'validateEmailAddress').and.returnValue(Observable.from([null]));
      validateUsernameSpy = spyOn(validator, 'validateUsername').and.returnValue(Observable.from([null]));
      validator.validateRegistration(reg).subscribe(error => result = error);
      expect(result).toBeNull();
    });

    it('should return the emailValidationError if it was the only error', () => {
      let result;
      validateEmailAddressSpy = spyOn(validator, 'validateEmailAddress').and.returnValue(Observable.from(['email']));
      validateUsernameSpy = spyOn(validator, 'validateUsername').and.returnValue(Observable.from([null]));
      validator.validateRegistration(reg).subscribe(error => result = error);
      expect(result).toEqual('email');
    });

    it('should return the usernameValidationError if it was the only error', () => {
      let result;
      validateEmailAddressSpy = spyOn(validator, 'validateEmailAddress').and.returnValue(Observable.from([null]));
      validateUsernameSpy = spyOn(validator, 'validateUsername').and.returnValue(Observable.from(['username']));
      validator.validateRegistration(reg).subscribe(error => result = error);
      expect(result).toEqual('username');
    });

    it('should return the emailValidationError if two errors occurred', () => {
      let result;
      validateEmailAddressSpy = spyOn(validator, 'validateEmailAddress').and.returnValue(Observable.from(['email']));
      validateUsernameSpy = spyOn(validator, 'validateUsername').and.returnValue(Observable.from(['username']));
      validator.validateRegistration(reg).subscribe(error => result = error);
      expect(result).toEqual('email');
    });

  });


// todo dont know how this is testable right now
/*  it('#validateUsername should return an observable that emits at most once', () => {
   expect(true).toBeFalsy();
   });

   it('#validateUsername should return an observable that emits at least once', () => {
   expect(true).toBeFalsy();
   });*/

});

