import httpErrors from 'httperrors';

import { Token, Access } from './controller';

function base64decode(base64) {
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function authMiddleware(req, _res, next) {
  const prefix = 'Basic ';
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(prefix)) {
    req.authorization = null;
    next();
    return;
  }

  const [username, password] = base64decode(authHeader.substring(prefix.length)).split(':');

  Token.check(username, password)
    .then((matches) => {
      if (!matches) {
        req.authorization = null;
        next();
        return;
      }

      return Access.readAll({ tokenUuid: username });
    })
    .then((accesses) => {
      req.authorization = {
        token: username,
        pluginAccess: new Set(accesses.map((accesses) => accesses.pluginUuid)),
      };

      next();
    })
    .catch(next);
}

export function requireAccess(req, pluginUuid) {
  if (!req.authorization) {
    throw new httpErrors[401]('Authentication required', {
      headers: { 'www-authenticate': 'Basic realm="dyd", charset="UTF-8"' },
    });
  }

  if (!req.authorization.pluginAccess.has(pluginUuid)) {
    throw new httpErrors[403](`Access to plugin ${pluginUuid} is not granted`);
  }
}
