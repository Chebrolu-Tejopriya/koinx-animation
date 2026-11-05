const featureData = [
  {
    "title": "Unified Financial Platform",
    "description": "Manage all your financial operations in one place with our comprehensive platform built for modern businesses."
  },
  {
    "title": "Real-time Financial Analytics",
    "description": "Access up-to-the-minute insights of your financial health and performance metrics."
  },
  {
    "title": "Team Collaboration",
    "description": "Enable secure collaboration with role-based access controls and real-time updates across your organization."
  },
  {
    "title": "Automated Compliance",
    "description": "Stay compliant with regulations across multiple jurisdictions with built-in compliance checks and updates."
  }
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
const featureNextSection = document.createElement('section');
featureNextSection.className = 'feature-next-section';
featureNextSection.setAttribute('aria-label','Next section');
featurePanel.append(featureNextSection);
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
const versionSwitch = document.createElement('div');
versionSwitch.className = 'feature-version-switch';
versionSwitch.setAttribute('role','group');
versionSwitch.setAttribute('aria-label','Feature icon version');
const versionButtons = ['v1','v2'].map(version => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = version.toUpperCase();
  button.setAttribute('aria-label',`Use ${version.toUpperCase()} icons`);
  button.addEventListener('click',() => selectIconVersion(version));
  versionSwitch.append(button);
  return button;
});
document.querySelector('.view-tabs').append(versionSwitch);
function selectIconVersion(version) {
  const next = version === 'v2' ? 'v2' : 'v1';
  featurePanel.dataset.iconVersion = next;
  featureTiles.forEach((tile,index) => {
    for (const state of ['default','selected']) {
      const template = document.getElementById(`feature-${index+1}-${next==='v2'?'v2-':''}${state}`);
      tile.querySelector(`.feature-variant-${state}`).replaceChildren(template.content.cloneNode(true));
    }
  });
  versionButtons.forEach((button,index) => button.setAttribute('aria-pressed',String(next === `v${index+1}`)));
  const url = new URL(location.href);
  url.searchParams.set('featureVersion',next);
  history.replaceState(null,'',url);
}
selectIconVersion(new URL(location.href).searchParams.get('featureVersion'));
let selectedFeature = 0;
let wheelTotal = 0;
let wheelTime = 0;
let wheelConsumed = false;
let transitionUntil = 0;
function pinDesktopFrame() {
  if (mobileFeatures.matches) return;
  const top = featurePanel.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({top,behavior:'instant'});
}

