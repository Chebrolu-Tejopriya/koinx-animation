const featureData = [
  {title:'Automated Transaction Classification',description:'Automatically organize complex crypto transactions into clear, accurate records.'},
  {title:'Real-time Financial Analytics',description:'Access up-to-the-minute insights of your financial health and performance metrics.'},
  {title:'Seamless Team Collaboration',description:'Bring your finance team together with shared access and coordinated workflows.'},
  {title:'Simplified Financial Reconciliation',description:'Match transactions, identify discrepancies, and keep your books accurate with less manual effort.'},
];
const featurePanel = document.getElementById('features-panel');
const featureColumn = featurePanel.querySelector('[data-node-id="11250:189214"]');
const featureDiagram = featurePanel.querySelector('[data-node-id="11250:189216"]');
const featureTitle = featurePanel.querySelector('[data-node-id="11250:189256"] p');
const featureDescription = featurePanel.querySelector('[data-node-id="11250:189257"]');
const featureCopy = featurePanel.querySelector('[data-node-id="11250:189254"]');
featurePanel.classList.add('features-interactive');
const mobileFeatures = window.matchMedia('(width < 700px)');
const featureSequence = featureColumn.parentElement;
// The mobile stage pins only while this sequence is in view. Its heading
// remains in normal document flow so it scrolls out naturally.
const featureStage = document.createElement('div');
featureStage.className = 'feature-scroll-stage';
featureSequence.insertBefore(featureStage, featureColumn);
featureStage.append(featureColumn, featureCopy);
featureSequence.classList.add('feature-scroll-sequence');
featureColumn.tabIndex = 0;
featureColumn.setAttribute('role', 'region');
featureColumn.setAttribute('aria-label', mobileFeatures.matches ? 'Explore four features. Scroll the page or use the up and down arrow keys.' : 'Explore four features. Scroll here, swipe, or use the up and down arrow keys.');
featureCopy.setAttribute('aria-live', 'polite');
featureCopy.setAttribute('aria-atomic', 'true');

// Keep the original rails and the callout connector; replace only the old
// three illustrative tiles with the exact four pairs of Figma variants.
for (const id of ['189221','189231','189241']) {
  featureDiagram.querySelector(`[data-node-id="11250:${id}"]`).hidden = true;
}
const featureTiles = featureData.map((feature,index) => {
  const tile = document.createElement('div');
  tile.className = 'feature-tile';
  tile.dataset.featureIndex = index;
  tile.setAttribute('role','img');
  tile.setAttribute('aria-label',`${index+1}. ${feature.title}`);
  for (const variant of ['default','selected']) {
    const layer = document.createElement('div');
    layer.className = `feature-variant feature-variant-${variant}`;
    layer.append(document.getElementById(`feature-${index+1}-${variant}`).content.cloneNode(true));
    tile.append(layer);
  }
  featureDiagram.append(tile);
  return tile;
});
let selectedFeature = 0;
let wheelTotal = 0;
let wheelTime = 0;
let wheelConsumed = false;
let transitionUntil = 0;

function selectFeature(index, initial = false) {
  const next = Math.max(0,Math.min(featureTiles.length-1,index));
  if (next === selectedFeature && !initial) return false;
  selectedFeature = next;
  featurePanel.dataset.selectedFeature = String(next+1);
  featureTiles.forEach((tile,tileIndex) => {
    const offset = tileIndex - selectedFeature;
    const top = offset === -1 ? 0 : offset === 0 ? 242 : offset === 1 ? 494 : offset < -1 ? -252 : 746 + (offset-2)*252;
    tile.classList.toggle('is-selected', offset === 0);
    tile.classList.toggle('is-neighbor', Math.abs(offset) === 1);
    tile.style.transform = `translate3d(1px,${top}px,0)`;
    tile.style.opacity = Math.abs(offset) <= 1 ? '1' : '0';
    tile.style.pointerEvents = Math.abs(offset) <= 1 ? 'auto' : 'none';
    tile.setAttribute('aria-hidden', String(Math.abs(offset)>1));
    tile.setAttribute('aria-label',`${tileIndex+1}. ${featureData[tileIndex].title}${offset===0?', selected':''}`);
  });
  featureTitle.textContent = featureData[next].title;
  featureDescription.textContent = featureData[next].description;
  for (const id of ['189217','189218','189219','189220']) {
    const rail = featureDiagram.querySelector(`[data-node-id="11250:${id}"]`);
    rail.style.top = `${next===0?335.5:95.5}px`;
    rail.style.height = `${next===0?229:next===3?240:468.5}px`;
  }
  if (!initial) {
    transitionUntil = performance.now()+600;
    featureCopy.classList.remove('feature-copy-enter');
    // Restart the short text entrance without changing the callout position.
    void featureCopy.offsetWidth;
    featureCopy.classList.add('feature-copy-enter');
  }
  return true;
}

