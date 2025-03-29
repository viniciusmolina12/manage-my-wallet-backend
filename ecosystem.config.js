module.exports = {
    apps: [
      {
        name: 'app',
        script: './dist/infrastructure/api/express/server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '300M',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  