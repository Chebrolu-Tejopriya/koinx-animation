// Responsive layout uses real element positions; only the detailed processor
// and report internals scale. The connecting paths are rebuilt in CSS pixels.
const scene = document.querySelector('.scene');
const flow = document.querySelector('.flow');
const defaultSources = document.querySelector('.sources');
const columnSources = document.querySelector('.column-sources');
const processor = document.querySelector('.processor');
const statement = document.querySelector('.statement');
const svgNamespace = 'http://www.w3.org/2000/svg';
const wires = document.createElementNS(svgNamespace, 'svg');
wires.classList.add('responsive-wires');
wires.setAttribute('aria-hidden', 'true');
flow.prepend(wires);
const defaultIconPositions = [
  ['186050',32.66,153.73],['186055',94.85,0],['186060',0,308.31],
  ['186062',126.47,215.81],['186067',189.71,92.49],['186069',221.32,246.65],
  ['186080',158.09,339.13],['186085',189.71,400.8],['186090',63.24,400.8],
  ['186101',252.94,154.15],['186106',18.98,246.65],['186117',233.97,30.83],
].map(([id,x,y]) => ({element: defaultSources.querySelector(`[data-node-id="11250:${id}"]`), x, y}));
const columnIconPositions = ["11313:154526","11313:154531","11313:154533","11313:154535","11313:154540","11313:154545","11313:154547","11313:154550","11313:154555","11313:154560","11313:154566","11313:154568","11313:154572","11313:154575","11313:154580","11313:154585","11313:154587","11313:154593","11313:154598"].map(id => ({element:columnSources.querySelector(`[data-node-id="${id}"]`)}));
const paths = columnIconPositions.map((_, index) => {
  const path = document.createElementNS(svgNamespace, 'path');
  path.classList.add('responsive-wire');
  path.style.animationDelay = `${index * -.23}s`;
  wires.append(path);
  return path;
});
const outputPath = document.createElementNS(svgNamespace, 'path');
outputPath.classList.add('responsive-wire', 'output-wire');
wires.append(outputPath);
const inputTrunk = document.createElementNS(svgNamespace, 'path');
inputTrunk.classList.add('responsive-wire', 'converged-input');
wires.append(inputTrunk);
let inputRouting = null;

function drawIncomingWires() {
  if (!inputRouting) return;
  const {starts, vertical, processorScale} = inputRouting;
  const bounds = flow.getBoundingClientRect();
  // Branches meet once; only this shared trunk enters the floating processor.
  const tile = processor.querySelector(vertical ? '[data-node-id="11250:186129"]' : '[data-node-id="11250:186121"]').getBoundingClientRect();
  const endX = vertical ? tile.left + tile.width / 2 - bounds.left : tile.left - bounds.left + 3 * processorScale;
  const endY = vertical ? tile.top - bounds.top + 20 * processorScale : tile.top - bounds.top + 81 * processorScale;
  const sourceEdge = Math.max(...starts.map(point => vertical ? point.y : point.x));
  const gap = (vertical ? endY : endX) - sourceEdge;
  const trunkLength = Math.min(64, Math.max(18, gap * .55));
  const joinX = vertical ? endX : endX - trunkLength;
  const joinY = vertical ? endY - trunkLength : endY;
  starts.forEach(({x:startX,y:startY}, index) => {
    const bend = vertical ? Math.max(24, (joinY - startY) * .55) : Math.max(18, (joinX - startX) * .55);
    paths[index].setAttribute('d', vertical
      ? `M${startX},${startY} C${startX},${startY+bend} ${joinX},${joinY-bend} ${joinX},${joinY}`
      : `M${startX},${startY} C${startX+bend},${startY} ${joinX-bend},${joinY} ${joinX},${joinY}`);
  });
  inputTrunk.setAttribute('d', `M${joinX},${joinY} L${endX},${endY}`);
}

function followFloatingInput() {
  if (inputRouting && !document.hidden && !scene.closest('[hidden]')) drawIncomingWires();
  requestAnimationFrame(followFloatingInput);
}
requestAnimationFrame(followFloatingInput);

function place(element, x, y, scale = 1) {
  Object.assign(element.style, {left:`${x}px`,top:`${y}px`,transform:`scale(${scale})`,transformOrigin:'top left'});
}

