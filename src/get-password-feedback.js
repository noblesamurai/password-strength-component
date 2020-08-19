/**
 * Use the globally available zxcvbn lib to calculate a password's strength.
 *
 * Custom rules:
 * - If the password is less than 8 characters the strength is always 0
 * - If less than 8 characters and no other warnings we return a warning stating
 *   that we require at least 8 characters.
 * - If less than 8 characters and there is another warning, the 8 character
 *   requirement is instead added to the start of the suggestions array.
 *
 * @param {string} password
 * @return {object} with { score: {number}, suggestions: {string[]}, warning: string }
 */
function getPasswordFeedback (password) {
  const {
    score,
    feedback: { suggestions = [], warning } = {}
  } = window.zxcvbn(password);
  if (password.length >= 8) {
    return { score, suggestions, warning };
  }

  // If the password is not long enough (at least 8 characters) then force the
  // score to 0 and add a notice to either the warning (if no other warning) or
  // to the start of the suggestions list.
  return {
    score: 0,
    suggestions: warning ? ['Use at least 8 characters', ...suggestions] : suggestions,
    warning: warning || 'Password must contain at least 8 characters'
  };
}

export default getPasswordFeedback;
