import {routes} from "./app.routes";
import {HomeComponent} from "./home/home.component";

describe('routes', () => {
  it('should contain a route for /home', () => {
    expect(routes).toContain({ path: 'home', component: HomeComponent });
  });
});
