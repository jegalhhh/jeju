import crypto from "crypto";

function makeSignature(_apiKey: string, apiSecret: string): { signature: string; timestamp: string; salt: string } {
  const timestamp = new Date().toISOString();
  const salt = crypto.randomBytes(8).toString("hex");
  const hmac = crypto.createHmac("sha256", apiSecret);
  hmac.update(timestamp + salt);
  const signature = hmac.digest("hex");
  return { signature, timestamp, salt };
}

export async function sendSms(to: string, text: string): Promise<void> {
  const apiKey = process.env.SOLAPI_API_KEY!;
  const apiSecret = process.env.SOLAPI_API_SECRET!;
  const from = process.env.SOLAPI_SENDER_NUMBER!;

  const { signature, timestamp, salt } = makeSignature(apiKey, apiSecret);

  const res = await fetch("https://api.solapi.com/messages/v4/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${timestamp}, salt=${salt}, signature=${signature}`,
    },
    body: JSON.stringify({
      message: { to, from, text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SOLAPI error: ${err}`);
  }
}
