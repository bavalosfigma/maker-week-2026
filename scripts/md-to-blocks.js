import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function parseMarkdown(md) {
  const blocks = []
  const lines = md.trim().split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i += 1
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() })
      i += 1
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() })
      i += 1
      continue
    }

    if (/^[-*] /.test(line)) {
      const items = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, '').trim())
        i += 1
      }
      blocks.push({ type: 'list', ordered: false, items })
      continue
    }

    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, '').trim())
        i += 1
      }
      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    const paragraphLines = []
    while (
      i < lines.length
      && lines[i].trim() !== ''
      && !lines[i].startsWith('## ')
      && !lines[i].startsWith('### ')
      && !/^[-*] /.test(lines[i])
      && !/^\d+\. /.test(lines[i])
    ) {
      paragraphLines.push(lines[i])
      i += 1
    }

    if (paragraphLines.length) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
    }
  }

  return blocks
}

function writeBlockJs(filePath, blocks) {
  fs.writeFileSync(filePath, `export default ${JSON.stringify(blocks, null, 2)}\n`)
}

function convertArticle(articleId, { eyebrow, title, marginaliaAfter = null }) {
  const articleDir = path.join(root, 'src/articles', articleId)
  const blocksDir = path.join(articleDir, 'blocks')
  const mdFiles = fs.readdirSync(blocksDir).filter((file) => file.endsWith('.md')).sort()

  const imports = []
  const body = []

  mdFiles.forEach((file, index) => {
    const md = fs.readFileSync(path.join(blocksDir, file), 'utf8')
    const blocks = parseMarkdown(md)
    const jsName = file.replace(/\.md$/, '.js')
    writeBlockJs(path.join(blocksDir, jsName), blocks)
    fs.unlinkSync(path.join(blocksDir, file))

    const varName = `section${index + 1}`
    imports.push(`import ${varName} from './blocks/${jsName}'`)
    body.push(`  ...${varName},`)

    if (marginaliaAfter === file.replace(/\.md$/, '')) {
      body.push(`  { type: 'marginalia', text: 'Research is not a preface. It is a loop you keep running.' },`)
    }
  })

  const content = `${imports.join('\n')}

export default [
  { type: 'header', eyebrow: '${eyebrow}', title: ${JSON.stringify(title)} },
${body.join('\n')}
]
`

  fs.writeFileSync(path.join(articleDir, 'content.js'), content)
}

convertArticle('article01', {
  eyebrow: 'principle 01',
  title: 'Look towards something else',
})

convertArticle('article02', {
  eyebrow: 'principle 02',
  title: 'Make What You Know',
  marginaliaAfter: '02-slt-from-noticing-to-notes',
})

console.log('Converted articles to prop-based blocks')
