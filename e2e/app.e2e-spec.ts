import { TlUiPage } from './app.po';

describe('tl-ui App', function() {
  let page: TlUiPage;

  beforeEach(() => {
    page = new TlUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
