(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['h5-tools'] = factory());
}(this, (function () { 'use strict';

    /**
     * 返回URL参数对象
     */
    var getParams = function getParams(key) {
      var arr = (location.search || "").replace(/^\?/, '').split("&");
      var params = {};
      var data = [];

      for (var i = 0; i < arr.length; i++) {
        data = arr[i].split("=");

        if (data.length === 2) {
          params[data[0]] = data[1];
        }
      }

      return key ? params[key] : params;
    };
    /**
     * 获取hash(取消#)
     */

    var getHash = function getHash() {
      return (location.search || "").replace("#", '');
    };
    /**
     * 获取URL
     * @param {*} params 
     */

    var getUrl = function getUrl(params) {
      if (params === void 0) params = {};
      var query = '';
      Object.keys(params).forEach(function (key) {
        query += key + '=' + params[key] + '&';
      });

      if (query.length > 0) {
        query = '?' + query.substr(0, query.length - 1);
      }

      return location.href.replace(location.search, '').replace(location.hash, '') + query;
    };
    var url = {
      getParams: getParams,
      getHash: getHash,
      getUrl: getUrl
    };

    var _storage = window.localStorage;

    var cache = function cache() {};

    cache.prototype.setItem = function (k, v, t) {
      var seconds = parseInt(t);
      var expire = 0;

      if (seconds > 0) {
        expire = new Date().getTime() + seconds * 1000;
      }

      _storage.setItem(k, JSON.stringify({
        value: v,
        expire: expire
      }));
    };

    cache.prototype.getItem = function (k, _default) {
      if (_default === void 0) _default = null;
      var time = new Date().getTime();

      var valueItem = _storage.getItem(k);

      if (!valueItem) {
        return _default;
      }

      var ref = JSON.parse(valueItem);
      var value = ref.value;
      var expire = ref.expire;

      if (expire === 0 || expire > time) {
        return value || _default;
      }

      _storage.removeItem(k);

      return _default;
    };

    cache.prototype.removeItem = function (k) {
      _storage.removeItem(k);
    };

    var cache$1 = new cache();

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    var u = navigator.userAgent;
    var isAndroid = function isAndroid() {
      return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    };
    var isIOS = function isIOS() {
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };
    var isWeiXin = function isWeiXin() {
      return u.indexOf('MicroMessenger') > -1;
    };
    /**
     * 移动端初始化
     */

    var mobileInit = function mobileInit() {
      function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {
          'fontSize': 0
        }); // 重写设置网页字体大小的事件

        WeixinJSBridge.on('menu:setfont', function () {
          WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
          });
        });
      }

      if (isAndroid()) {
        if ((typeof WeixinJSBridge === "undefined" ? "undefined" : _typeof(WeixinJSBridge)) == "object" && typeof WeixinJSBridge.invoke == "function") {
          handleFontSize();
        } else {
          if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
          }
        }
      }

      if (isIOS()) {
        window.addEventListener('focusout', function () {
          setTimeout(function () {
            window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop);
          }, 100);
        });
      }

      var bodyHeight = window.document.body.offsetHeight;
      var timer = setInterval(function () {
        bodyHeight = window.document.body.offsetHeight;

        if (bodyHeight > 0) {
          clearInterval(timer);
        }
      }, 100);

      window.onresize = function () {
        if (window.history && window.history.length > 1) {
          bodyHeight -= 49;
        }

        if (bodyHeight - window.document.body.offsetHeight > 49) {
          window.document.body.style.height = bodyHeight + 'px';
        }
      };
    };
    var compat = {
      isAndroid: isAndroid,
      isIOS: isIOS,
      isWeiXin: isWeiXin,
      mobileInit: mobileInit
    };

    var main = {
      url: url,
      cache: cache$1,
      compat: compat
    };

    return main;

})));