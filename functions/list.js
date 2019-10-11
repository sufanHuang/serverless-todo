const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion:'2012-08-10'});
const to = require("await-to-js").default
const { success, failure } = require("./response-helper")

module.exports = {
    processEvent: async()=>{
        const databaseParameters = {
            TableName: "todos",
            AttributesToGet: [
                'id',
                'content',
                'createAt'
            ]
        }

        let [ error, result ] = await to(dynamoDb.scan(databaseParameters).promise())

        if(error){
            console.log(error)
            return failure({status: false})
        }

        return success(result.Items)
    }
}
