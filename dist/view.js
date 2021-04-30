import { ErrorRenderer } from "./error_renderer";
import { Snapshot } from "./snapshot";
import { SnapshotRenderer } from "./snapshot_renderer";
var View = /** @class */ (function () {
    function View(delegate) {
        this.htmlElement = document.documentElement;
        this.delegate = delegate;
    }
    View.prototype.getRootLocation = function () {
        return this.getSnapshot().getRootLocation();
    };
    View.prototype.getElementForAnchor = function (anchor) {
        return this.getSnapshot().getElementForAnchor(anchor);
    };
    View.prototype.getSnapshot = function () {
        return Snapshot.fromHTMLElement(this.htmlElement);
    };
    View.prototype.render = function (_a, callback) {
        var snapshot = _a.snapshot, error = _a.error, isPreview = _a.isPreview;
        this.markAsPreview(isPreview);
        if (snapshot) {
            this.renderSnapshot(snapshot, isPreview, callback);
        }
        else {
            this.renderError(error, callback);
        }
    };
    // Private
    View.prototype.markAsPreview = function (isPreview) {
        if (isPreview) {
            this.htmlElement.setAttribute("data-turbolinks-preview", "");
        }
        else {
            this.htmlElement.removeAttribute("data-turbolinks-preview");
        }
    };
    View.prototype.renderSnapshot = function (snapshot, isPreview, callback) {
        SnapshotRenderer.render(this.delegate, callback, this.getSnapshot(), snapshot, isPreview || false);
    };
    View.prototype.renderError = function (error, callback) {
        ErrorRenderer.render(this.delegate, callback, error || "");
    };
    return View;
}());
export { View };
//# sourceMappingURL=view.js.map