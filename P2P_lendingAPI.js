'use strict'
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
AWS.config.update({ region: "us-east-1"});

const update = async ({ tableName, primaryKey, primaryKeyValue, updateKey, updateValue }) => {
    const params = {
        TableName: tableName,
        Key: { [primaryKey]: primaryKeyValue },
        UpdateExpression: `set ${updateKey} = :updateValue`,
        ExpressionAttributeValues: {
            ':updateValue': updateValue,
        },
    };

    return documentClient.update(params).promise();
}

const getSingle = async(a) => {
     const params = {
    TableName:"AccountBalance",
    Key: {
      "id": a
    },
   ProjectionExpression: 'Balance'
  };
  try { 
      const data = await documentClient.get(params).promise();
      console.log("This is the value in getSingle():",data.Item.Balance);
      return data.Item.Balance;
  } catch(err) {
      console.log("Can't access user data");
      statusCode: 403;
  }
}

function between (min,max) {
    return Math.floor (Math.random() * (max - min) + min)
}

exports.handler = async (event) => {

    let input1 = 0, input2 = 0, input3 = 0,input4 = 0, input5 = 0, input6 = 0;
    
    //compute current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var test = between(0,1000000);
    input1 = test.toString();
    input2 = event.RecipentName;
    input3 = event.RecipentID;
    input4 = event.Amount;
    input5 = event.payerName;
    input6 = event.payerId;
  const params = {
      TableName: "Test-table",
      Item: {
          isbn: input1,             // isbn is the transactionID
          Recipient_Name: input2,
          Recipent_ID: input3,
          Payer_Name: input5,
          Payer_ID: input6,
          Amount: input4,
          date: today
      }   
  };

  var Balance_recipent = 0; // update Account Balance for the recipent
  Balance_recipent =  Number(await getSingle(input3))+ Number(input4);
    console.log("the balance_recipent:", Balance_recipent);
  const res1= await update({
    tableName : 'AccountBalance',
    primaryKey: 'id',
    primaryKeyValue: input3,
    updateKey: 'Balance',
    updateValue: Balance_recipent,
});
    

    var Balance_payer = 0; // update Account Balance for the payer
    Balance_payer = Number(await getSingle(input6)) - Number(input4);
    const res2 = await update ({
        tableName : 'AccountBalance',
        primaryKey: 'id',
        primaryKeyValue: input6,
        updateKey: 'Balance',
        updateValue: Balance_payer,
    });
    
let response1 = {
    statusCode: 200,
    "Message": "Trasaction successed.",
    "TransactioId": input1,
    "Account Balance":"$" + Balance_payer
}
let response2 = {
    statusCode: 403,
    "Message": "Transaction denied, Please try again."
}
try {
    const response = await documentClient.put(params).promise();
    console.log(response);
    return response1;
}catch (err) {
    console.log(err);
    return response2;
    
}
};
