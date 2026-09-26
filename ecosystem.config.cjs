module.exports = {
  apps: [
    {
      name: "coreandfit",
      cwd: "/var/www/coreandfit",
      script: "/opt/node22/bin/node",
      args: "node_modules/next/dist/bin/next start -p 3050",
      env: {
        NODE_ENV: "production",
        PORT: "3050",
        DATABASE_PATH: "/var/www/coreandfit/.data/coreandfit.sqlite",
        PATH: "/opt/node22/bin:" + (process.env.PATH || "")
      },
      max_memory_restart: "600M",
      autorestart: true,
      restart_delay: 4000,
      watch: false
    }
  ]
};
