import { SystemStatusCode } from "./http_request";
import { ProgressBar } from "./progress_bar";
import { uuid } from "./util";
var BrowserAdapter = /** @class */ (function () {
    function BrowserAdapter(controller) {
        var _this = this;
        this.progressBar = new ProgressBar;
        this.showProgressBar = function () {
            _this.progressBar.show();
        };
        this.controller = controller;
    }
    BrowserAdapter.prototype.visitProposedToLocationWithAction = function (location, action) {
        var restorationIdentifier = uuid();
        this.controller.startVisitToLocationWithAction(location, action, restorationIdentifier);
    };
    BrowserAdapter.prototype.visitStarted = function (visit) {
        visit.issueRequest();
        visit.changeHistory();
        visit.loadCachedSnapshot();
    };
    BrowserAdapter.prototype.visitRequestStarted = function (visit) {
        this.progressBar.setValue(0);
        if (visit.hasCachedSnapshot() || visit.action != "restore") {
            this.showProgressBarAfterDelay();
        }
        else {
            this.showProgressBar();
        }
    };
    BrowserAdapter.prototype.visitRequestProgressed = function (visit) {
        this.progressBar.setValue(visit.progress);
    };
    BrowserAdapter.prototype.visitRequestCompleted = function (visit) {
        visit.loadResponse();
    };
    BrowserAdapter.prototype.visitRequestFailedWithStatusCode = function (visit, statusCode) {
        switch (statusCode) {
            case SystemStatusCode.networkFailure:
            case SystemStatusCode.timeoutFailure:
            case SystemStatusCode.contentTypeMismatch:
                return this.reload();
            default:
                return visit.loadResponse();
        }
    };
    BrowserAdapter.prototype.visitRequestFinished = function (visit) {
        this.hideProgressBar();
    };
    BrowserAdapter.prototype.visitCompleted = function (visit) {
        visit.followRedirect();
    };
    BrowserAdapter.prototype.pageInvalidated = function () {
        this.reload();
    };
    BrowserAdapter.prototype.visitFailed = function (visit) {
    };
    BrowserAdapter.prototype.visitRendered = function (visit) {
    };
    // Private
    BrowserAdapter.prototype.showProgressBarAfterDelay = function () {
        this.progressBarTimeout = window.setTimeout(this.showProgressBar, this.controller.progressBarDelay);
    };
    BrowserAdapter.prototype.hideProgressBar = function () {
        this.progressBar.hide();
        if (this.progressBarTimeout != null) {
            window.clearTimeout(this.progressBarTimeout);
            delete this.progressBarTimeout;
        }
    };
    BrowserAdapter.prototype.reload = function () {
        window.location.reload();
    };
    return BrowserAdapter;
}());
export { BrowserAdapter };
//# sourceMappingURL=browser_adapter.js.map