const colaItems: NodeList = document.querySelectorAll('.cola-item');

Array.prototype.forEach.call(colaItems, (colaItem: Element) => {
  // colaItem.classList.add("cola-item_selected");
  colaItem.addEventListener('mouseover', () => {
    colaItem.classList.add('cola-item_selected');
  });
  colaItem.addEventListener('mouseout', () => {
    colaItem.classList.remove('cola-item_selected');
  });
});

console.log('why');
