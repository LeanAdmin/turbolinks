var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { HttpRequest } from "./http_request";
import { Snapshot } from "./snapshot";
import { uuid } from "./util";
export var TimingMetric;
(function (TimingMetric) {
    TimingMetric["visitStart"] = "visitStart";
    TimingMetric["requestStart"] = "requestStart";
    TimingMetric["requestEnd"] = "requestEnd";
    TimingMetric["visitEnd"] = "visitEnd";
})(TimingMetric || (TimingMetric = {}));
export var VisitState;
(function (VisitState) {
    VisitState["initialized"] = "initialized";
    VisitState["started"] = "started";
    VisitState["canceled"] = "canceled";
    VisitState["failed"] = "failed";
    VisitState["completed"] = "completed";
})(VisitState || (VisitState = {}));
var Visit = /** @class */ (function () {
    function Visit(controller, location, action, restorationIdentifier) {
        if (restorationIdentifier === void 0) { restorationIdentifier = uuid(); }
        var _this = this;
        this.identifier = uuid();
        this.timingMetrics = {};
        this.followedRedirect = false;
        this.historyChanged = false;
        this.progress = 0;
        this.scrolled = false;
        this.snapshotCached = false;
        this.state = VisitState.initialized;
        // Scrolling
        this.performScroll = function () {
            if (!_this.scrolled) {
                if (_this.action == "restore") {
                    _this.scrollToRestoredPosition() || _this.scrollToTop();
                }
                else {
                    _this.scrollToAnchor() || _this.scrollToTop();
                }
                _this.scrolled = true;
            }
        };
        this.controller = controller;
        this.location = location;
        this.action = action;
        this.adapter = controller.adapter;
        this.restorationIdentifier = restorationIdentifier;
    }
    Visit.prototype.start = function () {
        if (this.state == VisitState.initialized) {
            this.recordTimingMetric(TimingMetric.visitStart);
            this.state = VisitState.started;
            this.adapter.visitStarted(this);
        }
    };
    Visit.prototype.cancel = function () {
        if (this.state == VisitState.started) {
            if (this.request) {
                this.request.cancel();
            }
            this.cancelRender();
            this.state = VisitState.canceled;
        }
    };
    Visit.prototype.complete = function () {
        if (this.state == VisitState.started) {
            this.recordTimingMetric(TimingMetric.visitEnd);
            this.state = VisitState.completed;
            this.adapter.visitCompleted(this);
            this.controller.visitCompleted(this);
        }
    };
    Visit.prototype.fail = function () {
        if (this.state == VisitState.started) {
            this.state = VisitState.failed;
            this.adapter.visitFailed(this);
        }
    };
    Visit.prototype.changeHistory = function () {
        if (!this.historyChanged) {
            var actionForHistory = this.location.isEqualTo(this.referrer) ? "replace" : this.action;
            var method = this.getHistoryMethodForAction(actionForHistory);
            method.call(this.controller, this.location, this.restorationIdentifier);
            this.historyChanged = true;
        }
    };
    Visit.prototype.issueRequest = function () {
        if (this.shouldIssueRequest() && !this.request) {
            this.progress = 0;
            this.request = new HttpRequest(this, this.location, this.referrer);
            this.request.send();
        }
    };
    Visit.prototype.getCachedSnapshot = function () {
        var snapshot = this.controller.getCachedSnapshotForLocation(this.location);
        if (snapshot && (!this.location.anchor || snapshot.hasAnchor(this.location.anchor))) {
            if (this.action == "restore" || snapshot.isPreviewable()) {
                return snapshot;
            }
        }
    };
    Visit.prototype.hasCachedSnapshot = function () {
        return this.getCachedSnapshot() != null;
    };
    Visit.prototype.loadCachedSnapshot = function () {
        var _this = this;
        var snapshot = this.getCachedSnapshot();
        if (snapshot) {
            var isPreview_1 = this.shouldIssueRequest();
            this.render(function () {
                _this.cacheSnapshot();
                _this.controller.render({ snapshot: snapshot, isPreview: isPreview_1 }, _this.performScroll);
                var finish = function () {
                    _this.adapter.visitRendered(_this);
                    if (!isPreview_1) {
                        _this.complete();
                    }
                };
                if (window.Turbolinks.pendingScripts && window.Turbolinks.pendingScripts.length) {
                    window.Turbolinks.loadedAllScripts.then(function () { return finish(); });
                }
                else {
                    finish();
                }
            });
        }
    };
    Visit.prototype.loadResponse = function () {
        var _this = this;
        var _a = this, request = _a.request, response = _a.response;
        if (request && response) {
            this.render(function () {
                _this.cacheSnapshot();
                if (request.failed) {
                    _this.controller.render({ error: _this.response }, _this.performScroll);
                    _this.adapter.visitRendered(_this);
                    _this.fail();
                }
                else {
                    _this.controller.render({ snapshot: Snapshot.fromHTMLString(response) }, _this.performScroll);
                    var finish_1 = function () {
                        _this.adapter.visitRendered(_this);
                        _this.complete();
                    };
                    if (window.Turbolinks.pendingScripts && window.Turbolinks.pendingScripts.length) {
                        window.Turbolinks.loadedAllScripts.then(function () { return finish_1(); });
                    }
                    else {
                        finish_1();
                    }
                }
            });
        }
    };
    Visit.prototype.followRedirect = function () {
        if (this.redirectedToLocation && !this.followedRedirect) {
            this.location = this.redirectedToLocation;
            this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier);
            this.followedRedirect = true;
        }
    };
    // HTTP request delegate
    Visit.prototype.requestStarted = function () {
        this.recordTimingMetric(TimingMetric.requestStart);
        this.adapter.visitRequestStarted(this);
    };
    Visit.prototype.requestProgressed = function (progress) {
        this.progress = progress;
        if (this.adapter.visitRequestProgressed) {
            this.adapter.visitRequestProgressed(this);
        }
    };
    Visit.prototype.requestCompletedWithResponse = function (response, redirectedToLocation) {
        this.response = response;
        this.redirectedToLocation = redirectedToLocation;
        this.adapter.visitRequestCompleted(this);
    };
    Visit.prototype.requestFailedWithStatusCode = function (statusCode, response) {
        this.response = response;
        this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
    };
    Visit.prototype.requestFinished = function () {
        this.recordTimingMetric(TimingMetric.requestEnd);
        this.adapter.visitRequestFinished(this);
    };
    Visit.prototype.scrollToRestoredPosition = function () {
        var position = this.restorationData ? this.restorationData.scrollPosition : undefined;
        if (position) {
            this.controller.scrollToPosition(position);
            return true;
        }
    };
    Visit.prototype.scrollToAnchor = function () {
        if (this.location.anchor != null) {
            this.controller.scrollToAnchor(this.location.anchor);
            return true;
        }
    };
    Visit.prototype.scrollToTop = function () {
        this.controller.scrollToPosition({ x: 0, y: 0 });
    };
    // Instrumentation
    Visit.prototype.recordTimingMetric = function (metric) {
        this.timingMetrics[metric] = new Date().getTime();
    };
    Visit.prototype.getTimingMetrics = function () {
        return __assign({}, this.timingMetrics);
    };
    // Private
    Visit.prototype.getHistoryMethodForAction = function (action) {
        switch (action) {
            case "replace": return this.controller.replaceHistoryWithLocationAndRestorationIdentifier;
            case "advance":
            case "restore": return this.controller.pushHistoryWithLocationAndRestorationIdentifier;
        }
    };
    Visit.prototype.shouldIssueRequest = function () {
        return this.action == "restore"
            ? !this.hasCachedSnapshot()
            : true;
    };
    Visit.prototype.cacheSnapshot = function () {
        if (!this.snapshotCached) {
            this.controller.cacheSnapshot();
            this.snapshotCached = true;
        }
    };
    Visit.prototype.render = function (callback) {
        var _this = this;
        this.cancelRender();
        this.frame = requestAnimationFrame(function () {
            delete _this.frame;
            callback.call(_this);
        });
    };
    Visit.prototype.cancelRender = function () {
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            delete this.frame;
        }
    };
    return Visit;
}());
export { Visit };
//# sourceMappingURL=visit.js.map