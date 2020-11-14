/**
 * traps tab focus on the focussed Node
 * @param {HTMLElement} focusNode
 * @returns {{ release: () => void }}
 */
const trapFocus = (focusNode, rootNode = document) => {
  const nodes = [
    ...rootNode.querySelectorAll(
      'a, button, input, select, textarea, svg, area, details, summary, iframe, object, embed, [tabindex], [contenteditable]'
    ),
  ].filter(node => !focusNode.contains(node) && node.getAttribute('tabindex') !== '-1');

  nodes.forEach(node => node.setAttribute('tabindex', '-1'));

  return {
    release() {
      nodes.forEach(node => node.removeAttribute('tabindex'));
    },
  };
};

export default trapFocus;
