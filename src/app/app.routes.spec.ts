import {routes} from "./app.routes";
import {ActivitiesComponent} from "./activities/activities.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";

describe('routes', () => {

  it('should contain a route for /activities', () => {
    expect(routes).toContain({ path: 'activities', component: ActivitiesComponent });
  });

  it('should contain a route for /login', () => {
    expect(routes).toContain({ path: 'login', component: LoginComponent });
  });

  it('should contain a route for /register', () => {
    expect(routes).toContain({ path: 'register', component: RegisterComponent });
  });

});
