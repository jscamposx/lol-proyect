export default async function handler(req: any, res: any) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "Missing Riot API url",
    });
  }

  const apiKey = process.env.RIOT_API_KEY;

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

    // Check if the response is JSON (Riot API usually returns JSON)
    const contentType = riotResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await riotResponse.json();
      return res.status(riotResponse.status).json(data);
    } else {
      const text = await riotResponse.text();
      return res.status(riotResponse.status).send(text);
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching Riot API",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
