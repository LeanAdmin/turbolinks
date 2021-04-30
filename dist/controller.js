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
import { BrowserAdapter } from "./browser_adapter";
import { History } from "./history";
import { Location } from "./location";
import { ScrollManager } from "./scroll_manager";
import { SnapshotCache } from "./snapshot_cache";
import { isAction } from "./types";
import { closest, defer, dispatch, uuid } from "./util";
import { View } from "./view";
import { Visit } from "./visit";
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        this.adapter = new BrowserAdapter(this);
        this.history = new History(this);
        this.restorationData = {};
        this.scrollManager = new ScrollManager(this);
        this.view = new View(this);
        this.cache = new SnapshotCache(10);
        this.enabled = true;
        this.progressBarDelay = 500;
        this.started = false;
        // Event handlers
        this.pageLoaded = function () {
            _this.lastRenderedLocation = _this.location;
            _this.notifyApplicationAfterPageLoad();
        };
        this.clickCaptured = function () {
            removeEventListener("click", _this.clickBubbled, false);
            addEventListener("click", _this.clickBubbled, false);
        };
        this.clickBubbled = function (event) {
            if (_this.enabled && _this.clickEventIsSignificant(event)) {
                var link = _this.getVisitableLinkForTarget(event.target);
                if (link) {
                    var location_1 = _this.getVisitableLocationForLink(link);
                    if (location_1 && _this.applicationAllowsFollowingLinkToLocation(link, location_1)) {
                        event.preventDefault();
                        var action = _this.getActionForLink(link);
                        _this.visit(location_1, { action: action });
                    }
                }
            }
        };
    }
    Controller.prototype.start = function () {
        if (Controller.supported && !this.started) {
            addEventListener("click", this.clickCaptured, true);
            addEventListener("DOMContentLoaded", this.pageLoaded, false);
            this.scrollManager.start();
            this.startHistory();
            this.started = true;
            this.enabled = true;
        }
    };
    Controller.prototype.disable = function () {
        this.enabled = false;
    };
    Controller.prototype.stop = function () {
        if (this.started) {
            removeEventListener("click", this.clickCaptured, true);
            removeEventListener("DOMContentLoaded", this.pageLoaded, false);
            this.scrollManager.stop();
            this.stopHistory();
            this.started = false;
        }
    };
    Controller.prototype.clearCache = function () {
        this.cache = new SnapshotCache(10);
    };
    Controller.prototype.visit = function (location, options) {
        if (options === void 0) { options = {}; }
        location = Location.wrap(location);
        if (this.applicationAllowsVisitingLocation(location)) {
            if (this.locationIsVisitable(location)) {
                var action = options.action || "advance";
                this.adapter.visitProposedToLocationWithAction(location, action);
            }
            else {
                window.location.href = location.toString();
            }
        }
    };
    Controller.prototype.startVisitToLocationWithAction = function (location, action, restorationIdentifier) {
        if (Controller.supported) {
            var restorationData = this.getRestorationDataForIdentifier(restorationIdentifier);
            this.startVisit(Location.wrap(location), action, { restorationData: restorationData });
        }
        else {
            window.location.href = location.toString();
        }
    };
    Controller.prototype.setProgressBarDelay = function (delay) {
        this.progressBarDelay = delay;
    };
    // History
    Controller.prototype.startHistory = function () {
        this.location = Location.currentLocation;
        this.restorationIdentifier = uuid();
        this.history.start();
        this.history.replace(this.location, this.restorationIdentifier);
    };
    Controller.prototype.stopHistory = function () {
        this.history.stop();
    };
    Controller.prototype.pushHistoryWithLocationAndRestorationIdentifier = function (locatable, restorationIdentifier) {
        this.location = Location.wrap(locatable);
        this.restorationIdentifier = restorationIdentifier;
        this.history.push(this.location, this.restorationIdentifier);
    };
    Controller.prototype.replaceHistoryWithLocationAndRestorationIdentifier = function (locatable, restorationIdentifier) {
        this.location = Location.wrap(locatable);
        this.restorationIdentifier = restorationIdentifier;
        this.history.replace(this.location, this.restorationIdentifier);
    };
    // History delegate
    Controller.prototype.historyPoppedToLocationWithRestorationIdentifier = function (location, restorationIdentifier) {
        if (this.enabled) {
            this.location = location;
            this.restorationIdentifier = restorationIdentifier;
            var restorationData = this.getRestorationDataForIdentifier(restorationIdentifier);
            this.startVisit(location, "restore", { restorationIdentifier: restorationIdentifier, restorationData: restorationData, historyChanged: true });
        }
        else {
            this.adapter.pageInvalidated();
        }
    };
    // Snapshot cache
    Controller.prototype.getCachedSnapshotForLocation = function (location) {
        var snapshot = this.cache.get(location);
        return snapshot ? snapshot.clone() : snapshot;
    };
    Controller.prototype.shouldCacheSnapshot = function () {
        return this.view.getSnapshot().isCacheable();
    };
    Controller.prototype.cacheSnapshot = function () {
        var _this = this;
        if (this.shouldCacheSnapshot()) {
            this.notifyApplicationBeforeCachingSnapshot();
            var snapshot_1 = this.view.getSnapshot();
            var location_2 = this.lastRenderedLocation || Location.currentLocation;
            defer(function () { return _this.cache.put(location_2, snapshot_1.clone()); });
        }
    };
    // Scrolling
    Controller.prototype.scrollToAnchor = function (anchor) {
        var element = this.view.getElementForAnchor(anchor);
        if (element) {
            this.scrollToElement(element);
        }
        else {
            this.scrollToPosition({ x: 0, y: 0 });
        }
    };
    Controller.prototype.scrollToElement = function (element) {
        this.scrollManager.scrollToElement(element);
    };
    Controller.prototype.scrollToPosition = function (position) {
        this.scrollManager.scrollToPosition(position);
    };
    // Scroll manager delegate
    Controller.prototype.scrollPositionChanged = function (position) {
        var restorationData = this.getCurrentRestorationData();
        restorationData.scrollPosition = position;
    };
    // View
    Controller.prototype.render = function (options, callback) {
        this.view.render(options, callback);
    };
    Controller.prototype.viewInvalidated = function () {
        this.adapter.pageInvalidated();
    };
    Controller.prototype.viewWillRender = function (newBody) {
        this.notifyApplicationBeforeRender(newBody);
    };
    Controller.prototype.viewRendered = function () {
        this.lastRenderedLocation = this.currentVisit.location;
        this.notifyApplicationAfterRender();
    };
    // Application events
    Controller.prototype.applicationAllowsFollowingLinkToLocation = function (link, location) {
        var event = this.notifyApplicationAfterClickingLinkToLocation(link, location);
        return !event.defaultPrevented;
    };
    Controller.prototype.applicationAllowsVisitingLocation = function (location) {
        var event = this.notifyApplicationBeforeVisitingLocation(location);
        return !event.defaultPrevented;
    };
    Controller.prototype.notifyApplicationAfterClickingLinkToLocation = function (link, location) {
        return dispatch("turbolinks:click", { target: link, data: { url: location.absoluteURL }, cancelable: true });
    };
    Controller.prototype.notifyApplicationBeforeVisitingLocation = function (location) {
        return dispatch("turbolinks:before-visit", { data: { url: location.absoluteURL }, cancelable: true });
    };
    Controller.prototype.notifyApplicationAfterVisitingLocation = function (location) {
        return dispatch("turbolinks:visit", { data: { url: location.absoluteURL } });
    };
    Controller.prototype.notifyApplicationBeforeCachingSnapshot = function () {
        return dispatch("turbolinks:before-cache");
    };
    Controller.prototype.notifyApplicationBeforeRender = function (newBody) {
        return dispatch("turbolinks:before-render", { data: { newBody: newBody } });
    };
    Controller.prototype.notifyApplicationAfterRender = function () {
        return dispatch("turbolinks:render");
    };
    Controller.prototype.notifyApplicationAfterPageLoad = function (timing) {
        if (timing === void 0) { timing = {}; }
        return dispatch("turbolinks:load", { data: { url: this.location.absoluteURL, timing: timing } });
    };
    // Private
    Controller.prototype.startVisit = function (location, action, properties) {
        if (this.currentVisit) {
            this.currentVisit.cancel();
        }
        this.currentVisit = this.createVisit(location, action, properties);
        this.currentVisit.start();
        this.notifyApplicationAfterVisitingLocation(location);
    };
    Controller.prototype.createVisit = function (location, action, properties) {
        var visit = new Visit(this, location, action, properties.restorationIdentifier);
        visit.restorationData = __assign({}, (properties.restorationData || {}));
        visit.historyChanged = !!properties.historyChanged;
        visit.referrer = this.location;
        return visit;
    };
    Controller.prototype.visitCompleted = function (visit) {
        this.notifyApplicationAfterPageLoad(visit.getTimingMetrics());
    };
    Controller.prototype.clickEventIsSignificant = function (event) {
        return !((event.target && event.target.isContentEditable)
            || event.defaultPrevented
            || event.which > 1
            || event.altKey
            || event.ctrlKey
            || event.metaKey
            || event.shiftKey);
    };
    Controller.prototype.getVisitableLinkForTarget = function (target) {
        if (target instanceof Element && this.elementIsVisitable(target)) {
            return closest(target, "a[href]:not([target]):not([download])");
        }
    };
    Controller.prototype.getVisitableLocationForLink = function (link) {
        var location = new Location(link.getAttribute("href") || "");
        if (this.locationIsVisitable(location)) {
            return location;
        }
    };
    Controller.prototype.getActionForLink = function (link) {
        var action = link.getAttribute("data-turbolinks-action");
        return isAction(action) ? action : "advance";
    };
    Controller.prototype.elementIsVisitable = function (element) {
        var container = closest(element, "[data-turbolinks]");
        if (container) {
            return container.getAttribute("data-turbolinks") != "false";
        }
        else {
            return true;
        }
    };
    Controller.prototype.locationIsVisitable = function (location) {
        return location.isPrefixedBy(this.view.getRootLocation()) && location.isHTML();
    };
    Controller.prototype.getCurrentRestorationData = function () {
        return this.getRestorationDataForIdentifier(this.restorationIdentifier);
    };
    Controller.prototype.getRestorationDataForIdentifier = function (identifier) {
        if (!(identifier in this.restorationData)) {
            this.restorationData[identifier] = {};
        }
        return this.restorationData[identifier];
    };
    Controller.supported = !!(window.history.pushState &&
        window.requestAnimationFrame &&
        window.addEventListener);
    return Controller;
}());
export { Controller };
//# sourceMappingURL=controller.js.map