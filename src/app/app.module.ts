import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {routes} from "./app.routes";
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ActivitiesComponent } from './activities/activities.component';
import {AngularFireModule} from "angularfire2";
import {environment} from "../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FirstKeyPipe} from "./util/pipes/first-key.pipe";
import {AuthService} from "./auth/auth.service";
import {AuthGuard} from "./auth/auth.guard";
import {NoAuthGuard} from "./auth/no-auth.guard";
import {ActivitiesService} from "./activities/activities.service";
import { HomeComponent } from './home/home.component';
import {CompletedActivitiesService} from "./activities/completed-activities.service";
import {AuthValidatorService} from "./util/validation/auth-validator.service";
import {DatabasePusherService} from "./util/database-pusher.service";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    ActivitiesComponent,
    FirstKeyPipe,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    AuthService,
    ActivitiesService,
    CompletedActivitiesService,
    AuthGuard,
    NoAuthGuard,
    AuthValidatorService,
    DatabasePusherService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
