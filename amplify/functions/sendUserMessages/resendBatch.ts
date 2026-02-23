import { Resend } from "resend";
import { chunk } from "./helper";

type BatchEmail = {
  from: string;
  to: string[]; // Resend expects array of recipients
  subject: string;
  html: string;
  // optional:
  // reply_to?: string;
  // cc?: string[];
  // bcc?: string[];
  // headers?: Record<string, string>;
  // tags?: { name: string; value: string }[];
};

const GGP_RESEND_KEY = process.env.GGP_RESEND_KEY || "";
const resend = new Resend(GGP_RESEND_KEY);

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const sendPersonalisedInBatches = async (userMailsData: BatchEmail[], batchSize = 50, delayMs = 2000) => {
  // 2) Chunk to batches of 50
  const batches = chunk(userMailsData, batchSize);

  const summary = {
    total: userMailsData.length,
    batches: batches.length,
    sentBatches: 0,
    failedBatches: 0,
    failedBatchIndexes: [] as number[],
  };

  // 3) Send each batch with delay
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    try {
      const result = await resend.batch.send(batch);

      summary.sentBatches += 1;

      console.log(`Batch ${i + 1}/${batches.length} sent. Count=${batch.length}`);

      batch.forEach((b) => {
        // Optional: log each recipient in that batch
        console.log(`Queued via batch for: ${b.to[0]}`);
      });
    } catch (err) {
      summary.failedBatches += 1;
      summary.failedBatchIndexes.push(i);

      console.error(`Batch ${i + 1}/${batches.length} failed. Count=${batch.length}`, err);
      batch.forEach((b) => {
        console.log(`Failed mail in batch ${i + 1}/${batches.length} for: ${b.to[0]}`);
      });
      // Decide if you want to continue or break; continuing is usually better for bulk comms.
    }

    // Delay between batches (except after last)
    if (i < batches.length - 1) {
      await sleep(delayMs);
    }
  }

  return summary;
};
