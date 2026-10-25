import json
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, Http404
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


    # All 12 services in exact order
    all_services = Service.objects.all().select_related('category').order_by('order', 'id')

    context.update({
        'featured_services': all_services,
        'home_gallery': ProjectGallery.objects.all().order_by('-id')[:6],
        'testimonials': ClientTestimonial.objects.all().order_by('order', 'id')[:8],
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
    categories = ServiceCategory.objects.prefetch_related('services').all()
    all_services = Service.objects.all().select_related('category')

    # Map services by key, id, and slug for dynamic template binding
    services_map = {}
    for s in all_services:
        services_map[s.id] = s
        services_map[s.slug] = s
        slug_lower = s.slug.lower()
        if 'refinery' in slug_lower:
            services_map['refinery'] = s
        elif 'floor' in slug_lower:
            services_map['floor'] = s
        elif 'maintenance' in slug_lower:
            services_map['maintenance'] = s
        elif 'corrosion' in slug_lower or 'audit' in slug_lower or 'survey' in slug_lower:
            services_map['survey'] = s
        elif 'manpower' in slug_lower or 'freelanc' in slug_lower or 'inspectors' in slug_lower:
            services_map['freelance'] = s
        elif 'optimize' in slug_lower or 'expedite' in slug_lower:
            services_map['optimize'] = s
        elif 'specifications' in slug_lower or 'procedure' in slug_lower or 'sop' in slug_lower:
            services_map['sop'] = s
        elif 'custom' in slug_lower or slug_lower == 'customize-paint':
            services_map['paint'] = s
        elif 'digital' in slug_lower:
            services_map['digital'] = s
        elif 'training' in slug_lower:
            services_map['training'] = s
        elif 'booth' in slug_lower or 'blasting' in slug_lower:
            services_map['booth'] = s
        elif 'specialized' in slug_lower or 'tsa' in slug_lower:
            services_map['specialized'] = s

    context.update({
        'categories': categories,
        'services_map': services_map,
        'all_services': all_services,
        'testimonials': ClientTestimonial.objects.all().order_by('order', 'id'),
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
    gallery_qs = ProjectGallery.objects.all().order_by('-id')
    serialized_gallery = ProjectGallerySerializer(gallery_qs, many=True).data

    # Generate dynamic filter tags with counts from live database records
    tag_counts = {}
    tag_labels = {}
    for item in gallery_qs:
        tag = (item.filter_tag or 'general').strip().lower()
        label = item.client_category or tag.replace('-', ' ').title()
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
        if tag not in tag_labels:
            tag_labels[tag] = label

    filter_tags = [
        {'tag': tag, 'label': tag_labels[tag], 'count': count}
        for tag, count in tag_counts.items()
    ]

    context.update({
        'gallery_items': gallery_qs,
        'gallery_json': json.dumps(serialized_gallery),
        'filter_tags': filter_tags,
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
        service = request.POST.get('service_of_interest') or request.POST.get('service') or request.POST.get('f_service') or 'General Enquiry'
        message = request.POST.get('message') or request.POST.get('f_msg') or ''

        # Support JSON request body
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body.decode('utf-8'))
                full_name = data.get('full_name') or data.get('f_name') or full_name
                company = data.get('company') or data.get('f_company') or company
                email = data.get('email') or data.get('f_email') or email
                phone = data.get('phone') or data.get('f_phone') or phone
                service = data.get('service_of_interest') or data.get('service') or data.get('f_service') or service
                message = data.get('message') or data.get('f_msg') or message
            except Exception:
                pass

        if full_name and email and phone:
            submission = ContactSubmission.objects.create(
                full_name=full_name.strip(),
                company=company.strip() if company else '',
                email=email.strip(),
                phone=phone.strip(),
                service_of_interest=service.strip() if service else 'General Enquiry',
                message=message.strip() if message else ''
            )

            is_ajax = (
                request.headers.get('x-requested-with') == 'XMLHttpRequest' or
                request.content_type == 'application/json' or
                'application/json' in request.headers.get('accept', '')
            )
            if is_ajax:
                return JsonResponse({
                    'status': 'success',
                    'message': 'Thank you! Your enquiry has been received.',
                    'redirect_url': '/thank-you/',
                    'submission_id': submission.id
                })

            return redirect('thank_you')
        else:
            is_ajax = (
                request.headers.get('x-requested-with') == 'XMLHttpRequest' or
                request.content_type == 'application/json'
            )
            if is_ajax:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Please provide required fields (Full Name, Email, and Phone).'
                }, status=400)
            context['error_message'] = "Please provide all required fields (Full Name, Email, and Phone)."

    context.update({
        'industries': Industry.objects.all(),
        'services': Service.objects.all(),
    })
    return render(request, 'pages/contact.html', context)


def thank_you(request):
    context = _get_page_seo(
        request,
        'thank_you',
        'Thank You For Your Enquiry | BG Group Of Paint & Coatings Consultant',
        'Thank you for reaching out to BG Group. Your technical consultation request has been received by our certified coating engineers.',
    )
    context.update({
        'featured_services': Service.objects.filter(is_featured=True).select_related('category')[:4],
        'latest_blogs': BlogPost.objects.all()[:3],
    })
    return render(request, 'pages/thank_you.html', context)


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
    post = BlogPost.objects.filter(slug=slug).first()
    if not post and slug.isdigit():
        post = BlogPost.objects.filter(id=int(slug)).first()
    if not post:
        raise Http404("No Blog Article matches the requested URL.")

    context = _get_page_seo(
        request,
        'blog',
        f'{post.title} | BG Group Insights',
        post.excerpt,
    )
    # Prefer articles from same category, then fallback to other recent articles
    same_cat = list(BlogPost.objects.filter(category_name=post.category_name).exclude(id=post.id)[:3])
    needed = 3 - len(same_cat)
    if needed > 0:
        exclude_ids = [post.id] + [p.id for p in same_cat]
        others = list(BlogPost.objects.exclude(id__in=exclude_ids)[:needed])
        related_posts = same_cat + others
    else:
        related_posts = same_cat

    prev_post = BlogPost.objects.filter(publish_date__lt=post.publish_date).order_by('-publish_date').first()
    next_post = BlogPost.objects.filter(publish_date__gt=post.publish_date).order_by('publish_date').first()

    context.update({
        'post': post,
        'related_posts': related_posts,
        'prev_post': prev_post,
        'next_post': next_post,
    })
    return render(request, 'pages/blog_detail.html', context)

