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

// Temporarily pin Books Flow to the single variant shown in the preview.
document.querySelector('.scene').dataset.iconLayout = 'scattered';
document.querySelector('.processor').dataset.highlightStyle = 'fill';

const booksUrl = new URL(location.href);
if (booksUrl.searchParams.has('iconLayout') || booksUrl.searchParams.has('processorStyle')) {
  booksUrl.searchParams.delete('iconLayout');
  booksUrl.searchParams.delete('processorStyle');
  history.replaceState(null, '', booksUrl);
}
