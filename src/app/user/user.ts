export class User {

  uid: string;

  username = '';

  emailAddress = '';

  constructor(auth) {
    this.uid = auth.uid;
  }
}
