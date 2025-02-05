var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Renderer } from "./renderer";
import { array, PendingAction } from "./util";
var SnapshotRenderer = /** @class */ (function (_super) {
    __extends(SnapshotRenderer, _super);
    function SnapshotRenderer(delegate, currentSnapshot, newSnapshot, isPreview) {
        var _this = _super.call(this) || this;
        _this.delegate = delegate;
        _this.currentSnapshot = currentSnapshot;
        _this.currentHeadDetails = currentSnapshot.headDetails;
        _this.newSnapshot = newSnapshot;
        _this.newHeadDetails = newSnapshot.headDetails;
        _this.newBody = newSnapshot.bodyElement;
        _this.isPreview = isPreview;
        return _this;
    }
    SnapshotRenderer.render = function (delegate, callback, currentSnapshot, newSnapshot, isPreview) {
        return new this(delegate, currentSnapshot, newSnapshot, isPreview).render(callback);
    };
    SnapshotRenderer.prototype.render = function (callback) {
        var _this = this;
        if (this.shouldRender()) {
            this.mergeHead();
            this.renderView(function () {
                _this.replaceBody();
                if (!_this.isPreview) {
                    _this.focusFirstAutofocusableElement();
                }
                callback();
            });
        }
        else {
            this.invalidateView();
        }
    };
    SnapshotRenderer.prototype.mergeHead = function () {
        this.copyNewHeadStylesheetElements();
        this.copyNewHeadScriptElements();
        this.removeCurrentHeadProvisionalElements();
        this.copyNewHeadProvisionalElements();
    };
    SnapshotRenderer.prototype.replaceBody = function () {
        var placeholders = this.relocateCurrentBodyPermanentElements();
        this.activateNewBodyScriptElements();
        this.assignNewBody();
        this.replacePlaceholderElementsWithClonedPermanentElements(placeholders);
    };
    SnapshotRenderer.prototype.shouldRender = function () {
        return this.newSnapshot.isVisitable() && this.trackedElementsAreIdentical();
    };
    SnapshotRenderer.prototype.trackedElementsAreIdentical = function () {
        return this.currentHeadDetails.getTrackedElementSignature() == this.newHeadDetails.getTrackedElementSignature();
    };
    SnapshotRenderer.prototype.copyNewHeadStylesheetElements = function () {
        for (var _i = 0, _a = this.getNewHeadStylesheetElements(); _i < _a.length; _i++) {
            var element = _a[_i];
            document.head.appendChild(element);
        }
    };
    SnapshotRenderer.prototype.copyNewHeadScriptElements = function () {
        window.Turbolinks.pendingScripts = [];
        window.Turbolinks.loadedAllScripts = new PendingAction;
        var unblockScript = function (script) {
            window.Turbolinks.pendingScripts = window.Turbolinks.pendingScripts.filter(function (pending) { return pending !== script; });
            if (!window.Turbolinks.pendingScripts.length) {
                window.Turbolinks.loadedAllScripts.resolve(true);
            }
        };
        var _loop_1 = function (element) {
            var script = this_1.createScriptElement(element);
            if (script.src) {
                script.onload = function () { return eval(script.getAttribute('onload') || '') || unblockScript(script); };
                script.onerror = function () { return window.location.reload(); };
                window.Turbolinks.pendingScripts.push(script);
            }
            document.head.appendChild(script);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.getNewHeadScriptElements(); _i < _a.length; _i++) {
            var element = _a[_i];
            _loop_1(element);
        }
        if (!window.Turbolinks.pendingScripts.length) {
            window.Turbolinks.loadedAllScripts.resolve(true);
        }
    };
    SnapshotRenderer.prototype.removeCurrentHeadProvisionalElements = function () {
        for (var _i = 0, _a = this.getCurrentHeadProvisionalElements(); _i < _a.length; _i++) {
            var element = _a[_i];
            document.head.removeChild(element);
        }
    };
    SnapshotRenderer.prototype.copyNewHeadProvisionalElements = function () {
        for (var _i = 0, _a = this.getNewHeadProvisionalElements(); _i < _a.length; _i++) {
            var element = _a[_i];
            document.head.appendChild(element);
        }
    };
    SnapshotRenderer.prototype.relocateCurrentBodyPermanentElements = function () {
        var _this = this;
        return this.getCurrentBodyPermanentElements().reduce(function (placeholders, permanentElement) {
            var newElement = _this.newSnapshot.getPermanentElementById(permanentElement.id);
            if (newElement) {
                var placeholder = createPlaceholderForPermanentElement(permanentElement);
                replaceElementWithElement(permanentElement, placeholder.element);
                replaceElementWithElement(newElement, permanentElement);
                return placeholders.concat([placeholder]);
            }
            else {
                return placeholders;
            }
        }, []);
    };
    SnapshotRenderer.prototype.replacePlaceholderElementsWithClonedPermanentElements = function (placeholders) {
        for (var _i = 0, placeholders_1 = placeholders; _i < placeholders_1.length; _i++) {
            var _a = placeholders_1[_i], element = _a.element, permanentElement = _a.permanentElement;
            var clonedElement = permanentElement.cloneNode(true);
            replaceElementWithElement(element, clonedElement);
        }
    };
    SnapshotRenderer.prototype.activateNewBodyScriptElements = function () {
        for (var _i = 0, _a = this.getNewBodyScriptElements(); _i < _a.length; _i++) {
            var inertScriptElement = _a[_i];
            var activatedScriptElement = this.createScriptElement(inertScriptElement);
            replaceElementWithElement(inertScriptElement, activatedScriptElement);
        }
    };
    SnapshotRenderer.prototype.assignNewBody = function () {
        replaceElementWithElement(document.body, this.newBody);
    };
    SnapshotRenderer.prototype.focusFirstAutofocusableElement = function () {
        var element = this.newSnapshot.findFirstAutofocusableElement();
        if (elementIsFocusable(element)) {
            element.focus();
        }
    };
    SnapshotRenderer.prototype.getNewHeadStylesheetElements = function () {
        return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails);
    };
    SnapshotRenderer.prototype.getNewHeadScriptElements = function () {
        return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails);
    };
    SnapshotRenderer.prototype.getCurrentHeadProvisionalElements = function () {
        return this.currentHeadDetails.getProvisionalElements();
    };
    SnapshotRenderer.prototype.getNewHeadProvisionalElements = function () {
        return this.newHeadDetails.getProvisionalElements();
    };
    SnapshotRenderer.prototype.getCurrentBodyPermanentElements = function () {
        return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot);
    };
    SnapshotRenderer.prototype.getNewBodyScriptElements = function () {
        return array(this.newBody.querySelectorAll("script"));
    };
    return SnapshotRenderer;
}(Renderer));
export { SnapshotRenderer };
function createPlaceholderForPermanentElement(permanentElement) {
    var element = document.createElement("meta");
    element.setAttribute("name", "turbolinks-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return { element: element, permanentElement: permanentElement };
}
function replaceElementWithElement(fromElement, toElement) {
    var parentElement = fromElement.parentElement;
    if (parentElement) {
        return parentElement.replaceChild(toElement, fromElement);
    }
}
function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
}
//# sourceMappingURL=snapshot_renderer.js.map