import json, re, html
from pathlib import Path

sources = json.loads(Path('design-context.json').read_text(encoding='utf-8'))
sources += json.loads(Path('reconciliation-context.json').read_text(encoding='utf-8'))
sources += json.loads(Path('features-context.json').read_text(encoding='utf-8'))
sources += json.loads(Path('feature-motion-parts.json').read_text(encoding='utf-8'))
sources += json.loads(Path('feature-v2-parts.json').read_text(encoding='utf-8'))
sources += json.loads(Path('columns-sources-context.json').read_text(encoding='utf-8'))
assets = {}
for item in sources:
    for name, url in re.findall(r'const (\w+) = "(https:[^"]+)";', item['code']):
        revision = '-'+item['assetRevision'] if item.get('assetRevision') else ''
        assets.setdefault(url, f"assets/{item['name']}{revision}-{name}.{url.rsplit('.',1)[1]}")

simple = {
 '-scale-x-100':'scale:-1 1',
 'border':'border-width:1px','border-l':'border-left-width:1px','border-r':'border-right-width:1px','h-px':'height:1px','w-px':'width:1px','left-px':'left:1px','z-[1]':'z-index:1','isolate':'isolation:isolate','-translate-x-1/2':'--tx:-50%;translate:var(--tx,0px) var(--ty,0px)','-translate-y-1/2':'--ty:-50%;translate:var(--tx,0px) var(--ty,0px)','bg-gradient-to-r':'background:linear-gradient(to right,transparent,#212538)',
 'flex-row':'flex-direction:row','self-stretch':'align-self:stretch','opacity-0':'opacity:0',
 'bg-white':'background:white','border-white':'border-color:white','ml-0':'margin-left:0','mt-0':'margin-top:0',
 'absolute':'position:absolute','relative':'position:relative','contents':'display:contents','block':'display:block','flex':'display:flex','inline-grid':'display:inline-grid',
 'flex-col':'flex-direction:column','items-center':'align-items:center','items-start':'align-items:flex-start','items-end':'align-items:flex-end','justify-center':'justify-content:center','justify-between':'justify-content:space-between','justify-end':'justify-content:flex-end',
 'content-stretch':'align-content:stretch','shrink-0':'flex-shrink:0','flex-none':'flex:none','size-full':'width:100%;height:100%','w-full':'width:100%','h-full':'height:100%',
 'top-0':'top:0','left-0':'left:0','right-0':'right:0','bottom-0':'bottom:0','top-px':'top:1px','inset-0':'inset:0','h-0':'height:0','w-0':'width:0','max-w-none':'max-width:none','min-w-px':'min-width:1px',
 'text-white':'color:white','text-black':'color:black','text-center':'text-align:center','text-right':'text-align:right','font-bold':'font-weight:700','font-semibold':'font-weight:600','font-medium':'font-weight:500','font-normal':'font-weight:400','not-italic':'font-style:normal',
 'whitespace-nowrap':'white-space:nowrap','overflow-clip':'overflow:clip','overflow-hidden':'overflow:hidden','object-cover':'object-fit:cover','pointer-events-none':'pointer-events:none','text-ellipsis':'text-overflow:ellipsis','border-solid':'border-style:solid','border-0':'border-width:0','border-b-0':'border-bottom-width:0','bg-clip-padding':'background-clip:padding-box',
 'col-1':'grid-column:1','row-1':'grid-row:1','place-items-start':'place-items:start','grid-cols-[max-content]':'grid-template-columns:max-content','grid-rows-[max-content]':'grid-template-rows:max-content',
 '-scale-y-100':'scale:1 -1','rotate-180':'rotate:180deg','rotate-30':'rotate:30deg','-rotate-30':'rotate:-30deg','-skew-x-30':'transform:skewX(-30deg)','skew-x-30':'transform:skewX(30deg)','scale-y-87':'scale:1 .87',
 'mask-alpha':'mask-mode:alpha','mask-intersect':'mask-composite:intersect','mask-no-clip':'mask-clip:no-clip','mask-no-repeat':'mask-repeat:no-repeat',
}
props={'h':'height','w':'width','size':'width','left':'left','right':'right','top':'top','bottom':'bottom','inset':'inset','gap':'gap','p':'padding','px':'padding-inline','py':'padding-block','pt':'padding-top','pb':'padding-bottom','ml':'margin-left','mt':'margin-top','mr':'margin-right','mb':'margin-bottom','rounded':'border-radius','leading':'line-height','tracking':'letter-spacing','flex':'flex','rotate':'rotate','mask-size':'mask-size','mask-position':'mask-position'}
rules={}
unknown=set()
def convert_class(c):
    if c in simple: return simple[c]
    if c.startswith('[word-break:'): return 'word-break:break-word'
    if c.startswith('font-'): return 'font-family:'+('Space Grotesk' if 'typeface' in c.lower() else 'Inter')
    m=re.fullmatch(r'([\w-]+)-\[(.*)\]',c)
    if m:
        k,v=m.groups(); v=v.replace('\\/','/').replace('_',' ')
        v=re.sub(r'(?<=%)([+-])(?=[0-9])',r' \1 ',v)
        tokens={'--surface/surface-raised':'#171a26','--border/border-tertiary':'#212538','--border/border-secondary':'#2d3246','--content/content-secondary':'#d1d7ed','--content/content-tertiary':'#a9afc5'}
        tokens.update({'--surface/surface-success-tertiary':'#10281f','--content/content-primary':'#eff5ff'})
        v=re.sub(r'var\(([^,]+),([^\)]+)\)',lambda m:tokens.get(m[1],m[2]),v)
        if k=='text': return ('color:'+v.removeprefix('color:')) if v.startswith(('color:','#','white','black')) else 'font-size:'+v
        if k=='bg': return 'background:'+v
        if k in ['border','border-b','border-l','border-r']:
            side={'border-b':'border-bottom-width:','border-l':'border-left-width:','border-r':'border-right-width:'}
            return ('border-color:' if v.startswith(('#','transparent')) else side.get(k,'border-width:'))+v
        if k=='drop-shadow':
            return 'filter:'+ ' '.join('drop-shadow('+s+')' for s in re.split(r'(?<=\)),',v))
        if k in props: return props[k]+':'+v+(';height:'+v if k=='size' else '')
    if c.startswith(('bg-gradient','from-','to-')): return ''
    unknown.add(c);return ''

