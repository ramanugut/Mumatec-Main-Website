"""Marven's trail design, fitted to the shared Mumatec catalogue and page routes."""
from pathlib import Path

def render_trail(ctx):
    config = ctx['CONFIG']
    content = (Path(__file__).resolve().parents[1]/'templates/trail-home.html').read_text()
    content = content.replace('__DOMAIN_FORM__', ctx['domain_form']())
    content = content.replace('__BUSINESS_EMAIL__', ctx['e'](config['email']))
    for i, plan in enumerate(config['hostingPlans']):
        values = dict(plan, saving=plan['monthly']*12-plan['yearly'])
        for key, value in values.items():
            content=content.replace(f'__PLAN{i}_{key.upper()}__',ctx['e'](value))
    questions = [ctx['FAQ'][0],ctx['FAQ'][2],ctx['FAQ'][3],ctx['FAQ'][5],
      ('Can I buy a domain without hosting?', 'New domain registrations come with Mumatec hosting. Every hosting setup needs a domain: register a new one or connect a domain you already own.'),
      ('Can I move my existing website?', 'Tell us your website platform, file size and email setup. We’ll confirm compatibility, costs and the plan for your move before you change hosting or DNS.')]
    content=content.replace('__TRAIL_FAQ__',ctx['faq'](questions))
    return content
