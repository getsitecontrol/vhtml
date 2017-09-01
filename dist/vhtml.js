(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.vhtml = {})));
}(this, (function (exports) { 'use strict';

var emptyTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

var map = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' };
var sanitized = {};

var options = {
	noEscape: ['style', 'script'],
	emptyTags: emptyTags,
	escape: function escape(str) {
		return String(str).replace(/[&<>"']/g, function (s) {
			return '&' + map[s] + ';';
		});
	},
	normalizeAttr: function normalizeAttr(attr) {
		return attr.toLowerCase();
	},
	normalizeAttrValue: function normalizeAttrValue(attr, value) {
		return value;
	},
	normalizeNode: function normalizeNode(node) {
		return node.toLowerCase();
	},

	DOMAttributeNames: {
		className: 'class',
		htmlFor: 'for'
	}
};

function h(name, attrs) {
	var stack = [];
	for (var i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}

	if (typeof name === 'function') {
		(attrs || (attrs = {})).children = stack.reverse();
		return name(attrs);
	}

	var s = '<' + options.normalizeNode(name);
	if (attrs) for (var _i in attrs) {
		if (attrs[_i] !== false && attrs[_i] != null) {
			var attrName = options.DOMAttributeNames[_i] ? options.normalizeAttr(options.DOMAttributeNames[_i]) : options.escape(options.normalizeAttr(_i));
			var attrValue = options.escape(options.normalizeAttrValue(attrName, attrs[_i]));
			if (attrName && attrValue) {
				s += ' ' + attrName + '="' + attrValue + '"';
			}
		}
	}

	if (emptyTags.indexOf(name) === -1) {
		s += '>';

		while (stack.length) {
			var child = stack.pop();
			if (child) {
				if (child.pop) {
					for (var _i2 = child.length; _i2--;) {
						stack.push(child[_i2]);
					}
				} else {
					s += sanitized[child] === true || options.noEscape.indexOf(name) !== -1 ? child : options.escape(child);
				}
			}
		}

		s += '</' + options.normalizeNode(name) + '>';
	} else {
		s += '>';
	}

	sanitized[s] = true;
	return s;
}

exports.options = options;
exports.h = h;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vhtml.js.map