def classes(m):
    declarations=[]
    for c in m.group(1).split():
        if c not in rules: rules[c]=('u'+str(len(rules)),convert_class(c))
        declarations.append(rules[c][0])
    return 'class="'+' '.join(declarations)+'"'

parts={}
for item in sources:
    code=item['code']; constants=dict(re.findall(r'const (\w+) = "([^"]+)";',code))
    body=code[code.index('return ')+7:].strip()
    if body.startswith('('): body=body[1:body.rfind(');')]
    else: body=body[:body.rfind(';')]
    body=re.sub(r'className=\{className \|\| "([^"]+)"\}',r'className="\1"',body)
    body=re.sub(r'src=\{(\w+)\}',lambda m:'src="'+assets[constants[m[1]]]+'"',body)
    body=re.sub(r'style=\{\{ maskImage: `url\("\$\{(\w+)\}"\)` \}\}',lambda m:'style="mask-image:url('+assets[constants[m[1]]]+')"',body)
    body=body.replace('style={{ containerType: "size" }}','style="container-type:size"')
    body=re.sub(r'\{`([^`]+)`\}',lambda m:html.escape(m[1]),body)
    body=re.sub(r'className="([^"]*)"',classes,body)
    # Close only the actual self-closing element; matching by class would also
    # close nonempty wrappers that happen to share the same utility classes.
    body=re.sub(r'<div\b([^>]*?)/>', r'<div\1></div>', body)
    body=re.sub(r'\s*/>', '>',body)
    parts[item['name']]=body.strip()

