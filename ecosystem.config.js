// PM2 process file for api-gateway (the same settings the GCP VMs use).
//
//   sudo mkdir -p /opt/learnhub /var/log/pm2
//   sudo cp target/api-gateway.jar /opt/learnhub/api-gateway.jar
//   pm2 start ecosystem.config.js --update-env      # start it (values come from the environment)
//   pm2 save                                        # remember the process list
//   pm2 startup systemd -u root --hp /root          # start PM2 again after a VM reboot
//
// autorestart: PM2 restarts the app if it crashes. Logs: /var/log/pm2/api-gateway-out.log and api-gateway-error.log

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''));

module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'java',
      args: '-Xms192m -Xmx384m -jar /opt/learnhub/api-gateway.jar',
      cwd: '/opt/learnhub',
      env: clean({
        SERVER_PORT: '8080',
        CONFIG_SERVER_URL: process.env.CONFIG_SERVER_URL,
        EUREKA_SERVER_URL: process.env.EUREKA_SERVER_URL,
        STUDENT_SERVICE_URI: process.env.STUDENT_SERVICE_URI,
        COURSE_SERVICE_URI: process.env.COURSE_SERVICE_URI,
        ENROLLMENT_SERVICE_URI: process.env.ENROLLMENT_SERVICE_URI,
      }),
      autorestart: true,
      max_restarts: 30,
      min_uptime: '20s',
      restart_delay: 5000,
      kill_timeout: 15000,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/var/log/pm2/api-gateway-out.log',
      error_file: '/var/log/pm2/api-gateway-error.log',
    },
  ],
};
