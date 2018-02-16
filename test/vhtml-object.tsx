const { expect } = require('chai')
const { h, options } = require('../src/vhtml')
/** @jsx h */
/*global describe,it*/

describe('vhtml to object', () => {
	it('should stringify html', () => {
		let items = ['one', 'two', 'three']
		expect(
			<div class="foo">
				<h1>Hi!</h1>
				<p>Here is a list of {items.length} items:</p>
				<ul>{items.map(item => <li>{item}</li>)}</ul>
			</div>
		).to.eql({
			nodeName: 'div',
			attributes: { class: 'foo' },
			children: [{ nodeName: 'h1', attributes: {}, children: ['Hi!'] }],
		})
	})

	it('should flatten children', () => {
		expect(
			<div>
				{[['a', 'b']]}
				<span>d</span>
				{['e', ['f'], [['g']]]}
			</div>
		).to.eql({ nodeName: 'div', attributes: {}, children: ['a', 'b'] })
	})

	it('should support sortof components', () => {
		let items = ['one', 'two']

		interface Props {
			item: string
			index: number
			children?: JSX.Element[]
		}

		const Item = ({ item, index, children }: Props) => (
			<li id={index}>
				<h4>{item}</h4>
				{children}
			</li>
		)

		expect(
			<div class="foo">
				<h1>Hi!</h1>
				<ul>
					{items.map((item, index) => (
						<Item {...{ item, index }}>This is item {item}!</Item>
					))}
				</ul>
			</div>
		).to.eql({
			nodeName: 'div',
			attributes: { class: 'foo' },
			children: [{ nodeName: 'h1', attributes: {}, children: ['Hi!'] }],
		})
	})

	it('should support sortof components without args', () => {
		let items = ['one', 'two']

		const Item = () => (
			<li>
				<h4 />
			</li>
		)

		expect(
			<div class="foo">
				<h1>Hi!</h1>
				<ul>{items.map((item, index) => <Item>This is item {item}!</Item>)}</ul>
			</div>
		).to.eql({
			nodeName: 'div',
			attributes: { class: 'foo' },
			children: [{ nodeName: 'h1', attributes: {}, children: ['Hi!'] }],
		})
	})

	it('should support sortof components without args but with children', () => {
		let items = ['one', 'two']

		const Item = ({ children }: { children?: JSX.Element[] }) => (
			<li>
				<h4 />
				{children}
			</li>
		)

		expect(
			<div class="foo">
				<h1>Hi!</h1>
				<ul>{items.map((item, index) => <Item>This is item {item}!</Item>)}</ul>
			</div>
		).to.eql({
			nodeName: 'div',
			attributes: { class: 'foo' },
			children: [{ nodeName: 'h1', attributes: {}, children: ['Hi!'] }],
		})
	})
})
