import json
from django.shortcuts import render, get_object_or_404
from .models import (
    PageSEO,
    ServiceCategory,
    Service,
    BlogPost,
    ProjectGallery,
    BoardMember,
    EducationItem,
    CertificationItem,
    ClientTestimonial,
    Industry,
    ContactSubmission,
)
from .serializers import ProjectGallerySerializer


def _get_page_seo(request, page_id, default_title, default_desc):
    """Helper to fetch PageSEO from DB or return fallback defaults dynamically based on current host."""
    seo_obj = PageSEO.objects.filter(page_identifier=page_id).first()
    canonical_url = request.build_absolute_uri(request.path)
    if seo_obj:
        return {
            'page_title': seo_obj.meta_title,
            'page_desc': seo_obj.meta_description,
            'page_canonical': canonical_url,
            'page_seo': seo_obj,
            'current_page': page_id,
        }
    return {
        'page_title': default_title,
        'page_desc': default_desc,
        'page_canonical': canonical_url,
        'current_page': page_id,
    }


def home(request):
    context = _get_page_seo(
        request,
        'home',
        'BG GROUP Of Paint & Coatings Consultant | Industrial Coating Experts',
        'Protective coatings, surface preparation, corrosion assessment & NACE/AMPP-aligned coating inspection for refinery, oil & gas, petrochemical and industrial assets. BG Group, Surat, India.',
    )
    context.update({
        'featured_services': Service.objects.filter(is_featured=True).select_related('category')[:6],
        'testimonials': ClientTestimonial.objects.all()[:6],
        'latest_blogs': BlogPost.objects.all()[:3],
    })
    return render(request, 'pages/index.html', context)


def about(request):
    context = _get_page_seo(
        request,
        'about',
        'About BG Group | Industrial Coating & Corrosion Experts',
        'Discover BG Group — 22+ years of surface engineering, NACE/AMPP-aligned coating consultancy, inspection and asset preservation.',
    )
    context.update({
        'board_members': BoardMember.objects.all(),
        'industries': Industry.objects.all(),
    })
    return render(request, 'pages/about.html', context)


def services(request):
    context = _get_page_seo(
        request,
        'services',
        'Services | BG Group Of Paint & Coatings Consultant',
        'Comprehensive coating consultancy, surface preparation, paint inspection, third-party audit, and technical training.',
    )
    context.update({
        'categories': ServiceCategory.objects.prefetch_related('services').all(),
    })
    return render(request, 'pages/services.html', context)


def blog(request):
    context = _get_page_seo(
        request,
        'blog',
        'Technical Insights & Blog | BG Group',
        'Read technical articles, surface preparation guides, abrasive profile benchmarks, and industrial coating best practices by BG Group.',
    )
    featured_article = BlogPost.objects.filter(is_featured=True).first()
    if not featured_article:
        featured_article = BlogPost.objects.first()

    context.update({
        'featured_article': featured_article,
        'blog_posts': BlogPost.objects.all(),
    })
    return render(request, 'pages/blog.html', context)


def gallery(request):
    context = _get_page_seo(
        request,
        'gallery',
        'Project Gallery | BG Group',
        'View our past surface preparation, industrial painting, inspection and technical audit projects.',
    )
    gallery_qs = ProjectGallery.objects.all()
    serialized_gallery = ProjectGallerySerializer(gallery_qs, many=True).data

    context.update({
        'gallery_items': gallery_qs,
        'gallery_json': json.dumps(serialized_gallery),
    })
    return render(request, 'pages/gallery.html', context)


def contact(request):
    context = _get_page_seo(
        request,
        'contact',
        'Contact Us | BG Group Of Paint & Coatings Consultant',
        'Get in touch with NACE/AMPP certified experts for surface treatment, coating inspection, and corrosion consultation.',
    )
    if request.method == 'POST':
        full_name = request.POST.get('full_name') or request.POST.get('f_name')
        company = request.POST.get('company') or request.POST.get('f_company') or ''
        email = request.POST.get('email') or request.POST.get('f_email')
        phone = request.POST.get('phone') or request.POST.get('f_phone')
        service = request.POST.get('service') or request.POST.get('f_service') or 'General Consultation'
        message = request.POST.get('message') or request.POST.get('f_msg') or ''

        if full_name and email and phone:
            ContactSubmission.objects.create(
                full_name=full_name,
                company=company,
                email=email,
                phone=phone,
                service_of_interest=service,
                message=message
            )
            context['success_message'] = "Thank you! Your enquiry has been received. Our technical team will reach out shortly."

    context.update({
        'industries': Industry.objects.all(),
        'services': Service.objects.all(),
    })
    return render(request, 'pages/contact.html', context)


def board(request):
    context = _get_page_seo(
        request,
        'board',
        'Technical Board & Leadership Team | BG Group',
        'Meet the leadership and technical board of BG Group of Paint & Coating Consultant — NACE/AMPP certified experts.',
    )
    context.update({
        'board_members': BoardMember.objects.all(),
        'education_items': EducationItem.objects.all(),
        'certification_items': CertificationItem.objects.all(),
    })
    return render(request, 'pages/board.html', context)


def calculator(request):
    return calculator_dashboard(request)


def calculator_dashboard(request):
    context = _get_page_seo(
        request,
        'calculator',
        'Home | BG CoatingOS™',
        'BG CoatingOS™ — the digital workspace for surface treatment, protective coating & corrosion engineering.',
    )
    return render(request, 'pages/calculator/dashboard.html', context)


def calculator_suite(request):
    context = _get_page_seo(
        request,
        'calculator',
        'Coating Calculator | BG CoatingOS™',
        'Interactive paint & coating surface area and quantity calculation suite.',
    )
    return render(request, 'pages/calculator/coating_calculator.html', context)


def calculator_specification_reading(request):
    context = _get_page_seo(
        request,
        'calculator',
        'Coating Specification Reading | BG CoatingOS™',
        'Coating Specification Reading — Paint & Coating Specification Engine.',
    )
    return render(request, 'pages/calculator/specification_reading.html', context)


def calculator_knowledge(request):
    context = _get_page_seo(
        request,
        'calculator',
        'Knowledge Base | BG CoatingOS™',
        'BG CoatingOS™ Knowledge Base & Coating Standards Reference.',
    )
    return render(request, 'pages/calculator/knowledge.html', context)


def calculator_support(request):
    context = _get_page_seo(
        request,
        'calculator',
        'Support | BG CoatingOS™',
        'BG CoatingOS™ Help & FAQ Support Workspace.',
    )
    return render(request, 'pages/calculator/support.html', context)


def calculator_settings(request):
    context = _get_page_seo(
        request,
        'calculator',
        'Profile & Settings | BG CoatingOS™',
        'BG CoatingOS™ Profile & User Preferences Settings.',
    )
    return render(request, 'pages/calculator/settings.html', context)


def board_frame(request):
    return render(request, 'pages/board_frame.html')


def service_detail(request, slug):
    service = get_object_or_404(Service.objects.select_related('category'), slug=slug)
    context = _get_page_seo(
        request,
        'services',
        f'{service.title} | BG Group',
        service.excerpt or service.description,
    )
    context.update({
        'service': service,
        'related_services': Service.objects.filter(category=service.category).exclude(id=service.id)[:4],
    })
    return render(request, 'pages/service_detail.html', context)


def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    context = _get_page_seo(
        request,
        'blog',
        f'{post.title} | BG Group Insights',
        post.excerpt,
    )
    context.update({
        'post': post,
        'related_posts': BlogPost.objects.exclude(id=post.id)[:3],
    })
    return render(request, 'pages/blog_detail.html', context)
