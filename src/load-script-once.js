import _loadScript from 'load-script';
import { promisify } from 'util';

const scriptCache = {};
const loadScript = promisify(_loadScript);

/**
 * Asynchronously load a script (once only).
 *
 * @param {string} options.src script source url to load.
 * @param {string} options.integrity integrity check (sha256, sha384, sha512 hash).
 */
function loadScriptOnce (options) {
  const { src, integrity } = options;
  if (!scriptCache[src]) {
    const attrs = { ...(integrity && { integrity }), crossorigin: 'anonymouse' };
    scriptCache[src] = loadScript(src, { attrs });
  }

  return scriptCache[src];
}

export default loadScriptOnce;
