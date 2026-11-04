const tabs = [...document.querySelectorAll('.view-tabs [role="tab"]')];
function selectView(tab, focus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  history.replaceState(null, '', tab.id === 'books-tab' ? '#books' : '#features');
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
new ResizeObserver(() => {
  if (!illustration.clientWidth) return;
  const scale = Math.min(1, (illustration.clientWidth - 32) / 302);
  illustration.style.setProperty('--diagram-scale', scale);
  illustration.style.setProperty('--diagram-width', `${302 * scale}px`);
  illustration.style.setProperty('--diagram-height', `${684.5 * scale}px`);
}).observe(illustration);
