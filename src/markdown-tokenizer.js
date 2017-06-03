import * as log from 'loglevel'

log.enableAll()

const STATE_KEYWORDS = [
  'START',
  'DONE',
  'IN_HEADER_1',
  'IN_HEADER_1_TEXT',
  'IN_HEADER_2',
  'IN_HEADER_2_TEXT',
  'IN_TEXT',
  'IN_INLINE_COMMENT',
  'IN_COMMENT_BLOCK',
  'LEFT_ARROW',
  'EXCLAMATION_MARK',
  'HEAD_FIRST_DASH',
  'HEAD_SECOND_DASH',
  'TAIL_FIRST_DASH',
  'TAIL_SECOND_DASH',
  'EXCLAMATION_MARK',
  'IN_COMMENT_',

]

const TOKEN_TYPES = [
  'newline',
  'tab',
  'header1',
  'header2',
  'text',
  'image',
  'inline comment',
  'multi-line comment',
]

const StateType = STATE_KEYWORDS.reduce((acc, cur, i) => {
  acc[cur] = i
  return acc
}, {})

const TokenType = TOKEN_TYPES.reduce((acc, cur, i) => {
  acc[cur] = {
    enum: i,
    name: cur,
  }
  return acc
}, {})

const MarkdownTokenizer = class {
  constructor (text) {
    this.lines = text.split("\n").map(d => d + "\n")
    this.line_no = 0
    this.char_pos = -1
    this.EOF_flag = false
    this.line = this._get_next_line()
  }

  _print_cur_char () {
    let character = this.line[this.char_pos]
    switch (character) {
      case "\t":
        character = "\\t"
        break
      case "\n":
        character = "\\n"
        break
    }
    
    console.log(`- At line ${this.line_no}, position ${this.char_pos + 1}, "${character}"`)
  }

  _print_token (token) {
    console.log(`Token '${token.type.name}', body: ${token.body.toString()}`)
  }

  _get_next_line () {
    this.line_no += 1
    return this.lines.shift()
  }

  _get_next_char () {
    if (this.EOF_flag) {
      return null
    }
    this.char_pos += 1
    let character = this.line[this.char_pos]
    if (character !== undefined) {
      this._print_cur_char()
      return character
    }
    this.line = this._get_next_line()
    if (this.line !== undefined) {
      this.char_pos = 0
      character = this.line[this.char_pos]
      this._print_cur_char()
      return character
    }
    this.EOF_flag = true
    console.log('End of the file')
    return null
  }
  
  _back_to_prev_char () {
    this.char_pos -= 1
  }

  get_token () {
    return this.scan_token()
  }

  scan_token () {
    let state = StateType.START
    let token = {}
    let token_type = null
    let token_string = ''
    let token_string_stack = []

    while (state != StateType.DONE) {
      const character = this._get_next_char()
      if (character === null) {
        return null
      }

      switch (state) {
        case StateType.START:
          if (character === "\n") {
            state = StateType.DONE
            token_type = TokenType.newline
          } else if (character === "#") {
            state = StateType.IN_HEADER_1
          }
          else {
            state = StateType.IN_TEXT
            token_string += character
          }
          break
        case StateType.IN_HEADER_1:
          if (character === " ") {
            state = StateType.IN_HEADER_1_TEXT
          }
          else if (character === "#") {
            state = StateType.IN_HEADER_2
          }
          break
        case StateType.IN_HEADER_1_TEXT:
          if (character === "\n") {
            state = StateType.DONE
            token_type = TokenType.header1
            token_string_stack.push(token_string)
          }
          else {
            state = StateType.IN_HEADER_1_TEXT
            token_string += character
          }
          break
        case StateType.IN_HEADER_2:
          if (character === " ") {
            state = StateType.IN_HEADER_2_TEXT
          }
          break
        case StateType.IN_HEADER_2_TEXT:
          if (character === "\n") {
            state = StateType.DONE
            token_type = TokenType.header2
            token_string_stack.push(token_string)
          } else {
            state = StateType.IN_HEADER_2_TEXT
            token_string += character
          }
          break
        case StateType.IN_TEXT:
          if (character === "\n") {
            state = StateType.DONE
            token_type = TokenType.text
            token_string_stack.push(token_string)
          } else if (character === "<") {
            state = StateType.LEFT_ARROW
          } else {
            state = StateType.IN_TEXT
            token_string += character
          }
          break
        case StateType.DONE:
          break
      }
      if (state === StateType.DONE) {
        token.type = token_type
        token.body = token_string_stack,
        this._print_token(token)
        return token
      }
    }
  }
}


module.exports = MarkdownTokenizer
