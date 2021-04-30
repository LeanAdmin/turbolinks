import { Location } from "./location";
import { defer } from "./util";
var History = /** @class */ (function () {
    function History(delegate) {
        var _this = this;
        this.started = false;
        this.pageLoaded = false;
        // Event handlers
        this.onPopState = function (event) {
            if (!_this.shouldHandlePopState())
                return;
            if (!event.state)
                return;
            var turbolinks = event.state.turbolinks;
            if (!turbolinks)
                return;
            var location = Location.currentLocation;
            var restorationIdentifier = turbolinks.restorationIdentifier;
            _this.delegate.historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier);
        };
        this.onPageLoad = function (event) {
            defer(function () {
                _this.pageLoaded = true;
            });
        };
        this.delegate = delegate;
    }
    History.prototype.start = function () {
        if (!this.started) {
            addEventListener("popstate", this.onPopState, false);
            addEventListener("load", this.onPageLoad, false);
            this.started = true;
        }
    };
    History.prototype.stop = function () {
        if (this.started) {
            removeEventListener("popstate", this.onPopState, false);
            removeEventListener("load", this.onPageLoad, false);
            this.started = false;
        }
    };
    History.prototype.push = function (location, restorationIdentifier) {
        this.update(history.pushState, location, restorationIdentifier);
    };
    History.prototype.replace = function (location, restorationIdentifier) {
        this.update(history.replaceState, location, restorationIdentifier);
    };
    // Private
    History.prototype.shouldHandlePopState = function () {
        // Safari dispatches a popstate event after window's load event, ignore it
        return this.pageIsLoaded();
    };
    History.prototype.pageIsLoaded = function () {
        return this.pageLoaded || document.readyState == "complete";
    };
    History.prototype.update = function (method, location, restorationIdentifier) {
        var state = { turbolinks: { restorationIdentifier: restorationIdentifier } };
        method.call(history, state, "", location.absoluteURL);
    };
    return History;
}());
export { History };
//# sourceMappingURL=history.js.map