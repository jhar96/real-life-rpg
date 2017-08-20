export class User {
  // todo should probably not be public
  public uid: string;

  constructor(public emailAddress: string, public username: string) {
  }

}
