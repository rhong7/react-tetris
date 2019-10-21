import React, { Component } from 'react';

import { SHAPES } from '../configs';

import Block from './Block';

const WIDTH = 10;
const HEIGHT = 20;
const FPS = 60;

export class Board extends Component {
	state = {
		board: null,
		pos: { x: 0, y: 0 },
		width: 10,
		height: 20,
		shapeId: 1,
		shape: SHAPES[0].shape,
		intervalId: null,
		emptyArr: []
	};

	componentWillMount() {
		this.createBoard();
		console.log(1);
		let intervalId = setInterval(() => {
			this.updateBoard();
		}, 200);
		const emptyArr = [];
		for (let i = 0; i < WIDTH; i++) {
			emptyArr.push(0);
		}
		this.setState({ intervalId, emptyArr });

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

	hasCollision = (newPos, pos, shape, board) => {
		let tempBoard = board.map((inner) => inner.slice());

		if (newPos != pos) {
			tempBoard = this.drawShapeToBoard(shape, tempBoard, pos, true);
		} else {
			console.log('rotate');
		}

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y].length; x++) {
				if (newPos.y + y < HEIGHT) {
					let shapeOnBoard = tempBoard[newPos.y + y][newPos.x + x];
					let currentShape = shape[y][x];
					if (shapeOnBoard > 0 && currentShape !== 0) {
						console.log('Has collision', shapeOnBoard);
						return true;
					}
				}
			}
		}
		return false;
	};

	outOfBoard = (newPos, shape) => {
		let shapeWidth = shape[0].length;
		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y].length; x++) {
				let currentShape = shape[y][x];
				if (newPos.x + x < 0 || newPos.x + x >= WIDTH) {
					if (currentShape !== 0) {
						console.log('Is out of board');
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

		let newBoard = this.checkLineDeletion(board);
		const reachedGround = this.reachedGround(shape, board, newPos);
		if (reachedGround == true || this.hasCollision(newPos, pos, shape, board)) {
			if (yDir === 1) {
				const newShapeId = Math.floor(Math.random() * 5) + 1;
				const newShape = SHAPES[newShapeId - 1].shape;
				this.setState({
					pos: { x: 0, y: 0 },
					shape: newShape,
					shapeId: newShapeId,
					board: newBoard
				});
			}
			return false;
		} else if (this.outOfBoard(newPos, shape) == false && this.reachedGround !== false) {
			newBoard = this.drawShapeToBoard(shape, newBoard, pos, true);
			newBoard = this.drawShapeToBoard(shape, newBoard, newPos, false);

			this.setState({ pos: newPos, board: newBoard });
			return true;
		}
	};

	reachedGround = (shape, board, pos) => {
		let shapeLength = shape.length;
		let yPos = pos.y + shapeLength;
		if (yPos > HEIGHT) {
			let checkingY = shapeLength - 1 - (yPos - HEIGHT - 1);
			for (let x = 0; x < shape[checkingY].length; x++) {
				let shapeId = shape[checkingY][x];
				console.log(shapeId);
				if (shapeId !== 0) return true;
			}
		}
		return false;
	};

	drawShapeToBoard = (shape, board, pos, empty) => {
		for (let y = 0; y < shape.length; y++) {
			if (board[pos.y + y]) {
				for (let x = 0; x < shape[y].length; x++) {
					let shapeOnBoard = board[pos.y + y][pos.x + x];
					let currentShape = shape[y][x];
					if (empty && currentShape !== 0) {
						board[pos.y + y][pos.x + x] = 0;
					} else {
						if (shapeOnBoard === 0 && currentShape !== 0) {
							board[pos.y + y][pos.x + x] = currentShape;
						}
					}
				}
			}
		}

		return board;
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

	rotateShape = () => {
		let { shape, board, pos } = this.state;
		let newShape = shape.map((inner) => [ ...inner ]);
		this.drawShapeToBoard(shape, board, pos, true);
		let length = shape.length;
		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[0].length; x++) {
				newShape[x][length - 1 - y] = shape[y][x];
			}
		}
		if (this.outOfBoard(pos, newShape) == true || this.hasCollision(pos, pos, newShape, board)) {
			this.drawShapeToBoard(shape, board, pos, false);
		} else {
			this.drawShapeToBoard(newShape, board, pos, false);
			this.setState({ shape: newShape });
		}
	};

	straightToGround = () => {
		let move = true;
		while (move == true) {
			move = this.moveShape(0, 1);
		}
	};

	checkLineDeletion = (board) => {
		let newBoard = [ ...board.map((line) => [ ...line ]) ];
		console.log('checking line');
		for (let i = 0; i < HEIGHT; i++) {
			if (board[i].includes(0) == false) {
				newBoard.splice(i, 1);
				newBoard.unshift(this.state.emptyArr);
				console.log(i, 'line filled');
			}
		}

		return newBoard;
	};

	keyDownHandler = (e) => {
		if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 38) {
			if (e.keyCode === 40) {
				this.moveShape(0, 1);
			} else if (e.keyCode == 38) {
				this.rotateShape();
			} else {
				const direction = e.keyCode === 37 ? -1 : 1;
				this.moveShape(direction, 0);
			}
		} else if (e.keyCode == 32) {
			this.straightToGround();
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
