type RiotProxyRequest = {
  query: {
    url?: string | string[];
  };
};

type RiotProxyResponse = {
  status: (statusCode: number) => {
    json: (body: unknown) => unknown;
  };
};

export default async function handler(req: RiotProxyRequest, res: RiotProxyResponse) {
  const rawUrl = req.query.url;

  const url = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;

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

    const text = await riotResponse.text();

    let data: unknown;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    return res.status(riotResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching Riot API",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
