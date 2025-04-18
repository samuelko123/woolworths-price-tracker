import {
  SchedulerClient,
  CreateScheduleCommand,
} from "@aws-sdk/client-scheduler";

const client = new SchedulerClient({ region: "ap-southeast-2" });

export const handler = async () => {
  const targetLambdaArn = process.env.TARGET_LAMBDA_ARN;
  if (!targetLambdaArn) {
    console.error("TARGET_LAMBDA_ARN is not set");
    return;
  }

  const scheduledTaskRoleArn = process.env.SCHEDULED_TASK_ROLE_ARN;
  if (!scheduledTaskRoleArn) {
    console.error("SCHEDULED_TASK_ROLE_ARN is not set");
    return;
  }

  const futureTime = new Date(Date.now() + 2 * 60 * 1000) // +2 minutes
    .toISOString()
    .replace(/\.\d{3}Z$/, "");
  const scheduleName = `one-off-${Date.now()}`;

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    GroupName: "woolworths-price-fetcher",
    ScheduleExpression: `at(${futureTime})`,
    FlexibleTimeWindow: { Mode: "OFF" },
    Target: {
      Arn: targetLambdaArn,
      RoleArn: scheduledTaskRoleArn,
      Input: JSON.stringify({
        productId: "1234567890",
      }),
      RetryPolicy: {
        MaximumRetryAttempts: 0,
      },
    },
    ActionAfterCompletion: "DELETE",
  });

  try {
    const response = await client.send(command);
    console.log({
      message: "Scheduled successfully",
      response,
    });
  } catch (error) {
    console.error("Failed to schedule:", error);
  }
};
