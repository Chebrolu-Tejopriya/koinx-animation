function animateStatement() {
  const windowElement = document.querySelector('.statement-window');
  const cards = ['.chart', '.report-panel', '.reconciliation'].map(selector =>
    windowElement.querySelector(selector)
  );
  if (cards.some(card => !card)) return;
  const track = document.createElement('div');
  track.className = 'statement-track';
  const group = document.createElement('div');
  group.className = 'statement-group';
  cards.forEach(card => group.append(card));
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  track.append(duplicate, group);
  windowElement.prepend(track);
}
animateStatement();

const iconLayoutControl = document.createElement('div');
iconLayoutControl.className = 'icon-layout-control';
iconLayoutControl.setAttribute('role', 'group');
iconLayoutControl.setAttribute('aria-label', 'Exchange icon layout');
iconLayoutControl.innerHTML = '<span>Icon layout</span><button type="button" data-icon-layout="scattered" aria-pressed="true">Scattered</button><button type="button" data-icon-layout="aligned" aria-pressed="false">Aligned</button><button type="button" data-icon-layout="columns" aria-pressed="false">Columns</button>';
document.querySelector('.heading').append(iconLayoutControl);
const requestedLayout = new URL(location.href).searchParams.get('iconLayout');
const initialLayout = ['aligned','columns'].includes(requestedLayout) ? requestedLayout : 'scattered';
document.querySelector('.scene').dataset.iconLayout = initialLayout;
function updateStatementOrder(layout) {
  const order = layout === 'columns'
    ? ['.chart','.reconciliation','.report-panel']
    : ['.chart','.report-panel','.reconciliation'];
  for (const group of document.querySelectorAll('.statement-group')) {
    for (const selector of order) group.append(group.querySelector(selector));
  }
}
updateStatementOrder(initialLayout);
for (const button of iconLayoutControl.querySelectorAll('button[data-icon-layout]')) {
  button.setAttribute('aria-pressed',String(button.dataset.iconLayout === initialLayout));
}
iconLayoutControl.addEventListener('click', event => {
  const button = event.target.closest('button[data-icon-layout]');
  if (!button) return;
  document.querySelector('.scene').dataset.iconLayout = button.dataset.iconLayout;
  updateStatementOrder(button.dataset.iconLayout);
  const url = new URL(location.href);
  url.searchParams.set('iconLayout',button.dataset.iconLayout);
  history.replaceState(null,'',url);
  for (const option of iconLayoutControl.querySelectorAll('button[data-icon-layout]')) {
    option.setAttribute('aria-pressed', String(option === button));
  }
  window.dispatchEvent(new Event('resize'));
});

const processorStyleControl = document.createElement('div');
processorStyleControl.className = 'processor-style-control';
processorStyleControl.setAttribute('role','group');
processorStyleControl.setAttribute('aria-label','Processor highlight style');
processorStyleControl.innerHTML = '<span>Highlight</span><button type="button" data-processor-style="fill">Fill</button><button type="button" data-processor-style="border">Border</button>';
iconLayoutControl.append(processorStyleControl);
function selectProcessorStyle(style) {
  const next = style === 'border' ? 'border' : 'fill';
  document.querySelector('.processor').dataset.highlightStyle = next;
  for (const button of processorStyleControl.querySelectorAll('button')) {
    button.setAttribute('aria-pressed',String(button.dataset.processorStyle === next));
  }
  const url = new URL(location.href);
  url.searchParams.set('processorStyle',next);
  history.replaceState(null,'',url);
}
processorStyleControl.addEventListener('click',event => {
  const button = event.target.closest('button[data-processor-style]');
  if (button) selectProcessorStyle(button.dataset.processorStyle);
});
selectProcessorStyle(new URL(location.href).searchParams.get('processorStyle'));
