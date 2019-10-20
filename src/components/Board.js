import React, { Component } from 'react';

import { SHAPES } from '../configs';

import Block from './Block';
const WIDTH = 10;
const HEIGHT = 20;
export class Board extends Component {
	state = {
		board: null,
		pos: { x: 0, y: 0 },
		width: 10,
		height: 20,
		shapeId: 1,
		shape: SHAPES[0].shape,
		intervalId: null
	};

	componentWillMount() {
		this.createBoard();
		console.log(1);
		let intervalId = setInterval(() => {
			this.updateBoard();
		}, 1000);
		this.setState({ intervalId });

		document.addEventListener('keydown', this.keyDownHandler);
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);

		document.removeEventListener('keydown', this.keyDownHandler);
	}

	createBoard = () => {
		const board = [];
		for (let i = 0; i < HEIGHT; i++) {
			let line = [];
			for (let j = 0; j < WIDTH; j++) {
				line.push(0);
			}
			board.push(line);
		}
		this.setState({ board });
	};

	updateBoard = () => {
		this.moveShape(0, 1);
	};

	hasCollision = (newPos, pos, shapeHeight) => {
		const { board, shape, shapeId } = this.state;
		let tempBoard = [ ...board ];
		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y].length; x++) {
				tempBoard[pos.y + y][pos.x + x] = 0;
			}
		}

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y].length; x++) {
				if (newPos.y + y <= HEIGHT - shapeHeight) {
					let shapeIdCheck = tempBoard[newPos.y + y][newPos.x + x];
					if (shapeIdCheck != 0) {
						debugger;
						console.log('Has collision', shapeIdCheck);
						return true;
					}
				}
			}
		}
		return false;
	};

	moveShape = (xDir, yDir) => {
		const { board, pos, shape } = this.state;

		const newPos = { x: pos.x + xDir, y: pos.y + yDir };
		const shapeWidth = shape[0].length;
		const shapeHeight = shape.length;
		if (newPos.y > HEIGHT - shapeHeight || this.hasCollision(newPos, pos, shapeHeight)) {
			if (yDir == 1) {
				const newShapeId = Math.floor(Math.random() * 5) + 1;
				const newShape = SHAPES[newShapeId - 1].shape;
				this.setState({ pos: { x: 0, y: 0 }, shape: newShape, shapeId: newShapeId });
				return;
			} else {
				return;
			}
		} else if (newPos.x >= 0 && newPos.x <= WIDTH - shapeWidth && newPos.y <= HEIGHT - shapeHeight) {
			const newBoard = board;

			for (let y = 0; y < shape.length; y++) {
				for (let x = 0; x < shape[y].length; x++) {
					newBoard[pos.y + y][pos.x + x] = 0;
				}
			}
			for (let y = 0; y < shape.length; y++) {
				for (let x = 0; x < shape[y].length; x++) {
					newBoard[newPos.y + y][newPos.x + x] = shape[y][x];
				}
			}
			this.setState({ pos: newPos, board: newBoard });
		}
	};

	drawBoard = () => {
		let list = [];
		this.state.board.map((line, y) => {
			line.map((block, x) => {
				list.push(<Block x={x} y={y} shape={this.state.board[y][x]} />);
			});
		});
		return list;
	};

	keyDownHandler = (e) => {
		if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 40) {
			if (e.keyCode == 40) {
				this.moveShape(0, 1);
			} else {
				const direction = e.keyCode == 37 ? -1 : 1;
				this.moveShape(direction, 0);
			}
		}
	};
	render() {
		const board = this.drawBoard();
		return (
			<div
				onKeyDown={(e) => {
					this.keyPressHandler(e);
				}}
			>
				Board
				{board}
			</div>
		);
	}
}

export default Board;