function selectFeature(index, initial = false) {
  const next = Math.max(0,Math.min(featureTiles.length-1,index));
  if (next === selectedFeature && !initial) return false;
  selectedFeature = next;
  featurePanel.dataset.selectedFeature = String(next+1);
  const finalStack = mobileFeatures.matches && next === featureTiles.length-1;
  featureTiles.forEach((tile,tileIndex) => {
    const offset = tileIndex - selectedFeature;
    const visible = finalStack ? offset>=-2 && offset<=0 : Math.abs(offset)<=1;
    const top = finalStack
      ? offset === -2 ? 0 : offset === -1 ? 242 : offset === 0 ? 494 : -252
      : offset === -1 ? 0 : offset === 0 ? 242 : offset === 1 ? 494 : offset < -1 ? -252 : 746 + (offset-2)*252;
    tile.classList.toggle('is-selected', offset === 0);
    tile.classList.toggle('is-neighbor', visible && offset !== 0);
    tile.style.transform = `translate3d(1px,${top}px,0)`;
    tile.style.opacity = visible ? '1' : '0';
    tile.style.pointerEvents = visible ? 'auto' : 'none';
    tile.setAttribute('aria-hidden', String(!visible));
    tile.setAttribute('aria-label',`${tileIndex+1}. ${featureData[tileIndex].title}${offset===0?', selected':''}`);
  });
  featureTitle.textContent = featureData[next].title;
  featureDescription.textContent = featureData[next].description;
  for (const id of ['189217','189218','189219','189220']) {
    const rail = featureDiagram.querySelector(`[data-node-id="11250:${id}"]`);
    rail.style.top = `${next===0?335.5:95.5}px`;
    rail.style.height = `${next===0?229:next===3&&!finalStack?240:468.5}px`;
  }
  window.dispatchEvent(new Event('featureselectionchange'));
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
  pinDesktopFrame();
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
  if (!mobileFeatures.matches && performance.now()>=transitionUntil &&
      (direction>0&&selectedFeature===3 || direction<0&&selectedFeature===0)) return;
  event.preventDefault();
  if (performance.now()<transitionUntil) return;
  const target = event.key==='Home'?0:event.key==='End'?3:Math.max(0,Math.min(3,selectedFeature+direction));
  if (mobileFeatures.matches) {
    const start = featureSequence.getBoundingClientRect().top + window.scrollY;
    const travel = featureSequence.offsetHeight - featureStage.offsetHeight;
    const step = (travel-96)/2.5;
    window.scrollTo({top:start+Math.min(travel,target*step),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  } else { pinDesktopFrame(); selectFeature(target); }
});
// Wheel input outside the stack keeps the pinned desktop frame steady, while
// the first/last boundary remains available for normal section navigation.
featurePanel.addEventListener('wheel',event => {
  if (mobileFeatures.matches || event.defaultPrevented || featureColumn.contains(event.target)) return;
  if (selectedFeature===3 || event.deltaY<0&&selectedFeature===0) return;
  const frame = featurePanel.querySelector('.features-artboard').getBoundingClientRect();
  if (frame.top<=1 && frame.bottom>0) event.preventDefault();
},{passive:false});
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
  pinDesktopFrame();
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
  const sequenceTop = featureSequence.getBoundingClientRect().top;
  const start = sequenceTop + window.scrollY;
  const pinned = start > 0 ? Math.max(0,Math.min(1,window.scrollY/start)) : 1;
  featureStage.classList.toggle('is-pinned',sequenceTop<=0);
  // Preserve the first three scroll intervals; end the final hold after 96px.
  const step = (travel-96)/2.5;
  const index = Math.max(0,Math.min(featureTiles.length-1,Math.round(-sequenceTop/step)));
  const diagramHeight = featureDiagram.parentElement.offsetHeight;
  const scale = diagramHeight / 684.5;
  const centerOffset = (featureColumn.clientHeight-diagramHeight)/2;
  // The final tile has no following neighbor. Bring it closer to the fixed
  // details instead of leaving the empty lower half of the stack visible.
  const offset = index === featureTiles.length-1
    ? featureColumn.clientHeight - (494+199.5)*scale - 16
    : centerOffset;
  // Start the first selected tile directly below the heading, without an
  // empty slot for a previous tile. Center the stack as the heading leaves.
  const initialOffset = index === 0 ? -242*scale : 0;
  featureStage.style.setProperty('--feature-diagram-offset',`${initialOffset*(1-pinned)+offset*pinned}px`);
  selectFeature(index);
}
function scheduleMobileFeature() {
  if (!featureScrollFrame) featureScrollFrame = requestAnimationFrame(updateMobileFeature);
}
window.addEventListener('scroll',scheduleMobileFeature,{passive:true});
window.addEventListener('resize',scheduleMobileFeature);
window.addEventListener('featureselectionchange',scheduleMobileFeature);
mobileFeatures.addEventListener('change',() => {
  touchOrigin = null;
  wheelConsumed = false;
  selectFeature(selectedFeature,true);
  featureColumn.setAttribute('aria-label',mobileFeatures.matches
    ? 'Explore four features. Scroll the page or use the up and down arrow keys.'
    : 'Explore four features. Scroll here, swipe, or use the up and down arrow keys.');
  scheduleMobileFeature();
});
new ResizeObserver(scheduleMobileFeature).observe(featureStage);
new ResizeObserver(() => {
  featureStage.style.setProperty('--feature-copy-height', `${featureCopy.offsetHeight}px`);
  scheduleMobileFeature();
}).observe(featureCopy);
scheduleMobileFeature();
