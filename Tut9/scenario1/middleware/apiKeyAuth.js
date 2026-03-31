'use strict'

var API_KEY = 'student-management-demo-key';

function apiKeyAuth(req, res, next) {
    var providedApiKey = req.get('x-api-key');

    if (!providedApiKey) {
        return res.status(401).json({
            message: 'API key is required',
            error: 'Unauthorized'
        });
    }

    if (providedApiKey !== API_KEY) {
        return res.status(401).json({
            message: 'Invalid API key',
            error: 'Unauthorized'
        });
    }

    next();
}

apiKeyAuth.API_KEY = API_KEY;

module.exports = apiKeyAuth;