module.exports = {
  apps: [
    {
      name: "weixin-mp-rss-web",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      },
      max_memory_restart: "512M"
    },
    {
      name: "weixin-mp-rss-worker",
      script: "npm",
      args: "run worker",
      cwd: __dirname,
      env: {
        NODE_ENV: "production"
      },
      max_memory_restart: "512M"
    }
  ]
};
