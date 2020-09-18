import { ReceiveMode, ServiceBusClient } from '@azure/service-bus';

// Define connection string and related Service Bus entity names here
const connectionString = 'Endpoint=sb://radiation.servicebus.windows.net/;SharedAccessKeyName=sub;SharedAccessKey=bOdzNBs+xr4ZZQFL8+AzK3oZdoxBmFxwTRSvbHNLrUo=';
const topicName = 'marketorderinfo';
const subscriptionName = 'subscriber';

async function main() {
  const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
  const subscriptionClient = sbClient.createSubscriptionClient(topicName, subscriptionName);
  const receiver = subscriptionClient.createReceiver(ReceiveMode.receiveAndDelete);

  const retry = 10;
  try {
    for (let i = 0; i<=retry; i++) {
      const messages = await receiver.receiveMessages(100);

      if(Array.isArray(messages) && messages.length === 0) continue;
      console.log('Received messages:');
      console.log(messages.map((message: { body: any; }) => message.body));
    }

    await subscriptionClient.close();
  } finally {
    await sbClient.close();
  }
}

main().catch((err) => {
  console.log('Error occurred: ', err);
});
