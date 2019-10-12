const AWS = require("aws-sdk")
const uuid = require("uuid")
const { success, failure } = require("./response-helper")
const to = require('await-to-js').default
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports = {
     processEvent: async (event) => {
        const data = JSON.parse(event.body)
        const databaseParameters = {
            TableName: "todos",
            Item: {
                id: uuid.v1(),
                content: data.content,
                createdAt: Date.now()
            }
        }

        let [ error ] = await to(dynamoDb.put(databaseParameters).promise())

        if(error) {
            console.log(error)
            return failure({ status: false })
        }

        return success(databaseParameters.Item)
    }
}



