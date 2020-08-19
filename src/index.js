import debounce from 'p-debounce';
import getPasswordFeedback from './get-password-feedback';
import loadScriptOnce from './load-script-once';
import './style.less'; // eslint-disable-line import/no-unassigned-import

const INITIAL_LABEL = 'Calculating... &#x1F914;';
const SCORE_LABELS = [
  'Too Weak &#x1F62D;',
  'Weak &#x1F61F;',
  'Average &#x1F610;',
  'Strong &#x1F600;',
  'Very Strong &#x1F60E;'
];
const INITIAL_HINT = 'Loading password checking rules. Please wait...';
const INITIAL_COMPONENT_HTML = `
  <section class="ns-password-strength-component">
    <header>Password Strength <span class="label">${INITIAL_LABEL}</span></header>
    <meter min="0" max="4" value="0"></meter>
    <aside class="hints"><p>${INITIAL_HINT}</p></aside>
  </section>`;

/**
 * Render the password strength component and return an update function.
 *
 * Example:
 * ```js
 * const mountPasswordStrengthComponent = require('@noblesam/password-strength-component');
 * const element = document.querySelector('#container');
 * const update = mountPasswordStrengthComponent(element);
 *
 * // update the password strength component based on the password passed in and returns the
 * // password strength to be used for form validation etc...
 * const strength = update(password);
 * ```
 *
 * @param {HTMLElement} element where to mount the password strength display
 * @param {number} opts.delay min time between updates
 * @param {string} opts.url where to load the zxcvbn.js file from
 * @returns {function}
 */
function mountPasswordStrengthComponent (element, options = {}) {
  element.innerHTML = INITIAL_COMPONENT_HTML;

  // Start loading the zxcvbn lib...
  const zxcvbnLoading = loadScriptOnce(options);

  let version = 0;
  let score = -1;
  async function update (password) {
    const current = ++version;
    try {
      await zxcvbnLoading;
    } catch (error) {
      console.error('failed to load zxcvbn', error);
      return;
    }

    // If version is still current, update the score and the display to the
    // new value... otherwise just return the existing value.
    if (version === current) {
      score = updateComponent(password, element);
    }

    return score;
  }

  update(''); // Set to empty password initially (once loaded).
  return debounce(update, options.delay || 200);
}

/**
 * Update the component display based on the passed in password
 *
 * @param {string} password
 * @param {HTMLElement} element
 * @return {number}
 */
function updateComponent (password, element) {
  const { label, meter, hints } = getComponentParts(element);
  const { score, suggestions, warning } = getPasswordFeedback(password);
  label.innerHTML = SCORE_LABELS[score];
  label.className = `label score-${score}`;
  meter.value = score;
  hints.innerHTML = [
    warning && `<p class="${password && score < 1 ? 'warning' : 'notice'}">${warning}</p>`,
    `<p>${suggestions.join('. ')}</p>`
  ].join('');
  return score;
}

/**
 * Get relevant part elements from the component element
 *
 * @param {HTMLElement} element
 * @return {object}
 */
function getComponentParts (element) {
  const label = element.querySelector('.label');
  const meter = element.querySelector('meter');
  const hints = element.querySelector('.hints');
  return { label, meter, hints };
}

export default mountPasswordStrengthComponent;
