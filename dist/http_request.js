import { Location } from "./location";
import { dispatch } from "./util";
export var SystemStatusCode;
(function (SystemStatusCode) {
    SystemStatusCode[SystemStatusCode["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode[SystemStatusCode["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode[SystemStatusCode["contentTypeMismatch"] = -2] = "contentTypeMismatch";
})(SystemStatusCode || (SystemStatusCode = {}));
var HttpRequest = /** @class */ (function () {
    function HttpRequest(delegate, location, referrer) {
        var _this = this;
        this.failed = false;
        this.progress = 0;
        this.sent = false;
        // XMLHttpRequest events
        this.requestProgressed = function (event) {
            if (event.lengthComputable) {
                _this.setProgress(event.loaded / event.total);
            }
        };
        this.requestLoaded = function () {
            _this.endRequest(function (xhr) {
                var contentType = xhr.getResponseHeader("Content-Type");
                if (contentTypeIsHTML(contentType)) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var redirectedToLocation = Location.wrap(xhr.getResponseHeader("Turbolinks-Location"));
                        _this.delegate.requestCompletedWithResponse(xhr.responseText, redirectedToLocation);
                    }
                    else {
                        _this.failed = true;
                        _this.delegate.requestFailedWithStatusCode(xhr.status, xhr.responseText);
                    }
                }
                else {
                    _this.failed = true;
                    _this.delegate.requestFailedWithStatusCode(SystemStatusCode.contentTypeMismatch);
                }
            });
        };
        this.requestFailed = function () {
            _this.endRequest(function () {
                _this.failed = true;
                _this.delegate.requestFailedWithStatusCode(SystemStatusCode.networkFailure);
            });
        };
        this.requestTimedOut = function () {
            _this.endRequest(function () {
                _this.failed = true;
                _this.delegate.requestFailedWithStatusCode(SystemStatusCode.timeoutFailure);
            });
        };
        this.requestCanceled = function () {
            _this.endRequest();
        };
        this.delegate = delegate;
        this.location = location;
        this.referrer = referrer;
        this.location = Location.wrap(location);
        this.referrer = Location.wrap(referrer);
        this.url = location.absoluteURL;
        this.createXHR();
    }
    HttpRequest.prototype.send = function () {
        if (this.xhr && !this.sent) {
            this.notifyApplicationBeforeRequestStart();
            this.setProgress(0);
            this.xhr.send();
            this.sent = true;
            this.delegate.requestStarted();
        }
    };
    HttpRequest.prototype.cancel = function () {
        if (this.xhr && this.sent) {
            this.xhr.abort();
        }
    };
    // Application events
    HttpRequest.prototype.notifyApplicationBeforeRequestStart = function () {
        dispatch("turbolinks:request-start", { data: { url: this.url, xhr: this.xhr } });
    };
    HttpRequest.prototype.notifyApplicationAfterRequestEnd = function () {
        dispatch("turbolinks:request-end", { data: { url: this.url, xhr: this.xhr } });
    };
    // Private
    HttpRequest.prototype.createXHR = function () {
        var xhr = this.xhr = new XMLHttpRequest;
        var referrer = this.referrer ? this.referrer.absoluteURL : "";
        var timeout = HttpRequest.timeout * 1000;
        xhr.open("GET", this.url, true);
        xhr.timeout = timeout;
        xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml");
        xhr.setRequestHeader("Turbolinks-Referrer", referrer);
        xhr.onprogress = this.requestProgressed;
        xhr.onload = this.requestLoaded;
        xhr.onerror = this.requestFailed;
        xhr.ontimeout = this.requestTimedOut;
        xhr.onabort = this.requestCanceled;
    };
    HttpRequest.prototype.endRequest = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (this.xhr) {
            this.notifyApplicationAfterRequestEnd();
            callback(this.xhr);
            this.destroy();
        }
    };
    HttpRequest.prototype.setProgress = function (progress) {
        this.progress = progress;
        this.delegate.requestProgressed(progress);
    };
    HttpRequest.prototype.destroy = function () {
        this.setProgress(1);
        this.delegate.requestFinished();
    };
    HttpRequest.timeout = 60;
    return HttpRequest;
}());
export { HttpRequest };
function contentTypeIsHTML(contentType) {
    return (contentType || "").match(/^text\/html|^application\/xhtml\+xml/);
}
//# sourceMappingURL=http_request.js.map