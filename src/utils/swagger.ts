import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const getSwaggerJsdocOptions = (): swaggerJsdoc.Options => {
    return {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "User API",
          version: "1.0.0",
          description: "API documentation for User operations",
        },
      },
      apis: [
        // List your route files that contain Swagger annotations
        'src/controllers/*.ts',
      ],
    };
  };
  
  // Serve Swagger documentation
  export const serveSwaggerDocs = () => {
    const swaggerSpec = swaggerJsdoc(getSwaggerJsdocOptions());
    const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
      customCss: ".swagger-ui .topbar { display: none }",
    };
  
    return [
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, swaggerUiOptions),
    ];
  };