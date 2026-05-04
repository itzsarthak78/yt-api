import express from "express";
import ytdl from "ytdl-core";

const app = express();

app.get("/api", async (req, res) => {
  const url = req.query.url;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const info = await ytdl.getInfo(url);

    const formats = ytdl
      .filterFormats(info.formats, "videoandaudio")
      .map(f => ({
        quality: f.qualityLabel,
        url: f.url
      }));

    res.json({
      title: info.videoDetails.title,
      formats
    });

  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
