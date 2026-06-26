/**
 * Event utilities
 */

export function addEventListener<K extends keyof WindowEventMap>(
  element: Window,
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;

export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;

export function addEventListener(
  element: Window | HTMLElement,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

export function addEventListenerOnce<K extends keyof WindowEventMap>(
  element: Window,
  event: K,
  handler: (event: WindowEventMap[K]) => void
): () => void;

export function addEventListenerOnce<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void
): () => void;

export function addEventListenerOnce(
  element: Window | HTMLElement,
  event: string,
  handler: EventListener
): () => void {
  const wrappedHandler = (e: Event) => {
    handler(e);
    element.removeEventListener(event, wrappedHandler);
  };
  element.addEventListener(event, wrappedHandler);
  return () => element.removeEventListener(event, wrappedHandler);
}

export function addEventListeners(
  element: Window | HTMLElement,
  events: string[],
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  events.forEach((event) => element.addEventListener(event, handler, options));
  return () => events.forEach((event) => element.removeEventListener(event, handler));
}

export function addDocumentEventListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  document.addEventListener(event, handler, options);
  return () => document.removeEventListener(event, handler, options);
}

export function addKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
): () => void {
  const wrappedHandler = (e: KeyboardEvent) => {
    const ctrlMatch = modifiers.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
    const shiftMatch = modifiers.shift ? e.shiftKey : !e.shiftKey;
    const altMatch = modifiers.alt ? e.altKey : !e.altKey;

    if (e.key === key && ctrlMatch && shiftMatch && altMatch) {
      e.preventDefault();
      handler(e);
    }
  };

  return addEventListener(window, "keydown", wrappedHandler);
}

export function addClickOutside(
  element: HTMLElement,
  handler: () => void
): () => void {
  const wrappedHandler = (e: MouseEvent) => {
    if (!element.contains(e.target as Node)) {
      handler();
    }
  };

  return addEventListener(document, "mousedown", wrappedHandler as EventListener);
}

export function addResizeObserver(
  element: HTMLElement,
  handler: (entry: ResizeObserverEntry) => void
): () => void {
  const observer = new ResizeObserver((entries) => {
    entries.forEach(handler);
  });

  observer.observe(element);
  return () => observer.disconnect();
}

export function addIntersectionObserver(
  element: HTMLElement,
  handler: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(handler);
  }, options);

  observer.observe(element);
  return () => observer.disconnect();
}
