import swaggerJSDoc from "swagger-jsdoc";

let swaggerDefinition = {
    info: {
        title: 'Countries Api',
        version: '1.0.0',
        description: 'separated country api to fetch countries, city, regions',
    },

    host: 'localhost:3000',
    basePath: '/api/v1',
    securityDefinitions: {
        JWT: {
            type: "apiKey",
            description: "Ex: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
            name: "Authorization",
            in: "header"
        }
    },
    security: [
        {
            "JWT": []
        }
    ]
    
};


let options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./src/routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec ;
