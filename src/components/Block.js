import React, { Component } from 'react';
import { SHAPES, COLORS } from '../configs';

import newId from '../utils/newid.js';
const BLOCK_SIZE = 30;
export class Block extends Component {
	compoundWillMount() {
		this.id = newId();
	}
	render() {
		const { x, y, shape } = this.props;
		return (
			<div
				className="block"
				style={{
					width: `${BLOCK_SIZE}px`,
					height: `${BLOCK_SIZE}px`,
					left: x * BLOCK_SIZE,
					top: y * BLOCK_SIZE,
					border: '1px solid #ccc',
					backgroundColor: COLORS[shape]
				}}
				key={this.id}
			/>
		);
	}
}

export default Block;
