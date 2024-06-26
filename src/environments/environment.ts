// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
import versionInfo from '../../version.json';
const basePath = 'http://localhost:8000/';

export const environment = {
  production: false,
  basePath: basePath,
  apiPath: basePath + 'api/v3/',
  imgPathPrefix: 'assets/',
  sentryTunnel: '',
  oauthClientId: 'gpfjs',
  version: versionInfo?.version
};
