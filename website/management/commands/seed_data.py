from django.core.management.base import BaseCommand
from datetime import date
from website.models import (
    SiteSettings,
    PageSEO,
    NavigationItem,
    ServiceCategory,
    Service,
    BlogPost,
    ProjectGallery,
    BoardMember,
    EducationItem,
    CertificationItem,
    ClientTestimonial,
    TechnicalStandard,
    Industry,
)


class Command(BaseCommand):
    help = 'Seeds initial real data into database models'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial database content...')

        # 1. Site Settings
        settings = SiteSettings.load()
        settings.site_name = "BG Group Of Paint & Coatings Consultant"
        settings.tagline = "Industrial Coating Intelligence · Since 2004"
        settings.phone_number = "+91-99258-10408"
        settings.whatsapp_number = "919925810408"
        settings.primary_email = "inquiry.bggroup@gmail.com"
        settings.support_email = "support@bgcoating.com"
        settings.office_address = "E 103, Akash Echo Point, Bhimrad, Surat – 395007, Gujarat, India"
        settings.working_hours = "Mon – Sat · 09:00 am – 06:00 pm"
        settings.save()
        self.stdout.write(self.style.SUCCESS('[OK] SiteSettings configured.'))

        # 2. Page SEO Metadata
        seo_pages = [
            ('home', 'BG GROUP Of Paint & Coatings Consultant | Industrial Coating Experts', 'Protective coatings, surface preparation, corrosion assessment & NACE/AMPP-aligned coating inspection for refinery, oil & gas, petrochemical and industrial assets. BG Group, Surat, India.', 'https://bgcoating.com/'),
            ('about', 'About BG Group | Industrial Coating & Corrosion Experts', 'Discover BG Group — 22+ years of surface engineering, NACE/AMPP-aligned coating consultancy, inspection and asset preservation.', 'https://bgcoating.com/about/'),
            ('services', 'Services | BG Group Of Paint & Coatings Consultant', 'Comprehensive coating consultancy, surface preparation, paint inspection, third-party audit, and technical training.', 'https://bgcoating.com/services/'),
            ('blog', 'Technical Insights & Blog | BG Group', 'Read technical articles, surface preparation guides, abrasive profile benchmarks, and industrial coating best practices by BG Group.', 'https://bgcoating.com/blog/'),
            ('gallery', 'Project Gallery | BG Group', 'View our past surface preparation, industrial painting, inspection and technical audit projects.', 'https://bgcoating.com/gallery/'),
            ('contact', 'Contact Us | BG Group Of Paint & Coatings Consultant', 'Get in touch with NACE/AMPP certified experts for surface treatment, coating inspection, and corrosion consultation.', 'https://bgcoating.com/contact/'),
            ('board', 'Technical Board & Leadership Team | BG Group', 'Meet the leadership and technical board of BG Group of Paint & Coating Consultant — NACE/AMPP certified experts.', 'https://bgcoating.com/board/'),
        ]
        for pid, title, desc, canonical in seo_pages:
            PageSEO.objects.update_or_create(
                page_identifier=pid,
                defaults={'meta_title': title, 'meta_description': desc, 'canonical_url': canonical, 'robots': 'index, follow'}
            )
        self.stdout.write(self.style.SUCCESS('[OK] PageSEO metadata seeded.'))

        # 3. Technical Standards
        standards = [
            ('ISO 12944', 'Paints & varnishes — Corrosion protection of steel structures', 1),
            ('NACE', 'National Association of Corrosion Engineers Inspection Standards', 2),
            ('AMPP', 'Association for Materials Protection and Performance', 3),
            ('SSPC', 'Society for Protective Coatings Specifications', 4),
            ('ASTM', 'American Society for Testing and Materials International', 5),
        ]
        for code, desc, order in standards:
            TechnicalStandard.objects.update_or_create(
                code=code,
                defaults={'name': code, 'description': desc, 'order': order}
            )
        self.stdout.write(self.style.SUCCESS('[OK] TechnicalStandards seeded.'))

        # 4. Service Categories & Services
        sc_surface, _ = ServiceCategory.objects.get_or_create(name='Surface & Coatings', slug='surface-coatings', defaults={'order': 1})
        sc_inspection, _ = ServiceCategory.objects.get_or_create(name='Coating Inspection', slug='coating-inspection', defaults={'order': 2})
        sc_consultancy, _ = ServiceCategory.objects.get_or_create(name='Engineering Consultancy', slug='engineering-consultancy', defaults={'order': 3})
        sc_digital, _ = ServiceCategory.objects.get_or_create(name='Digital Solutions', slug='digital-solutions', defaults={'order': 4})
        sc_training, _ = ServiceCategory.objects.get_or_create(name='Training & Certification', slug='training-certification', defaults={'order': 5})
        sc_booth, _ = ServiceCategory.objects.get_or_create(name='Equipment & Booth Solutions', slug='equipment-booth-solutions', defaults={'order': 6})
        sc_specialized, _ = ServiceCategory.objects.get_or_create(name='Specialized Applications', slug='specialized-applications', defaults={'order': 7})

        services_data = [
            ('Refinery Equipment Expert Solution', 'refinery-equipment-coating', sc_surface, 'Internal and external protective coating of refinery pressure vessels, heat exchangers, storage tanks and high-temperature process piping.', 'ISO 12944 / NACE', 'assets/images/01__Coating_Survey_and_Corrosion_Assessment-transformed.png', True, 1),
            ('Floor Coating Solutions', 'industrial-floor-coating', sc_surface, 'Seamless chemical-resistant epoxy and polyurethane flooring engineered for heavy plant traffic, cleanrooms, and warehouse operations.', 'ASTM / ISO 12944', 'assets/images/R2___1_Floor_Coating.jpg', True, 2),
            ('Maintenance Coating', 'maintenance-coating', sc_surface, 'Turnaround maintenance coating supply, surface rejuvenation, corrosion mitigation, and asset protection for operating plants.', 'ISO 12944 / NACE', 'assets/images/R2_2_Maintenance.jpg', True, 3),
            ('Coating Survey & Corrosion Assessment', 'coating-survey-corrosion-assessment', sc_inspection, 'Structured corrosion assessment turning surface observations into actionable asset preservation maintenance intelligence.', 'ISO 12944 / NACE', 'assets/images/01__Coating_Survey_and_Corrosion_Assessment-transformed.png', True, 4),
            ('Freelancing : On-Site Coating Experts', 'freelance-coating-experts', sc_inspection, 'Certified NACE/AMPP Level 3 Inspectors deployed on-site for turnaround inspection, third-party QA/QC, and failure analysis.', 'NACE Level 3 / AMPP', 'assets/images/Prakash_Ramavat.jpg', True, 5),
            ('Consultancy : Expedite & Optimize Coating Process', 'consultancy-expedite-optimize-coating-process', sc_consultancy, 'Process optimization, bottleneck elimination, and rapid curing strategies for high-throughput industrial paint lines.', 'NACE / SSPC', 'assets/images/Front_Page_Microns.jpg', False, 6),
            ('Coating Procedure, Specification & SOP', 'coating-procedure-specification-sop', sc_consultancy, 'Engineering custom coating specifications, technical SOPs, and QA/QC documentation tailored to complex client asset conditions.', 'ISO 12944 / AMPP', 'assets/images/R2_1_Specialized_Application.jpg', False, 7),
            ('Customize Paint Solution', 'customize-paint', sc_consultancy, 'Custom paint formulation advisory, chemical resistance matching, and color retention specification for aggressive industrial environments.', 'ASTM / NACE', 'assets/images/R2_1_Customize_Paint_Solution.jpg', False, 8),
            ('Digital Coating Solution', 'digital-coating-solution', sc_digital, 'Digital workspace and BG CoatingOS™ estimation engine for automated surface area calculations, paint quantity forecasting, and specification decoding.', 'BG CoatingOS™', 'assets/images/logo-2.png', False, 9),
            ('Coating Training & Certification', 'coating-training-certification', sc_training, 'Comprehensive technical training programs for blasters, painters, inspectors, and engineers aligned with international coating standards.', 'AMPP / NACE / SSPC', 'assets/images/R2_1_Training.jpg', False, 10),
            ('Booth Blasting & Painting', 'booth-blasting-painting', sc_booth, 'Turnkey design advisory, operational workflow optimization, and environmental compliance for industrial blast booths and spray enclosures.', 'SSPC / ISO 8501', 'assets/images/R2___1_Blasting_and_Painting_Booth.jpg', False, 11),
            ('Specialized Application (TSA / PFP / FRE)', 'specialized-applications-tsa-pfp', sc_specialized, 'Thermal spray aluminium (TSA), passive fire protection (PFP), and fiber-reinforced epoxy (FRE) insulation systems for high-value refinery assets.', 'NACE / AMPP', 'assets/images/R2_1_Specialized_Application.jpg', True, 12),
        ]
        for title, slug, cat, excerpt, code, img, feat, order in services_data:
            Service.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title, 'category': cat, 'excerpt': excerpt,
                    'description': excerpt,
                    'cover_image': img,
                    'standard_code': code, 'is_featured': feat, 'order': order
                }
            )
        self.stdout.write(self.style.SUCCESS('[OK] ServiceCategories & Services seeded.'))


        # 5. Blog Posts
        blogs = [
            ('Uncover The Hurdles Within The Coating Field & Strategic Prioritization', 'hurdles-in-coating-field-strategic-prioritization', 'Productivity', date(2023, 9, 27), 6, 'Real-world coating operations face bottlenecks that quietly erode margin...', 'Productivity search terms surface prep scheduling', True),
            ('The Unexplored Depths Of Abrasive Blasting Profiles: Ra, Rm And Rz', 'abrasive-blasting-profiles-ra-rm-rz', 'Surface Preparation', date(2023, 9, 21), 8, 'Surface profile is the foundation every coating depends on...', 'abrasive blasting profile roughness micron', True),
            ('Expedite Curing Of Inorganic Zinc Silicate Primer And Ensure Validation Through ASTM D 4752', 'expedite-curing-inorganic-zinc-silicate-primer', 'Protective Coatings', date(2023, 9, 19), 7, 'Inorganic zinc silicate primers must cure fully before topcoating...', 'inorganic zinc silicate primer cure astm d 4752', False),
            ('Exploring Coating Adhesion: The Cross-Cut V-Cut Test', 'exploring-coating-adhesion-cross-cut-v-cut-test', 'Inspection', date(2023, 9, 15), 5, 'A simple, field-friendly way to gauge coating adhesion...', 'cross cut v cut adhesion test bond strength', False),
        ]
        for title, slug, cat, pub_date, read_t, excerpt, kw, feat in blogs:
            BlogPost.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title, 'category_name': cat, 'publish_date': pub_date,
                    'read_time_minutes': read_t, 'excerpt': excerpt, 'search_keywords': kw,
                    'is_featured': feat, 'featured_image': 'assets/images/Front_Page_Microns.jpg'
                }
            )
        self.stdout.write(self.style.SUCCESS('[OK] BlogPosts seeded.'))

        # 6. Project Gallery Items
        gallery_data = [
            ("Inorganic Zinc vs Epoxy Zinc", "Protective Coatings", "Technical Reference", "Coating System Selection", "Comparative study of inorganic zinc and epoxy zinc primers.", "ISO 12944", "assets/images/R1__PNG___Inorganic_Zinc_Vs_Epoxy_Zinc.png", "protective", 1),
            ("SSPC-VIS 1 Visual Standard", "Inspection & QA/QC", "Surface Prep Reference", "Blast Cleaning Assessment", "Visual comparator for abrasive blast-cleaned steel.", "SSPC-VIS 1", "assets/images/02_R1__JPG___SSPC_VIS_1-transformed.jpeg", "inspection", 2),
            ("SSPC-VIS 2 Visual Standard", "Inspection & QA/QC", "Surface Prep Reference", "Rust Grade Assessment", "Standard for evaluating degree of rusting on painted steel.", "SSPC-VIS 2", "assets/images/03__JPG___SSPC_VIS_2-transformed.jpeg", "inspection", 3),
            ("Coating Survey & Corrosion Assessment", "Refinery", "Refinery Site", "Condition Survey", "Structured corrosion assessment turning observations into maintenance intelligence.", "NACE", "assets/images/01__Coating_Survey_and_Corrosion_Assessment-transformed.png", "refinery", 4),
        ]
        for title, cat, loc, svc, summary, std, img, tag, order in gallery_data:
            ProjectGallery.objects.update_or_create(
                title=title,
                defaults={
                    'client_category': cat, 'location_name': loc, 'service_type': svc,
                    'summary': summary, 'standard': std, 'image': img, 'filter_tag': tag, 'order': order
                }
            )
        self.stdout.write(self.style.SUCCESS('[OK] ProjectGallery items seeded.'))

        # 7. Board Members
        board_members = [
            ("Prakash Ramavat", "Principal Coating Consultant & Technical Director", "NACE / AMPP Level 3 Certified", "22+ years of hands-on expertise in refinery, petrochemical and industrial protective coatings.", "assets/images/Prakash_Ramavat.jpg", 1),
        ]
        for name, role, cert, bio, img, order in board_members:
            BoardMember.objects.update_or_create(
                name=name,
                defaults={'role': role, 'certification': cert, 'bio': bio, 'photo': img, 'display_order': order}
            )
        self.stdout.write(self.style.SUCCESS('[OK] BoardMembers seeded.'))

        # 7b. Education Items
        edu_items = [
            ("PG Program — Corrosion Management & Technology", "Indian Institute of Technology (IIT) Ropar · with CII", "Nov 2024 – Oct 2025 · Completed", "Post Graduate Professional Development Program from the Department of Metallurgical & Materials Engineering.", "edu_iit", 1),
            ("Executive Education — International Business & Trade", "Indian Institute of Management (IIM) Ahmedabad", "Aug 2023 – Jan 2024 · Completed", "Specialized executive coursework in global trade strategy, EPC contract structuring & supply chain resilience.", "edu_iim", 2),
            ("Post Graduate Diploma — Industrial Safety & Environmental Mgmt", "Gujarat Technological University (GTU)", "Jun 2021 – May 2022 · Completed", "Comprehensive curriculum covering industrial hygiene, hazardous chemical handling, OSHA standards, and environmental compliance.", "edu_gtu", 3),
            ("B.Tech — Chemical & Surface Engineering", "Surat Institute of Technology", "Jul 2016 – May 2020 · Completed", "Core engineering foundation covering polymer chemistry, electrochemistry, corrosion kinetics, fluid dynamics, and surface treatment technologies.", "edu_sit", 4),
        ]
        for title, inst, period, desc, key, order in edu_items:
            EducationItem.objects.update_or_create(
                program_title=title,
                defaults={
                    'institution': inst, 'period_date': period, 'description': desc,
                    'img_key': key, 'order': order, 'certificate_image': 'assets/images/Front_Page_Microns.jpg'
                }
            )
        self.stdout.write(self.style.SUCCESS('[OK] EducationItems seeded.'))

        # 8. Industries
        industries = [
            ("Oil & Gas", "oil-gas", 1),
            ("Refinery", "refinery", 2),
            ("Marine", "marine", 3),
            ("Petrochemical", "petrochemical", 4),
            ("Power", "power", 5),
            ("Infrastructure", "infrastructure", 6),
        ]
        for name, slug, order in industries:
            Industry.objects.update_or_create(
                slug=slug,
                defaults={'name': name, 'order': order}
            )
        self.stdout.write(self.style.SUCCESS('[OK] Industries seeded.'))

        # 9. Client Testimonials
        testimonials = [
            ("Refinery Maintenance Manager", "Asset Integrity Lead", "Leading Indian Oil Refinery", "BG Group provided exceptional coating inspection during our major turnaround, keeping downtime to a minimum.", 5, 1),
            ("EPC Project Director", "Project Lead", "Heavy Engineering Firm", "Their technical specifications and NACE-aligned supervision saved us significant rework costs.", 5, 2),
        ]
        for name, role, comp, text, rating, order in testimonials:
            ClientTestimonial.objects.update_or_create(
                client_name=name, company_name=comp,
                defaults={'client_role': role, 'testimonial_text': text, 'rating': rating, 'order': order}
            )
        # 10. Certification Items
        certs = [
            ("NACE Coating Inspector Level 2", "NACE International Institute", "International", "Cert No. 20438 · Expires August 2, 2028", "The global benchmark for supervising and certifying protective coating work — advanced instruments, destructive & non-destructive testing, and specification authority. Held and renewed since 2011.", "cert_nace2", 1),
            ("AMPP Certified Coatings Inspector", "AMPP — Association for Materials Protection and Performance", "International", "Cert No. N-20438 · Expires August 2, 2028", "Recognition continued under AMPP — the Association for Materials Protection and Performance, formed by the NACE-SSPC merger — confirming certified inspector status through 2028.", "cert_ampp", 2),
            ("BGAS-CSWIP Painting Inspector Grade 2", "TWI — BGAS-CSWIP Approval Scheme, Cambridge UK", "International", "Cert No. 41241 · Issued 13 August 2009", "TWI-administered painting inspection approval examined under the BGAS-CSWIP scheme — an early international credential that opened the door to global specification work.", "cert_bgas", 3),
            ("AGA Galvanizing Inspection Course", "American Galvanizers Association", "Specialist", "Completed May 21, 2025", "AGA inspection qualification — underpinning galvanizing consultancy for KBR module projects and structural galvanizing scopes for Bechtel, Esso France and HRRL.", "cert_aga", 4),
            ("ISO 45001:2018 Internal Auditor Training", "DNV-GL Business Assurance India", "Internal Auditor", "15–16 October 2018 · Certified 26 Nov 2018, Baroda", "DNV-certified occupational health and safety internal auditor — ensuring HSE protocols, site safety audits and SAIF compliance across complex plant assignments.", "cert_dnv", 5),
            ("Basic to Advanced Microsoft Excel", "Skill Nation — Advanced Masterclass", "Digital", "Advanced Masterclass · 2023", "Advanced Excel mastery — the engine behind estimation frameworks, paint-inventory dashboards and data-driven vendor analytics.", "cert_excel", 6),
            ("Basic to Advanced MS PowerPoint", "Skill Nation — Advanced Masterclass", "Digital", "2023", "Advanced PowerPoint — powering technical program presentations for customers, proposals and training material.", "cert_ppt", 7),
            ("LinkedIn Skill Assessment Badges", "LinkedIn — Microsoft PowerPoint & Microsoft Outlook", "Verified", "PowerPoint top 5% · Outlook top 15%", "Independently verified badges: Microsoft PowerPoint in the top 5% of 10.3 million test-takers, Microsoft Outlook in the top 15% of 5.4 million.", "cert_linkedin", 8),
        ]
        for title, org, badge, vdate, desc, key, order in certs:
            CertificationItem.objects.update_or_create(
                title=title, issuing_org=org,
                defaults={
                    'category_badge': badge,
                    'validity_date': vdate,
                    'description': desc,
                    'img_key': key,
                    'order': order
                }
            )
        self.stdout.write(self.style.SUCCESS('[OK] CertificationItems seeded.'))

        self.stdout.write(self.style.SUCCESS('\nAll initial data successfully seeded!'))

