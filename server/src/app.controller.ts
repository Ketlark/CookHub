import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { writeFile } from "fs/promises";
import { readFileSync, writeFileSync } from "fs";

const OPEN_API_KEY = "test";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  getInstructions(prompt: string) {
    return readFileSync("prompt.txt", "utf8");
  }

  @Get("tiktok")
  async downloadTiktokVideo(@Query() params) {
    try {
      const finalUrl = await resolveShortUrl(params.url);

      // Extract video ID from URL
      const videoId = finalUrl.match(/video\/(\d+)/)?.[1];
      if (!videoId) {
        throw new Error("Invalid TikTok URL - Could not extract video ID");
      }

      // API parameters
      const apiParams = {
        aweme_id: videoId,
        iid: "7318518857994389254",
        device_id: "7318517321748022790",
        channel: "googleplay",
        app_name: "musical_ly",
        version_code: "300904",
        device_platform: "android",
        device_type: "ASUS_Z01QD",
        version: "9",
        carrier_region: "US",
        sys_region: "US",
        region: "US",
        language: "en",
      };

      // Build query string
      const queryString = Object.entries(apiParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      // Make API request
      const response = await fetch(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?${queryString}`, {
        headers: {
          "User-Agent": "TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet",
        },
      });

      const data = await response.json();

      if (!data.aweme_list?.[0]?.music?.play_url?.uri) {
        throw new Error("Could not find audio URL in API response");
      }

      // Get video URL from response
      const audioUrl = data.aweme_list?.[0]?.music?.play_url?.uri;

      // Download video
      const audioResponse = await fetch(audioUrl);
      const buffer = await audioResponse.arrayBuffer();

      // Save video file
      writeFileSync("test.mp3", Buffer.from(buffer));
      console.log("✅ Audio saved as test.mp3");

      const fileBuffer = readFileSync("test.mp3");

      let formData = new FormData();
      formData.append("file", new Blob([fileBuffer], { type: "audio/mp3" }), "test.mp3");
      formData.append("model", "whisper-1");

      const transcription = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPEN_API_KEY}`,
        },
        body: formData,
      });

      const recipeTranscription = await transcription.json();
      console.log(recipeTranscription.text);

      const recipeResume = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPEN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instructions: this.getInstructions(recipeTranscription.text),
          input: recipeTranscription.text,
          model: "gpt-4.1-nano",
        }),
      });

      const recipeResumeJson = await recipeResume.json();
      console.log(JSON.stringify(recipeResumeJson.output));

      return "ok";
    } catch (error) {
      console.error("Error downloading TikTok video:", error);
      throw error;
    }
  }

  @Get("instagram")
  async downloadInstagramVideo(@Query() params): Promise<string> {
    console.log(params);
    try {
      // 1. Configuration cruciale des headers
      const headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "X-IG-App-ID": "936619743392459", // Nécessaire depuis 2023
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      };

      // 2. Requête avec gestion des redirects
      const response = await fetch(params.url, {
        headers,
        redirect: "manual",
        referrer: "https://www.instagram.com/",
      });

      // 3. Gestion spéciale des redirections Instagram
      if ([301, 302, 307, 308].includes(response.status)) {
        const redirectUrl = response.headers.get("location");
        //return await downloadInstagramVideo(redirectUrl);
      }

      const html = await response.text();

      // 4. Extraction robuste avec fallbacks
      const videoUrl = html.match(/(?:"video_url":")(https?:\/\/[^"]+\.mp4[^"]+)/i)?.[1] || html.match(/<meta[^>]+content="([^"]+\.mp4[^"]+)"/i)?.[1];

      if (!videoUrl) {
        throw new Error("Aucune URL vidéo trouvée - Structure HTML modifiée ?");
      }

      // 5. Décodage des caractères Unicode
      return decodeURIComponent(JSON.parse(`"${videoUrl.replace(/"/g, '\\"')}"`));
    } catch (error) {
      console.error(`Erreur critique: ${error.message}`);

      // Enregistrement du HTML pour debug
      await writeFile("debug.html", error);
      console.log("HTML sauvegardé dans debug.html");

      return null;
    }
  }
}

// Helper pour les URLs courtes
const resolveShortUrl = async url => {
  if (!url.includes("vm.tiktok.com") && !url.includes("vt.tiktok.com")) return url;

  const response = await fetch(url, { redirect: "manual" });
  return response.headers.get("location") || url;
};
