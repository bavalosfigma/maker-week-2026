import article01 from './article01/config.js'
import article02 from './article02/config.js'
import article03 from './article03/config.js'
import article04 from './article04/config.js'
import article05 from './article05/config.js'
import './theme.css'

/**
 * Article registry.
 *
 * To add a new article popup:
 * 1. Create src/articles/articleXX/ with config.js, content.js, and blocks/*.md
 * 2. Register it below
 * 3. Open it from App.vue with <ArticleWindow article-id="articleXX" />
 */
export const articles = {
  article01,
  article02,
  article03,
  article04,
  article05,
}

export function getArticle(id) {
  const article = articles[id]

  if (!article) {
    throw new Error(`Unknown article: ${id}`)
  }

  return article
}

export function getArticleTitle(article) {
  const header = article.blocks.find((block) => block.type === 'header')
  return header?.title ?? article.id
}
