# Technical Specification: Dynamic Media Uploads & Service Detail Content Expansion

## 🎯 Executive Summary

This specification outlines the architecture and execution plan to upgrade the **BG Coating CMS System** across two major capabilities:

1. **Dynamic Media File Upload Architecture**: Replace hardcoded URL/Base64 strings with direct file uploads (`multipart/form-data`) across all content models (`BlogPost`, `ProjectGallery`, `BoardMember`, `TechnicalStandard`, `Service`).
2. **Service Detail Content Expansion**: Add a rich technical content field (`full_content`) and cover image to `Service` model to power dedicated `/services/<slug>/` exploration pages.

---

## 🏗️ 1. Dynamic Media File Upload Architecture

### 1.1 Current Limitation
Previously, image fields in admin forms accepted static URL strings (e.g. Unsplash placeholders). This requires users to manually host images externally before entering URLs in the admin panel.

### 1.2 Target File Upload Pipeline
```
[ Admin UI Modal File Input ] 
       │ (multipart/form-data upload)
       ▼
[ NestJS Admin Controller Handler ] 
       │ (Multer / Form-Data Stream Proxy)
       ▼
[ NestJS ApiClientService.postMultipart() / patchMultipart() ]
       │ (HTTP POST with Boundary)
       ▼
[ Django DRF API Endpoint ] (/api/v1/...)
       │ (ImageField validation)
       ▼
[ Local Media Storage / Cloud Bucket ] (/media/uploads/...)
```

### 1.3 Django Backend Configuration
1. **Settings Configuration** (`bgcoating/settings.py`):
   ```python
   MEDIA_URL = '/media/'
   MEDIA_ROOT = BASE_DIR / 'media'
   ```
2. **Static/Media URL Routing** (`bgcoating/urls.py`):
   ```python
   from django.conf import settings
   from django.conf.urls.static import static

   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   ```
3. **DRF Serializers**:
   - Serializers using `serializers.ImageField()` automatically format return URLs as relative or absolute media paths (e.g. `/media/blog/coating_prep.png`).

### 1.4 NestJS Admin API Client & Controllers
1. **Multer File Interceptors**:
   Use `@UseInterceptors(FileInterceptor('image'))` in NestJS controller routes (`POST /admin/content/blogs`, `POST /admin/content/gallery`, `POST /admin/services/items`, etc.).
2. **Multipart Proxy Wrapper** (`src/api/api-client.service.ts`):
   Implement `postMultipart` and `patchMultipart` using `form-data` package to stream upload buffers directly to Django REST Framework.

### 1.5 Admin UI Dropzone Component (`views/partials/file_uploader.hbs`)
- Reusable drag-and-drop file uploader component with instant browser image preview (`FileReader` API) and fallback URL paste box.

---

## 🔬 2. Service Detail Page Content Expansion

### 2.1 Django Model Schema Update (`website/models.py`)
To enable full technical exploration of individual services (e.g., *Abrasive Blasting*, *Tank Lining Inspection*, *Passive Fire Protection*), the `Service` model is updated as follows:

```python
class Service(models.Model):
    """Detailed Industrial Coating Service offering."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    excerpt = models.TextField(help_text="Short card summary")
    description = models.TextField(blank=True, help_text="Overview summary")
    
    # NEW EXPANSION FIELDS FOR EXPLORING SERVICE
    cover_image = models.ImageField(upload_to='services/', blank=True, null=True, help_text="Main hero background image")
    full_content = models.TextField(blank=True, help_text="Rich HTML content body for service exploration page (CKEditor)")
    specification_sheet = models.FileField(upload_to='services/specs/', blank=True, null=True, help_text="Optional downloadable PDF standard spec")
    
    standard_code = models.CharField(max_length=100, blank=True, help_text="Associated standard, e.g. ISO 12944, NACE, AMPP")
    icon_svg = models.TextField(blank=True, help_text="Inline SVG or icon CSS class")
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
```

### 2.2 Django Migration Command
```bash
py manage.py makemigrations website
py manage.py migrate website
```

### 2.3 DRF Serializer & View Updates (`website/serializers.py` & `website/api_views.py`)
- Include `cover_image`, `full_content`, and `specification_sheet` in `ServiceSerializer`.

### 2.4 Service Exploration Page (`/services/<slug>/`)
- **Django View Route**: `ServiceDetailView` in `website/views.py` matching `path('services/<slug:slug>/', views.service_detail, name='service_detail')`.
- **Frontend Template** (`website/templates/website/service_detail.html`):
  - Hero banner with `cover_image`, Service Title, Category badge, and Standard Code badge.
  - Interactive Tab Navigation (*Overview*, *Technical Specifications*, *Applicable Standards*, *Case Studies*).
  - Main HTML content body rendering `full_content` formatted with CKEditor typography.
  - Downloadable Technical Data Sheet button (`specification_sheet`).
  - Contact Inquiry Form drawer pre-filled with this service title.

---

## 📋 3. Step-by-Step Implementation Roadmap

### Phase A: Django Media & Model Migration
- [x] Add `cover_image`, `full_content`, `specification_sheet` to `Service` model in `website/models.py`.
- [x] Configure `MEDIA_ROOT` and `MEDIA_URL` in `bgcoating/settings.py`.
- [x] Run `py manage.py makemigrations` and `py manage.py migrate`.
- [x] Update `ServiceSerializer` in `website/serializers.py`.

### Phase B: NestJS Multipart Upload Engine
- [ ] Install `multer`, `@types/multer`, and `form-data` packages in `admin-panel/package.json`.
- [ ] Add `postMultipart` and `patchMultipart` methods to `ApiClientService`.
- [ ] Add `@UseInterceptors(FileInterceptor('image'))` to controller endpoints.

### Phase C: Admin Panel UI Uploader & CKEditor Expansion
- [x] Add `cover_image` field & `full_content` CKEditor 5 Rich Text Editor (`.rich-text-editor`) to `views/services/items.hbs`.
- [x] Update `createService` and `updateService` payload handlers in `AdminController`.
- [ ] Update `views/content/blogs.hbs`, `views/content/gallery.hbs`, and `views/content/board.hbs` with File Uploader controls.

### Phase D: Website Service Detail Exploration Page
- [x] Create `templates/pages/service_detail.html` template.
- [x] Add route `path('services/<slug:slug>/', views.service_detail, name='service_detail')` in `website/urls.py`.
- [x] Add view handler `service_detail` in `website/views.py`.
- [x] Connect "Explore Service ↗" live preview buttons to `{{websiteUrl}}/services/{{this.slug}}/`.

---

## 🎨 4. Data Models Media Summary Matrix

| Django Model | Image/File Field | Storage Directory | Admin Modal Control | Target Page Location |
| :--- | :--- | :--- | :--- | :--- |
| **`Service`** | `cover_image`<br>`specification_sheet` | `media/services/`<br>`media/services/specs/` | File Dropzone + CKEditor `full_content` | Service Exploration (`/services/<slug>/`) |
| **`BlogPost`** | `featured_image` | `media/blog/` | File Dropzone + Image URL fallback | Blog Detail (`/blog/<slug>/`) |
| **`ProjectGallery`** | `image` | `media/gallery/` | File Dropzone + Preset selector | Gallery Grid (`/gallery/`) |
| **`BoardMember`** | `photo` | `media/board/` | File Dropzone + Portrait selector | Board Leadership (`/about/`) |
| **`TechnicalStandard`** | `badge_icon` | `media/standards/` | File Dropzone | Standards Page (`/standards/`) |
