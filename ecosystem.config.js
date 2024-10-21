module.exports = {
    apps: [
      {
        name: 'aic-patient-demographics',
        script: 'node_modules/.bin/next',
        args: 'start',
        instances: 1, // Adjust based on your server capacity
        autorestart: true,
        watch: false,
        max_memory_restart: '1G', // Adjust based on your application's memory usage
        env: {
          NODE_ENV: 'production'
        },
        env_dev: {
          NODE_ENV: 'development'
        }
      }
    ]
  };