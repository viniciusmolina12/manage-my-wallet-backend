const ENV = {
    SECRET_KEY: process.env.SECRET_KEY as string,
    FROM_EMAIL: process.env.FROM_EMAIL as string,
    RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL as string
}

export default ENV;