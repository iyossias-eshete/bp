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


let errResponse = {
    name: '',
    errId: '',
    statusCode: '',
    description: ''
};

const generatedErrorHandler = (err, req, res, next) => {
    if (err.generatedErrorType !== undefined )
        generalErrorHandler(err, req, res, next);
    else
        otherError(err, req, res, next);
};

const generalErrorHandler = (err, req, res, next) => {
    errResponse = errorLists.find(errList => errList.errId === err.generatedErrorType)
    errResponse.description = err.toString();
    res.json(errResponse);
}

const otherError = (err, req, res, next) => {
    errResponse.name = err.message;
    errResponse.statusCode = 400;
    errResponse.description = err.toString();
    res.json(errResponse);
};

module.exports = generatedErrorHandler;