featureColumn.addEventListener('wheel',event => {
  if (mobileFeatures.matches) return;
  if (Math.abs(event.deltaY)<=Math.abs(event.deltaX)) return;
  const now = performance.now();
  if (now-wheelTime>180) { wheelTotal=0; wheelConsumed=false; }
  wheelTime = now;
  const direction = Math.sign(event.deltaY);
  const atBoundary = direction<0&&selectedFeature===0 || direction>0&&selectedFeature===3;
  if (atBoundary && !wheelConsumed && now>=transitionUntil) return;
  event.preventDefault();
  if (wheelConsumed || now<transitionUntil) return;
  const pixels = event.deltaY * (event.deltaMode===1?16:event.deltaMode===2?featureColumn.clientHeight:1);
  wheelTotal = Math.sign(wheelTotal)!==Math.sign(pixels)?pixels:wheelTotal+pixels;
  if (Math.abs(wheelTotal)<60) return;
  wheelConsumed = true;
  selectFeature(selectedFeature+Math.sign(wheelTotal));
  wheelTotal = 0;
},{passive:false});

featureColumn.addEventListener('keydown',event => {
  const direction = event.key==='ArrowDown'||event.key==='PageDown'?1:event.key==='ArrowUp'||event.key==='PageUp'?-1:0;
  if (!direction && !['Home','End'].includes(event.key)) return;
  event.preventDefault();
  if (performance.now()<transitionUntil) return;
  const target = event.key==='Home'?0:event.key==='End'?3:Math.max(0,Math.min(3,selectedFeature+direction));
  if (mobileFeatures.matches) {
    const start = featureSequence.getBoundingClientRect().top + window.scrollY;
    const travel = featureSequence.offsetHeight - featureStage.offsetHeight;
    window.scrollTo({top:start+travel*target/3,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  } else selectFeature(target);
});
let touchOrigin = null;
featureColumn.addEventListener('touchstart',event => {
  if (mobileFeatures.matches) return;
  if (event.touches.length!==1) return;
  const y=event.touches[0].clientY;
  touchOrigin={y,lastY:y,consumed:false};
},{passive:true});
featureColumn.addEventListener('touchmove',event => {
  if (mobileFeatures.matches) return;
  if (!touchOrigin||event.touches.length!==1) return;
  const y=event.touches[0].clientY;
  const delta=touchOrigin.y-y;
  const boundary=delta<0&&selectedFeature===0||delta>0&&selectedFeature===3;
  if (boundary&&!touchOrigin.consumed&&performance.now()>=transitionUntil) return;
  event.preventDefault();
  if (touchOrigin.consumed||performance.now()<transitionUntil||Math.abs(delta)<45) return;
  touchOrigin.consumed=true;
  selectFeature(selectedFeature+Math.sign(delta));
},{passive:false});
featureColumn.addEventListener('touchend',()=>{touchOrigin=null;},{passive:true});
featureColumn.addEventListener('touchcancel',()=>{touchOrigin=null;},{passive:true});
selectFeature(0,true);

let featureScrollFrame = 0;
function updateMobileFeature() {
  featureScrollFrame = 0;
  if (!mobileFeatures.matches || featurePanel.hidden) return;
  const travel = featureSequence.offsetHeight - featureStage.offsetHeight;
  if (travel <= 0) return;
  const progress = Math.max(0,Math.min(1,-featureSequence.getBoundingClientRect().top/travel));
  selectFeature(Math.round(progress * (featureTiles.length - 1)));
}
function scheduleMobileFeature() {
  if (!featureScrollFrame) featureScrollFrame = requestAnimationFrame(updateMobileFeature);
}
window.addEventListener('scroll',scheduleMobileFeature,{passive:true});
window.addEventListener('resize',scheduleMobileFeature);
mobileFeatures.addEventListener('change',() => {
  touchOrigin = null;
  wheelConsumed = false;
  featureColumn.setAttribute('aria-label',mobileFeatures.matches
    ? 'Explore four features. Scroll the page or use the up and down arrow keys.'
    : 'Explore four features. Scroll here, swipe, or use the up and down arrow keys.');
  scheduleMobileFeature();
});
new ResizeObserver(scheduleMobileFeature).observe(featureStage);
scheduleMobileFeature();
