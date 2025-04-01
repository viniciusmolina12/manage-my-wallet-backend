const ENV = {
   SECRET_KEY: process.env.SECRET_KEY as string,
   FROM_EMAIL: process.env.FROM_EMAIL as string,
   RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL as string,
   MAILER_HOST: process.env.MAILER_HOST as string,
   MAILER_PORT: process.env.MAILER_PORT as string,
   MAILER_AUTH_USER: process.env.MAILER_AUTH_USER as string,
   MAILER_AUTH_PASSWORD: process.env.MAILER_AUTH_PASSWORD as string,
};

export default ENV;
