import {routes} from "./app.routes";
import {ActivitiesComponent} from "./activities/activities.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthGuard} from "./auth/auth.guard";
import {NoAuthGuard} from "./auth/no-auth.guard";

describe('routes', () => {

  it('should contain a route for /activities that is only accessible if not logged in', () => {
    expect(routes).toContain({ path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] });
  });

  it('should contain a route for /login that is only accessible if not logged in', () => {
    expect(routes).toContain({ path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] });
  });

  it('should contain a route for /register that is only accessible if not logged in', () => {
    expect(routes).toContain({ path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] });
  });

});
