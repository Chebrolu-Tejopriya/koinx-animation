const tabs = [...document.querySelectorAll('.view-tabs [role="tab"]')];
function selectView(tab, focus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  const url = new URL(location.href);
  url.hash = tab.id === 'books-tab' ? 'books' : 'features';
  history.replaceState(null, '', url);
  if (focus) tab.focus();
  window.dispatchEvent(new Event('resize'));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectView(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectView(tabs[next], true);
  });
});
selectView(document.getElementById(location.hash === '#books' ? 'books-tab' : 'features-tab'));
const illustration = document.querySelector('[data-node-id="11250:189214"]');
function sizeFeatureIllustration() {
  if (!illustration.clientWidth) return;
  const mobile = window.matchMedia('(width < 700px)').matches;
  const finalStack = mobile && document.getElementById('features-panel').dataset.selectedFeature === '4';
  // Updated mobile Figma frame scales the existing artwork to 90.51%.
  const scale = mobile
    ? Math.min(.9051095, (illustration.clientWidth - 48) / 302,
        finalStack ? Math.max(1,illustration.clientHeight-32)/693.5 : 1)
    : Math.min(1, (illustration.clientWidth - 32) / 302);
  illustration.style.setProperty('--diagram-scale', scale);
  illustration.style.setProperty('--diagram-width', `${(mobile ? 286 : 302) * scale}px`);
  illustration.style.setProperty('--diagram-height', `${684.5 * scale}px`);
}
new ResizeObserver(sizeFeatureIllustration).observe(illustration);
window.addEventListener('resize',sizeFeatureIllustration);
window.addEventListener('featureselectionchange',sizeFeatureIllustration);
