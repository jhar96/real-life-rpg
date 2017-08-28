import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireDatabase} from "angularfire2/database";
import {Router} from "@angular/router";
import {AuthValidatorService} from "../util/validation/auth-validator.service";
import {DatabaseUpdaterService} from "../util/database-updater.service";

class DbStub {
}

class RouterStub {
  navigate(route: string) {
  }
}

class avsStub {
}

class dbuStub {
}

describe('AuthService', () => {
  let auth: AuthService;
  let db: AngularFireDatabase;
  let router: Router;
  let validator: AuthValidatorService;
  let updater: DatabaseUpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebase),
        // RouterTestingModule.withRoutes([]),
      ],
      providers: [
        AuthService,
        { provide: AngularFireDatabase, useClass: DbStub },
        { provide: Router, useClass: RouterStub},
        { provide: AuthValidatorService, useClass: avsStub},
        { provide: DatabaseUpdaterService, useClass: dbuStub},
      ]
    });

    auth = TestBed.get(AuthService);
    db = TestBed.get(AngularFireDatabase);
    router = TestBed.get(Router);
    validator = TestBed.get(AuthValidatorService);
    updater = TestBed.get(DatabaseUpdaterService);
  });

  it('should create an instance', () => {
    expect(auth).toBeDefined();
  });

});

