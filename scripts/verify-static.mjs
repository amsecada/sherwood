// Optional browser verification; uses an externally supplied Playwright installation, not a product dependency.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {mkdir} from 'node:fs/promises';
import {staticServer} from './serve-static.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const subject={PIN14:'01011000250000',street_address:'100 TEST ST',township_name:'Test',TAXYR:2026,BCLASS:'203',NBHD:12,BLDGSQFT:1000,BLDGAGE:50,CURRENTVALUE_TOTAL:100,current_procname:'TEST',current_value_desc:'County',latitude:42,longitude:-88};
let calls=0,mode='normal';
const fixture=async url=>{
 calls++;const where=new URL(url).searchParams.get('where');
 const baseParcel=mode==='other'?{...subject,PIN14:'01011000880000',street_address:'800 OTHER ST'}:subject;
 if(mode==='failure')throw new TypeError('fixture outage');
 const candidates=[{...subject,PIN14:'01011000430000',street_address:'200 TEST ST',CURRENTVALUE_TOTAL:90,latitude:42.001},{...subject,PIN14:'01011000450000',street_address:'300 TEST ST',CURRENTVALUE_TOTAL:110,longitude:-88.001}];
 let rows=where.includes('<>')?(mode==='empty'?[]:candidates):mode==='ambiguous'&&where.includes('UPPER')?[subject,{...subject,PIN14:'01011000990000',street_address:'100 TEST ST UNIT 2'}]:[baseParcel];
 if(mode==='locations-missing')rows=rows.map(r=>({...r,latitude:null,longitude:null}));
 if(mode==='missing-subject'&&!where.includes('<>'))rows=rows.map(r=>({...r,latitude:null,longitude:null}));
 if(mode==='overlap')rows=rows.map(r=>({...r,latitude:42,longitude:-88}));
 if(mode==='reverse'&&where.includes('<>'))rows.reverse();
 return new Response(JSON.stringify({features:rows.map(attributes=>({attributes}))}));
};
const server=staticServer({prefix:'/sherwood/'});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}/sherwood/`;
let browser;
try{
 browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1280,height:1000}});
 // Never bulk request real public tiles during automated testing.
 await context.route('https://tile.openstreetmap.org/**',route=>route.abort());
 const unexpected=[];
 await context.route('**/api/**',route=>{unexpected.push(route.request().url());return route.abort();});
 await context.route('https://gis.cookcountyil.gov/**',async route=>{try{const r=await fixture(route.request().url());await route.fulfill({status:200,contentType:'application/json',body:await r.text()});}catch{await route.abort();}});
 const page=await context.newPage();page.setDefaultTimeout(5000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('#lookup-submit').click();
 await page.locator('#analysis-content').waitFor({state:'visible'});
 assert.match(await page.locator('#analysis-content').innerText(),/1 are lower/);
 assert.equal(await page.locator('.map-choice').count(),0);assert.equal(await page.locator('#raw-source').getAttribute('open'),null);
 await page.locator('#raw-source summary').click();assert.equal(await page.locator('#raw-source').getAttribute('open'),'');assert.equal(calls,3);
 await page.getByRole('checkbox',{name:/confirm a simulated handoff/i}).check();
 await page.getByRole('button',{name:'Create simulated request',exact:true}).click();
 await page.getByText('Simulated request created.',{exact:true}).waitFor();
 mode='other';await page.locator('#lookup-value').fill('800 OTHER ST');await page.locator('#lookup-submit').click();await page.locator('#analysis-content').waitFor({state:'visible'});
 const management=page.locator('#handoff section').filter({has:page.getByRole('heading',{name:'Your test request',exact:true})});
 assert.match(await management.innerText(),/100 TEST ST/,'Retained request names its original parcel, not the new search');
 assert.equal(await page.locator('#raw-source').getAttribute('open'),null);
 mode='normal';
 await page.locator('#clear-live').click();assert.equal(await page.getByRole('button',{name:'Delete test request',exact:true}).count(),1);
 await page.getByRole('button',{name:'Withdraw test request',exact:true}).click();await page.getByText('Simulated request: withdrawn.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Delete test request',exact:true}).click();
 mode='ambiguous';await page.locator('#lookup-value').fill('100 TEST ST');await page.locator('#lookup-submit').click();
 await page.locator('#match-list button').first().waitFor();assert.equal(await page.locator('#match-list button').count(),2);
 await page.locator('#match-list button').first().click();await page.locator('#analysis-content').waitFor({state:'visible'});
 mode='empty';await page.locator('#lookup-submit').click();await page.getByText(/There are no usable compatible candidate values/).first().waitFor();
 assert.equal(await page.getByRole('button',{name:'Create simulated request',exact:true}).count(),0);
 mode='failure';await page.locator('#lookup-submit').click();await page.getByText(/Could not read CookViewer/).waitFor();assert.equal(await page.locator('#analysis').isVisible(),false);
 mode='normal';await page.locator('#lookup-submit').click();await page.locator('#analysis-content').waitFor({state:'visible'});
 await page.locator('#raw-source summary').click();mode='failure';
 await page.locator('#candidates-button').click();await page.getByText(/Could not read CookViewer/).waitFor();
 assert.equal(await page.locator('#raw-source').isVisible(),false,'Failed refresh hides stale raw fields');
 assert.equal(await page.locator('#field-rows tr').count(),0);
 mode='normal';await page.locator('#lookup-submit').click();await page.locator('#analysis-content').waitFor({state:'visible'});
 if(true){
  await page.locator('.property-map').scrollIntoViewIfNeeded();await page.locator('.map-marker').first().waitFor();
  const before=calls;await page.locator('.map-marker[data-pin="01011000430000"]').hover();
  assert.ok(await page.locator('tr[data-pin="01011000430000"]').evaluate(e=>e.classList.contains('map-selected')));
  await page.locator('.map-marker[data-pin="01011000430000"]').click();await page.keyboard.press('Escape');
  assert.equal(await page.locator('tr.map-selected').count(),0);
  await page.locator('tr[data-pin="01011000450000"]').focus();assert.ok(await page.locator('.map-marker[data-pin="01011000450000"]').evaluate(e=>e.classList.contains('selected')));
  assert.equal(calls,before);
  assert.ok(await page.locator('.map-controls').evaluate(e=>e.getBoundingClientRect().top >= document.querySelector('.map-viewport').getBoundingClientRect().bottom));
  assert.ok(await page.locator('.property-map').evaluate(e=>[...e.children].find(n=>n.textContent.startsWith('S = subject')).getBoundingClientRect().top >= e.querySelector('.map-viewport').getBoundingClientRect().bottom));
  assert.equal(await page.locator('.map-playback').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.radar-ring').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.getByRole('checkbox',{name:'Show street background (OpenStreetMap)',exact:true}).uncheck();assert.equal(await page.locator('.map-tiles img').count(),0);
  await page.getByRole('checkbox',{name:'Show street background (OpenStreetMap)',exact:true}).check();
  await mkdir('/tmp/sherwood-gallery-artifacts',{recursive:true});await page.screenshot({path:'/tmp/sherwood-gallery-artifacts/desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.locator('.property-map').scrollIntoViewIfNeeded();await page.locator('tr[data-pin="01011000430000"] > td').first().click();
  assert.ok(await page.locator('tr[data-pin="01011000430000"]').evaluate(e=>e.classList.contains('map-selected')));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await page.screenshot({path:'/tmp/sherwood-gallery-artifacts/mobile.png',fullPage:true});
 }
 if(true){
  const edge=await context.newPage();edge.setDefaultTimeout(5000);await edge.goto(base);
  for(const [variant,count] of [['locations-missing',0],['missing-subject',2],['overlap',3],['reverse',3]]){
   mode=variant;await edge.locator('#lookup-submit').click();await edge.locator('#analysis-content').waitFor({state:'visible'});
   await edge.locator('.property-map').scrollIntoViewIfNeeded();assert.equal(await edge.locator('.map-marker').count(),count);
   if(variant==='locations-missing')assert.match(await edge.locator('.property-map').innerText(),/Locations unavailable/);
   if(variant==='missing-subject')assert.match(await edge.locator('.property-map').innerText(),/Subject location unavailable/);
   if(variant==='overlap'||variant==='reverse'){
    await edge.locator('tr[data-pin="01011000430000"] > td').first().click();assert.ok(await edge.locator('tr[data-pin="01011000430000"]').evaluate(e=>e.classList.contains('map-selected')));
   }
  }
  await edge.close();mode='normal';
 }
 // Long-lived request controls must not be redrawn every tick after evidence expiry.
 const expiryPage=await context.newPage();expiryPage.setDefaultTimeout(5000);await expiryPage.clock.install();
 await expiryPage.goto(base);await expiryPage.locator('#lookup-submit').click();await expiryPage.locator('#analysis-content').waitFor({state:'visible'});
 await expiryPage.getByRole('checkbox',{name:/confirm a simulated handoff/i}).check();await expiryPage.getByRole('button',{name:'Create simulated request',exact:true}).click();
 await expiryPage.getByText('Simulated request created.',{exact:true}).waitFor();
 await expiryPage.clock.fastForward(901000);
 const withdraw=expiryPage.getByRole('button',{name:'Withdraw test request',exact:true});await withdraw.focus();await expiryPage.clock.runFor(2100);
 assert.ok(await withdraw.evaluate(e=>document.activeElement===e),'Receipt controls retain focus after evidence expiry');
 await expiryPage.close();
 await expiryPage.close().catch(()=>{});
 await page.reload();assert.equal(await page.getByRole('heading',{name:'Your test request',exact:true}).count(),0);
 assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});
 assert.deepEqual(unexpected,[]);
 assert.deepEqual(errors,[]);console.log('PASS: browser live flow, ambiguity, missing/source failure, consent, request persistence across clear, withdrawal/delete'+(true?', linked map, keyboard/Escape, no playback control/reduced motion, mobile selection and overflow':''));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
