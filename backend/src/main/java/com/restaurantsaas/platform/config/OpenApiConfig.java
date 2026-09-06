package com.restaurantsaas.platform.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "BearerAuth";

    @Bean
    public OpenAPI restaurantSaaSOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Enterprise Multi-Tenant Restaurant SaaS Platform API")
                        .description("Production-grade multi-tenant REST API for Restaurant POS, KDS, QR Ordering, Inventory & Analytics")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Enterprise SaaS Team")
                                .email("architect@restaurantsaas.io"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://restaurantsaas.io/terms")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .name(BEARER_AUTH)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token")));
    }

    @Bean
    public OperationCustomizer customizeGlobalHeaders() {
        return (operation, handlerMethod) -> {
            // Add optional X-Tenant-ID and X-Branch-ID parameters to all OpenAPI operations
            operation.addParametersItem(new Parameter()
                    .in("header")
                    .required(false)
                    .name("X-Tenant-ID")
                    .description("UUID of the active Restaurant Tenant")
                    .schema(new io.swagger.v3.oas.models.media.StringSchema().format("uuid")));

            operation.addParametersItem(new Parameter()
                    .in("header")
                    .required(false)
                    .name("X-Branch-ID")
                    .description("UUID of the active Restaurant Branch")
                    .schema(new io.swagger.v3.oas.models.media.StringSchema().format("uuid")));

            return operation;
        };
    }
}
