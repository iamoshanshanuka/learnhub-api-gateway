# LearnHub API Gateway

Single entry point for every backend request (Spring Cloud Gateway, WebFlux).

## Student Information

- **Student Name:** M.W. Oshan Shanuka
- **Student Number:** 2301692025
- **Slack Handle:** oshan_shanuka
- **GCP Project ID:** learnhub-capstone

Final project of **ITS 2130 Enterprise Cloud Architecture** (Higher Diploma in Software Engineering, IJSE).

## Project Description

The web application talks only to the gateway. It routes `/api/students/**`, `/api/courses/**` and `/api/enrollments/**` to the matching microservice through **Eureka** (`lb://student-service` and so on) and spreads requests over all running instances. CORS is enabled, including `PATCH`. Two gateway instances run on GCP (one per zone) behind the external HTTPS load balancer.

## Technology Stack

- Java 25
- Spring Boot 4.0.7 and Spring Cloud 2025.1.2
- Spring Cloud Gateway (`spring-cloud-starter-gateway-server-webflux`), Spring Cloud Netflix Eureka Client, Spring Cloud Config Client, Spring Cloud LoadBalancer
- PM2 (process manager on the VM: restarts on failure, starts again after a reboot)
- Google Compute Engine (IaaS), Cloud DNS, Cloud NAT, Cloud Load Balancing

## Setup / Getting Started

**Requirements:** JDK 25 and Maven 3.9+.

```bash
git clone https://github.com/iamoshanshanuka/learnhub-api-gateway.git
cd learnhub-api-gateway
mvn clean package
java -jar target/api-gateway.jar          # needs Eureka and the services for real routing
```

Runs on port **8080**. Every setting has a local default, so no environment variable is needed for a local run.

### Configuration (environment variables)

| Variable | Meaning | Default |
|---|---|---|
| `SERVER_PORT` | HTTP port | `8080` |
| `CONFIG_SERVER_URL` | Config Server address | `http://localhost:8888` |
| `EUREKA_SERVER_URL` | Eureka URL(s), comma separated | `http://localhost:8761/eureka/` |
| `STUDENT_SERVICE_URI` | Emergency override of the student route | `lb://student-service` |
| `COURSE_SERVICE_URI` | Emergency override of the course route | `lb://course-service` |
| `ENROLLMENT_SERVICE_URI` | Emergency override of the enrollment route | `lb://enrollment-service` |

### Routes

| Path | Service |
|---|---|
| `/api/students/**` | student-service |
| `/api/courses/**` | course-service |
| `/api/enrollments/**` | enrollment-service |
| `/actuator/health` | the gateway itself (used by the load balancer health check) |

Spring Cloud 2025.x renamed the starter to `spring-cloud-starter-gateway-server-webflux` and moved the routes to `spring.cloud.gateway.server.webflux.routes`.

### Run under PM2 (like on the GCP VM)

```bash
sudo mkdir -p /opt/learnhub /var/log/pm2
sudo cp target/api-gateway.jar /opt/learnhub/api-gateway.jar
pm2 start ecosystem.config.js --update-env
pm2 save
pm2 startup systemd -u root --hp /root      # PM2 starts again after a reboot
```

`ecosystem.config.js` restarts the app when it crashes and writes logs to `/var/log/pm2/api-gateway-out.log` and `api-gateway-error.log`.

## Related repositories

- [`learnhub-backend-platform`](https://github.com/iamoshanshanuka/learnhub-backend-platform)
- [`learnhub-eureka-server`](https://github.com/iamoshanshanuka/learnhub-eureka-server)
- [`learnhub-config-server`](https://github.com/iamoshanshanuka/learnhub-config-server)
- [`learnhub-api-gateway`](https://github.com/iamoshanshanuka/learnhub-api-gateway)
