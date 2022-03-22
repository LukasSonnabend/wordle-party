require ('dotenv').config();
const query = require("express");
const { GraphQLClient, gql } = require('graphql-request')
const { Query } = require('pg/lib/client');


async function QueryNoco() {
  const endpoint = process.env.NOCO_GRAPH_ENDPOINT

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "xc-auth": process.env.NOCO_GRAPH_API_KEY,
    },
  })

  const query = gql`
    {
      QuestionsList {
        id
        title
        length
      }
    }
  `
  console.log("Sending Req to noco")
  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
  return data
}

// QueryNoco().catch((error) => console.error(error))

module.exports ={
  QueryNoco
}