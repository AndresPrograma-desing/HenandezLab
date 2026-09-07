import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Index.module.css';

export const MarkdownContent = ({ children, className = '', style, components }) => (
  <div className={`${styles.markdown} ${className}`} style={style}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children ?? ''}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
