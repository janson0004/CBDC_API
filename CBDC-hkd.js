'use strict';
exports.handler = async (event) => {
    console.log("request: " + JSON.stringify(event));
    let input =0;
    input = event.CBDCamount;
    let rate=0.98;
    let HKDrepsonse ={
        transactionInfo:{
            rate:rate,
            returnedHKD:input*rate,
            acceptedCBDC: input,
            transactionDate: "13th October 2020"
        },
        AccountInfo:{
            HKDBalance:input*rate+1998,
            CBDCBalance:input+1998
        },
        
    };

    let response = {
        statusCode: 200,
        body: HKDrepsonse
    };
    
    return response;
};


// this programme is for p2p lending 
'use strict'
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
AWS.config.update({ region: "us-east-1"});


exports.handler = async (event) => {

    let input1 = 0, input2 = 0, input3 = 0,input4 = 0, input5 = 0;
    
    //current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    
    input1 = event.TransactionId;
    input2 = event.RecipentName;
    input3 = event.RecipentID;
    input4 = event.Amount;
  const params = {
      TableName: "Test-table",
      Item: {
          isbn: input1,             // isbn is the transactionID
          Recipient_Name: input2,
          Recipent_ID: input3,
          Amount: input4,
          date: today
      }
  };
// need to add a function to update the 

try {
    const response = await documentClient.put(params).promise();
    console.log(response);
}catch (err) {
    console.log(err);
    
}
};
}
