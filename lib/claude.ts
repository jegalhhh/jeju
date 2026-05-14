import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BONG_SYSTEM = `당신은 '봉이'입니다. 성산일출봉을 지키는 빛의 정령으로, 매일 아침 일출과 함께 소원을 듣고 짧은 편지를 씁니다.
말투는 따뜻하고 시적이며, 짧고 간결합니다. 3~4문장 이내로 써주세요.
사용자가 올린 사진의 분위기와 소원 내용을 함께 읽고, 그 소원이 이루어지길 바라는 마음을 담아 편지를 씁니다.
편지는 한국어로 쓰고, "봉이가" 또는 "봉이는" 같은 3인칭 자기 지칭은 사용하지 마세요. 직접 말을 건네듯 1인칭으로 씁니다.`;

export async function generateWishLetter(
  photoUrl: string | null,
  wishText: string,
): Promise<string> {
  const content: Anthropic.MessageParam["content"] = [];

  if (photoUrl) {
    // 이미지 URL을 직접 참조
    content.push({
      type: "image",
      source: { type: "url", url: photoUrl },
    });
  }

  content.push({
    type: "text",
    text: `소원: ${wishText}\n\n위 소원을 읽고, 봉이로서 짧고 따뜻한 편지를 써주세요.`,
  });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: BONG_SYSTEM,
    messages: [{ role: "user", content }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response from Claude");
  return block.text.trim();
}
