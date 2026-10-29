import { Controller, Get, UseGuards, Render, Req, Query, Post, Body, Param, Res, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as FormData from 'form-data';
import { AuthGuard } from '../auth/auth.guard';
import { ApiClientService } from '../api/api-client.service';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly apiClient: ApiClientService) {}

  private getAdminContext(req: Request, title: string, activeRoute: string) {
    const successQuery = req.query?.success;
    const errorQuery = req.query?.error;

    return {
      layout: 'layouts/main',
      title,
      activeRoute,
      username: req.cookies?.admin_username || 'Admin',
      role: req.cookies?.admin_role || 'SUPERADMIN',
      websiteUrl: process.env.WEBSITE_URL || 'http://localhost:7777',
      query: req.query,
      successMessage: successQuery === '1' ? 'Operation completed successfully.' : (typeof successQuery === 'string' ? successQuery : null),
      errorMessage: typeof errorQuery === 'string' ? errorQuery : null,
    };
  }

  @Get()
  getAdminRoot(@Res() res: Response) {
    return res.redirect('/admin/dashboard');
  }

  @Get('dashboard')
  @Render('dashboard')
  async getDashboard(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Dashboard Overview', 'dashboard');

    try {
      const [blogs, services, gallery, testimonials, enquiries, users] = await Promise.all([
        this.apiClient.get<any>('/blog-posts/', {}, token).catch(() => ({ count: 0 })),
        this.apiClient.get<any>('/services/', {}, token).catch(() => ({ count: 0 })),
        this.apiClient.get<any>('/gallery/', {}, token).catch(() => ({ count: 0 })),
        this.apiClient.get<any>('/testimonials/', {}, token).catch(() => ({ count: 0 })),
        this.apiClient.get<any>('/contact-submissions/', {}, token).catch(() => ({ count: 0 })),
        this.apiClient.get<any>('/users/', {}, token).catch(() => ({ count: 0 })),
      ]);

      return {
        ...ctx,
        stats: {
          blogCount: blogs.count ?? (Array.isArray(blogs) ? blogs.length : 0),
          serviceCount: services.count ?? (Array.isArray(services) ? services.length : 0),
          galleryCount: gallery.count ?? (Array.isArray(gallery) ? gallery.length : 0),
          testimonialCount: testimonials.count ?? (Array.isArray(testimonials) ? testimonials.length : 0),
          enquiryCount: enquiries.count ?? (Array.isArray(enquiries) ? enquiries.length : 0),
          userCount: users.count ?? (Array.isArray(users) ? users.length : 0),
        },
      };
    } catch (err) {
      return {
        ...ctx,
        stats: { blogCount: 0, serviceCount: 0, galleryCount: 0, testimonialCount: 0, enquiryCount: 0, userCount: 0 },
      };
    }
  }

  // ================= VISITOR ANALYTICS & TRAFFIC LOGS =================
  @Get('analytics/visitors')
  @Render('analytics/visitors')
  async getVisitorAnalytics(@Req() req: Request, @Query() query: any) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Visitor Analytics & Traffic Logs', 'analytics-visitors');

    const page = parseInt(query?.page as string, 10) || 1;
    const pageSize = 25;

    const apiParams: Record<string, any> = {
      page,
      page_size: pageSize,
    };

    if (query?.date_from) apiParams.date_from = query.date_from;
    if (query?.date_to) apiParams.date_to = query.date_to;
    if (query?.country) apiParams.country = query.country;
    if (query?.city) apiParams.city = query.city;
    if (query?.visitor_hash) apiParams.visitor_hash = query.visitor_hash;
    if (query?.device_type) apiParams.device_type = query.device_type;
    if (query?.search) apiParams.search = query.search;

    try {
      const [rawLogs, stats] = await Promise.all([
        this.apiClient.get<any>('/visitor-logs/', apiParams, token).catch(() => ({ results: [], count: 0 })),
        this.apiClient.get<any>('/visitor-logs/stats/', apiParams, token).catch(() => ({
          total_visits: 0,
          unique_visitors: 0,
          avg_duration_seconds: 0,
          avg_duration_display: '0s',
          top_pages: [],
          top_locations: [],
          devices: [],
          available_countries: [],
        })),
      ]);

      const pagination = this.apiClient.adaptPaginated(rawLogs, page, pageSize);

      return {
        ...ctx,
        pagination,
        logs: pagination.items,
        stats,
        filters: {
          date_from: query?.date_from || '',
          date_to: query?.date_to || '',
          country: query?.country || '',
          city: query?.city || '',
          visitor_hash: query?.visitor_hash || '',
          device_type: query?.device_type || '',
          search: query?.search || '',
        },
      };
    } catch (err) {
      return {
        ...ctx,
        pagination: this.apiClient.adaptPaginated([], 1, pageSize),
        logs: [],
        stats: {
          total_visits: 0,
          unique_visitors: 0,
          avg_duration_seconds: 0,
          avg_duration_display: '0s',
          top_pages: [],
          top_locations: [],
          devices: [],
          available_countries: [],
        },
        filters: {},
      };
    }
  }

  // ================= WEBSITE MANAGEMENT =================
  @Get('website/settings')
  @Render('website/settings')
  async getSettings(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Site Settings', 'website-settings');
    const raw = await this.apiClient.get<any>('/site-settings/', {}, token).catch(() => ({}));
    const siteSettings = raw?.results?.[0] || (Array.isArray(raw) ? raw[0] : raw) || {};
    return { ...ctx, siteSettings };
  }

  @Post('website/settings')
  async updateSettings(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.patch('/site-settings/1/', body, token);
      return res.redirect('/admin/website/settings?success=Global+site+settings+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/settings?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('website/navigation')
  @Render('website/navigation')
  async getNavigation(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Navigation Items', 'website-navigation');
    const raw = await this.apiClient.get<any>('/navigation/', {}, token).catch(() => []);
    const items = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, items };
  }

  @Post('website/navigation')
  async createNavigation(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const payload = {
      title: body.title,
      url: body.url,
      order: parseInt(body.order, 10) || 0,
      is_header: body.is_header === 'on' || body.is_header === 'true' || body.is_header === true,
      is_footer: body.is_footer === 'on' || body.is_footer === 'true' || body.is_footer === true,
      is_external: body.is_external === 'on' || body.is_external === 'true' || body.is_external === true,
      parent: body.parent ? parseInt(body.parent, 10) : null,
    };

    try {
      await this.apiClient.post('/navigation/', payload, token);
      return res.redirect('/admin/website/navigation?success=Navigation+item+created+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/navigation?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('website/navigation/:id/edit')
  async updateNavigation(@Param('id') id: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const payload = {
      title: body.title,
      url: body.url,
      order: parseInt(body.order, 10) || 0,
      is_header: body.is_header === 'on' || body.is_header === 'true' || body.is_header === true,
      is_footer: body.is_footer === 'on' || body.is_footer === 'true' || body.is_footer === true,
      is_external: body.is_external === 'on' || body.is_external === 'true' || body.is_external === true,
      parent: body.parent ? parseInt(body.parent, 10) : null,
    };

    try {
      await this.apiClient.patch(`/navigation/${id}/`, payload, token);
      return res.redirect('/admin/website/navigation?success=Navigation+item+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/navigation?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('website/navigation/:id/delete')
  async deleteNavigation(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/navigation/${id}/`, token);
      return res.redirect('/admin/website/navigation?success=Navigation+item+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/navigation?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('website/seo')
  @Render('website/seo')
  async getSEO(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Page SEO Metadata', 'website-seo');
    const raw = await this.apiClient.get<any>('/seo-metadata/', {}, token).catch(() => []);
    const seoList = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, seoList };
  }

  @Post('website/seo')
  async createSEO(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const payload = {
      page_identifier: body.page_identifier,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      canonical_url: body.canonical_url || `${process.env.WEBSITE_URL || 'http://localhost:7777'}/${body.page_identifier === 'home' ? '' : body.page_identifier + '/'}`,
      robots: body.robots || 'index, follow',
    };

    try {
      await this.apiClient.post('/seo-metadata/', payload, token);
      return res.redirect('/admin/website/seo?success=SEO+metadata+created+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/seo?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('website/seo/:identifier/edit')
  async updateSEO(@Param('identifier') identifier: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const payload = {
      page_identifier: body.page_identifier,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      canonical_url: body.canonical_url,
      robots: body.robots || 'index, follow',
    };

    try {
      await this.apiClient.patch(`/seo-metadata/${identifier}/`, payload, token);
      return res.redirect('/admin/website/seo?success=SEO+metadata+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/seo?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('website/seo/:identifier/delete')
  async deleteSEO(@Param('identifier') identifier: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/seo-metadata/${identifier}/`, token);
      return res.redirect('/admin/website/seo?success=SEO+metadata+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/website/seo?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= SERVICES CMS =================
  @Get('services/categories')
  @Render('services/categories')
  async getServiceCategories(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Service Categories', 'services-categories');
    const raw = await this.apiClient.get<any>('/service-categories/', {}, token).catch(() => []);
    const categories = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, categories };
  }

  @Post('services/categories')
  async createServiceCategory(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const payload = {
      name: body.name,
      slug,
      description: body.description || '',
      order: parseInt(body.order, 10) || 0,
    };

    try {
      await this.apiClient.post('/service-categories/', payload, token);
      return res.redirect('/admin/services/categories?success=Service+category+created+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/services/categories?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('services/categories/:id/edit')
  async updateServiceCategory(@Param('id') id: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const payload = {
      name: body.name,
      slug,
      description: body.description || '',
      order: parseInt(body.order, 10) || 0,
    };

    try {
      await this.apiClient.patch(`/service-categories/${id}/`, payload, token);
      return res.redirect('/admin/services/categories?success=Service+category+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/services/categories?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('services/categories/:id/delete')
  async deleteServiceCategory(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/service-categories/${id}/`, token);
      return res.redirect('/admin/services/categories?success=Service+category+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/services/categories?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('services/items')
  @Render('services/items')
  async getServices(@Req() req: Request, @Query('category') categoryFilter?: string) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Service Offerings', 'services-items');
    const params = categoryFilter ? { category: categoryFilter } : {};
    
    const [rawServices, rawCategories] = await Promise.all([
      this.apiClient.get<any>('/services/', params, token).catch(() => []),
      this.apiClient.get<any>('/service-categories/', {}, token).catch(() => []),
    ]);

    const services = rawServices?.results || (Array.isArray(rawServices) ? rawServices : []);
    const categories = rawCategories?.results || (Array.isArray(rawCategories) ? rawCategories : []);

    return { ...ctx, services, categories, categoryFilter };
  }

    @Post('services/items')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cover_image', maxCount: 1 },
    { name: 'thumbnail_image', maxCount: 1 },
  ]))
  async createService(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFiles() files: { cover_image?: Express.Multer.File[]; thumbnail_image?: Express.Multer.File[] } | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const coverImageVal = body.cover_image_url || body.cover_image || null;
    const thumbImageVal = body.thumbnail_image_url || body.thumbnail_image || null;

    const coverFile = files?.cover_image?.[0];
    const thumbFile = files?.thumbnail_image?.[0];

    if (coverFile || thumbFile) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('slug', slug);
      form.append('category', body.category);
      form.append('excerpt', body.excerpt);
      form.append('description', body.description || '');
      form.append('full_content', body.full_content || '');
      form.append('standard_code', body.standard_code || '');
      form.append('icon_svg', body.icon_svg || '');
      form.append('is_featured', String(body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true));
      form.append('order', body.order || '0');
      if (coverFile) {
        form.append('cover_image', coverFile.buffer, { filename: coverFile.originalname, contentType: coverFile.mimetype });
      } else if (coverImageVal) {
        form.append('cover_image', coverImageVal);
      }
      if (thumbFile) {
        form.append('thumbnail_image', thumbFile.buffer, { filename: thumbFile.originalname, contentType: thumbFile.mimetype });
      } else if (thumbImageVal) {
        form.append('thumbnail_image', thumbImageVal);
      }

      try {
        await this.apiClient.postMultipart('/services/', form, token);
        return res.redirect('/admin/services/items?success=Service+offering+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/services/items?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        title: body.title,
        slug,
        category: parseInt(body.category, 10),
        excerpt: body.excerpt,
        description: body.description || '',
        cover_image: coverImageVal,
        thumbnail_image: thumbImageVal,
        full_content: body.full_content || '',
        standard_code: body.standard_code || '',
        icon_svg: body.icon_svg || '',
        is_featured: body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true,
        order: parseInt(body.order, 10) || 0,
      };

      try {
        await this.apiClient.post('/services/', payload, token);
        return res.redirect('/admin/services/items?success=Service+offering+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/services/items?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('services/items/:id/edit')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cover_image', maxCount: 1 },
    { name: 'thumbnail_image', maxCount: 1 },
  ]))
  async updateService(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFiles() files: { cover_image?: Express.Multer.File[]; thumbnail_image?: Express.Multer.File[] } | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const coverImageVal = body.cover_image_url || body.cover_image;
    const thumbImageVal = body.thumbnail_image_url || body.thumbnail_image;

    const coverFile = files?.cover_image?.[0];
    const thumbFile = files?.thumbnail_image?.[0];

    if (coverFile || thumbFile) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('slug', slug);
      form.append('category', body.category);
      form.append('excerpt', body.excerpt);
      form.append('description', body.description || '');
      form.append('full_content', body.full_content || '');
      form.append('standard_code', body.standard_code || '');
      form.append('icon_svg', body.icon_svg || '');
      form.append('is_featured', String(body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true));
      form.append('order', body.order || '0');
      if (coverFile) {
        form.append('cover_image', coverFile.buffer, { filename: coverFile.originalname, contentType: coverFile.mimetype });
      } else if (coverImageVal) {
        form.append('cover_image', coverImageVal);
      }
      if (thumbFile) {
        form.append('thumbnail_image', thumbFile.buffer, { filename: thumbFile.originalname, contentType: thumbFile.mimetype });
      } else if (thumbImageVal) {
        form.append('thumbnail_image', thumbImageVal);
      }

      try {
        await this.apiClient.patchMultipart(`/services/${id}/`, form, token);
        return res.redirect('/admin/services/items?success=Service+offering+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/services/items?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        title: body.title,
        slug,
        category: parseInt(body.category, 10),
        excerpt: body.excerpt,
        description: body.description || '',
        full_content: body.full_content || '',
        standard_code: body.standard_code || '',
        icon_svg: body.icon_svg || '',
        is_featured: body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true,
        order: parseInt(body.order, 10) || 0,
      };
      if (coverImageVal !== undefined) payload.cover_image = coverImageVal;
      if (thumbImageVal !== undefined) payload.thumbnail_image = thumbImageVal;

      try {
        await this.apiClient.patch(`/services/${id}/`, payload, token);
        return res.redirect('/admin/services/items?success=Service+offering+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/services/items?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('services/items/:id/delete')
  async deleteService(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/services/${id}/`, token);
      return res.redirect('/admin/services/items?success=Service+offering+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/services/items?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('services/items/:id/toggle-featured')
  async toggleServiceFeatured(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const referer = req.header('Referer') || '/admin/services/items';
    try {
      const svc = await this.apiClient.get<any>(`/services/${id}/`, {}, token);
      const newStatus = !svc.is_featured;
      await this.apiClient.patch(`/services/${id}/`, { is_featured: newStatus }, token);
      return res.redirect(`${referer}${referer.includes('?') ? '&' : '?'}success=Service+featured+status+updated+successfully`);
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`${referer}${referer.includes('?') ? '&' : '?'}error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= CONTENT & INSIGHTS =================
  @Get('content/blogs')
  @Render('content/blogs')
  async getBlogs(@Req() req: Request, @Query('search') search?: string, @Query('category') categoryFilter?: string) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Blog Articles', 'content-blogs');
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;

    const raw = await this.apiClient.get<any>('/blog-posts/', params, token).catch(() => []);
    const blogs = raw?.results || (Array.isArray(raw) ? raw : []);

    return { ...ctx, blogs, search, categoryFilter };
  }

  @Post('content/blogs')
  @UseInterceptors(FileInterceptor('featured_image'))
  async createBlog(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const imageVal = body.featured_image_url || body.featured_image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

    if (file && file.buffer) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('slug', slug);
      form.append('category_name', body.category_name || 'General');
      form.append('publish_date', body.publish_date || new Date().toISOString().split('T')[0]);
      form.append('read_time_minutes', body.read_time_minutes || '5');
      form.append('excerpt', body.excerpt);
      form.append('content', body.content || '');
      form.append('search_keywords', body.search_keywords || '');
      if (body.external_url) form.append('external_url', body.external_url);
      form.append('is_featured', String(body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true));
      form.append('featured_image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.postMultipart('/blog-posts/', form, token);
        return res.redirect('/admin/content/blogs?success=Blog+article+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/blogs?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload = {
        title: body.title,
        slug,
        category_name: body.category_name || 'General',
        publish_date: body.publish_date || new Date().toISOString().split('T')[0],
        read_time_minutes: parseInt(body.read_time_minutes, 10) || 5,
        excerpt: body.excerpt,
        content: body.content || '',
        featured_image: imageVal,
        search_keywords: body.search_keywords || '',
        external_url: body.external_url || null,
        is_featured: body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true,
      };

      try {
        await this.apiClient.post('/blog-posts/', payload, token);
        return res.redirect('/admin/content/blogs?success=Blog+article+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/blogs?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/blogs/:id/edit')
  @UseInterceptors(FileInterceptor('featured_image'))
  async updateBlog(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const imageVal = body.featured_image_url || body.featured_image;

    if (file && file.buffer) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('slug', slug);
      form.append('category_name', body.category_name || 'General');
      form.append('publish_date', body.publish_date || new Date().toISOString().split('T')[0]);
      form.append('read_time_minutes', body.read_time_minutes || '5');
      form.append('excerpt', body.excerpt);
      form.append('content', body.content || '');
      form.append('search_keywords', body.search_keywords || '');
      if (body.external_url) form.append('external_url', body.external_url);
      form.append('is_featured', String(body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true));
      form.append('featured_image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.patchMultipart(`/blog-posts/${id}/`, form, token);
        return res.redirect('/admin/content/blogs?success=Blog+article+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/blogs?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        title: body.title,
        slug,
        category_name: body.category_name || 'General',
        publish_date: body.publish_date || new Date().toISOString().split('T')[0],
        read_time_minutes: parseInt(body.read_time_minutes, 10) || 5,
        excerpt: body.excerpt,
        content: body.content || '',
        search_keywords: body.search_keywords || '',
        external_url: body.external_url || null,
        is_featured: body.is_featured === 'on' || body.is_featured === 'true' || body.is_featured === true,
      };
      if (imageVal && !imageVal.startsWith('http://') && !imageVal.startsWith('https://') && !imageVal.startsWith('/media/')) {
        payload.featured_image = imageVal;
      }

      try {
        await this.apiClient.patch(`/blog-posts/${id}/`, payload, token);
        return res.redirect('/admin/content/blogs?success=Blog+article+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/blogs?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/blogs/:id/delete')
  async deleteBlog(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/blog-posts/${id}/`, token);
      return res.redirect('/admin/content/blogs?success=Blog+article+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/content/blogs?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('content/gallery')
  @Render('content/gallery')
  async getGallery(@Req() req: Request, @Query('tag') tagFilter?: string) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Project Gallery', 'content-gallery');
    const params = tagFilter ? { tag: tagFilter } : {};

    const raw = await this.apiClient.get<any>('/gallery/', params, token).catch(() => []);
    const gallery = raw?.results || (Array.isArray(raw) ? raw : []);

    return { ...ctx, gallery, tagFilter };
  }

  @Post('content/gallery')
  @UseInterceptors(FileInterceptor('image'))
  async createGallery(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const imageVal = body.image_url || body.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80';

    if (file && file.buffer) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('client_category', body.client_category || 'Protective Coatings');
      form.append('location_name', body.location_name || 'Technical Reference');
      form.append('service_type', body.service_type || 'Surface Preparation');
      form.append('filter_tag', body.filter_tag || 'standards');
      form.append('standard', body.standard || body.standard_code || '');
      form.append('standard_code', body.standard_code || body.standard || '');
      form.append('order', body.order !== undefined ? String(body.order) : '0');
      form.append('summary', body.summary || body.title || '');
      form.append('image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.postMultipart('/gallery/', form, token);
        return res.redirect('/admin/content/gallery?success=Gallery+item+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/gallery?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload = {
        title: body.title,
        client_category: body.client_category || 'Protective Coatings',
        location_name: body.location_name || 'Technical Reference',
        service_type: body.service_type || 'Surface Preparation',
        filter_tag: body.filter_tag || 'standards',
        standard: body.standard || body.standard_code || '',
        standard_code: body.standard_code || body.standard || '',
        order: body.order !== undefined ? (parseInt(body.order, 10) || 0) : 0,
        summary: body.summary || body.title || '',
        image: imageVal,
      };

      try {
        await this.apiClient.post('/gallery/', payload, token);
        return res.redirect('/admin/content/gallery?success=Gallery+item+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/gallery?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/gallery/:id/edit')
  @UseInterceptors(FileInterceptor('image'))
  async updateGallery(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const imageVal = body.image_url || body.image;

    if (file && file.buffer) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('client_category', body.client_category || 'Protective Coatings');
      form.append('location_name', body.location_name || 'Technical Reference');
      form.append('service_type', body.service_type || 'Surface Preparation');
      form.append('filter_tag', body.filter_tag || 'standards');
      form.append('standard', body.standard || body.standard_code || '');
      form.append('standard_code', body.standard_code || body.standard || '');
      if (body.order !== undefined) form.append('order', String(body.order));
      if (body.summary) form.append('summary', body.summary);
      form.append('image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.patchMultipart(`/gallery/${id}/`, form, token);
        return res.redirect('/admin/content/gallery?success=Gallery+item+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/gallery?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        title: body.title,
        client_category: body.client_category || 'Protective Coatings',
        location_name: body.location_name || 'Technical Reference',
        service_type: body.service_type || 'Surface Preparation',
        filter_tag: body.filter_tag || 'standards',
        standard: body.standard || body.standard_code || '',
        standard_code: body.standard_code || body.standard || '',
      };
      if (body.order !== undefined) payload.order = parseInt(body.order, 10) || 0;
      if (body.summary) payload.summary = body.summary;
      if (imageVal) payload.image = imageVal;

      try {
        await this.apiClient.patch(`/gallery/${id}/`, payload, token);
        return res.redirect('/admin/content/gallery?success=Gallery+item+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/gallery?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/gallery/:id/order')
  async updateGalleryOrder(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const orderVal = parseInt(body.order, 10) || 0;
    try {
      await this.apiClient.patch(`/gallery/${id}/`, { order: orderVal }, token);
      return res.redirect('/admin/content/gallery?success=Gallery+order+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/content/gallery?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('content/gallery/:id/delete')
  async deleteGallery(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/gallery/${id}/`, token);
      return res.redirect('/admin/content/gallery?success=Gallery+item+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/content/gallery?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('content/board')
  @Render('content/board')
  async getBoard(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Board Members', 'content-board');
    const raw = await this.apiClient.get<any>('/board-members/', {}, token).catch(() => []);
    const members = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, members };
  }

  @Post('content/board')
  @UseInterceptors(FileInterceptor('photo'))
  async createBoardMember(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const photoVal = body.photo_url || body.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';

    if (file && file.buffer) {
      const form = new FormData();
      form.append('name', body.name);
      form.append('role', body.role);
      form.append('certification', body.certification || '');
      form.append('bio', body.bio || '');
      form.append('display_order', body.display_order || '0');
      form.append('photo', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.postMultipart('/board-members/', form, token);
        return res.redirect('/admin/content/board?success=Board+member+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/board?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload = {
        name: body.name,
        role: body.role,
        certification: body.certification || '',
        bio: body.bio || '',
        photo: photoVal,
        display_order: parseInt(body.display_order, 10) || 0,
      };

      try {
        await this.apiClient.post('/board-members/', payload, token);
        return res.redirect('/admin/content/board?success=Board+member+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/board?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/board/:id/edit')
  @UseInterceptors(FileInterceptor('photo'))
  async updateBoardMember(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const photoVal = body.photo_url || body.photo;

    if (file && file.buffer) {
      const form = new FormData();
      form.append('name', body.name);
      form.append('role', body.role);
      form.append('certification', body.certification || '');
      form.append('bio', body.bio || '');
      form.append('display_order', body.display_order || '0');
      form.append('photo', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.patchMultipart(`/board-members/${id}/`, form, token);
        return res.redirect('/admin/content/board?success=Board+member+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/board?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        name: body.name,
        role: body.role,
        certification: body.certification || '',
        bio: body.bio || '',
        display_order: parseInt(body.display_order, 10) || 0,
      };
      if (photoVal) payload.photo = photoVal;

      try {
        await this.apiClient.patch(`/board-members/${id}/`, payload, token);
        return res.redirect('/admin/content/board?success=Board+member+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/board?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/board/:id/delete')
  async deleteBoardMember(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/board-members/${id}/`, token);
      return res.redirect('/admin/content/board?success=Board+member+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/content/board?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= EDUCATION TIMELINE =================
  @Get('content/education')
  @Render('content/education')
  async getEducation(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Education Timeline', 'content-education');
    const raw = await this.apiClient.get<any>('/education/', {}, token).catch(() => []);
    const items = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, items };
  }

  @Post('content/education')
  @UseInterceptors(FileInterceptor('certificate_image'))
  async createEducationItem(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const imgVal = body.certificate_image_url || body.certificate_image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

    if (file && file.buffer) {
      const form = new FormData();
      form.append('program_title', body.program_title);
      form.append('institution', body.institution);
      form.append('period_date', body.period_date || '');
      form.append('description', body.description || '');
      form.append('img_key', body.img_key || '');
      form.append('order', body.order || '0');
      form.append('certificate_image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.postMultipart('/education/', form, token);
        return res.redirect('/admin/content/education?success=Education+item+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/education?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload = {
        program_title: body.program_title,
        institution: body.institution,
        period_date: body.period_date || '',
        description: body.description || '',
        img_key: body.img_key || '',
        certificate_image: imgVal,
        order: parseInt(body.order, 10) || 0,
      };

      try {
        await this.apiClient.post('/education/', payload, token);
        return res.redirect('/admin/content/education?success=Education+item+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/education?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/education/:id/edit')
  @UseInterceptors(FileInterceptor('certificate_image'))
  async updateEducationItem(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const imgVal = body.certificate_image_url || body.certificate_image;

    if (file && file.buffer) {
      const form = new FormData();
      form.append('program_title', body.program_title);
      form.append('institution', body.institution);
      form.append('period_date', body.period_date || '');
      form.append('description', body.description || '');
      form.append('img_key', body.img_key || '');
      form.append('order', body.order || '0');
      form.append('certificate_image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.patchMultipart(`/education/${id}/`, form, token);
        return res.redirect('/admin/content/education?success=Education+item+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/education?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        program_title: body.program_title,
        institution: body.institution,
        period_date: body.period_date || '',
        description: body.description || '',
        img_key: body.img_key || '',
        order: parseInt(body.order, 10) || 0,
      };
      if (imgVal && !imgVal.startsWith('http://') && !imgVal.startsWith('https://') && !imgVal.startsWith('/media/')) {
        payload.certificate_image = imgVal;
      }

      try {
        await this.apiClient.patch(`/education/${id}/`, payload, token);
        return res.redirect('/admin/content/education?success=Education+item+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/education?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/education/:id/delete')
  async deleteEducationItem(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/education/${id}/`, token);
      return res.redirect('/admin/content/education?success=Education+item+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/content/education?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= CERTIFICATIONS GALLERY =================
  @Get('content/certifications')
  @Render('content/certifications')
  async getCertifications(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Certifications Gallery', 'content-certifications');
    const raw = await this.apiClient.get<any>('/certifications/', {}, token).catch(() => []);
    const items = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, items };
  }

  @Post('content/certifications')
  @UseInterceptors(FileInterceptor('certificate_image'))
  async createCertificationItem(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const imgVal = body.certificate_image_url || body.certificate_image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80';

    if (file && file.buffer) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('issuing_org', body.issuing_org);
      form.append('category_badge', body.category_badge || '');
      form.append('validity_date', body.validity_date || '');
      form.append('description', body.description || '');
      form.append('img_key', body.img_key || '');
      form.append('order', body.order || '0');
      form.append('certificate_image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.postMultipart('/certifications/', form, token);
        return res.redirect('/admin/content/certifications?success=Certification+item+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/certifications?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload = {
        title: body.title,
        issuing_org: body.issuing_org,
        category_badge: body.category_badge || '',
        validity_date: body.validity_date || '',
        description: body.description || '',
        img_key: body.img_key || '',
        certificate_image: imgVal,
        order: parseInt(body.order, 10) || 0,
      };

      try {
        await this.apiClient.post('/certifications/', payload, token);
        return res.redirect('/admin/content/certifications?success=Certification+item+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/certifications?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/certifications/:id/edit')
  @UseInterceptors(FileInterceptor('certificate_image'))
  async updateCertificationItem(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const imgVal = body.certificate_image_url || body.certificate_image;

    if (file && file.buffer) {
      const form = new FormData();
      form.append('title', body.title);
      form.append('issuing_org', body.issuing_org);
      form.append('category_badge', body.category_badge || '');
      form.append('validity_date', body.validity_date || '');
      form.append('description', body.description || '');
      form.append('img_key', body.img_key || '');
      form.append('order', body.order || '0');
      form.append('certificate_image', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.patchMultipart(`/certifications/${id}/`, form, token);
        return res.redirect('/admin/content/certifications?success=Certification+item+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/certifications?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        title: body.title,
        issuing_org: body.issuing_org,
        category_badge: body.category_badge || '',
        validity_date: body.validity_date || '',
        description: body.description || '',
        img_key: body.img_key || '',
        order: parseInt(body.order, 10) || 0,
      };
      if (imgVal && !imgVal.startsWith('http://') && !imgVal.startsWith('https://') && !imgVal.startsWith('/media/')) {
        payload.certificate_image = imgVal;
      }

      try {
        await this.apiClient.patch(`/certifications/${id}/`, payload, token);
        return res.redirect('/admin/content/certifications?success=Certification+item+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/content/certifications?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('content/certifications/:id/delete')
  async deleteCertificationItem(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/certifications/${id}/`, token);
      return res.redirect('/admin/content/certifications?success=Certification+item+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/content/certifications?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= STANDARDS & INDUSTRIES =================
  @Get('standards')
  @Render('standards/index')
  async getStandards(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Technical Standards', 'standards');
    const raw = await this.apiClient.get<any>('/standards/', {}, token).catch(() => []);
    const standards = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, standards };
  }

  @Post('standards')
  @UseInterceptors(FileInterceptor('badge_icon'))
  async createStandard(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const badgeVal = body.badge_icon_url || body.badge_icon || '';

    if (file && file.buffer) {
      const form = new FormData();
      form.append('name', body.name);
      form.append('code', body.code);
      form.append('description', body.description || '');
      form.append('order', body.order || '0');
      form.append('badge_icon', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.postMultipart('/standards/', form, token);
        return res.redirect('/admin/standards?success=Technical+standard+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/standards?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload = {
        name: body.name,
        code: body.code,
        description: body.description || '',
        badge_icon: badgeVal,
        order: parseInt(body.order, 10) || 0,
      };

      try {
        await this.apiClient.post('/standards/', payload, token);
        return res.redirect('/admin/standards?success=Technical+standard+created+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/standards?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('standards/:id/edit')
  @UseInterceptors(FileInterceptor('badge_icon'))
  async updateStandard(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res() res: Response,
  ) {
    const token = req.cookies?.admin_token;
    const badgeVal = body.badge_icon_url || body.badge_icon;

    if (file && file.buffer) {
      const form = new FormData();
      form.append('name', body.name);
      form.append('code', body.code);
      form.append('description', body.description || '');
      form.append('order', body.order || '0');
      form.append('badge_icon', file.buffer, { filename: file.originalname, contentType: file.mimetype });

      try {
        await this.apiClient.patchMultipart(`/standards/${id}/`, form, token);
        return res.redirect('/admin/standards?success=Technical+standard+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/standards?error=${encodeURIComponent(formatted.message)}`);
      }
    } else {
      const payload: Record<string, any> = {
        name: body.name,
        code: body.code,
        description: body.description || '',
        order: parseInt(body.order, 10) || 0,
      };
      if (badgeVal) payload.badge_icon = badgeVal;

      try {
        await this.apiClient.patch(`/standards/${id}/`, payload, token);
        return res.redirect('/admin/standards?success=Technical+standard+updated+successfully');
      } catch (err: any) {
        const formatted = this.apiClient.formatApiError(err);
        return res.redirect(`/admin/standards?error=${encodeURIComponent(formatted.message)}`);
      }
    }
  }

  @Post('standards/:id/delete')
  async deleteStandard(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/standards/${id}/`, token);
      return res.redirect('/admin/standards?success=Technical+standard+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/standards?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('industries')
  @Render('industries/index')
  async getIndustries(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Industry Sectors', 'industries');
    const raw = await this.apiClient.get<any>('/industries/', {}, token).catch(() => []);
    const industries = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, industries };
  }

  @Post('industries')
  async createIndustry(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const payload = {
      name: body.name,
      slug,
      icon_svg: body.icon_svg || 'icon-factory',
      order: parseInt(body.order, 10) || 0,
    };

    try {
      await this.apiClient.post('/industries/', payload, token);
      return res.redirect('/admin/industries?success=Industry+sector+created+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/industries?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('industries/:id/edit')
  async updateIndustry(@Param('id') id: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const slug = body.slug || body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const payload = {
      name: body.name,
      slug,
      icon_svg: body.icon_svg || 'icon-factory',
      order: parseInt(body.order, 10) || 0,
    };

    try {
      await this.apiClient.patch(`/industries/${id}/`, payload, token);
      return res.redirect('/admin/industries?success=Industry+sector+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/industries?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('industries/:id/delete')
  async deleteIndustry(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/industries/${id}/`, token);
      return res.redirect('/admin/industries?success=Industry+sector+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/industries?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= MARKETING & CLIENTS =================
  @Get('marketing/testimonials')
  @Render('marketing/testimonials')
  async getTestimonials(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Client Testimonials', 'marketing-testimonials');
    const raw = await this.apiClient.get<any>('/testimonials/', {}, token).catch(() => []);
    const testimonials = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, testimonials };
  }

  @Post('marketing/testimonials')
  async createTestimonial(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const payload = {
      client_name: body.client_name,
      client_role: body.client_role || 'Asset Owner',
      company_name: body.company_name || 'Industrial Client',
      testimonial_text: body.testimonial_text,
      rating: parseInt(body.rating, 10) || 5,
      order: parseInt(body.order, 10) || 0,
    };

    try {
      await this.apiClient.post('/testimonials/', payload, token);
      return res.redirect('/admin/marketing/testimonials?success=Client+testimonial+created+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/marketing/testimonials?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('marketing/testimonials/:id/edit')
  async updateTestimonial(@Param('id') id: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const payload = {
      client_name: body.client_name,
      client_role: body.client_role || 'Asset Owner',
      company_name: body.company_name || 'Industrial Client',
      testimonial_text: body.testimonial_text,
      rating: parseInt(body.rating, 10) || 5,
      order: parseInt(body.order, 10) || 0,
    };

    try {
      await this.apiClient.patch(`/testimonials/${id}/`, payload, token);
      return res.redirect('/admin/marketing/testimonials?success=Client+testimonial+updated+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/marketing/testimonials?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Post('marketing/testimonials/:id/delete')
  async deleteTestimonial(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/testimonials/${id}/`, token);
      return res.redirect('/admin/marketing/testimonials?success=Client+testimonial+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/marketing/testimonials?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  @Get('marketing/enquiries')
  @Render('marketing/enquiries')
  async getEnquiries(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Contact Submissions', 'marketing-enquiries');
    const raw = await this.apiClient.get<any>('/contact-submissions/', {}, token).catch(() => []);
    const enquiries = raw?.results || (Array.isArray(raw) ? raw : []);
    return { ...ctx, enquiries };
  }

  @Post('marketing/enquiries/:id/delete')
  async deleteEnquiry(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/contact-submissions/${id}/`, token);
      return res.redirect('/admin/marketing/enquiries?success=Contact+submission+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/marketing/enquiries?error=${encodeURIComponent(formatted.message)}`);
    }
  }

  // ================= CALCULATOR USERS & PROFILES =================
  @Get('users')
  @Render('users/index')
  async getUsers(@Req() req: Request) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'Registered Users & Profiles', 'calculator-users');
    const page = parseInt(req.query?.page as string, 10) || 1;
    const query = (req.query?.q as string) || '';
    const provider = (req.query?.provider as string) || '';

    try {
      const raw = await this.apiClient.get<any>(
        '/users/',
        { page, search: query, provider: provider || undefined },
        token
      );
      const pagination = this.apiClient.adaptPaginated<any>(raw, page);

      return {
        ...ctx,
        users: pagination.items,
        pagination,
        searchQuery: query,
        selectedProvider: provider,
        totalUsers: pagination.count,
      };
    } catch (err: any) {
      return {
        ...ctx,
        users: [],
        pagination: this.apiClient.adaptPaginated([], 1),
        searchQuery: query,
        selectedProvider: provider,
        totalUsers: 0,
      };
    }
  }

  @Get('users/:id')
  async getUserDetail(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const ctx = this.getAdminContext(req, 'User Profile Details', 'calculator-users');

    try {
      const userItem = await this.apiClient.get<any>(`/users/${id}/`, {}, token);
      return res.render('users/detail', {
        ...ctx,
        userItem,
      });
    } catch (err: any) {
      return res.redirect('/admin/users?error=User+profile+not+found');
    }
  }

  @Post('users/:id/toggle-pro')
  async toggleUserPro(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    const referer = req.header('Referer') || `/admin/users/${id}`;
    try {
      await this.apiClient.post<any>(`/users/${id}/toggle-pro/`, {}, token);
      return res.redirect(referer);
    } catch (err: any) {
      return res.redirect(`${referer}${referer.includes('?') ? '&' : '?'}error=Failed+to+update+Pro+status`);
    }
  }

  @Post('users/:id/delete')
  async deleteUser(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.admin_token;
    try {
      await this.apiClient.delete(`/users/${id}/`, token);
      return res.redirect('/admin/users?success=User+account+deleted+successfully');
    } catch (err: any) {
      const formatted = this.apiClient.formatApiError(err);
      return res.redirect(`/admin/users?error=${encodeURIComponent(formatted.message || 'Failed to delete user account')}`);
    }
  }
}
