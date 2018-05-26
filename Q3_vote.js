'use strict';
console.log('starting function');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});

exports.handler = function(event, ctx, callback) {
    // Get parameter id
    let id = Number(event["queryStringParameters"]['id']);

    // Set record details
    var params = {
        Item: {
            timestamp: Date.now(),
            vote_id: id
        },
        
        TableName: 'vote'
    };
    
    // Put the record to db with responds
    docClient.put(params, function(err,data){
        if(err){
            callback(err,null);
        }else{
            let responseCode = 200;

            var responseBody = {
                message: "Success voted",
                input: event
            };
        
            var response = {
                statusCode: responseCode,
                headers: {
                    "x-custom-header" : "Vote"
                },
                body: JSON.stringify(responseBody)
            };
            console.log("response: " + JSON.stringify(response));
            callback(null, response);

        }
    });
};
