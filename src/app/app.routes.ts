import {ActivitiesComponent} from "./activities/activities.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthGuard} from "./auth/auth.guard";
import {NoAuthGuard} from "./auth/no-auth.guard";
import {HomeComponent} from "./home/home.component";

export const routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomeComponent},
];
