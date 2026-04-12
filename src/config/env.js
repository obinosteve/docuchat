import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
};

export default env;
