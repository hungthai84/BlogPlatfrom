import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Auth for Google APIs
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

  const drive = google.drive({ version: 'v3', auth });

  // API: Get articles from Drive
  app.get("/api/articles", async (req, res) => {
    try {
      const response = await drive.files.list({
        q: "name = 'blog_articles.json' and trashed = false",
        fields: "files(id, name)",
      });
      
      const files = (response.data as any).files;
      if (files && files.length > 0) {
        const fileId = files[0].id;
        const file = await drive.files.get({
          fileId: fileId as string,
          alt: 'media',
        });
        res.json(file.data);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // API: Save articles to Drive
  app.post("/api/articles", async (req, res) => {
    try {
      const articles = req.body;
      const fileMetadata = {
        name: 'blog_articles.json',
        mimeType: 'application/json',
      };
      const media = {
        mimeType: 'application/json',
        body: JSON.stringify(articles),
      };

      const existingFiles = await drive.files.list({
        q: "name = 'blog_articles.json' and trashed = false",
        fields: "files(id)",
      });

      const files = (existingFiles.data as any).files;
      if (files && files.length > 0) {
        const fileId = files[0].id;
        await drive.files.update({
          fileId: fileId as string,
          media: media,
        });
      } else {
        await drive.files.create({
          requestBody: fileMetadata,
          media: media,
        });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving articles:", error);
      res.status(500).json({ error: "Failed to save articles" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
