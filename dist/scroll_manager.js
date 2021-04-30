var ScrollManager = /** @class */ (function () {
    function ScrollManager(delegate) {
        var _this = this;
        this.started = false;
        this.onScroll = function () {
            _this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
        };
        this.delegate = delegate;
    }
    ScrollManager.prototype.start = function () {
        if (!this.started) {
            addEventListener("scroll", this.onScroll, false);
            this.onScroll();
            this.started = true;
        }
    };
    ScrollManager.prototype.stop = function () {
        if (this.started) {
            removeEventListener("scroll", this.onScroll, false);
            this.started = false;
        }
    };
    ScrollManager.prototype.scrollToElement = function (element) {
        element.scrollIntoView();
    };
    ScrollManager.prototype.scrollToPosition = function (_a) {
        var x = _a.x, y = _a.y;
        window.scrollTo(x, y);
    };
    // Private
    ScrollManager.prototype.updatePosition = function (position) {
        this.delegate.scrollPositionChanged(position);
    };
    return ScrollManager;
}());
export { ScrollManager };
//# sourceMappingURL=scroll_manager.js.map