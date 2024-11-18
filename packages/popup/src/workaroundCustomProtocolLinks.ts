const findLink = function (el: HTMLElement): HTMLLinkElement | null {
  if (!el || !el.tagName || !el.parentElement) {
    return null;
  }
  if (el.tagName.toLowerCase() === "a") {
    return el as HTMLLinkElement;
  }
  return findLink(el.parentElement);
};
export default function (window: Window, protocol: string) {
  protocol = protocol.replace(/[:/]+$/, ":");
  window.document.addEventListener("click", function (event) {
    const link = findLink(event.target as HTMLElement);
    if (!link) {
      return;
    }
    const url = link.getAttribute("href");
    if (!url || !url.startsWith(protocol)) {
      return;
    }
    event.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.height = "0";
    iframe.width = "0";
    window.document.body.appendChild(iframe);
  });
}
