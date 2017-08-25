import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesComponent } from './activities.component';
import {ActivitiesService} from "./activities.service";
import {CompletedActivitiesService} from "./completed-activities.service";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {RouterTestingModule} from "@angular/router/testing";

xdescribe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;
  let as: ActivitiesService;
  let cas: CompletedActivitiesService;
  let auth: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ ActivitiesComponent ],
      providers: [
        ActivitiesService,
        CompletedActivitiesService,
        AuthService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    console.log('hope law before');
    auth = TestBed.get(AuthService);
    spyOn(auth, 'initialize').and.callFake(() => {});
    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    as = TestBed.get(ActivitiesService);
    cas = TestBed.get(CompletedActivitiesService);
    spyOn(as, 'getActivities').and.callFake(() => {});
    spyOn(cas, 'getCompletedActivities').and.callFake(() => {});
    console.log('middle');
    fixture.detectChanges();
    console.log('hope law');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
