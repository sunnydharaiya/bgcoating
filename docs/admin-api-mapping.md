# DRF API Mapping & Admin Panel Specification

## 1. Executive Summary

This document establishes the official **API Mapping and System Specification** for the NestJS Dynamic CMS Admin Panel.

The NestJS Admin Application acts as a separate, mobile-friendly management frontend. The existing **Django REST Framework (DRF)** application (`bgcoating`) is the authoritative source of truth. NestJS communicates with Django exclusively via HTTP/REST APIs. No direct database connection to SQLite/PostgreSQL is permitted.

---

## 2. DRF Backend Capability & Security Audit

### 2.1 Current DRF Configuration (`bgcoating_config/settings.py` & `website/api_views.py`)
- **API Base URL**: `http://localhost:7777/api/v1/`
- **Pagination Format**: `rest_framework.pagination.PageNumberPagination` (Page size = 20)
  ```json
  {
    "count": 12,
    "next": "http://localhost:7777/api/v1/services/?page=2",
    "previous": null,
    "results": [...]
  }
  ```
- **Current Permissions**: `AllowAny` (Public read-only endpoints).
- **Current ViewSet Access**:
  - `SiteSettingsViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail)
  - `PageSEOViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail, filter by `page_identifier`)
  - `NavigationItemViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail, filter by `section`)
  - `ServiceCategoryViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail by `slug`)
  - `ServiceViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail by `slug`, filter by `category`, `featured`)
  - `BlogPostViewSet`: `ReadOnlyModelViewSet` (GET list with `BlogPostListSerializer`, GET detail by `slug` with `BlogPostDetailSerializer`, filter by `category`, `featured`, `search`)
  - `ProjectGalleryViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail, filter by `tag`)
  - `BoardMemberViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail)
  - `ClientTestimonialViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail)
  - `TechnicalStandardViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail)
  - `IndustryViewSet`: `ReadOnlyModelViewSet` (GET list, GET detail by `slug`)
  - `ContactSubmissionViewSet`: `mixins.CreateModelMixin`, `mixins.ListModelMixin` (POST create, GET list)

### 2.2 Backend Capabilities Needed for Full Administrative CRUD:
To enable write operations (Create, Edit, Delete, Media Upload, Authentication) from the NestJS Admin panel, the Django backend will require standard DRF ViewSet updates:
1. Change `ReadOnlyModelViewSet` → `viewsets.ModelViewSet` for admin-managed models (`SiteSettings`, `PageSEO`, `NavigationItem`, `ServiceCategory`, `Service`, `BlogPost`, `ProjectGallery`, `BoardMember`, `ClientTestimonial`, `TechnicalStandard`, `Industry`).
2. Register DRF Token or Session Authentication endpoint (`/api/v1/auth/login/` and `/api/v1/auth/logout/`).
3. Apply `IsAdminUser` / `IsAuthenticated` permission classes on mutating HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`).

---

## 3. Comprehensive DRF API Mapping

Below is the complete mapping of all 12 backend entities:

| Entity / Model | Endpoint Path | Supported GET | Write Endpoint (POST/PATCH/DELETE) | Query Parameters / Filters | Serializer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Site Settings** | `/api/v1/site-settings/` | `GET /` (Singleton) | `PATCH /1/` | N/A | `SiteSettingsSerializer` |
| **Page SEO** | `/api/v1/seo-metadata/` | `GET /`, `GET /{page_identifier}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | `?page={identifier}` | `PageSEOSerializer` |
| **Navigation** | `/api/v1/navigation/` | `GET /`, `GET /{id}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | `?section=header\|footer` | `NavigationItemSerializer` |
| **Service Categories** | `/api/v1/service-categories/` | `GET /`, `GET /{slug}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | N/A | `ServiceCategorySerializer` |
| **Service Offerings** | `/api/v1/services/` | `GET /`, `GET /{slug}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | `?category={slug}`, `?featured=true` | `ServiceSerializer` |
| **Blog Articles** | `/api/v1/blog-posts/` | `GET /`, `GET /{slug}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | `?category={cat}`, `?search={q}`, `?featured=true` | `BlogPostListSerializer`, `BlogPostDetailSerializer` |
| **Project Gallery** | `/api/v1/gallery/` | `GET /`, `GET /{id}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | `?tag={tag}` | `ProjectGallerySerializer` |
| **Board Members** | `/api/v1/board-members/` | `GET /`, `GET /{id}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | N/A | `BoardMemberSerializer` |
| **Client Testimonials** | `/api/v1/testimonials/` | `GET /`, `GET /{id}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | N/A | `ClientTestimonialSerializer` |
| **Technical Standards** | `/api/v1/standards/` | `GET /`, `GET /{id}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | N/A | `TechnicalStandardSerializer` |
| **Industry Sectors** | `/api/v1/industries/` | `GET /`, `GET /{slug}/` | `POST /`, `PATCH /{id}/`, `DELETE /{id}/` | N/A | `IndustrySerializer` |
| **Contact Submissions** | `/api/v1/contact-submissions/`| `GET /`, `GET /{id}/` | `POST /` (Public submission) | N/A | `ContactSubmissionSerializer` |

---

## 4. Proposed NestJS Admin Navigation & Menu Architecture

The NestJS Admin UI will render a multi-level hierarchical menu based on discovered domain models:

```text
Dashboard (/admin/dashboard)

