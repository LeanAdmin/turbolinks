export function array<T>(values: ArrayLike<T>): T[] {
  return Array.prototype.slice.call(values)
}

export const closest = (() => {
  const html = document.documentElement

  type MatchesSelector = (this: Element, selector: string) => boolean
  const match: MatchesSelector = html.matches
    || (html as any).webkitMatchesSelector
    || (html as any).msMatchesSelector
    || (html as any).mozMatchesSelector

  type Closest = (this: Element, selector: string) => Element | null
  const closest: Closest = html.closest || function(selector: string) {
    let element: Element | null = this
    while (element) {
      if (match.call(element, selector)) {
        return element
      } else {
        element = element.parentElement
      }
    }
  }

  return function(element: Element, selector: string) {
    return closest.call(element, selector)
  }
})()

export function defer(callback: () => any) {
  setTimeout(callback, 1)
}

export type DispatchOptions = { target: EventTarget, cancelable: boolean, data: any }

export function dispatch(eventName: string, { target, cancelable, data }: Partial<DispatchOptions> = {}) {
  const event = document.createEvent("Events") as Event & { data: any }
  event.initEvent(eventName, true, cancelable == true)
  event.data = data || {}

  // Fix setting `defaultPrevented` when `preventDefault()` is called
  // http://stackoverflow.com/questions/23349191/event-preventdefault-is-not-working-in-ie-11-for-custom-events
  if (event.cancelable && !preventDefaultSupported) {
    const { preventDefault } = event
    event.preventDefault = function() {
      if (!this.defaultPrevented) {
        Object.defineProperty(this, "defaultPrevented", { get: () => true })
      }
      preventDefault.call(this)
    }
  }

  (target || document).dispatchEvent(event)
  return event
}

const preventDefaultSupported = (() => {
  const event = document.createEvent("Events")
  event.initEvent("test", true, true)
  event.preventDefault()
  return event.defaultPrevented
})()

export function unindent(strings: TemplateStringsArray, ...values: any[]): string {
  const lines = trimLeft(interpolate(strings, values)).split("\n")
  const match = lines[0].match(/^\s+/)
  const indent = match ? match[0].length : 0
  return lines.map(line => line.slice(indent)).join("\n")
}

function trimLeft(string: string) {
  return string.replace(/^\n/, "")
}

function interpolate(strings: TemplateStringsArray, values: any[]) {
  return strings.reduce((result, string, i) => {
    const value = values[i] == undefined ? "" : values[i]
    return result + string + value
  }, "")
}

export function uuid() {
  return Array.apply(null, { length: 36 } as any).map((_, i) => {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      return "-"
    } else if (i == 14) {
      return "4"
    } else if (i == 19) {
      return (Math.floor(Math.random() * 4) + 8).toString(16)
    } else {
      return Math.floor(Math.random() * 15).toString(16)
    }
  }).join("")
}

export class PendingAction<T = any> {
    public readonly promise: Promise<T>;

    public pending: boolean = true;
    public resolved: boolean = false;
    public rejected: boolean = false;

    private _resolve: any = null;
    private _reject: any = null;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public resolve(value: T): void {
        if (! this.pending) return;

        this._resolve(value);

        this.resolved = true;
        this.pending = false;
    }

    public reject(reason?: any): void {
        if (! this.pending) return;

        this._reject(reason);

        this.rejected = true;
        this.pending = false;
    }

    public then(...args: any): Promise<T> {
        return this.promise.then(...args);
    }

    public catch(...args: any): Promise<T> {
        return this.promise.catch(...args);
    }
}
