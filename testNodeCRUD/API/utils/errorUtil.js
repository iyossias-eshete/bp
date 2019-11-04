const errorLists = [
    {
        id: 1,
        errId: 'ValErr',
        name: 'Validation Errors',
        statusCode: 400,
        description: ''
    },
    {
        id: 2,
        errId: 'AuthErr',
        name: 'Authorization Error',
        statusCode: 400,
        description: ''
    },
    {
        id: 3,
        errId : 'InvalUserErr',
        name: 'Invalid User',
        statusCode : 404,
        description: 'The user that you are looking for doesn\'t exist'
    }
];


const ErrorBuilder = (name,information,statusCode)=>{
    const ResultedError = new Error();
    ResultedError.name = name;
    ResultedError.information = information;
    ResultedError.statusCode = statusCode;
    ResultedError.description = '';
    return ResultedError;
};

const ValidationError = ErrorBuilder('Validation Error',
'The entry has validation error(s).',
400,
);
module.exports.ValidationError = ValidationError;

const AuthenticationError =  ErrorBuilder('Authentication Error',
'Authentication failed. Please verify that you have correctly provided your login infomration.',
400
);
module.exports.AuthenticationError = AuthenticationError;

const TokenNotInReqError =  ErrorBuilder('Token not Found in Request Error',
'Token couldn\t be retreived from the incoming request.',
400
);
module.exports.TokenNotInReqError = TokenNotInReqError;

const ForbiddenForToken = ErrorBuilder('Permission Denied for the Provided Token',
'You cannot get access to the resource you requested using the token you provided.',
403
); 
module.exports.ForbiddenForToken = ForbiddenForToken;

const InvalidToken = ErrorBuilder('Invalid Token',
'The token provided cannot be verified. It is invalid. You cannot get access to the resource you requested using that token.',
403
); 
module.exports.InvalidToken = InvalidToken;

module.exports.errorBuilder = err => {
    const ResultedError = err;
    ResultedError.name = err.message;
    ResultedError.information = err.toString();
    ResultedError.statusCode = statusCode;
    ResultedError.description = '';
    return ResultedError;
}; 
