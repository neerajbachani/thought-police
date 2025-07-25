"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-retry-allowed";
exports.ids = ["vendor-chunks/is-retry-allowed"];
exports.modules = {

/***/ "(rsc)/./node_modules/is-retry-allowed/index.js":
/*!************************************************!*\
  !*** ./node_modules/is-retry-allowed/index.js ***!
  \************************************************/
/***/ ((module) => {

eval("\n\nconst denyList = new Set([\n\t'ENOTFOUND',\n\t'ENETUNREACH',\n\n\t// SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328\n\t'UNABLE_TO_GET_ISSUER_CERT',\n\t'UNABLE_TO_GET_CRL',\n\t'UNABLE_TO_DECRYPT_CERT_SIGNATURE',\n\t'UNABLE_TO_DECRYPT_CRL_SIGNATURE',\n\t'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',\n\t'CERT_SIGNATURE_FAILURE',\n\t'CRL_SIGNATURE_FAILURE',\n\t'CERT_NOT_YET_VALID',\n\t'CERT_HAS_EXPIRED',\n\t'CRL_NOT_YET_VALID',\n\t'CRL_HAS_EXPIRED',\n\t'ERROR_IN_CERT_NOT_BEFORE_FIELD',\n\t'ERROR_IN_CERT_NOT_AFTER_FIELD',\n\t'ERROR_IN_CRL_LAST_UPDATE_FIELD',\n\t'ERROR_IN_CRL_NEXT_UPDATE_FIELD',\n\t'OUT_OF_MEM',\n\t'DEPTH_ZERO_SELF_SIGNED_CERT',\n\t'SELF_SIGNED_CERT_IN_CHAIN',\n\t'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',\n\t'UNABLE_TO_VERIFY_LEAF_SIGNATURE',\n\t'CERT_CHAIN_TOO_LONG',\n\t'CERT_REVOKED',\n\t'INVALID_CA',\n\t'PATH_LENGTH_EXCEEDED',\n\t'INVALID_PURPOSE',\n\t'CERT_UNTRUSTED',\n\t'CERT_REJECTED',\n\t'HOSTNAME_MISMATCH'\n]);\n\n// TODO: Use `error?.code` when targeting Node.js 14\nmodule.exports = error => !denyList.has(error && error.code);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaXMtcmV0cnktYWxsb3dlZC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIkQ6XFxjb2RpbmdcXG9wZW4tc291cmNlXFx0aG91Z2h0LXBvbGljZVxcbm9kZV9tb2R1bGVzXFxpcy1yZXRyeS1hbGxvd2VkXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGRlbnlMaXN0ID0gbmV3IFNldChbXG5cdCdFTk9URk9VTkQnLFxuXHQnRU5FVFVOUkVBQ0gnLFxuXG5cdC8vIFNTTCBlcnJvcnMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9mYzhlM2UyY2RjNTIxOTc4MzUxZGUyNTcwMzBkYjAwNzZkNzllMGFiL3NyYy9jcnlwdG8vY3J5cHRvX2NvbW1vbi5jYyNMMzAxLUwzMjhcblx0J1VOQUJMRV9UT19HRVRfSVNTVUVSX0NFUlQnLFxuXHQnVU5BQkxFX1RPX0dFVF9DUkwnLFxuXHQnVU5BQkxFX1RPX0RFQ1JZUFRfQ0VSVF9TSUdOQVRVUkUnLFxuXHQnVU5BQkxFX1RPX0RFQ1JZUFRfQ1JMX1NJR05BVFVSRScsXG5cdCdVTkFCTEVfVE9fREVDT0RFX0lTU1VFUl9QVUJMSUNfS0VZJyxcblx0J0NFUlRfU0lHTkFUVVJFX0ZBSUxVUkUnLFxuXHQnQ1JMX1NJR05BVFVSRV9GQUlMVVJFJyxcblx0J0NFUlRfTk9UX1lFVF9WQUxJRCcsXG5cdCdDRVJUX0hBU19FWFBJUkVEJyxcblx0J0NSTF9OT1RfWUVUX1ZBTElEJyxcblx0J0NSTF9IQVNfRVhQSVJFRCcsXG5cdCdFUlJPUl9JTl9DRVJUX05PVF9CRUZPUkVfRklFTEQnLFxuXHQnRVJST1JfSU5fQ0VSVF9OT1RfQUZURVJfRklFTEQnLFxuXHQnRVJST1JfSU5fQ1JMX0xBU1RfVVBEQVRFX0ZJRUxEJyxcblx0J0VSUk9SX0lOX0NSTF9ORVhUX1VQREFURV9GSUVMRCcsXG5cdCdPVVRfT0ZfTUVNJyxcblx0J0RFUFRIX1pFUk9fU0VMRl9TSUdORURfQ0VSVCcsXG5cdCdTRUxGX1NJR05FRF9DRVJUX0lOX0NIQUlOJyxcblx0J1VOQUJMRV9UT19HRVRfSVNTVUVSX0NFUlRfTE9DQUxMWScsXG5cdCdVTkFCTEVfVE9fVkVSSUZZX0xFQUZfU0lHTkFUVVJFJyxcblx0J0NFUlRfQ0hBSU5fVE9PX0xPTkcnLFxuXHQnQ0VSVF9SRVZPS0VEJyxcblx0J0lOVkFMSURfQ0EnLFxuXHQnUEFUSF9MRU5HVEhfRVhDRUVERUQnLFxuXHQnSU5WQUxJRF9QVVJQT1NFJyxcblx0J0NFUlRfVU5UUlVTVEVEJyxcblx0J0NFUlRfUkVKRUNURUQnLFxuXHQnSE9TVE5BTUVfTUlTTUFUQ0gnXG5dKTtcblxuLy8gVE9ETzogVXNlIGBlcnJvcj8uY29kZWAgd2hlbiB0YXJnZXRpbmcgTm9kZS5qcyAxNFxubW9kdWxlLmV4cG9ydHMgPSBlcnJvciA9PiAhZGVueUxpc3QuaGFzKGVycm9yICYmIGVycm9yLmNvZGUpO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/is-retry-allowed/index.js\n");

/***/ })

};
;