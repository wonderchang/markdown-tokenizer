import fs from 'fs'
import { expect } from 'chai'

import MarkdownTokenizer from '../dist/markdown-tokenizer'

const doc = `# example

Thiwefwefwefewf
wefwefwefwefe
ewfwefwefweeeeeeeweeeeeee

## wefwefwefwef

wefwefewf
`

describe("Construct object instance", () => {
  it("adds the numbers together", () => {
    const tokenizer = new MarkdownTokenizer(doc)
    let token = tokenizer.get_token()
    while (token) {
      console.log(token)
      token = tokenizer.get_token()
    }
  })
})

