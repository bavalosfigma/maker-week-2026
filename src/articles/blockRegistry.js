import ArticleHeader from '../components/blocks/ArticleHeader.vue'
import ArticleFigure from '../components/blocks/ArticleFigure.vue'
import ArticleHeading from '../components/blocks/ArticleHeading.vue'
import ArticleIntro from '../components/blocks/ArticleIntro.vue'
import ArticleList from '../components/blocks/ArticleList.vue'
import ArticleMarginalia from '../components/blocks/ArticleMarginalia.vue'
import ArticleParagraph from '../components/blocks/ArticleParagraph.vue'
import ArticleBiblio from '../components/blocks/ArticleBiblio.vue'

export const blockComponents = {
  header: ArticleHeader,
  figure: ArticleFigure,
  heading: ArticleHeading,
  intro: ArticleIntro,
  paragraph: ArticleParagraph,
  list: ArticleList,
  marginalia: ArticleMarginalia,
  biblio: ArticleBiblio,
}

export function blockProps(block) {
  const { type, ...props } = block
  return props
}
