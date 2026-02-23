import { DeleteMessageCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient();

export const addMessageToQueue = async (queueUrl: string, messageBody: any) => {
  const queueInput = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  };

  try {
    const command = new SendMessageCommand(queueInput);
    await sqsClient.send(command);
    return true;
  } catch (error) {
    console.log("unable to add queueInput ", queueInput, error);
    return false;
  }
};

export const removeMessageFromQueue = async (QueueUrl: string, ReceiptHandle: string) => {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl,
      ReceiptHandle,
    });
    await sqsClient.send(command);

    return true;
  } catch (error) {
    console.log("unable to delete message from queue ", QueueUrl, " with Recipet handle", ReceiptHandle, error);
    return false;
  }
};
