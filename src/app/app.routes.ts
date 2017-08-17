import {ActivitiesComponent} from "./activities/activities.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";

export const routes = [
  { path: 'activities', component: ActivitiesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
