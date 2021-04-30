import namespace from "./namespace";
import "./script_warning";
export default namespace;
if (!window.Turbolinks) {
    window.Turbolinks = namespace;
    if (!isAMD() && !isCommonJS()) {
        namespace.start();
    }
}
function isAMD() {
    return typeof define == "function" && define.amd;
}
function isCommonJS() {
    return typeof exports == "object" && typeof module != "undefined";
}
//# sourceMappingURL=index.js.map