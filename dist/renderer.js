import { array } from "./util";
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.prototype.renderView = function (callback) {
        var _this = this;
        var render = function (callback) {
            _this.delegate.viewWillRender(_this.newBody);
            callback();
            _this.delegate.viewRendered(_this.newBody);
        };
        if (window.Turbolinks.pendingScripts && window.Turbolinks.pendingScripts.length) {
            window.Turbolinks.loadedAllScripts.then(function () { return render(callback); });
        }
        else {
            render(callback);
        }
    };
    Renderer.prototype.invalidateView = function () {
        this.delegate.viewInvalidated();
    };
    Renderer.prototype.createScriptElement = function (element) {
        if (element.getAttribute("data-turbolinks-eval") == "false") {
            return element;
        }
        else {
            var createdScriptElement = document.createElement("script");
            createdScriptElement.textContent = element.textContent;
            createdScriptElement.async = false;
            copyElementAttributes(createdScriptElement, element);
            return createdScriptElement;
        }
    };
    return Renderer;
}());
export { Renderer };
function copyElementAttributes(destinationElement, sourceElement) {
    for (var _i = 0, _a = array(sourceElement.attributes); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b.name, value = _b.value;
        destinationElement.setAttribute(name_1, value);
    }
}
//# sourceMappingURL=renderer.js.map