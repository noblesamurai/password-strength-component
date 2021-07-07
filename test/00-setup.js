/* eslint-env mocha */
const chai = require('chai');
const express = require('express');
const fs = require('fs').promises;
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');
const rollup = require('rollup');
const loadRollupConfigFile = require('rollup/dist/loadConfigFile');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { expect } = require('chai');
const { promisify } = require('util');

chai.use(require('dirty-chai'));

// Create top level coverage map
const map = createCoverageMap();

async function _build () {
  const { options: [options] } = await loadRollupConfigFile(path.resolve(__dirname, '../rollup.config.js'));
  const bundle = await rollup.rollup(options);
  const outputs = await Promise.all(options.output.map(output => bundle.generate(output)));
  const files = new Map();
  outputs.forEach(({ output }) => {
    output.forEach(file => files.set(`/${file.fileName}`, file.code));
  });
  return files;
}

const build = _build();

const app = express();
app.use('/dist', async (request, response) => {
  const files = await build;
  if (files.has(request.url)) {
    response.status(200).type('text/javascript').send(files.get(request.url));
  // The CSS file is still built to the filesystem.
  } else if (/\.css$/.test(request.url)) {
    response.sendFile(path.resolve(__dirname, `../dist${request.url}`));
  } else {
    response.sendStatus(404);
  }
});
app.get('/vendor/zxcvbn.js', (request, response) => {
  response.sendFile(require.resolve('zxcvbn/dist/zxcvbn'));
});
app.use(express.static(path.resolve(__dirname, 'fixtures')));

async function createServer () {
  const server = http.createServer(app);
  await promisify(server.listen.bind(server))(0, 'localhost');
  return server;
}

before(async function () {
  this.timeout(15000);

  this.browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox']
  });
  this.server = await createServer();
  const { address, port } = this.server.address();
  this.baseUrl = `http://${address}:${port}`;
});

beforeEach(async function () {
  this.page = await this.browser.newPage();
  await this.page.setViewport({ width: 300, height: 300 });
  this.page.on('pageerror', console.error);
});

afterEach(async function () {
  // Get page coverage data and merge into top level coverage map.
  const coverage = await this.page.evaluate(() => window.__coverage__);
  if (coverage) map.merge(coverage);
  await this.page.close();
});

after(async function () {
  // Write coverage files to location required for nyc.
  const files = map.files();
  await Promise.all(files.map(async file => {
    const cov = map.fileCoverageFor(file);
    const { hash, path } = cov.data;
    await fs.writeFile(`.nyc_output/${hash}.json`, JSON.stringify({ [path]: cov }));
  }));
  await this.browser.close();
  this.server.close();
});

// Make sure puppeteer and localhost server are actually working as expected.
describe('setup', function () {
  this.timeout(5000);
  it('should be running puppeteer and a basic localhost server', async function () {
    await this.page.goto(`${this.baseUrl}/test.html`, { waitUntil: 'domcontentloaded' });
    const title = await this.page.title();
    expect(title).to.equal('Test Page');
  });
});
