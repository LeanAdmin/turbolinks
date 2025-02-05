import { array } from "./util"

export type RenderCallback = () => void

export interface RenderDelegate {
  viewWillRender(newBody: HTMLBodyElement): void
  viewRendered(newBody: HTMLBodyElement): void
  viewInvalidated(): void
}

export abstract class Renderer {
  abstract delegate: RenderDelegate
  abstract newBody: HTMLBodyElement

  renderView(callback: RenderCallback) {
      let render = (callback: CallableFunction) => {
        this.delegate.viewWillRender(this.newBody)
        callback()
        this.delegate.viewRendered(this.newBody)
      };

      if (window.Turbolinks.pendingScripts && window.Turbolinks.pendingScripts.length) {
        window.Turbolinks.loadedAllScripts.then(() => render(callback));
      } else {
        render(callback);
      }
  }

  invalidateView() {
    this.delegate.viewInvalidated()
  }

  createScriptElement(element: Element) {
    if (element.getAttribute("data-turbolinks-eval") == "false") {
      return element
    } else {
      const createdScriptElement = document.createElement("script")
      createdScriptElement.textContent = element.textContent
      createdScriptElement.async = false
      copyElementAttributes(createdScriptElement, element)
      return createdScriptElement
    }
  }
}

function copyElementAttributes(destinationElement: Element, sourceElement: Element) {
  for (const { name, value } of array(sourceElement.attributes)) {
    destinationElement.setAttribute(name, value)
  }
}
