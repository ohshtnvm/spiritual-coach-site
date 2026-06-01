#!/usr/bin/env node
/* build.js — (1) seeds coach-data.tsv if missing, (2) syncs the embedded
   fallback copy inside index.html so the site also renders offline / via file://.
   Run:  node build.js   (after editing coach-data.tsv, to refresh the fallback) */
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'public');
const TSV = path.join(DIR, 'coach-data.tsv');
const HTML = path.join(DIR, 'index.html');
const T = '\t';

/* ---- helper: build a sheet block from a header + rows ---- */
function sheet(name, header, rows){
  return ['#' + name, header.join(T), ...rows.map(r => r.map(c => String(c).replace(/\t/g,' ').replace(/\r?\n/g,' ')).join(T))].join('\n');
}
function kv(name, obj){
  return sheet(name, ['key','value'], Object.entries(obj));
}

/* =========================================================================
   SEED DATA  (Business coach example — edit coach-data.tsv after first run)
   ========================================================================= */
function seedTSV(){
  const config = kv('config', {
    coach_name:'John Carter',
    coach_title:'Business Coach & Investor',
    coach_type:'business',
    logo_text:'John Carter',
    currency:'USD',
    primary_color:'#1D9E75',
    secondary_color:'#0f172a',
    accent_color:'#f59e0b',
    text_dark:'#1f2937',
    bg_light:'#f6f8f7',
    font_heading:'Plus Jakarta Sans',
    font_body:'Inter',
    site_domain:'https://johncarter.example.com',
    email:'hello@johncarter.example.com',
    phone:'+1 (555) 123-4567',
    location:'Austin, TX · Remote worldwide',
    calcom_link:'rockt/discovery-call',
    cta_primary_text:'Book a strategy call',
    linkedin:'https://linkedin.com/in/example',
    twitter:'https://x.com/example',
    instagram:'',
    facebook:'',
    meta_title:'Business Coaching for Founders & Entrepreneurs | John Carter',
    meta_description:'Scale your business from idea to $1M+ with proven frameworks, accountability and strategic guidance. Book a free strategy call with John Carter today.',
    meta_keywords:'business coach, executive coaching, startup coach, founder coaching, scale business',
    og_image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=75&auto=format&fit=crop',
    show_testimonials:'true',
    show_pricing:'true',
    show_faq:'true',
    show_blog:'true',
    footer_tagline:'Built for founders. Powered by proven frameworks.'
  });

  const nav = sheet('nav', ['label','anchor'], [
    ['About','#about'], ['Services','#services'], ['Pricing','#pricing'],
    ['Results','#testimonials'], ['Insights','#blog'], ['FAQ','#faq'],
  ]);

  const meta = kv('meta', {
    services_eyebrow:'How I help',
    services_heading:'Coaching built around your stage',
    services_intro:'Choose the engagement that matches where your business is today.',
    testimonials_eyebrow:'Proof',
    testimonials_heading:'Founders who scaled with the system',
    testimonials_intro:'Real results from real operators — not vanity metrics.',
    pricing_eyebrow:'Investment',
    pricing_heading:'Simple, transparent pricing',
    pricing_intro:'No hidden fees. Clear outcomes. Cancel anytime.',
    faq_eyebrow:'Questions',
    faq_heading:'Everything you need to know',
    faq_intro:'Still unsure? Book a call and ask me directly.',
    blog_eyebrow:'Insights',
    blog_heading:'Frameworks & field notes',
    blog_intro:'Tactical playbooks I share with my private clients.'
  });

  const hero = kv('hero', {
    badge:'Trusted by 200+ founders',
    headline:'Scale your business to *$1M+* in 18 months or less',
    subheadline:'Work with a coach who has built and exited multiple 8-figure companies. Get the accountability, frameworks and strategy to grow — without the guesswork.',
    cta_text:'Book a free strategy call',
    cta_secondary_text:'See how it works',
    cta_secondary_url:'#services',
    image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=75&auto=format&fit=crop',
    image_alt:'John Carter, business coach, in a confident portrait',
    float_icon:'trending-up',
    float_value:'$240M+',
    float_label:'client revenue added',
    stat1_value:'200+', stat1_label:'founders coached',
    stat2_value:'14yrs', stat2_label:'operating experience',
    stat3_value:'4.9/5', stat3_label:'average rating'
  });

  const about = kv('about', {
    eyebrow:'About John',
    heading:'I’ve been in your seat — and built the playbook to get out',
    image:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=75&auto=format&fit=crop',
    image_alt:'John Carter mentoring a founder at a whiteboard',
    intro:'I help founders and entrepreneurs scale from zero to millions without burning out.',
    story:'<p>I started as a bootstrapped founder with no network and no funding. Over 14 years I built and scaled three companies to a combined <strong>$50M+ ARR</strong> and exited two of them.</p><p>Today I work with 20–30 founders a year, helping them install the systems, hire the right team, and make the strategic bets that compound. No fluff — just the frameworks that actually move revenue.</p>',
    points:'Scaled 3 companies to $50M+ combined ARR|Backed 30+ startups as an angel investor|Featured in Forbes, Inc. and TechCrunch|Direct, data-driven, accountability-first',
    signature:'— John Carter'
  });

  const services = sheet('services',
    ['name','slug','target_audience','description','duration','frequency','deliverables','price','pricing_model','icon','cta_text','order'],
  [
    ['1:1 Executive Coaching','executive-coaching','Founders $100K–$1M ARR',
     'High-touch coaching to sharpen strategy, fix bottlenecks and hold you accountable to aggressive growth targets.',
     '6 months','Bi-weekly',
     '12 one-hour calls|Direct email & WhatsApp access|Custom growth strategy doc|Template & resource library',
     5000,'one-time','briefcase','Book a discovery call',1],
    ['90-Day Strategy Intensive','strategy-intensive','Founders preparing to scale fast',
     'A focused sprint to audit your business, build a 90-day roadmap and execute with weekly accountability.',
     '90 days','Weekly',
     '12 weekly calls|Full business audit & roadmap|Weekly accountability check-ins|KPI dashboard setup',
     8000,'one-time','target-arrow','Apply for a sprint',2],
    ['Done-With-You Scale Program','scale-program','Teams pushing past $1M ARR',
     'My most comprehensive program — a full transformation with group coaching and an investor network introduction.',
     '12 months','Bi-weekly + monthly group',
     '24 one-hour calls|Weekly Slack support|Full transformation roadmap|Monthly founder group coaching|Investor network access',
     15000,'retainer','rocket','Request an invite',3],
  ]);

  const testimonials = sheet('testimonials',
    ['client_name','role','company','industry','testimonial','result_metric','result_value','photo','rating'],
  [
    ['Sarah Mitchell','Founder & CEO','Lumen SaaS','B2B Software',
     'John helped me go from a stalled $30K/month to a clear path past seven figures. The frameworks alone paid for the program in the first 60 days.',
     'Annual revenue','$30K → $1.4M ARR',
     'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&q=75&auto=format&fit=crop',5],
    ['David Okafor','Co-founder','Northbound Logistics','Operations',
     'The accountability was the unlock. We tightened our ops, doubled margins and finally hired the leadership team I’d been avoiding for years.',
     'Profit margin','+22% margin',
     'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=75&auto=format&fit=crop',5],
    ['Priya Raman','Founder','Bloom Studio','E-commerce',
     'I came in overwhelmed and left with systems. We 3x’d revenue in a year and I work fewer hours than before. Genuinely life-changing coaching.',
     'Growth rate','3x in 12 months',
     'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=75&auto=format&fit=crop',5],
  ]);

  const pricing = sheet('pricing',
    ['tier_name','slug','price','currency','billing','duration','target_audience','features','excluded','is_popular','cta_text','order'],
  [
    ['Starter','starter',1500,'USD','monthly','3 month minimum','Solo founders exploring coaching',
     'Monthly strategy call|Email support|Growth checklist|Resource library access',
     'Slack support|Group coaching|Investor network','false','Get started',1],
    ['Growth','growth',4000,'USD','monthly','6 month engagement','Scaling founders ($100K–$1M ARR)',
     'Bi-weekly coaching calls|Slack support|Custom growth strategy|Template library|90-day action plan',
     'Investor network','true','Start scaling',2],
    ['Scale','scale',12000,'USD','monthly','12 month engagement','Ambitious founders aiming for $1M+ ARR',
     'Weekly 1:1 calls|Priority Slack support|Full transformation roadmap|Monthly group coaching|Investor network access',
     '','false','Request an invite',3],
  ]);

  const faq = sheet('faq', ['question','answer','category','order'], [
    ['How do I know if coaching is right for me?',
     '<p>If you’re a founder who is serious about growth, coachable, and willing to do the work between sessions, coaching pays for itself many times over. The best way to find out is a free strategy call — we’ll diagnose your biggest bottleneck before you commit to anything.</p>','fit',1],
    ['What results can I realistically expect?',
     '<p>Most clients see measurable movement within 60–90 days — clearer strategy, better margins, and a working growth system. Revenue outcomes vary by stage and execution, but every engagement is built around specific, agreed KPIs.</p>','results',2],
    ['How much time does it require each week?',
     '<p>Plan for your call plus 2–4 hours of focused implementation per week. The coaching is designed to <em>save</em> you time by killing low-leverage work, not add to your plate.</p>','commitment',3],
    ['What’s your refund / cancellation policy?',
     '<p>Monthly plans can be cancelled anytime before your next billing date. Intensives include a 14-day satisfaction guarantee — if the first sessions aren’t a fit, you get a full refund.</p>','pricing',4],
    ['Do you only work with tech startups?',
     '<p>No. I work with founders across SaaS, e-commerce, services and logistics. The frameworks are industry-agnostic — what matters is that you have a real business with room to scale.</p>','fit',5],
    ['How do we actually work together?',
     '<p>Everything runs through scheduled video calls plus async support (email or Slack depending on your tier). You’ll get a shared workspace with your roadmap, KPIs and resources so nothing falls through the cracks.</p>','process',6],
  ]);

  const blog = sheet('blog',
    ['title','slug','meta_description','content','publish_date','category','tags','reading_time','image','image_alt','author','featured'],
  [
    ['The $1M Founder Operating System: 5 Systems That Scale',
     'founder-operating-system',
     'The five core systems every founder must install to scale past seven figures without burning out — and how to sequence them.',
     '<p>Most founders don’t have a growth problem — they have a systems problem. Below are the five systems I install with every client, in the order that creates the most leverage.</p><h2>1. The Weekly Operating Rhythm</h2><p>A single weekly meeting that reviews your three north-star metrics and the one bottleneck blocking them. Everything else is noise.</p><h2>2. The Hiring Scorecard</h2><p>Stop hiring on vibes. Define the outcomes a role must produce in 90 days, then interview against that scorecard.</p><blockquote>You don’t rise to your goals — you fall to your systems.</blockquote><h2>3. The Cash Dashboard</h2><p>One screen: revenue, runway, and CAC payback. If you can’t see it weekly, you can’t steer it.</p><h2>4. The Delegation Ladder</h2><p>Document, demonstrate, delegate, then disappear. Most founders skip the first two steps and wonder why delegation fails.</p><h2>5. The Strategic Bet</h2><p>One concentrated bet per quarter. Focus beats hustle every time.</p><p>Install these in sequence and growth stops feeling like chaos and starts feeling like a machine.</p>',
     '2026-05-12','frameworks','scaling,systems,operations',6,
     'https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=75&auto=format&fit=crop',
     'Team collaborating on a growth strategy at a desk','John Carter','true'],
    ['How to Hire Your First Leadership Team (Without Regret)',
     'first-leadership-team',
     'A practical framework for making your first executive hires — when to hire, who to hire first, and how to avoid the classic founder mistakes.',
     '<p>Your first leadership hires will make or break your next stage of growth. Here’s how to get them right.</p><h2>Hire for the bottleneck, not the org chart</h2><p>Don’t copy a Series-B org chart onto a pre-Series-A company. Hire the one role that removes your biggest constraint right now.</p><h2>The 90-day outcome test</h2><p>Before you open a role, write the three outcomes this person must deliver in 90 days. If you can’t, you’re not ready to hire them.</p><ul><li>Define outcomes before titles</li><li>Interview for evidence, not enthusiasm</li><li>Reference-check relentlessly</li></ul><h2>Let go of the rope</h2><p>The hardest part isn’t hiring — it’s trusting. Give your new leaders real ownership or you’ve just hired expensive assistants.</p>',
     '2026-04-28','insights','hiring,leadership,team',5,
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=75&auto=format&fit=crop',
     'A founder interviewing a candidate across a table','John Carter','false'],
    ['Case Study: From $30K/Month to $1.4M ARR in 11 Months',
     'case-study-lumen-saas',
     'The exact playbook one SaaS founder used to break through a revenue plateau and scale to seven figures in under a year.',
     '<p>When Sarah came to me, Lumen SaaS had been stuck at $30K/month for nine months. Here’s precisely what we changed.</p><h2>Step 1: Killed the wrong customers</h2><p>We cut the bottom 40% of accounts that drained support and raised prices on the rest. Revenue dipped for one month, then climbed.</p><h2>Step 2: Built a repeatable sales motion</h2><p>We documented the one channel that worked and doubled down instead of chasing five at once.</p><h2>Step 3: Hired ahead of the curve</h2><p>One senior account executive, hired against a clear scorecard, added more pipeline than the previous three junior reps combined.</p><blockquote>Focus didn’t shrink the business — it unlocked it.</blockquote><p>Eleven months later: $1.4M ARR, healthier margins, and a founder who finally takes weekends off.</p>',
     '2026-04-09','case-studies','case-study,saas,growth',7,
     'https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=75&auto=format&fit=crop',
     'A rising revenue chart on a laptop screen','John Carter','false'],
  ]);

  const cta = kv('cta_final', {
    heading:'Ready to scale your business?',
    subheadline:'Let’s talk about your goals and build a 90-day action plan together — free, no pitch.',
    cta_text:'Book your free strategy call'
  });

  const footer = kv('footer', {
    about_text:'Business coaching for founders who are serious about growth. Proven frameworks, real accountability, measurable results.',
    cta_text:'Book a free strategy call and let’s map your next move.',
    copyright:'All rights reserved.'
  });

  return [config, nav, meta, hero, about, services, testimonials, pricing, faq, blog, cta, footer].join('\n\n') + '\n';
}

/* ---- run ---- */
if(!fs.existsSync(TSV)){
  fs.writeFileSync(TSV, seedTSV(), 'utf8');
  console.log('✓ Seeded coach-data.tsv');
} else {
  console.log('• coach-data.tsv already exists — leaving it untouched');
}

const tsvText = fs.readFileSync(TSV, 'utf8');
let html = fs.readFileSync(HTML, 'utf8');
const re = /(<script id="fallback-tsv"[^>]*>)([\s\S]*?)(<\/script>)/;
if(!re.test(html)){ console.error('✗ Could not find fallback-tsv block in index.html'); process.exit(1); }
html = html.replace(re, (_, a, __, c) => a + '\n' + tsvText.replace(/\$/g,'$$$$') + c);
fs.writeFileSync(HTML, html, 'utf8');
console.log('✓ Synced embedded fallback inside index.html');
