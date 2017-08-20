export class User {

  private _emailAddress: string;
  private _username: string;
  private _uid: string;

  constructor(emailAddress: string, username: string, uid?: string) {
    this._emailAddress = emailAddress;
    this._username = username;
    this._uid = uid;
  }

  get emailAddress() {
    return this._emailAddress;
  }

  get username() {
    return this._username;
  }

  get uid() {
    return this._uid;
  }

}
