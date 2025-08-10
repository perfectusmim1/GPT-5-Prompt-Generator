import { NextRequest, NextResponse } from "next/server";

type GenerateBody = {
  prompt: string;
  imageDataUrl?: string | null; // backward-compat single image
  imageDataUrls?: string[] | null; // multi-image
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageDataUrl, imageDataUrls }: GenerateBody = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const headerKey = req.headers.get("x-openrouter-key");
    const apiKey = headerKey && headerKey.trim().length > 0 ? headerKey : process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is missing. Provide it from settings." },
        { status: 500 }
      );
    }

    const systemContent =
      "You are an elite prompt engineer. Read the user's brief and any optional image. Synthesize ONE copy‑paste‑ready master prompt in English, tailored to the user's goal. Strict rules: (1) Output ONLY the final prompt text — no preface, no explanations, no quotes, no code fences. (2) Use a clear, skimmable structure with concise section headers and bullet points where helpful. (3) Mark every variable with angle‑bracket placeholders, e.g., <product_name>, <target_audience>. (4) Include: role/goal for the target model, context and assumptions, constraints/guardrails, tone/style guide, step‑by‑step plan, expected output format/schema, success criteria, and optional extensions. (5) If an image is provided, integrate its salient details into the context succinctly. (6) Keep it self‑contained, unambiguous, and action‑oriented. Return ONLY the prompt.";

    type Part =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } };

    const userParts: Part[] = [{ type: "text", text: prompt }];
    const images: string[] = Array.isArray(imageDataUrls)
      ? imageDataUrls.filter((u): u is string => typeof u === "string")
      : imageDataUrl
      ? [imageDataUrl]
      : [];
    for (const url of images) {
      userParts.push({ type: "image_url", image_url: { url } });
    }

    // Web search kaldırıldı – yalnızca kullanıcı girdisi ve isteğe bağlı görseller kullanılır

    const payload = {
      model: "openai/gpt-5-chat",
      messages: [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: images.length > 0 ? userParts : prompt,
        },
      ],
      temperature: 0.7,
    } as const;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": req.headers.get("origin") ?? "http://localhost:3000",
        "X-Title": "Prompt Generator",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "OpenRouter error", detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompt: content });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", detail: String(err) },
      { status: 500 }
    );
  }
}



