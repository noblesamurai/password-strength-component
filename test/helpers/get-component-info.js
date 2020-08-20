async function getComponentInfo (page) {
  await page.waitForSelector('.ns-password-strength-component');
  return page.evaluate(() => {
    const component = document.querySelector('.ns-password-strength-component');
    const label = component.querySelector('.label').textContent;
    const score = component.querySelector('meter').value;
    const hints = Array.from(component.querySelectorAll('.hints p'))
      .map(p => ([p.className || 'hint', p.textContent]));
    return { label, score, hints };
  });
}

module.exports = getComponentInfo;