function fitResponsiveLayout() {
  const width = flow.clientWidth;
  if (!width) return;
  const vertical = matchMedia('(width <= 1024px)').matches;
  const columnMode = scene.dataset.iconLayout === 'columns';
  const sources = columnMode ? columnSources : defaultSources;
  const iconPositions = columnMode ? columnIconPositions : defaultIconPositions;
  defaultSources.hidden = columnMode;
  columnSources.hidden = !columnMode;
  paths.forEach((path,index) => {
    path.style.display = index < iconPositions.length ? '' : 'none';
    if (index < iconPositions.length) path.dataset.sourceNode = iconPositions[index].element.dataset.nodeId;
  });
  const aligned = scene.dataset.iconLayout !== 'scattered';
  scene.classList.toggle('vertical-layout', vertical);
  let sourceX, sourceY, processorX, processorY, processorScale, statementX, statementY, statementScale, height;
  let iconScale = 1;
  let sourceScale = 1;
  if (columnMode) {
    sourceScale = vertical ? Math.min(1,(width-16)/426) : Math.min(1,width/1276);
    sourceX = vertical ? (width-426*sourceScale)/2 : 0;
    sourceY = 10;
    processorScale = vertical ? Math.min(1,(width-16)/300) : sourceScale;
    processorX = vertical ? (width-283.503*processorScale)/2 : width*480/1276;
    statementScale = vertical ? Math.min(1,width/464) : sourceScale;
    statementX = vertical ? (width-464*statementScale)/2 : width-464*statementScale;
    if (vertical) {
      processorY = 530*sourceScale+90;
      statementY = processorY+227*processorScale+68;
      height = statementY+416*statementScale;
    } else {
      height = Math.max(515,530*sourceScale);
      processorY = (height-227*processorScale)/2;
      statementY = (height-416*statementScale)/2;
    }
  } else if (vertical) {
    const sourceWidth = Math.min(width,520);
    sourceX = (width-sourceWidth)/2; sourceY = 8;
    sources.style.width = `${sourceWidth}px`;
    sources.style.height = aligned ? '205px' : '390px';
    processorScale = Math.min(1, (width - 16) / 300);
    processorX = (width - 283.503 * processorScale) / 2;
    processorY = aligned ? 300 : 470;
    statementScale = Math.min(1, width / 464);
    statementX = (width - 464 * statementScale) / 2;
    statementY = processorY + 227 * processorScale + 68;
    height = statementY + 416 * statementScale;
    const step = Math.max(0, (sourceWidth - 65) / 3);
    iconPositions.forEach(({element,x,y}, index) => place(element,
      aligned ? 8 + index % 4 * step : 8 + x / 252.94 * (sourceWidth - 65),
      aligned ? Math.floor(index / 4) * 74 : y * .85));
  } else {
    sourceX = width * 42.3556 / 1276; sourceY = 19.0988;
    const sourceWidth = width * 357.861 / 1276;
    sources.style.width = `${sourceWidth}px`;
    sources.style.height = '449.431px';
    processorScale = Math.min(1, Math.max(.75, width / 1276));
    processorX = width * 463.7487 / 1276;
    processorY = (515 - 227 * processorScale) / 2;
    statementScale = Math.min(1, width * .364 / 464);
    statementX = width - 464 * statementScale - width * 10.7487 / 1276;
    statementY = (515 - 416 * statementScale) / 2;
    height = 515;
    iconPositions.forEach(({element,x,y}) => place(element, x * sourceWidth / 357.861, y));
    if (aligned) placeAlignedIcons(sourceWidth, 449.431, 1);
  }
  place(sources, sourceX, sourceY,sourceScale);
  place(processor, processorX, processorY, processorScale);
  place(statement, statementX, statementY, statementScale);
  flow.style.height = `${height}px`;
  wires.setAttribute('viewBox', `0 0 ${width} ${height}`);
  wires.setAttribute('width', width);
  wires.setAttribute('height', height);
  const bounds = flow.getBoundingClientRect();
  const starts = iconPositions.map(({element}) => {
    const box = element.getBoundingClientRect();
    const startX = (vertical ? box.left + box.width / 2 : box.right) - bounds.left;
    const startY = (vertical ? box.bottom : box.top + box.height / 2) - bounds.top;
    return {x:startX,y:startY};
  });
  inputRouting = {starts, vertical, processorX, processorY, processorScale};
  drawIncomingWires();
  const fromX = processorX + (vertical ? 141.75 : 282) * processorScale;
  const fromY = processorY + (vertical ? 227 : 113) * processorScale;
  const toX = vertical ? statementX + 232 * statementScale : statementX;
  const toY = vertical ? statementY - 8 : statementY + 208 * statementScale;
  outputPath.setAttribute('d', vertical
    ? `M${fromX},${fromY} C${fromX},${fromY+24} ${toX},${toY-24} ${toX},${toY}`
    : `M${fromX},${fromY} C${fromX+24},${fromY} ${toX-24},${toY} ${toX},${toY}`);
}
function placeAlignedIcons(width, height, scale) {
  const iconPositions = defaultIconPositions;
  const columns = width >= 270 ? 4 : width >= 190 ? 3 : 2;
  const rows = Math.ceil(iconPositions.length / columns);
  const tile = 48.633 * scale;
  const rowStep = Math.min(100, (height - tile - 20) / (rows - 1));
  const startY = (height - tile - rowStep * (rows - 1)) / 2;
  const columnStep = (width - tile - 16) / (columns - 1);
  iconPositions.forEach(({element}, index) => place(element,
    8 + index % columns * columnStep,
    startY + Math.floor(index / columns) * rowStep,
    scale));
}
new ResizeObserver(fitResponsiveLayout).observe(flow);
window.addEventListener('resize', fitResponsiveLayout);
document.fonts.ready.then(fitResponsiveLayout);
fitResponsiveLayout();
