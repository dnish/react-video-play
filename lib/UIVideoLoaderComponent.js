"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var UIVideoLoader = /** @class */ (function (_super) {
    __extends(UIVideoLoader, _super);
    function UIVideoLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        return _this;
    }
    UIVideoLoader.prototype.render = function () {
        return (React.createElement("div", { className: "ui-video-loader" },
            React.createElement("svg", { className: "ui-video-loader-circular", viewBox: "25 25 50 50", stroke: this.props.loaderColor },
                React.createElement("circle", { className: "ui-video-loader-path", cx: "50", cy: "50", r: "20", fill: "none", strokeWidth: "3", strokeMiterlimit: "10" }))));
    };
    UIVideoLoader.defaultProps = {
        loaderColor: "#fff"
    };
    return UIVideoLoader;
}(React.Component));
exports.UIVideoLoader = UIVideoLoader;
