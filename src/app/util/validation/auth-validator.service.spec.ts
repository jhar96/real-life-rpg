
import {TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {AuthValidatorService} from "./auth-validator.service";

class DbStub {
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
});

