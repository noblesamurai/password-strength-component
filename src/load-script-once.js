import loadScript from 'load-script';

const scriptCache = {};

/**
 * Asynchronously load a script (once only).
 *
 * @param {string} options.src script source url to load.
 * @param {string} options.integrity integrity check (sha256, sha384, sha512 hash).
 */
async function loadScriptOnce (options) {
  const { src, integrity } = options;
  if (!scriptCache[src]) {
    scriptCache[src] = new Promise((resolve, reject) => {
      const callback = err => err ? reject(err) : resolve();
      loadScript(src, { attrs: { ...(integrity && { integrity }), crossorigin: 'anonymous' } }, callback);
    });
  }

  return scriptCache[src];
}

export default loadScriptOnce;
