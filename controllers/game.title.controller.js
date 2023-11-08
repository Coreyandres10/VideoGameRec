module.exports.gameName = async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const apiKey = "rahditujjrz0jcth2neeu3npkqe4bx";

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "text/plain",
      },
      body: `fields name; where name ~ "${searchTerm}"*;`,
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      console.error("IGDB API request failed");
      res.status(500).json({ error: "API request failed" });
    }
  } catch (error) {
    console.error("An error occurred while fetching data from IGDB", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
