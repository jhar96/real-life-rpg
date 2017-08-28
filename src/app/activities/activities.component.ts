import { Component, OnInit } from '@angular/core';
import {FirebaseListObservable} from "angularfire2/database";
import {ActivitiesService} from "./activities.service";
import {Observable} from "rxjs/Observable";
import {CompletedActivitiesService} from "./completed-activities.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  get addActivityForm(): FormGroup {
    return this._addActivityForm;
  }

  get completedActivities() {
    return this._completedActivities;
  }

  get activities() {
    return this._activities;
  }

  get newActivity() {
    return this._addActivityForm.get('newActivity');
  }

  private _addActivityForm: FormGroup;

  private _activities: FirebaseListObservable<any>;

  private _completedActivities;

  constructor(private as: ActivitiesService,
              private cas: CompletedActivitiesService,
              private fb: FormBuilder,
  ) {}

  ngOnInit() {
    console.log('ActivitiesComponent ngOnInit');
    this._addActivityForm = this.fb.group({
      newActivity: [''],
    });
    this._activities = this.as.getActivities();
    this._completedActivities = this.cas.getCompletedActivities();
  }

  /**
   * Adds a new activity
   */
  addActivity() {
    this.activities.push({ text: this.newActivity.value });
    this.addActivityForm.reset();
  }

  /**
   * Delete the activity with the given key and adds it to the completed activities
   */
  completeActivity(key: string, completedActivity: string) { // todo undo function?
    this.activities.remove(key)
      .then(() => {
        console.log(completedActivity);
        this.completedActivities.push({ text: completedActivity });
      });
  }

  /**
   * Deletes the activity with the given key
   */
  deleteActivity(key: string) {
    this.activities.remove(key);
  }

}
