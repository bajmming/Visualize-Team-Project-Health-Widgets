var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "ReleaseManagement/Core/Contracts", "ReleaseManagement/Core/RestClient", "telemetryclient-team-services-extension", "./release-status", "./telemetryClientSettings"], function (require, exports, TFS_RM_Contracts, TFS_RM_Client, tc, ReleaseStatus, telemetryClientSettings) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("TPHealth-ReleaseDetailsWidget", function () {
            var detailsWidget = new ReleaseDetailsWidget(WidgetHelpers);
            return detailsWidget;
        });
        VSS.notifyLoadSucceeded();
    });
    var ReleaseDetailsWidget = /** @class */ (function () {
        function ReleaseDetailsWidget(WidgetHelpers) {
            this.WidgetHelpers = WidgetHelpers;
        }
        ReleaseDetailsWidget.prototype.load = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("ReleaseDetails");
                            return [4 /*yield*/, this.ShowReleaseDetails(widgetSettings)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                    }
                });
            });
        };
        ReleaseDetailsWidget.prototype.reload = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ShowReleaseDetails(widgetSettings)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.WidgetHelpers.WidgetStatusHelper.Success()];
                    }
                });
            });
        };
        ReleaseDetailsWidget.prototype.ShowReleaseDetails = function (widgetSettings) {
            return __awaiter(this, void 0, void 0, function () {
                var releaseClient, context, customSettings, releases, release;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            releaseClient = TFS_RM_Client.getClient();
                            context = VSS.getWebContext();
                            customSettings = JSON.parse(widgetSettings.customSettings.data);
                            if (!(customSettings != null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, releaseClient.getReleases(context.project.id, customSettings.definitionId, null, null, null, null, null, null, null, null, 1, null, TFS_RM_Contracts.ReleaseExpands.Environments)];
                        case 1:
                            releases = _a.sent();
                            if (releases.length >= 1) {
                                release = releases[0];
                                this.setDetails(release);
                                this.setStatus(release, customSettings.showRejectedAsFailed);
                                this.setNavigateUrl(release);
                            }
                            else {
                                this.setNoDetails();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            this.setNoDetails();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ReleaseDetailsWidget.prototype.setNavigateUrl = function (release) {
            if (release && release._links && release._links.web) {
                VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                    $("#definitionNavigateUrl").on("click", function (e) {
                        e.preventDefault();
                        navigationService.openNewWindow(release._links.web.href, "");
                    });
                });
            }
        };
        ReleaseDetailsWidget.prototype.setStatus = function (release, showRejectedAsFailed) {
            var status = ReleaseStatus.ReleaseStatus.getStatus(release, showRejectedAsFailed);
            switch (status) {
                case TFS_RM_Contracts.DeploymentStatus.InProgress:
                    this.setStatusCssClass("building", "build-status-building", "build-definition-name-building");
                    break;
                case TFS_RM_Contracts.DeploymentStatus.Succeeded:
                    this.setStatusCssClass("success", "build-status-succeeded", "build-definition-name-succeeded");
                    break;
                case TFS_RM_Contracts.DeploymentStatus.Failed:
                    this.setStatusCssClass("fail", "build-status-failed", "build-definition-name-failed");
                    break;
            }
        };
        ReleaseDetailsWidget.prototype.setStatusCssClass = function (root, status, definitionName) {
            var $root = $("#root");
            var $releaseStatus = $("#releaseStatus");
            var $releaseDefinitionName = $("#releaseDefinitionName");
            $root.removeClass("success partial fail building");
            $releaseStatus.removeClass("build-status-succeeded build-status-building build-status-failed");
            $root.addClass(root);
            $releaseStatus.addClass(status);
            $releaseDefinitionName.addClass(definitionName);
        };
        ReleaseDetailsWidget.prototype.setNoDetails = function () {
            $("#root").removeClass("success partial fail building");
            $("#root").addClass("no-releases");
            $("#nodata").text("No releases found");
            $("#details").hide();
        };
        ReleaseDetailsWidget.prototype.setDetails = function (release) {
            $("#details").show();
            $("#releaseDefinitionName").text(release.releaseDefinition.name);
            $("#releaseName").text(release.name);
            $("#releaseDescription").text(release.description);
            $("#releaseCreatedBy").text(release.createdBy.displayName);
            $("#nodata").hide();
            $("#root").removeClass("no-releases");
            if (release.releaseDefinition.name.length > 91) {
                $("#releaseDefinitionName").addClass("reallySmall-text");
            }
        };
        return ReleaseDetailsWidget;
    }());
    exports.ReleaseDetailsWidget = ReleaseDetailsWidget;
});
