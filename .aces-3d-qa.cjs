const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const {createHash} = require('node:crypto');
const {chromium} = require(path.join(os.tmpdir(),'aces-browser-qa','node_modules','playwright-core'));
const baseDir = path.resolve('dist');
const basePath = '/aces-website/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const item = new URL(req.url,'http://localhost').pathname;
  if (item === '/favicon.ico') return res.writeHead(204).end();
  if (!item.startsWith(basePath)) return res.writeHead(404).end();
  const file = path.join(baseDir,item.slice(basePath.length) || 'index.html');
  if (!file.startsWith(baseDir+path.sep)||!fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200,{'content-type':mime[path.extname(file)] ?? 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
const visuals = process.env.ACES_VISUAL_DIR || os.tmpdir();
const widths = [[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]];
const programs = ['Web Development','UI/UX Design','Database Management','Cybersecurity Fundamentals','Artificial Intelligence','Computer Networking','Git and GitHub','Career Readiness'];
const events = ['General Assembly and Oath-Taking Ceremony 2026','Artificial Intelligence Seminar','Data Mining Seminar'];
const officers = [
  ['Faculty Adviser','Criselda L. Anday'],['President','Jaira Mae B. Basmayor'],['Vice President Internal','Mikaela S. Reyes'],
  ['Vice President External','Charisse Lei G. Chiong'],['Secretary','Jessie A. Salonga'],['Treasurer','Angela Judy V. Juliata'],
  ['Auditor','Nathaniel G. Simbajon'],['PRO Internal','Valerie P. Butac'],['PRO External','John Mark P. Oclares'],
  ['Director for Multimedia','Shemeah N. Mostaza'],['1st Year Representative','Rhian Joy Bidaure'],
  ['2nd Year Representative','Angel M. Rellata'],['3rd Year Representative','Chloie C. Macabenta'],['4th Year Representative','Roma D. San Andres'],
];
const committees = [
  ['Multimedia','Shemeah N. Mostaza'],['Photography','Andrea Germino','Ejil Zhin S. Marinas'],['Writing','Charisse Jane L. Lucinda','Awaiting official roster.'],
  ['Graphics Design','Sheryl Lyn May S. Hamto','Kristof James E. Coy-Yao'],['Technical','Jorgel Ezekiel A. Remegio','Aj Rey E. Nicolas'],
  ['Academics','Ysabelle Nhicole Yangco','Roxan L. Bornales','Luis Arwin L. Domino'],
  ['Community Outreach','Irish Jade M. Marcos','Mary Magdalene Valenzuela','Julianna Nicole Velasco'],
  ['Program','Head pending confirmation.'],['Public Relations','Head pending confirmation.'],
];
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
async function pixelDifference(page, before, after) {
  return page.evaluate(async ([first,second]) => {
    async function rgba(data) {
      const img = new Image();
      img.src = 'data:image/png;base64,' + data;
      await img.decode();
      const canvas = new OffscreenCanvas(img.width,img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0);
      return ctx.getImageData(0,0,img.width,img.height).data;
    }
    const [a,b] = await Promise.all([rgba(first),rgba(second)]);
    if (a.length!==b.length) return 1;
    let different=0;
    for (let i=0;i<a.length;i+=4) {
      if (Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>24) different++;
    }
    return different/(a.length/4);
  },[before.toString('base64'),after.toString('base64')]);
}
async function noOverflow(page) {
  const [scroll, view] = await page.evaluate(() => [document.documentElement.scrollWidth,document.documentElement.clientWidth]);
  assert.ok(scroll <= view+1,'Overflow '+scroll+' > '+view+' at '+page.url());
}
async function waitReady(page) {
  await page.getByRole('button',{name:'Reset 3D view'}).waitFor();
  await page.locator('.core-canvas canvas').waitFor();
}
async function swipe(page, locator, direction) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  const session = await page.context().newCDPSession(page);
  const y = Math.round(box.y+box.height*.48);
  const x = Math.round(box.x+box.width*.55);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for (let step=1;step<=7;step++) {
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+step*12*direction,y:y+step*3}]});
  }
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await session.detach();
}
async function checkModal(page, trigger, label, strings=[]) {
  await trigger.click();
  const dialog = page.getByRole('dialog',{name:label,exact:true});
  await dialog.waitFor();
  assert.ok(await dialog.getByRole('button',{name:'Close '+label,exact:true}).evaluate((button)=>button===document.activeElement));
  const details = await dialog.innerText();
  for(const value of strings) assert.ok(details.toLowerCase().includes(value.toLowerCase()),label+' missing '+value);
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'detached'});
  assert.ok(await trigger.evaluate((button)=>button===document.activeElement),'Focus not restored for '+label);
}
async function features(page, base, mobile) {
  for (const program of programs) await checkModal(page,page.getByRole('button',{name:'View Details: '+program,exact:true}),program,['WORKSHOP','Key learning topics']);
  for (const event of events) await checkModal(page,page.getByRole('button',{name:(event.includes('Seminar')?'View Seminar Details: ':'View details for ')+event,exact:true}),event,[event.includes('Seminar')?'Planned':'Status pending']);
  await page.getByRole('button',{name:'Planned',exact:true}).click();
  assert.equal(await page.locator('.event-grid article').count(),2);
  await page.getByRole('button',{name:'Completed',exact:true}).click();
  assert.equal(await page.locator('.event-grid article').count(),0);
  const carousel = page.getByRole('region',{name:'Browse Activity Categories'});
  await checkModal(page,carousel.getByRole('button',{name:/Workshops/}),'Workshops',['Explore Workshops']);
  assert.equal(await page.locator('.opportunity-list li').count(),6);
  assert.equal(await page.locator('.election-steps button').count(),6);
  await page.locator('.election-steps button').last().click();
  assert.match(await page.locator('.election-detail').innerText(),/Document Signing/);
  await page.getByText('Where is the ACES office?',{exact:true}).click();
  assert.ok(await page.locator('.faq details[open] p').isVisible());
  assert.equal(await page.locator('#by-laws a[download]').count(),0);
  await page.goto(base+'#/organization');
  await page.locator('.roster-explorer').waitFor();
  await noOverflow(page);
  await page.screenshot({path:path.join(visuals,'aces-organization-'+page.viewportSize().width+'-light.png'),animations:'disabled'});
  for (const [role,name] of officers) {
    await page.getByRole('button',{name:role,exact:true}).click();
    assert.equal(await page.locator('.profile-record h3').innerText(),name);
  }
  await page.getByRole('button',{name:'1st Year Representative',exact:true}).click();
  await checkModal(page,page.getByRole('button',{name:'View officer profile'}),'Rhian Joy Bidaure',['Identity pending final confirmation.']);
  const branch = page.locator('.roster-branch').filter({hasText:'Year representatives'});
  await branch.locator('summary').click();
  assert.equal(await branch.getAttribute('open'),null);
  await branch.locator('summary').click();
  for (const [team,...details] of committees) await checkModal(page,page.getByRole('button',{name:'View Team for '+team,exact:true}),team+' team',details);
  assert.equal(await page.locator('.profile-monogram').evaluate((node)=>getComputedStyle(node).color),'rgb(85, 85, 85)');
  await page.goto(base+'#/gallery');
  await page.locator('.gallery-tile button').first().click();
  const viewer = page.getByRole('dialog',{name:'photo viewer'});
  await viewer.waitFor();
  await page.keyboard.press('ArrowRight');
  assert.match(await viewer.getByRole('status').innerText(),/Photo 2 of/);
  if (mobile) {
    await swipe(page,viewer.locator('.lightbox-figure img'),-1);
    assert.match(await viewer.getByRole('status').innerText(),/Photo 3 of/);
  }
  await page.keyboard.press('Escape');
  await viewer.waitFor({state:'detached'});
  await noOverflow(page);
}
async function test(browser,base,width,height,full) {
  const mobile = width < 600;
  const page = await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
  page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',entry=>{if(entry.type()==='error')errors.push(entry.text());});
  await page.goto(base);
  await waitReady(page);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  const canvas = page.locator('.core-canvas canvas');
  const orbitPocket = page.locator('.core-viewport');
  assert.equal(await canvas.evaluate(c=>c.getContext('webgl2')!==null),true);
  await noOverflow(page);
  await page.evaluate(()=>document.fonts.ready);
  const clipped = await page.locator('.hero-line').evaluateAll(lines=>lines.some(line=>{ const range=document.createRange();range.selectNodeContents(line);return range.getBoundingClientRect().width > line.getBoundingClientRect().width+2; }));
  assert.equal(clipped,false,'Heading clipped at '+width);
  if (width===1440||width===390) await page.screenshot({path:path.join(visuals,'aces-3d-'+width+'-dark.png'),animations:'disabled'});
  await page.waitForTimeout(150);
  const initial=await orbitPocket.screenshot();
  for (const mode of ['Build','Lead','Learn']) {
    const before=hash(await orbitPocket.screenshot());
    await page.getByRole('button',{name:mode,exact:true}).click();
    await page.waitForTimeout(160);
    assert.notEqual(hash(await orbitPocket.screenshot()),before,mode+' did not change the rendered scene');
    assert.equal(await page.getByRole('button',{name:mode,exact:true}).getAttribute('aria-pressed'),'true');
  }
  const learnDifference = await pixelDifference(page,initial,await orbitPocket.screenshot());
  assert.ok(learnDifference<.035,'Learn did not restore the initial view, difference '+learnDifference);
  if (mobile) {
    await page.getByRole('button',{name:'Enable rotation'}).click();
    assert.equal(await orbitPocket.evaluate(node=>getComputedStyle(node).touchAction),'none');
    await swipe(page,orbitPocket,1);
    assert.ok(await pixelDifference(page,initial,await orbitPocket.screenshot())>.025,'Touch drag did not rotate the model');
    await page.getByRole('button',{name:'Done rotating'}).click();
    assert.equal(await orbitPocket.evaluate(node=>getComputedStyle(node).touchAction),'pan-y');
  } else {
    const box=await orbitPocket.boundingBox();
    await page.mouse.move(box.x+box.width*.45,box.y+box.height*.48);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width*.69,box.y+box.height*.62,{steps:8});
    await page.mouse.up();
    assert.ok(await pixelDifference(page,initial,await orbitPocket.screenshot())>.025,'Mouse drag did not orbit the model');
  }
  await page.getByRole('button',{name:'Reset 3D view'}).click();
  const resetDifference = await pixelDifference(page,initial,await orbitPocket.screenshot());
  assert.ok(resetDifference<.035,'Reset did not restore the initial view, difference '+resetDifference);
  await page.getByRole('button',{name:'Zoom in'}).click();
  assert.ok(await pixelDifference(page,initial,await orbitPocket.screenshot())>.02,'Zoom did not change the scene');
  await page.getByRole('button',{name:'Switch to light mode'}).click();
  await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
  assert.equal(await page.locator('body').evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(255, 255, 255)');
  await noOverflow(page);
  if (width===1440||width===390) {
    await page.getByRole('button',{name:'Reset 3D view'}).click();
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(visuals,'aces-3d-'+width+'-light.png'),animations:'disabled'});
  }
  if (full) await features(page,base,mobile);
  assert.deepEqual(errors,[],width+' browser errors');
  console.log(width+'px: rendered WebGL, mode angles, '+(mobile?'touch':'mouse')+' orbit, reset, zoom, both themes and overflow checked'+(full?', complete content and modal checks passed':''));
  await page.close();
}
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+basePath;
  const executablePath='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser=await chromium.launch({headless:true,executablePath,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const requested=Number(process.argv[2]);
    for(const [width,height] of widths) if(!requested||width===requested) await test(browser,base,width,height,width===1440||width===390);
    if (!requested) {
      const page=await browser.newPage({viewport:{width:1440,height:900}});
      await page.addInitScript(() => {
        window.acesQaDrawCalls = 0;
        for (const key of ['drawElements','drawArrays','drawElementsInstanced']) {
          const draw = WebGL2RenderingContext.prototype[key];
          WebGL2RenderingContext.prototype[key] = function (...args) {
            window.acesQaDrawCalls++;
            return draw.apply(this,args);
          };
        }
      });
      await page.goto(base);
      await waitReady(page);
      const canvas=page.locator('.core-canvas canvas');
      const before=hash(await canvas.screenshot());
      await page.waitForTimeout(550);
      assert.notEqual(hash(await canvas.screenshot()),before,'Idle motion did not animate');
      await page.locator('#workshops').evaluate((section)=>section.scrollIntoView({behavior:'instant'}));
      await page.waitForTimeout(300);
      const drawCount=await page.evaluate(()=>window.acesQaDrawCalls);
      await page.waitForTimeout(400);
      assert.equal(await page.evaluate(()=>window.acesQaDrawCalls),drawCount,'WebGL kept drawing while offscreen');
      console.log('Idle animation verified and WebGL drawing stops offscreen');
      await page.close();
    }
  } finally { await browser.close(); }
  if (!Number(process.argv[2])) {
    const fallback=await chromium.launch({headless:true,executablePath,args:['--disable-webgl']});
    try {
      const page=await fallback.newPage();
      await page.goto(base);
      await page.getByText('The ACES Core couldn’t load on this device.').waitFor();
      assert.equal(await page.locator('.core-canvas canvas').count(),0);
      console.log('WebGL disabled: official logo fallback renders and site remains navigable');
    } finally { await fallback.close(); }
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