page='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KoinX Books — Animation Study</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="motion.css"><link rel="stylesheet" href="responsive.css"></head>
<body><main class="viewport"><section class="scene" aria-label="KoinX Books turns exchange transactions into unified financial reports">
<header class="heading">HEADING</header>
<div class="flow"><div class="sources" aria-label="Connected exchanges and wallets">SOURCES</div><div class="processor" aria-label="KoinX Books processor">PROCESSOR</div><div class="connector"></div>
<section class="statement" aria-label="Unified Statement">LABEL<div class="statement-window"><div class="chart">CHART</div><div class="report-panel"><div class="reports">REPORTS</div><div class="balances">BALANCES</div></div><div class="fade-right"></div><div class="fade-bottom"></div></div></section></div>
</section></main><script src="app.js"></script><script src="responsive.js"></script></body></html>'''
for k in ['heading','sources','processor','label','chart','reports','balances']:page=page.replace(k.upper(),parts[k])
page=page.replace('<div class="processor"', '<div class="column-sources" aria-label="Exchange icons in staggered columns" hidden>'+parts['columns-sources']+'</div><div class="processor"',1)
recon='<section class="reconciliation marquee-card" aria-label="Reconciliation"><h2>Reconciliation</h2><div class="recon-columns">'+parts['recon-columns']+'</div><div class="recon-fields">'+parts['recon-fields']+'</div>'+''.join('<div class="recon-row">'+parts[f'recon-row-{i}']+'</div>' for i in range(1,8))+'</section>'
page=page.replace('<div class="fade-right"></div>',recon+'<div class="fade-right"></div>')
page=page.replace('<div class="connector"></div>', '<div class="connector"><img src="assets/connector.svg" alt=""></div>')
tabs='<nav class="view-tabs" role="tablist" aria-label="Animation views"><button id="books-tab" role="tab" aria-controls="books-panel" aria-selected="false" tabindex="-1">Books flow</button><button id="features-tab" role="tab" aria-controls="features-panel" aria-selected="true" tabindex="0">Feature highlights</button></nav>'
page=page.replace('<body><main class="viewport">','<body>'+tabs+'<main class="viewport" id="books-panel" role="tabpanel" aria-labelledby="books-tab" hidden>')
page=page.replace('</main><script src="app.js">','</main><section id="features-panel" class="features-view" role="tabpanel" aria-labelledby="features-tab"><div class="features-artboard">'+parts['features']+'</div></section><script src="tabs.js"></script><script src="app.js">')
page=page.replace('</head>','<link rel="stylesheet" href="views.css"></head>')
templates=''.join('<template id="'+name+'">'+parts[name]+'</template>' for name in parts if name.startswith('feature-') and name.endswith(('default','selected')))
page=page.replace('</body>',templates+'<script src="features.js"></script></body>')
page=page.replace('</head>','<link rel="stylesheet" href="features.css"></head>')
Path('index.html').write_text(page,encoding='utf-8')
css='''@font-face{font-family:Space Grotesk;src:url('assets/SpaceGrotesk.ttf');font-weight:300 700;font-style:normal}@font-face{font-family:Inter;src:url('assets/Inter.ttf');font-weight:100 900;font-style:normal}
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0a0a12;color:white;font-family:Inter,Arial,sans-serif}p{margin:0}img{display:block}button{font:inherit}.viewport{width:100%;overflow:hidden}.scene{position:relative;width:1440px;height:769px;background:#0a0a12;transform-origin:top left}.heading{position:absolute;left:80px;top:50px;width:1280px;height:90px}.flow{position:absolute;left:82px;top:204px;width:1276px;height:515px}.sources{position:absolute;left:42.3556px;top:19.0988px;width:357.861px;height:449.431px}.processor{position:absolute;left:463.7487px;top:144px;width:283.503px;height:227px}.connector{position:absolute;left:746.9px;top:256.5px;width:60px;border-top:1px solid #484e63;z-index:0}.statement{position:absolute;left:801.2513px;top:49.5px;width:464px;height:416px}.statement>p{height:20px}.statement-window{position:absolute;top:26px;left:0;width:464px;height:390px;border:1px solid transparent;border-radius:8px;overflow:hidden;padding:9px;background:linear-gradient(#0a0a12,#0a0a12) padding-box,linear-gradient(to bottom,#121d3a,#1f377f) border-box}.chart{position:absolute;left:9px;top:9px;width:446px;height:211.094px}.report-panel{position:absolute;left:9px;top:240.094px;width:446px;height:239px;border:.567px solid #484e63;border-radius:6px;background:#171a26}.reports{position:absolute;left:5.403px;top:5.403px;width:249.504px;height:229.701px}.balances{position:absolute;left:259.819px;top:5.403px;width:180px;height:229px}.fade-right{pointer-events:none;position:absolute;left:450px;top:.5px;width:65px;height:387px;background:linear-gradient(to left,#0a0a12,transparent)}.fade-bottom{pointer-events:none;position:absolute;left:9.75px;top:324.602px;width:446px;height:65px;background:linear-gradient(to top,#0a0a12,transparent)}
'''
css+='*{border-width:0;border-style:solid}\n.connector{border:0;height:1px;top:255.5px}.connector img{display:block}\n'
css+='\n'.join('.'+n+'{'+d+'}' for n,d in rules.values() if d)
Path('style.css').write_text(css,encoding='utf-8')
print('Unmapped classes:',sorted(unknown))
print('Assets:',len(assets))
