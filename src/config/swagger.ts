import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerOptions: SwaggerOptions = {
    swaggerDefinition: {
        // 정보
        info: {
            title: 'Covey Application REST API', // Title (required)
            version: '0.0.2', // Version (required)
            description: `Endpoints to test the covey application routers. (version up)
            현재 sns회원가입 기능은 비활성화 상태이며 로그인은 _id가 5e1d2302a690f093ecab0ea5인 사용자로 고정되어 있음. (이름 : 김명관)`
        },
        // 주소
        // host: 'localhost:3000',
        host: 'www.coveyy.ml',
        components: {
            res: {
                BadRequest: {
                    description: '잘못된 요청',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                },
                Forbidden: {
                    description: '권한이 없음',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                },
                NotFound: {
                    description: '없는 리소스 요청',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                }
            },
            errorResult: {
                Error: {
                    type: 'object',
                    properties: {
                        errMsg: {
                            type: 'string',
                            description: '에러 메시지 전달.'
                        }
                    }
                }
            }
        },
        schemes: ['https'],
        // schemes: ['http'],
        definitions:  
            {
                'User': {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        snsId: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        },
                        gender: {
                            type: 'boolean'
                        },
                        age: {
                            type: 'string'
                        },
                        address1: {
                            type: 'string'
                        },
                        address2: {
                            type: 'string'
                        },
                        intro: {
                            type: 'string'
                        },
                        phoneNum: {
                            type: 'string'
                        },
                        img: {
                            type: 'string'
                        },
                    }
                },
                'Post': {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        userId: {
                            type: 'string'
                        },
                        title: {
                            type: 'string'
                        },
                        startDate: {
                            type: 'string',
                            format: 'date'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date'
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date'
                        },
                        isDue: {
                            type: 'boolean'
                        },
                        workingTime: {
                            type: 'string',
                        },
                        address1: {
                            type: 'string'
                        },
                        address2: {
                            type: 'string'
                        },
                        address3: {
                            type: 'string'
                        },
                        pay: {
                            type: 'integer'
                        },
                        description: {
                            type: 'string'
                        },
                        category: {
                            type: 'string',
                            enum: [ '식당', '카페', '술집', '편의점', '잡화매장', '독서실', 'PC방', '기타' ]
                        },
                        img1: {
                            type: 'string'
                        },
                        img2: {
                            type: 'string'
                        },
                        img3: {
                            type: 'string'
                        },
                    }
                },
                'Career': {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        userId: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        },
                        job: {
                            type: 'string'
                        },
                        periodNum: {
                            type: 'string'
                        },
                        periodUnit: {
                            type: 'string',
                            enum: [ '주', '개월', '년', ]
                        },
                    }
                },
                'Apply': {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        userId: {
                            type: 'string'
                        },
                        postId: {
                            type: 'string'
                        },
                    }
                },

            }
    },
    apis: ['src/routes/*'], // Path to the API docs
};