function render(element, container) {
  const dom = document.createElement(element)
  element.props.children.forEach(element => {
    render(element.type,dom)
  });

  container.appendChild(dom)
}