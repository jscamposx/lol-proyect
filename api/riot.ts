export default async function handler(req: any, res: any) {
  const rawUrl = req.query.url;

  const url = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "Missing Riot API url",
    });
  }

  const apiKey = process.env.RIOT_API_KEY;

  console.log("RIOT_API_KEY exists:", Boolean(apiKey));
  console.log("Riot URL:", url);

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing RIOT_API_KEY environment variable",
    });
  }

  try {
    const riotResponse = await fetch(url, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    const text = await riotResponse.text();

    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    return res.status(riotResponse.status).json(data);
  } catch (error) {
    console.error("Error fetching Riot API:", error);

    return res.status(500).json({
      error: "Error fetching Riot API",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
