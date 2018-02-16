const emptyTags = [
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
]

// escape an attribute
const map = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' }
let sanitized = {}

export const options = {
	noEscape: ['style', 'script'],
	emptyTags,
	escape(str) {
		return String(str).replace(/[&<>"']/g, s => `&${map[s]};`)
	},
	normalizeAttr(attr) {
		return attr.toLowerCase()
	},
	normalizeAttrValue(attr, value) {
		return value
	},
	normalizeNode(node) {
		return node.toLowerCase()
	},
	DOMAttributeNames: {
		className: 'class',
		htmlFor: 'for',
	},
}
function concat<T>(...item: (T | T[])[]): T[] {
	return Array.prototype.concat.apply([], item)
}

/** Hyperscript reviver that constructs a JSON string. */
export function h(name, attrs?: any, children?: any) {
	// Sortof component support!
	if (typeof name === 'function') {
		;(attrs || (attrs = {})).children = children
		return name(attrs)
		// return name(attrs, stack.reverse());
	}
	return {
		nodeName: name,
		attributes: attrs || {},
		children: concat([], ...(children || [])),
	}
}

/** Hyperscript reviver that constructs a sanitized HTML string. */
export function html(name, attrs) {
	let stack = []
	for (let i = arguments.length; i-- > 2; ) {
		stack.push(arguments[i])
	}

	// Sortof component support!
	if (typeof name === 'function') {
		;(attrs || (attrs = {})).children = stack.reverse()
		return name(attrs)
		// return name(attrs, stack.reverse());
	}

	let s = `<${options.normalizeNode(name)}`
	if (attrs && !attrs['__innerHTML']) {
		for (let i in attrs) {
			if (attrs[i] !== false && attrs[i] != null) {
				const attrName = options.DOMAttributeNames[i]
					? options.normalizeAttr(options.DOMAttributeNames[i])
					: options.escape(options.normalizeAttr(i))
				const attrValue = options.escape(
					options.normalizeAttrValue(attrName, attrs[i])
				)
				if (attrName && attrValue) {
					s += ` ${attrName}="${attrValue}"`
				}
			}
		}
	}

	if (emptyTags.indexOf(name) === -1) {
		s += '>'
		if (attrs && attrs['__innerHTML']) {
			s += attrs['__innerHTML']
		} else {
			while (stack.length) {
				let child = stack.pop()
				if (child) {
					if (child.pop) {
						for (let i = child.length; i--; ) stack.push(child[i])
					} else {
						s +=
							sanitized[child] === true || options.noEscape.indexOf(name) !== -1
								? child
								: options.escape(child)
					}
				}
			}
		}
		s += `</${options.normalizeNode(name)}>`
	} else {
		s += '>'
	}

	sanitized[s] = true
	return s
}
