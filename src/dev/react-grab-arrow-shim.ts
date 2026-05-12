import { getGlobalApi, type ReactGrabAPI } from "react-grab";

const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
const MIN_ELEMENT_SIZE = 16;
const BOX_TOLERANCE_PX = 2;

type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

let selectedElement: Element | null = null;
let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

function isReactGrabElement(element: Element) {
  const root = element.getRootNode();

  return Boolean(
    element.closest("[data-react-grab]") ||
    (root instanceof ShadowRoot &&
      root.host instanceof Element &&
      root.host.matches("[data-react-grab]")),
  );
}

function isValidElement(element: unknown): element is Element {
  if (!isElement(element) || !element.isConnected || isReactGrabElement(element)) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_ELEMENT_SIZE || rect.height >= MIN_ELEMENT_SIZE;
}

function getCenter(element: Element) {
  const rect = element.getBoundingClientRect();
  const left = Math.max(0, rect.left);
  const right = Math.min(window.innerWidth, rect.right);
  const top = Math.max(0, rect.top);
  const bottom = Math.min(window.innerHeight, rect.bottom);

  if (right <= left || bottom <= top) {
    return null;
  }

  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
  };
}

function getElementsAtCenter(element: Element) {
  const center = getCenter(element);

  if (!center) {
    return [];
  }

  return document.elementsFromPoint(center.x, center.y).filter(isValidElement);
}

function findElementAtLastPointer() {
  return document.elementsFromPoint(lastPointer.x, lastPointer.y).find(isValidElement) ?? null;
}

function getCurrentElement(api: ReactGrabAPI) {
  const targetElement = api.getState().targetElement;

  if (isValidElement(targetElement)) {
    selectedElement = targetElement;
    return targetElement;
  }

  if (isValidElement(selectedElement)) {
    return selectedElement;
  }

  selectedElement = findElementAtLastPointer();
  return selectedElement;
}

function isSameBox(a: Element, b: Element) {
  const first = a.getBoundingClientRect();
  const second = b.getBoundingClientRect();

  return (
    Math.abs(first.x - second.x) <= BOX_TOLERANCE_PX &&
    Math.abs(first.y - second.y) <= BOX_TOLERANCE_PX &&
    Math.abs(first.width - second.width) <= BOX_TOLERANCE_PX &&
    Math.abs(first.height - second.height) <= BOX_TOLERANCE_PX
  );
}

function findChild(element: Element): Element | null {
  for (const child of element.children) {
    if (isValidElement(child) && !isSameBox(element, child)) {
      return child;
    }

    const nested = findChild(child);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function findParent(element: Element): Element | null {
  let current = element.parentElement;

  while (current) {
    if (isValidElement(current) && !isSameBox(element, current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function findSibling(element: Element, direction: "next" | "previous"): Element | null {
  let current = direction === "next" ? element.nextElementSibling : element.previousElementSibling;

  while (current) {
    if (isValidElement(current)) {
      return current;
    }

    const nested = findChild(current);
    if (nested) {
      return nested;
    }

    current = direction === "next" ? current.nextElementSibling : current.previousElementSibling;
  }

  return null;
}

function findStackElement(element: Element, offset: number) {
  const elements = getElementsAtCenter(element);
  const index = elements.indexOf(element);

  if (index === -1) {
    return null;
  }

  return elements[index + offset] ?? null;
}

function findNextElement(key: ArrowKey, element: Element) {
  switch (key) {
    case "ArrowUp":
      return findStackElement(element, 1) ?? findParent(element);
    case "ArrowDown":
      return findStackElement(element, -1) ?? findChild(element);
    case "ArrowRight":
      return findChild(element) ?? findSibling(element, "next");
    case "ArrowLeft":
      return findSibling(element, "previous") ?? findParent(element);
  }
}

function dispatchPointerMove(element: Element) {
  const center = getCenter(element);

  if (!center) {
    return false;
  }

  selectedElement = element;
  lastPointer = center;

  const eventInit: PointerEventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
    clientX: center.x,
    clientY: center.y,
    pointerId: 1,
    pointerType: "mouse",
    isPrimary: true,
  };
  const event =
    typeof PointerEvent === "function"
      ? new PointerEvent("pointermove", eventInit)
      : new MouseEvent("pointermove", eventInit);

  window.dispatchEvent(event);
  return true;
}

function isArrowKey(key: string): key is ArrowKey {
  return ARROW_KEYS.has(key);
}

function shouldHandleArrow(api: ReactGrabAPI) {
  const state = api.getState();

  return api.isEnabled() && (api.isActive() || state.isPromptMode || state.isSelectionBoxVisible);
}

window.addEventListener(
  "pointermove",
  (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
  },
  { capture: true, passive: true },
);

window.addEventListener(
  "keydown",
  (event) => {
    if (!isArrowKey(event.key) || event.defaultPrevented) {
      return;
    }

    const api = getGlobalApi();
    if (!api || !shouldHandleArrow(api)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const currentElement = getCurrentElement(api);
    if (!currentElement) {
      return;
    }

    const nextElement = findNextElement(event.key, currentElement);
    if (nextElement) {
      dispatchPointerMove(nextElement);
    }
  },
  { capture: true },
);
