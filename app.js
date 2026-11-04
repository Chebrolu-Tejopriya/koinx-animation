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
iconLayoutControl.innerHTML = '<span>Icon layout</span><button type="button" data-icon-layout="aligned" aria-pressed="true">Aligned</button><button type="button" data-icon-layout="scattered" aria-pressed="false">Scattered</button>';
document.querySelector('.heading').append(iconLayoutControl);
document.querySelector('.scene').dataset.iconLayout = 'aligned';
iconLayoutControl.addEventListener('click', event => {
  const button = event.target.closest('button[data-icon-layout]');
  if (!button) return;
  document.querySelector('.scene').dataset.iconLayout = button.dataset.iconLayout;
  for (const option of iconLayoutControl.querySelectorAll('button')) {
    option.setAttribute('aria-pressed', String(option === button));
  }
  window.dispatchEvent(new Event('resize'));
});
