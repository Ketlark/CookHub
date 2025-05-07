import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { writeFile } from 'fs/promises';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tiktok')
  downloadTiktokVideo() {
    // return this.appService.downloadTiktokVideo();
  }

  @Get('instagram')
  async downloadInstagramVideo(@Query() params): Promise<string> {
    console.log(params);
    try {
      // 1. Configuration cruciale des headers
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'X-IG-App-ID': '936619743392459', // Nécessaire depuis 2023
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      };

      // 2. Requête avec gestion des redirects
      const response = await fetch(params.url, {
        headers,
        redirect: 'manual',
        referrer: 'https://www.instagram.com/',
      });

      // 3. Gestion spéciale des redirections Instagram
      if ([301, 302, 307, 308].includes(response.status)) {
        const redirectUrl = response.headers.get('location');
        //return await downloadInstagramVideo(redirectUrl);
      }

      const html = await response.text();

      // 4. Extraction robuste avec fallbacks
      const videoUrl =
        html.match(/(?:"video_url":")(https?:\/\/[^"]+\.mp4[^"]+)/i)?.[1] ||
        html.match(/<meta[^>]+content="([^"]+\.mp4[^"]+)"/i)?.[1];

      if (!videoUrl) {
        throw new Error('Aucune URL vidéo trouvée - Structure HTML modifiée ?');
      }

      // 5. Décodage des caractères Unicode
      return decodeURIComponent(
        JSON.parse(`"${videoUrl.replace(/"/g, '\\"')}"`),
      );
    } catch (error) {
      console.error(`Erreur critique: ${error.message}`);

      // Enregistrement du HTML pour debug
      await writeFile('debug.html', error);
      console.log('HTML sauvegardé dans debug.html');

      return null;
    }
  }
}
