import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const viewsDir = join(__dirname, '..', 'views');
  const publicDir = join(__dirname, '..', 'public');

  app.useStaticAssets(publicDir);
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'layouts/main' });
  app.set('layout', 'layouts/main');
  hbs.registerPartials(join(viewsDir, 'partials'));
  app.use(cookieParser());

  // Register Handlebars helper functions
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('or', (a, b) => Boolean(a || b));
  hbs.registerHelper('and', (a, b) => Boolean(a && b));
  hbs.registerHelper('inc', (val) => (typeof val === 'number' ? val + 1 : 1));
  hbs.registerHelper('dec', (val) => (typeof val === 'number' && val > 1 ? val - 1 : 1));
  hbs.registerHelper('json', (context) => JSON.stringify(context));
  hbs.registerHelper('formatDate', (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  });
  hbs.registerHelper('formatDateTime', (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  });
  hbs.registerHelper('gt', (a, b) => a > b);
  hbs.registerHelper('gte', (a, b) => a >= b);
  hbs.registerHelper('lt', (a, b) => a < b);
  hbs.registerHelper('lte', (a, b) => a <= b);
  hbs.registerHelper('slice', (str, start, end) => (typeof str === 'string' ? str.slice(start, end) : ''));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`NestJS CMS Admin Panel running on ${process.env.ADMIN_APP_URL || `http://localhost:${port}`}`);
}

bootstrap();
