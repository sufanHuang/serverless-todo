const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion:'2012-08-10'});
const to = require("await-to-js").default
const { success, failure } = require("./response-helper")

module.exports = {
    processEvent: async(event)=>{
        const data = JSON.parse(event.body);
        const databaseParameters = {
            TableName: "todos",
            Key: {
                id: event.pathParameters.id
            },
            UpdateExpression:"Set content = :content",
            ExpressionAttributeValues: {
                ":content": data.content || null
            },
            ReturnValues:"ALL_NEW"
        };

        let [ error ] = await to(dynamoDb.update(databaseParameters).promise())

        if(error){
            console.log(error)
            return failure({status:false})
        }

        return success({ status: true })
    }
}

