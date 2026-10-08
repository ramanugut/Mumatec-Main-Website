"""Build a dependency-free website that can be uploaded directly to shared hosting."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'
OUT.mkdir(exist_ok=True)
CONFIG = json.loads((ROOT / 'site.json').read_text())
def e(value): return html.escape(str(value), quote=True)
def billing(path): return e(CONFIG['billing'] + path)
def catalogue(key): return billing(CONFIG['catalogue'][key])
def btn(label, url, primary=False):
    return f'<a class="btn{" btn-primary" if primary else ""}" href="{url}">{e(label)}</a>'
def icon(name):
    paths = {
        'hosting': '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5M12 17.5h5"/>',
        'domain': '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
        'email': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
        'support': '<path d="M4 13v-1a8 8 0 0 1 16 0v1M20 17v2a2 2 0 0 1-2 2h-5"/><rect x="2" y="11" width="4" height="7" rx="2"/><rect x="18" y="11" width="4" height="7" rx="2"/>',
        'design': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M6 6.5h.01M9 6.5h.01"/>',
        'lock': '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    }
    return f'<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">{paths[name]}</svg></span>'
def brand():
    return '<a href="index.html" class="brand" aria-label="Mumatec Hosting home"><img src="assets/mumatec-logo.png" width="2000" height="1000" alt="Mumatec Hosting" fetchpriority="high"></a>'
def header(current):
    nav = [('hosting.html','Hosting'),('domains.html','Domains'),('web-design.html','Websites'),('about.html','About'),('support.html','Help')]
    links = ''.join(f'<a href="{path}"'+(' aria-current="page"' if path==current else '')+f'>{label}</a>' for path,label in nav)
    return f'''<a class="skip" href="#main">Skip to content</a>
<div class="utility"><div class="wrap"><span>Made for South African businesses.</span><a href="tel:{e(CONFIG['phoneHref'])}">Talk to us: {e(CONFIG['phone'])}</a></div></div><header class="site-header"><div class="wrap header-inner">{brand()}
<nav id="site-nav" class="site-nav" aria-label="Main navigation">{links}</nav>
<a class="btn header-client" href="{billing('clientarea.php')}">Client area</a>
<button class="btn menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
</div></header>'''
def footer():
    return f'''<footer class="site-footer"><div class="wrap">
<div class="footer-grid"><div class="footer-brand">{brand()}<p>Websites, domains and business email.<br>{e(CONFIG['location'])}.</p></div>
<div><h3>Get online</h3><ul><li><a href="hosting.html">Web hosting</a></li><li><a href="domains.html">Domain names</a></li><li><a href="email.html">Business email</a></li><li><a href="ssl.html">SSL certificates</a></li><li><a href="web-design.html">Web design</a></li></ul></div>
<div><h3>Your account</h3><ul><li><a href="{billing('clientarea.php')}">Client area</a></li><li><a href="{billing('register.php')}">Create an account</a></li><li><a href="{billing('index.php?rp=/password/reset')}">Reset password</a></li><li><a href="{billing('supporttickets.php')}">Support tickets</a></li><li><a href="{billing('cart.php?a=add&domain=transfer')}">Transfer a domain</a></li></ul></div>
<div><h3>Mumatec</h3><ul><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact us</a></li><li><a href="support.html">Help &amp; FAQs</a></li><li><a href="mailto:{e(CONFIG['email'])}">{e(CONFIG['email'])}</a></li><li><a href="tel:{e(CONFIG['phoneHref'])}">{e(CONFIG['phone'])}</a></li></ul></div></div>
<div class="footer-bottom"><p>© <span data-year>2026</span> Mumatec Hosting. All rights reserved.</p><p><a href="{e(CONFIG['origin'])}/refund_returns/">Terms, privacy &amp; service policies</a></p></div>
</div></footer>'''
def domain_form():
    return f'''<form class="domain-form" action="{billing('cart.php')}" method="get" novalidate>
<input type="hidden" name="a" value="add"><input type="hidden" name="domain" value="register">
<label for="domain-name">Your domain name</label><div class="domain-entry">
<input id="domain-name" name="query" type="text" placeholder="yourbusiness.co.za" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="domain-error" required>
<button class="clear-search" type="button" aria-label="Clear domain name" hidden>×</button>
<button class="btn btn-primary" type="submit">Search</button></div>
<p class="field-error" id="domain-error" aria-live="polite"></p></form>'''
def domain_panel():
    return f'''<div class="domain-panel"><p class="eyebrow">Your next business starts here</p><h2>Give your idea<br>a name.</h2><p>Find a domain that feels like you.</p>{domain_form()}<div class="extensions" aria-label="Popular domain extensions"><span>.co.za</span><span>.com</span><span>.africa</span><span>.org.za</span></div><div class="domain-foot"><span>Already own a domain?</span><a href="{billing('cart.php?a=add&domain=transfer')}">Transfer it to Mumatec</a></div></div>'''
def card(title, text, symbol, label, url, points=None, featured=False):
    lis = '<ul class="card-list">'+''.join(f'<li>{e(x)}</li>' for x in points)+'</ul>' if points else ''
    return f'<article class="card{" card-featured" if featured else ""}">{icon(symbol)}<h3>{e(title)}</h3><p>{e(text)}</p>{lis}{btn(label,url,featured)}</article>'
def intro(kicker,title,text):
    return f'<section class="page-intro"><div class="wrap"><p class="eyebrow">{e(kicker)}</p><h1>{e(title)}</h1><p class="lead">{e(text)}</p></div></section>'
def subintro(kicker,title,text):
    return intro(kicker,title,text).replace("<h1>","<h2>").replace("</h1>","</h2>")
def callout(title,text,label,url):
    return f'<section class="section"><div class="wrap callout"><div><h2>{e(title)}</h2><p>{e(text)}</p></div>{btn(label,url)}</div></section>'
FAQ = [
 ('What is the difference between a domain and hosting?', 'Your domain is your website address, such as yourbusiness.co.za. Hosting is the space where your website files live. You normally need both to publish a website.'),
 ('Can I use a domain I already own?', 'Yes. During your hosting order, choose to use an existing domain or transfer it to Mumatec. If you need help with the move, open a support ticket.'),
 ('Where do I see package prices and limits?', 'The hosting catalogue shows the current prices and package details. Check the storage, email and website limits before choosing a package. Your order total is shown before payment.'),
 ('How do I manage my services?', 'Sign in to the client area to manage your hosting and domains, view invoices and contact support.'),
 ('Can Mumatec help me build my website?', 'Yes. You can view the web design packages or contact us to discuss your website and get a quote.'),
]
def faq(items=FAQ):
    return '<div class="faq">'+''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q,a in items)+'</div>'
def photo(name,alt,hero=False):
    return f'<img src="assets/{name}-1536.webp" srcset="assets/{name}-768.webp 768w, assets/{name}-1536.webp 1536w" sizes="(max-width: 700px) 100vw, 50vw" width="1536" height="1024" alt="{e(alt)}" '+('fetchpriority="high"' if hero else 'loading="lazy"')+' decoding="async">'
def home():
    services=[('hosting.html','Web hosting','Make yourself at home','hosting'),('domains.html','Domain names','Make your name yours','domain'),('email.html','Business email','Make a great first impression','email'),('support.html','Human support','Let’s figure it out together','support')]
    strip=''.join(f'<a href="{u}">{icon(i)}<span><strong>{t}</strong><small>{s}</small></span><span class="strip-arrow" aria-hidden="true">↗</span></a>' for u,t,s,i in services)
    cards=card('A home for your website','From your first business website to your next big idea. Choose the space and features you need.','hosting','Explore hosting','hosting.html',['Monthly or annual billing','Your own domain, new or existing','Manage your account online'],True)+card('An address that means business','Put your name in every inbox. Email for the conversations that keep your business moving.','email','Explore business email','email.html',['Email on your business domain','Choose your mailbox package','Help with getting set up'])+card('A website that works for you','Give customers a place to discover what you do. Start with a website built around your business.','design','Explore website design','web-design.html',['Business websites and online shops','A clear scope before you start','A place for your own brand'])
    return f'''<section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><p class="eyebrow"><span class="live-dot" aria-hidden="true"></span> Your next chapter starts online</p><h1>Big ideas deserve<br>a <span>proper home.</span></h1><p class="lead">Your website. Your business email. Your name on the internet. Bring it all together with Mumatec Hosting.</p><div class="actions">{btn('Find your hosting','hosting.html',True)}{btn('Meet Mumatec','about.html')}</div><p class="hero-note">Based in Pretoria. Here for your business.</p></div><figure class="hero-art">{photo('hosting-studio','Sculptural blue server modules connected by a cyan ribbon and a silver globe.',True)}<figcaption><span>Built around your business</span><span>Domains / Hosting / Email</span></figcaption></figure></div></section>
<section class="domain-dock wrap" aria-labelledby="find-name"><div><p class="eyebrow">Your idea, addressed.</p><h2 id="find-name">Find your name.</h2></div><div>{domain_form()}<p class="domain-hint">Search .co.za, .com, .africa and more. <a href="{billing('cart.php?a=add&domain=transfer')}">Already have a domain? Transfer it ↗</a></p></div></section>
<div class="wrap service-strip">{strip}</div>
<section class="section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">The essentials. All together.</p><h2>A little idea.<br>A bigger online presence.</h2></div><p>Start with what you need.<br>We’ll help you with the next step.</p></div><div class="cards product-cards">{cards}</div></div></section>
<section class="section business-section"><div class="wrap business-split"><figure class="business-image">{photo('business-workspace','A bright business workspace with a laptop, notebook and a view of the city.')}<figcaption>Your business, with room to grow.</figcaption></figure><div><p class="eyebrow">Small business. Big ambition.</p><h2>You do your thing.<br>We’ll help you<br>get it online.</h2><p class="lead">A new venture, a growing business, or a fresh start for your website. There’s a place for it here.</p><ul class="benefit-list"><li><strong>Start with your own name</strong><span>A domain your customers can remember.</span></li><li><strong>Keep the essentials together</strong><span>Hosting, domains, invoices and support in one account.</span></li><li><strong>Ask a real person</strong><span>Talk to us about what your business needs.</span></li></ul>{btn('Let’s talk about your business','contact.html',True)}</div></div></section>
<section class="section"><div class="wrap split"><div><p class="eyebrow">From idea to online</p><h2>Three steps.<br>Your next chapter.</h2><p class="lead">Choose a name. Find a package. Make it yours.</p>{btn('Get started','hosting.html')}</div><ol class="steps"><li><h3>Find your name</h3><p>Register a new domain, transfer one, or use a domain you already own.</p></li><li><h3>Choose your home</h3><p>Compare the current packages and pick your billing cycle.</p></li><li><h3>Make your mark</h3><p>Set up your website and email. Need a hand? Contact Mumatec support.</p></li></ol></div></section>
<section class="section section-tint"><div class="wrap split"><div><p class="eyebrow">Good questions. Clear answers.</p><h2>Let’s clear<br>a few things up.</h2><p class="lead">You don’t need to know every technical term to get started.</p>{btn('More help & answers','support.html')}</div>{faq(FAQ[:4])}</div></section>
{callout('Your next big idea belongs online.','Let’s give it a home.','Explore hosting','hosting.html')}'''
def hosting():
    cards=card('Monthly hosting','Choose a hosting package billed each month.','hosting','View monthly plans',catalogue('monthly'),['See current package prices','Compare storage and email limits','Use a new or existing domain'],True)+card('Yearly hosting','Choose a hosting package with annual billing.','hosting','View yearly plans',catalogue('yearly'),['See the full yearly cost','Compare the available packages','Review renewal details at checkout'])+card('Moving your website?','Let us know what you have and where it is hosted.','support','Discuss your move','contact.html',['Keep your existing domain','Plan the website and email move','Get help with the next steps'])
    return f'<section class="product-hero"><div class="wrap split"><div><p class="eyebrow">Web hosting</p><h1>A proper home for your next big idea.</h1><p class="lead">Choose your hosting, bring your domain, and make your business feel at home online.</p><div class="actions">{btn("View monthly plans",catalogue("monthly"),True)}{btn("View yearly plans",catalogue("yearly"))}</div></div><figure>{photo("hosting-studio","Blue server modules and a silver globe on a white studio platform.",True)}</figure></div></section>'+subintro('Choose your billing','A home for your business online.','Choose how you want to be billed, then compare the available packages in our hosting catalogue.')+f'<section class="section"><div class="wrap"><div class="cards">{cards}</div></div></section>'+f'<section class="section section-tint"><div class="wrap split"><div><p class="eyebrow">One account</p><h2>Stay in control.</h2><p class="lead">Hosting, domains, invoices and support are together in your client area.</p>{btn("Open client area",billing("clientarea.php"),True)}</div>{faq(FAQ[:4])}</div></section>'
def domains():
    return intro('Domain names','The name people remember.','Search for your business name, register a new domain, or bring your existing domain to Mumatec.')+f'<section class="section"><div class="wrap split"><div><h2>Start with your name.</h2><p class="lead">Try your business name with .co.za, .com or another extension. Availability and the current registration price are checked in our domain catalogue.</p><p>Your search opens the domain checkout, where you can choose hosting as part of your order.</p>{btn("Transfer a domain",billing("cart.php?a=add&domain=transfer"))}</div>{domain_panel()}</div></section>'+callout('Already have a Mumatec domain?','Manage your domains and renewal settings from your client area.','Manage domains',billing('clientarea.php?action=domains'))
def email():
    cards=card('Email hosting','Choose a package for email on your own domain.','email','View email packages',catalogue('email'),featured=True)+card('Need a domain?','Find a name for your business before setting up your email.','domain','Search domains','domains.html')+card('Email setup help','Need help using your mailbox or moving from another provider?','support','Get support','support.html')
    return intro('Business email','Make your email feel like your business.','Use an address like hello@yourbusiness.co.za for your everyday business conversations.')+f'<section class="section"><div class="wrap"><div class="cards">{cards}</div></div></section>'+callout('Not sure which package fits?','Tell us how many email addresses you need and how you use them.','Contact us','contact.html')
def design():
    return f'<section class="product-hero"><div class="wrap split"><div><p class="eyebrow">Website design</p><h1>Your business. Beautifully online.</h1><p class="lead">Give your business a website that feels like you and helps customers take the next step.</p>{btn("Discuss your website","contact.html",True)}</div><figure class="photo-frame">{photo("business-workspace","A light-filled business workspace with a laptop and notebook.",True)}</figure></div></section>'+subintro('Built around your business','A website with a job to do.','Tell us about your business and what your visitors need to find, understand or buy.')+f'<section class="section"><div class="wrap split"><div><h2>Let’s build around<br>your business.</h2><p class="lead">From a business website to an online shop, start with the pages and features you actually need.</p><div class="actions">{btn("View design packages",catalogue("design"),True)}{btn("Discuss your website","contact.html")}</div></div><ol class="steps"><li><h3>Tell us what you need</h3><p>Share your business details, existing branding and goals for the website.</p></li><li><h3>Agree on the scope</h3><p>Choose a package or ask for a quote based on your pages and features.</p></li><li><h3>Build and review</h3><p>Review the website and get help preparing it for launch.</p></li></ol></div></section>'
def ssl():
    return intro('SSL certificates','A secure connection to your website.','An SSL certificate helps protect information sent between your website and its visitors.')+f'<section class="section"><div class="wrap split"><div><h2>Choose the right certificate.</h2><p class="lead">View our SSL catalogue for the available certificates, their coverage and current prices.</p><p>Ask support whether your hosting package already includes a certificate before ordering another one.</p>{btn("View SSL certificates",catalogue("ssl"),True)}</div>{card("Need help with SSL?","Contact support about setup, renewal or browser security warnings.","lock","Get support","support.html")}</div></section>'
def support():
    cards=card('Open a ticket','Send the details to our support team and keep the conversation together.','support','Open a ticket',billing('submitticket.php'),featured=True)+card('Knowledgebase','Look for guides to hosting, domains and email.','design','Browse guides',billing('index.php?rp=/knowledgebase'))+card('Your existing tickets','Sign in to read replies and follow up on an open request.','email','View tickets',billing('supporttickets.php'))
    return intro('Help & support','Let’s get it sorted.','Get help with a service, find a guide, or contact us before placing an order.')+f'<section class="section"><div class="wrap"><div class="cards">{cards}</div></div></section><section class="section section-tint"><div class="wrap split"><div><h2>Common questions.</h2><p class="lead">A few things to know before getting started.</p>{btn("Contact us","contact.html")}</div>{faq()}</div></section>'
def contact():
    return intro('Contact Mumatec','Talk to us about your next step.','For a new website, a hosting move or a question about a service, get in touch.')+f'''<section class="section"><div class="wrap"><div class="cards">
{card('Email us',CONFIG['email'],'email','Send an email','mailto:'+e(CONFIG['email']))}
{card('Call us',CONFIG['phone'],'support','Call Mumatec','tel:'+e(CONFIG['phoneHref']))}
{card('Service support','For an existing service, open a ticket so we can follow your request.','hosting','Open a ticket',billing('submitticket.php'),featured=True)}
</div></div></section>'''+callout('Based in Pretoria. Helping businesses get online.','Tell us about your business and what you would like to build.','View web design','web-design.html')
def about():
    return intro('About Mumatec','Space for your business to grow.','Mumatec Hosting helps South African businesses build their online presence with domains, hosting, email and web design.')+f'<section class="section"><div class="wrap split"><div><h2>Start where you are.</h2><p class="lead">Whether you have an idea, an existing website or a business ready for its first domain, we can help you take the next step.</p><p>We are based in Pretoria. Contact us to discuss your website, email or hosting needs.</p>{btn("Talk to Mumatec","contact.html",True)}</div><div class="card"><p class="eyebrow">The essentials, together</p><h3>Your website. Your email.<br>Your own business name.</h3><p>Choose your services and manage your account, invoices and support requests in one client area.</p>{btn("Explore our services","hosting.html")}</div></div></section>'

PAGES = {
 'index.html': ('Web hosting, domains & business email', 'Get your business online with Mumatec Hosting in South Africa. Explore web hosting, domains, business email and web design.', home),
 'hosting.html': ('Web hosting', 'Explore monthly and yearly web hosting packages from Mumatec Hosting.', hosting),
 'domains.html': ('Domain names', 'Search, register or transfer a domain with Mumatec Hosting.', domains),
 'email.html': ('Business email', 'Explore email hosting for your business domain with Mumatec Hosting.', email),
 'web-design.html': ('Web design', 'Discuss your business website or browse Mumatec web design packages.', design),
 'ssl.html': ('SSL certificates', 'Explore SSL certificates and get help securing your website connection.', ssl),
 'support.html': ('Help & support', 'Open a support ticket, read guides and find answers about Mumatec Hosting.', support),
 'contact.html': ('Contact', 'Contact Mumatec Hosting in Pretoria about hosting, email or web design.', contact),
 'about.html': ('About', 'Learn about Mumatec Hosting and our services for South African businesses.', about),
}
PAGES['pricing.html'] = ('Hosting plans', 'Compare monthly and yearly Mumatec hosting plans in the live catalogue.', hosting)
PAGES['faq.html'] = ('Frequently asked questions', 'Answers to common Mumatec hosting, domain and email questions.', support)
PAGES['websites.html'] = PAGES['web-design.html']
for path,(title,description,render) in PAGES.items():
    canonical_path = {'web-design.html':'websites.html', 'pricing.html':'hosting.html', 'faq.html':'support.html'}.get(path,path)
    canonical=CONFIG['origin'] + ('/' if canonical_path=='index.html' else '/'+canonical_path.removesuffix('.html'))
    content=f'''<!doctype html>
<html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)} | Mumatec Hosting</title><meta name="description" content="{e(description)}">
<link rel="canonical" href="{e(canonical)}"><meta name="theme-color" content="#105479"><meta property="og:type" content="website"><meta property="og:site_name" content="Mumatec Hosting"><meta property="og:title" content="{e(title)} | Mumatec Hosting"><meta property="og:description" content="{e(description)}"><meta property="og:url" content="{e(canonical)}"><meta property="og:image" content="{e(CONFIG['origin'])}/assets/hosting-studio-1536.webp"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/mumatec-logo.png" type="image/png">
<link rel="stylesheet" href="assets/site.css"><script src="assets/site.js" defer></script>
</head><body>{header(path)}<main id="main">{render()}</main>{footer()}</body></html>'''
    (OUT/path).write_text(content,encoding='utf-8')
(OUT/'404.html').write_text(f'''<!doctype html><html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | Mumatec Hosting</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/site.css"><link rel="icon" href="/assets/mumatec-logo.png"></head><body><main class="wrap section"><p class="eyebrow">404</p><h1>That page isn’t here.</h1><p>The address may have changed. Start from the homepage or contact us for help.</p>{btn('Back to home','/',True)} {btn('Contact us','/contact.html')}</main></body></html>''',encoding='utf-8')
(OUT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{e(CONFIG["origin"]+("/" if path=="index.html" else "/"+path.removesuffix('.html')))}</loc></url>' for path in PAGES if path not in {"web-design.html", "pricing.html", "faq.html"})+'</urlset>\n')
print(f'Built {len(PAGES)} pages + 404 and sitemap.')
