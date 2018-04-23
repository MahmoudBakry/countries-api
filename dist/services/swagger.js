'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _swaggerJsdoc = require('swagger-jsdoc');

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swaggerDefinition = {
    info: {
        title: 'Countries Api',
        version: '1.0.0',
        description: 'separated country api to fetch countries, city, regions'
    },

    host: 'localhost:5000',
    basePath: '/api/v1',
    securityDefinitions: {
        JWT: {
            type: "apiKey",
            description: "Ex: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
            name: "Authorization",
            in: "header"
        }
    },
    security: [{
        "JWT": []
    }]

};

var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./src/routes/**/*.js']
};

var swaggerSpec = (0, _swaggerJsdoc2.default)(options);

exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map