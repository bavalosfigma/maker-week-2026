import ArticleHeader from '../components/blocks/ArticleHeader.vue'
import ArticleHeading from '../components/blocks/ArticleHeading.vue'
import ArticleList from '../components/blocks/ArticleList.vue'
import ArticleMarginalia from '../components/blocks/ArticleMarginalia.vue'
import ArticleParagraph from '../components/blocks/ArticleParagraph.vue'

export const blockComponents = {
  header: ArticleHeader,
  heading: ArticleHeading,
  paragraph: ArticleParagraph,
  list: ArticleList,
  marginalia: ArticleMarginalia,
}

export function blockProps(block) {
  const { type, ...props } = block
  return props
}
