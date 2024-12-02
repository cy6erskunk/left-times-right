'use strict';

import * as path from 'path';
import * as fs from 'fs';
import getPublicUrlOrPath from 'react-dev-utils/getPublicUrlOrPath.js';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const jsonData = JSON.parse(fs.readFileSync(resolveApp('package.json'), { encoding: 'utf-8' }));
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  jsonData.homepage,
  process.env.PUBLIC_URL
);

const buildPath = process.env.BUILD_PATH || 'build';

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

  const dotenv = resolveApp('.env');
  const appPath= resolveApp('.');
  const appBuild = resolveApp(buildPath);
  const appPublic = resolveApp('public');
  const appHtml = resolveApp('public/index.html');
  const appIndexJs = resolveModule(resolveApp, 'src/index');
  const appPackageJson = resolveApp('package.json');
  const appSrc = resolveApp('src');
  const appTsConfig = resolveApp('tsconfig.json');
  const appJsConfig = resolveApp('jsconfig.json');
  const yarnLockFile = resolveApp('yarn.lock');
  const testsSetup = resolveModule(resolveApp, 'src/setupTests');
  const proxySetup = resolveApp('src/setupProxy.js');
  const appNodeModules = resolveApp('node_modules');
  const appWebpackCache = resolveApp('node_modules/.cache');
  const appTsBuildInfoFile = resolveApp('node_modules/.cache/tsconfig.tsbuildinfo');
  const swSrc = resolveModule(resolveApp, 'src/service-worker');

export {
  dotenv,
  appPath,
  appBuild,
  appPublic,
  appHtml,
  appIndexJs,
  appPackageJson,
  appSrc,
  appTsConfig,
  appJsConfig,
  yarnLockFile,
  testsSetup,
  proxySetup,
  appNodeModules,
  appWebpackCache,
  appTsBuildInfoFile,
  swSrc,
  publicUrlOrPath,
  moduleFileExtensions
};