Website Management
├── Site Settings (/admin/website/settings)
├── Navigation Items (/admin/website/navigation)
├── Page SEO Metadata (/admin/website/seo)
└── Media & Uploads (/admin/website/media)

Services & Offerings
├── Categories (/admin/services/categories)
└── Service Items (/admin/services/items)

Content & Insights
├── Blog Articles (/admin/content/blogs)
├── Board Members (/admin/content/board)
└── Project Gallery (/admin/content/gallery)

Standards & Industries
├── Technical Standards (/admin/standards)
└── Industry Sectors (/admin/industries)

Marketing & Clients
├── Client Testimonials (/admin/marketing/testimonials)
└── Contact Submissions (/admin/marketing/enquiries)

System
├── Profile (/admin/system/profile)
└── Logout (/auth/logout)
```

---

## 5. Phase-Wise Development Plan

- **Phase 0 — Project Audit & API Mapping Specification** (*Completed*)
- **Phase 1 — NestJS Admin Application Foundation**
  - Setup NestJS project structure, Tailwind CSS, TypeScript configurations, environment variables (`DJANGO_API_BASE_URL`, `ADMIN_APP_URL`, `WEBSITE_URL`).
  - Base UI layout (Header, Sidebar drawer, Breadcrumbs, Responsive Grid).
- **Phase 2 — Authentication & Protection**
  - Implement `/login`, token/session storage, Route Guards (`AuthGuard`), 401 interceptors, and logout flow.
- **Phase 3 — Reusable Admin Shell & Navigation Drawer**
  - Build responsive sidebar, mobile drawer, user dropdown, and active menu state handlers.
- **Phase 4 — Centralized API Client & Reusable Data Components**
  - Implement Axios/Fetch HTTP wrapper with DRF pagination adapters, toast alerts, confirmation modals, loading/empty states.
- **Phase 5 — Site Settings & Navigation CRUD**
  - Build screens for `SiteSettings` singleton form and `NavigationItem` tree table.
- **Phase 6 — Page SEO Management**
  - Build CRUD for `PageSEO` with title/meta character counters and preview badge.
- **Phase 7 — Services & Service Categories CMS**
  - Build full CRUD for `ServiceCategory` and `Service` (with icon selector, standard code, featured toggle).
- **Phase 8 — Rich Text & CKEditor Integration**
  - Integrate CKEditor 5 for HTML content fields (`BlogPost.content`, `Service.description`).
- **Phase 9 — Blog Article CMS**
  - Build Blog list, search/filter toolbar, create/edit form, image upload, publish status, and live website preview link.
- **Phase 10 — Project Gallery & Visual Standards CMS**
  - Build masonry/grid gallery CRUD, image uploader, tag filter, and standard code assignment.
- **Phase 11 — Board Members & Testimonials CMS**
  - Build CRUD for `BoardMember` and `ClientTestimonial` with drag/display order controls.
- **Phase 12 — Standards, Industries & Enquiries Management**
  - Build read-only submission table for `ContactSubmission` and CRUD for `TechnicalStandard` & `Industry`.
- **Phase 13 — Preview System & Verification Handoff**
  - Add "Save & Preview" and "View Live" buttons pointing to target website URLs (`/blog/<slug>/`, `/services/<slug>/`, etc.).
