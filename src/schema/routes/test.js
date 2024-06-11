'use strict';

export default {
    index: {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        msg: {
                            type: 'boolean',
                            default: true
                        },
                        result: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                email: { type: 'string' },
                                value: { type: 'string' }
                            }
                        },
                        token: {
                            type: 'string'
                        }
                    },
                    required: ['msg', 'result', 'token'],
                    example: {
                        msg: true
                    }
                }
            }
        }
    }
}