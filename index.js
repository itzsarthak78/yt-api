import express from "express";
import ytdl from "ytdl-core";

const app = express();

// Root route (fix for Not Found)
app.get("/", (req, res) => {
  res.send("API is running ✅ Use /api?url=YOUTUBE_LINK");
});

// Main API
app.get("/api", async (req, res) => {
  const url = req.query.url;

  // Validate URL
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(url);

    const formats = ytdl
      .filterFormats(info.formats, "videoandaudio")
      .map(f => ({
        quality: f.qualityLabel || "unknown",
        url: f.url
      }));

    return res.json({
      title: info.videoDetails.title,
      formats
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch video (YouTube may block request)"
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
