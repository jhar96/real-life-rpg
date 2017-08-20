import {User} from "./user";

describe('User', () => {

  let user: User;

  beforeEach(() => {
  });

  it('attributes should be set correctly if all attributes are set', () => {
    user = new User('mymail', 'myusername', '1234');
    expect([user.emailAddress, user.username, user.uid]).toEqual(['mymail', 'myusername', '1234']);
  });

  it('attributes should be set correctly if only must-have attributes are set', () => {
    user = new User('mymail', 'myusername');
    expect([user.emailAddress, user.username]).toEqual(['mymail', 'myusername']);
  });

});
