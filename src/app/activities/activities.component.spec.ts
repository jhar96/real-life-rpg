import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesComponent } from './activities.component';
import {ActivitiesService} from "./activities.service";
import {CompletedActivitiesService} from "./completed-activities.service";
import {AngularFireDatabaseModule, FirebaseListObservable} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireAuthModule} from "angularfire2/auth";
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";
import Spy = jasmine.Spy;

describe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;
  let as: ActivitiesService;
  let cas: CompletedActivitiesService;
  // let pushSpy: Spy;

  beforeEach(() => {
    // pushSpy = jasmine.createSpy('push');

    const asStub = {
      getActivities() {
        return FirebaseListObservable.empty();
/*        jasmine.createSpy('list').and.returnValue({
          push: pushSpy,
        });*/
      }
    };

    const casStub = {
      getCompletedActivities() {
        return FirebaseListObservable.empty();
      }
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ ActivitiesComponent ],
      providers: [
        {provide: ActivitiesService, useValue: asStub },
        {provide: CompletedActivitiesService, useValue: casStub },
      ]
    });

    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;

    as = TestBed.get(ActivitiesService);
    cas = TestBed.get(CompletedActivitiesService);
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call #getActivities onInit', () => {
    const spy = spyOn(as, 'getActivities');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should call #getCompletedActivities onInit', () => {
    const spy = spyOn(cas, 'getCompletedActivities');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  // it('should call #push when addActivity() is called', () => {
  //   fixture.detectChanges();
  //   console.log(component.activities);
  //   const spy = spyOn(component.activities, 'push');
  //   expect(spy).toHaveBeenCalled();
  // });
  //
  // it('should push the new activity when addActivity() is called', () => { // todo dont know how to spyon push
  //   console.log(component.activities);
  //
  //   const newActivity = 'doing swaggy things';
  //   component.newActivity.setValue(newActivity);
  //
  //   component.addActivity();
  //   fixture.detectChanges();
  //
  //   expect(pushSpy).toHaveBeenCalledWith(newActivity);
  // });

  // todo test for deletedActivity and completeActivity

  // todo could test what happens if the Observable emits values delayed
});
