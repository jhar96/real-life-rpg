import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  /**
   * Allows activation if currently NOT authenticated
   * @param route
   * @param state
   * @returns {Observable<T>}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('no auth guard..');
    return this.authService.isAuth().first().map(bool => !bool);
  }

}
