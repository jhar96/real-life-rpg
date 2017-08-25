import { Component, OnInit } from '@angular/core';
import {FirebaseListObservable} from "angularfire2/database";
import {ActivitiesService} from "./activities.service";
import {Observable} from "rxjs/Observable";
import {CompletedActivitiesService} from "./completed-activities.service";

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  get completedActivities() {
    return this._completedActivities;
  }

  get activities() {
    return this._activities;
  }

  private _activities; // : FirebaseListObservable<any>;

  private _completedActivities;

  constructor(private as: ActivitiesService,
              private cas: CompletedActivitiesService,
  ) {}

  ngOnInit() {
    console.log('ActivitiesComponent ngOnInit');
    this._activities = this.as.getActivities();
    this._completedActivities = this.cas.getCompletedActivities();
  }

  /**
   * Adds a new activity
   */
  addActivity(newActivity: string) {
    this.activities.push({ text: newActivity });
    // todo reset
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
