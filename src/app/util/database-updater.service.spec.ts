
import {TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {DatabaseUpdaterService} from "./database-updater.service";

class DbStub {
}

describe('DatabaseUpdaterService', () => {
  let updater: DatabaseUpdaterService;
  let db: AngularFireDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseUpdaterService,
        { provide: AngularFireDatabase, useClass: DbStub }
      ]
    });

    updater = TestBed.get(DatabaseUpdaterService);
    db = TestBed.get(AngularFireDatabase);
  });

  it('should create an instance', () => {
    expect(updater).toBeDefined();
  });

});
