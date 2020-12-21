import { Token, Access } from './controller';

function base64decode(base64) {
  return Buffer.from(base64, 'base64').toString('utf8');
}

export default (req, res, next) => {
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
};
