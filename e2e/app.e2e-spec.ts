import { RealLifeRpgPage } from './app.po';

describe('real-life-rpg App', () => {
  let page: RealLifeRpgPage;

  beforeEach(() => {
    page = new RealLifeRpgPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
