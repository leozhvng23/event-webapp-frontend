import AWS from "aws-sdk";

const queueUrl = "https://sqs.us-east-1.amazonaws.com/612277434742/Eventful-Invitations";

export const longPollQueue = async (userId, onMessagesReceived, onError) => {
  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_SQS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SQS_SECRET_ACCESS_KEY,
  });

  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  let continuePolling = true;

  const stopPolling = () => {
    continuePolling = false;
  };

  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 30,
    WaitTimeSeconds: 20,
    MessageAttributeNames: ["RecipientId"],
  };

  while (continuePolling) {
    try {
      const data = await sqs.receiveMessage(params).promise();
      if (data.Messages) {
        const messagesForUser = data.Messages.filter(
          (message) => message.MessageAttributes.RecipientId.StringValue === userId
        );

        for (const message of messagesForUser) {
          console.log("Processing message:", message);

          const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          };
          await sqs.deleteMessage(deleteParams).promise();
          console.log("Deleted message:", message.MessageId);
        }
        onMessagesReceived(messagesForUser);
      }
    } catch (error) {
      console.error("Error receiving messages:", error);
      if (onError) {
        onError(error);
      }
      stopPolling();
    }
  }
};
