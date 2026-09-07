import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Index.module.css';

/**
 * Generic breadcrumb trail. `items` is the full path in order — the last
 * entry is always rendered as the current page (a highlighted chip, not a
 * link), regardless of whether it has an `onClick`; every earlier entry
 * with an `onClick` renders as a clickable crumb.
 *
 * Crumbs animate in with a small staggered fade (via --crumb-index) so the
 * trail feels alive when it changes — e.g. drilling into a session — rather
 * than an instant text swap. Respects prefers-reduced-motion.
 */
export const Breadcrumbs = ({ items = [], className = '' }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="breadcrumb" className={`${styles.breadcrumbs} ${className}`}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={item.id ?? item.label ?? index}
              className={styles.item}
              style={{ '--crumb-index': index }}
            >
              {index === 0 && <Home size={14} className={styles.homeIcon} aria-hidden="true" />}

              {!isLast && item.onClick ? (
                <button type="button" className={styles.link} onClick={item.onClick}>
                  <span className={styles.linkLabel}>{item.label}</span>
                </button>
              ) : (
                <span
                  className={`${styles.crumbText} ${isLast ? styles.current : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <ChevronRight size={14} className={styles.separator} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
