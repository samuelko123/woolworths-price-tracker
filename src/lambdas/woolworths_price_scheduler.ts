import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";

const client = new SchedulerClient({ region: process.env.AWS_REGION });

export const handler = async () => {
  const taskName = `woolworths_price_${Date.now()}_${Math.random()}`;
  const taskTime = new Date(Date.now() + 2 * 60 * 1000) // +2 minutes
    .toISOString()
    .replace(/\.\d{3}Z$/, "");

  const command = new CreateScheduleCommand({
    Name: taskName,
    GroupName: process.env.SCHEDULED_TASK_GROUP_NAME,
    ScheduleExpression: `at(${taskTime})`,
    FlexibleTimeWindow: { Mode: "OFF" },
    Target: {
      Arn: process.env.PRICE_FETCHER_LAMBDA_ARN,
      RoleArn: process.env.SCHEDULED_TASK_ROLE_ARN,
      Input: JSON.stringify({
        productId: "1234567890",
      }),
      RetryPolicy: {
        MaximumRetryAttempts: 0,
      },
    },
    ActionAfterCompletion: "DELETE",
  });

  const response = await client.send(command);
  console.log({
    message: "Scheduled successfully.",
    response,
  });
};
