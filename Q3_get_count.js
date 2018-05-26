'use strict';
console.log('starting function');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});

exports.handler = function(event, ctx, callback) {
    // Get parameter id
    let id = Number(event["queryStringParameters"]['id']);
    console.log("request: " + JSON.stringify(event));

    function printCount(id,callback) {
        if (id == 0){
	    // Query for last 10 minutes vote count 
            var ts_now = Date.now();
            var ts_old = ts_now - 600000;
            var params = {
                TableName : "vote",
                FilterExpression: "#ts between :ts_old and :ts_now",
                ExpressionAttributeNames:{
                    "#ts": "timestamp"
                },
                ExpressionAttributeValues: {
                    ":ts_old": ts_old,
                    ":ts_now": ts_now
                }
            };
        }else{
	    // Query for each candidate vote count
            params = {
            TableName: 'vote',
            FilterExpression: "vote_id = :vid",
            ExpressionAttributeValues: {
                ":vid":id
                }
            };
        }

        // Get each candidate name with specific id
        switch(id) {
            case 0:
                var title_begin = "Last 10min total: ";
                var title_end = "";
                break;
            case 1:
                title_begin = "薯片(1): ";
                title_end = " votes";
                break;
            case 2:
                title_begin = "林林(2): ";
                title_end = " votes";
                break;
            case 3:
                title_begin = "正氣(3): ";
                title_end = " votes";
                break;
            default:
                title_begin = "no title: ";
                title_end = "";
                break;
        }
        

	// Scan DB and callback result
        docClient.scan(params, function(err,data){
            if(err){
                callback(err,null);
            }else{
                callback(title_begin + data.Count + title_end);
            }
            
        });
    }

    // Print result
    printCount(id, function (count){
        let responseCode = 200;

        var responseBody = {
            message: count,
            input: event
        };
        
        var response = {
            statusCode: responseCode,
            headers: {
                "x-custom-header" : "Get count of vote"
            },
            body: JSON.stringify(responseBody)
        };
        console.log("response: " + JSON.stringify(response));
        callback(null, response);
    
    });
};
