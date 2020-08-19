const chai = require('chai');
const express = require('express');
const fs = require('fs').promises;
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const webpackMiddleware = require('webpack-dev-middleware');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { expect } = require('chai');
const { promisify } = require('util');

// Create top level coverage map
const map = createCoverageMap();

const compiler = webpack({
  mode: 'development',
  ...webpackConfig,
  stats: {
    all: true
  }
});
const app = express();
const middleware = webpackMiddleware(compiler, {
  logLevel: 'warn',
  publicPath: '/dist'
});
app.use(middleware);
app.use(express.static(path.resolve(__dirname, 'fixtures')));

chai.use(require('dirty-chai'));

async function createServer () {
  const server = http.createServer(app);
  await promisify(server.listen.bind(server))(0, 'localhost');
  return server;
}

before(async function () {
  this.browser = await puppeteer.launch();
  this.server = await createServer();
  const { address, port } = this.server.address();
  this.baseUrl = `http://${address}:${port}`;
});

beforeEach(async function () {
  this.page = await this.browser.newPage();
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
  middleware.close();
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
