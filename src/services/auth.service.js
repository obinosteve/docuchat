const authRepository = require('../repositories/auth.repository');

exports.register = async () => {
  return await authRepository.register();
};