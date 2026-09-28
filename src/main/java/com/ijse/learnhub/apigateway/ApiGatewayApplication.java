package com.ijse.learnhub.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LearnHub Platform - API Gateway.
 *
 * The single entry point for the frontend. Routes /api/students/**, /api/courses/** and
 * /api/enrollments/** to the matching microservice, resolved through Eureka (lb://service-name)
 * and load-balanced across every registered instance. Two gateway instances run on GCP (one per
 * zone) behind the external HTTPS load balancer.
 */
@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
