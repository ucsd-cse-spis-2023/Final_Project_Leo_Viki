from flask import Flask, render_template, request
import numpy as np
import random
import sys
import math
import copy


app = Flask(__name__)

rows = 6
columns = 7

player = 0
ai = 1

empty = 0
player_piece = 1
ai_piece = 2

win_condition = 4
def drop_piece(board, row, col, piece):
	board[row][col] = piece
	return board
	
def get_next_open_row(board, col):
	for r in range(rows):
		if board[r][col] == 0:
			return r

def evaluate_window(window, piece):
	score = 0
	opp_piece = player_piece
	if piece == player_piece:
		opp_piece = ai_piece

	if window.count(piece) == 4:
		score += 100
	elif window.count(piece) == 3 and window.count(empty) == 1:
		score += 5
	elif window.count(piece) == 2 and window.count(empty) == 2:
		score += 2

	if window.count(opp_piece) == 3 and window.count(empty) == 1:
		score -= 4

	return score

def score_position(board, piece):
	score = 0
	board = np.asarray(board)

	## Score center column
	center_array = [int(i) for i in list(board[:,columns//2])]
	center_count = center_array.count(piece)
	score += center_count * 3

	## Score Horizontal
	for r in range(rows):
		row_array = [int(i) for i in list(board[r,:])]
		for c in range(columns-3):
			window = row_array[c:c+win_condition]
			score += evaluate_window(window, piece)

	## Score Vertical
	for c in range(columns):
		col_array = [int(i) for i in list(board[:,c])]
		for r in range(rows-3):
			window = col_array[r:r+win_condition]
			score += evaluate_window(window, piece)

	## Score posiive sloped diagonal
	for r in range(rows-3):
		for c in range(columns-3):
			window = [board[r+i][c+i] for i in range(win_condition)]
			score += evaluate_window(window, piece)

	for r in range(rows-3):
		for c in range(columns-3):
			window = [board[r+3-i][c+i] for i in range(win_condition)]
			score += evaluate_window(window, piece)

	return score

def get_valid_locations(board):
	valid_locations = []
	for col in range(columns):
		if is_valid_location(board, col):
			valid_locations.append(col)
	return valid_locations

def is_valid_location(board, col):
	return board[rows -1][col] == 0

def winning_move(board, piece):
	# Check horizontal locations for win
	for c in range(columns-3):
		for r in range(rows):
			if board[r][c] == piece and board[r][c+1] == piece and board[r][c+2] == piece and board[r][c+3] == piece:
				return True

	# Check vertical locations for win
	for c in range(columns):
		for r in range(rows-3):
			if board[r][c] == piece and board[r+1][c] == piece and board[r+2][c] == piece and board[r+3][c] == piece:
				return True

	# Check positively sloped diaganols
	for c in range(columns-3):
		for r in range(rows-3):
			if board[r][c] == piece and board[r+1][c+1] == piece and board[r+2][c+2] == piece and board[r+3][c+3] == piece:
				return True

	# Check negatively sloped diaganols
	for c in range(columns-3):
		for r in range(3, rows):
			if board[r][c] == piece and board[r-1][c+1] == piece and board[r-2][c+2] == piece and board[r-3][c+3] == piece:
				return True
			
def is_terminal_node(board):
	return winning_move(board, player_piece) or winning_move(board, ai_piece) or len(get_valid_locations(board)) == 0


def minimax(board, depth, alpha, beta, maximizingPlayer):
	valid_locations = get_valid_locations(board)
	is_terminal = is_terminal_node(board)
	if depth == 0 or is_terminal:
		if is_terminal:
			if winning_move(board, ai_piece):
				return (None, 100000000000000)
			elif winning_move(board, player_piece):
				return (None, -10000000000000)
			else: # Game is over, no more valid moves
				return (None, 0)
		else: # Depth is zero
			return (None, score_position(board, ai_piece))
	if maximizingPlayer:
		value = -math.inf
		column = random.choice(valid_locations)
		for col in valid_locations:
			row = get_next_open_row(board, col)
			if row==None:
				print("if", row, col)
				continue
			b_copy = copy.deepcopy(board)
			drop_piece(b_copy, row, col, ai_piece)
			new_score = minimax(b_copy, depth-1, alpha, beta, False)[1]
			if new_score > value:
				value = new_score
				column = col
			alpha = max(alpha, value)
			if alpha >= beta:
				break
		return column, value

	else: # Minimizing player
		value = math.inf
		column = random.choice(valid_locations)
		for col in valid_locations:
			row = get_next_open_row(board, col)
			if row==None:
				print("else", row, col)
				continue
			b_copy = copy.deepcopy(board)
			drop_piece(b_copy, row, col, player_piece)
			new_score = minimax(b_copy, depth-1, alpha, beta, True)[1]
			if new_score < value:
				value = new_score
				column = col
			beta = min(beta, value)
			if alpha >= beta:
				break
		return column, value


@app.route("/")
def hello():
   return render_template("index.html")


@app.route("/getMove1", methods = ['POST'])
def get_move1():
   board = request.get_json()
   board.reverse()
   col, minimax_score = minimax(board, 1, -math.inf, math.inf, True)
   return str(col)


@app.route("/getMove2", methods = ['POST'])
def get_move2():
   board = request.get_json()
   board.reverse()
   col, minimax_score = minimax(board, 3, -math.inf, math.inf, True)
   return str(col)

@app.route("/getMove3", methods = ['POST'])
def get_move3():
	board = request.get_json()
	board.reverse()
	col, minimax_score = minimax(board, 6, -math.inf, math.inf, True)
	return str(col)

	# if is_valid_location(board, col):
	# 	row = get_next_open_row(board, col)
	# 	drop_piece(board, row, col, ai_piece)
	# 	return ""


if __name__ == "__main__":
   app.run(host='0.0.0.0')