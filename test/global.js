const { expect } = require('chai');

async function getPasswordStrengthComponentInfo (page) {
  return page.evaluate(() => {
    const component = document.querySelector('.ns-password-strength-component');
    const label = component.querySelector('.label').textContent;
    const score = component.querySelector('meter').value;
    const hints = Array.from(component.querySelectorAll('.hints p'))
      .map(p => ([p.className || 'hint', p.textContent]));
    return { label, score, hints };
  });
}

describe('global.js', function () {
  this.timeout(5000);

  it('should start in a "loading, please wait..." state', async function () {
    await this.page.goto(`${this.baseUrl}/global.html`, { waitUntil: 'domcontentloaded' });
    const { label, score, hints } = await getPasswordStrengthComponentInfo(this.page);
    expect(label).to.equal('Calculating... 🤔');
    expect(score).to.equal(0);
    expect(hints).to.be.an('array').with.lengthOf(1);
    const [[type, text]] = hints;
    expect(type).to.equal('hint');
    expect(text).to.be.a('string').that.includes('Loading', 'Please wait...');
  });

  it('should transition to a "too weak" password state after loading', async function () {
    await this.page.goto(`${this.baseUrl}/global.html`, { waitUntil: 'networkidle0' });
    const { label, score, hints } = await getPasswordStrengthComponentInfo(this.page);
    expect(label).to.equal('Too Weak 😭');
    expect(score).to.equal(0);
    expect(hints).to.be.an('array').with.lengthOf(2);
    const [[noticeType, noticeText], [hintType, hintText]] = hints;
    expect(noticeType).to.equal('notice');
    expect(noticeText).to.equal('Password must contain at least 8 characters');
    expect(hintType).to.equal('hint');
    expect(hintText).to.be.a('string')
      .that.includes('Use a few words, avoid common phrases')
      .and.includes('No need for symbols, digits, or uppercase letters')
      .but.does.not.include('Use at least 8 characters');
  });

  it('should change from a notice to a warning', async function () {
    await this.page.goto(`${this.baseUrl}/global.html`, { waitUntil: 'networkidle0' });
    await this.page.type('input#password', 'a');
    // Wait for the notice hint to become a warning
    await this.page.waitForSelector('.hints p.warning');
    const { label, score, hints } = await getPasswordStrengthComponentInfo(this.page);
    expect(label).to.equal('Too Weak 😭');
    expect(score).to.equal(0);
    expect(hints).to.be.an('array').with.lengthOf(2);
    const [[warningType, warningText], [hintType, hintText]] = hints;
    expect(warningType).to.equal('warning');
    expect(warningText).to.equal('Password must contain at least 8 characters');
    expect(hintType).to.equal('hint');
    expect(hintText).to.be.a('string').that.does.not.include('Use at least 8 characters');
  });

  it('should show other warnings while under the 8 character limit', async function () {
    await this.page.goto(`${this.baseUrl}/global.html`, { waitUntil: 'networkidle0' });
    await this.page.type('input#password', 'bb');
    // Wait for the notice hint to become a warning
    await this.page.waitForSelector('.hints p.warning');
    const { label, score, hints } = await getPasswordStrengthComponentInfo(this.page);
    expect(label).to.equal('Too Weak 😭');
    expect(score).to.equal(0);
    expect(hints).to.be.an('array').with.lengthOf(2);
    const [[warningType, warningText], [hintType, hintText]] = hints;
    expect(warningType).to.equal('warning');
    expect(warningText).to.equal('Repeats like "aaa" are easy to guess');
    expect(hintType).to.equal('hint');
    expect(hintText).to.be.a('string').that.includes('Use at least 8 characters');
  });

  it('should keep showing the 8 character requirement even with a good short password', async function () {
    await this.page.goto(`${this.baseUrl}/global.html`, { waitUntil: 'networkidle0' });
    await this.page.type('input#password', 'RzU.7*D');
    await this.page.waitForSelector('.hints p.warning');
    {
      const { label, score, hints } = await getPasswordStrengthComponentInfo(this.page);
      expect(label).to.equal('Too Weak 😭');
      expect(score).to.equal(0);
      expect(hints).to.be.an('array').with.lengthOf(2);
      const [warningType, warningText] = hints[0];
      expect(warningType).to.equal('warning');
      expect(warningText).to.equal('Password must contain at least 8 characters');
    }

    await this.page.type('input#password', '!');
    // No notice or warning this time, wait for the "average" (score-2) label instead
    await this.page.waitForSelector('.score-2');
    {
      const { label, score, hints } = await getPasswordStrengthComponentInfo(this.page);
      expect(label).to.equal('Average 😐');
      expect(score).to.equal(2);
      expect(hints).to.be.an('array').with.lengthOf(1);
      const [[type, text]] = hints;
      expect(type).to.equal('hint');
      expect(text).to.be.a('string').that.includes('Add another word or two');
    }
  });

  [
    { password: 'aaaaaaaa', label: 'Too Weak 😭', score: 0 },
    { password: 'aaaaaaax', label: 'Weak 😟', score: 1 },
    { password: 'KrvMKziA', label: 'Average 😐', score: 2 },
    { password: 'KrvMKziAZq', label: 'Strong 😀', score: 3 },
    { password: 'KrvMKziAZqHK', label: 'Very Strong 😎', score: 4 }
  ].forEach(test => {
    it(`should show a "${test.label}" score`, async function () {
      await this.page.goto(`${this.baseUrl}/global.html`, { waitUntil: 'networkidle0' });
      await this.page.type('input#password', test.password);
      await this.page.waitForSelector(`.score-${test.score}`);
      const { label, score } = await getPasswordStrengthComponentInfo(this.page);
      expect(label).to.equal(test.label);
      expect(score).to.equal(test.score);
    });
  });
});
