import { Token } from './controller';

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

  Token.check(username, password).then((matches) => {
    if (!matches) {
      req.authorization = null;
      next();
      return;
    }

    req.authorization = { token: username };
    console.log(req.authorization);

    next();
  }).catch(next);
};
