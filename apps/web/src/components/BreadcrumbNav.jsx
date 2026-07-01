
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const BreadcrumbNav = ({ items }) => {
  const location = useLocation();
  
  // Auto-generate if items not provided
  const paths = items || location.pathname.split('/').filter(p => p).map((p, i, arr) => {
    let label = p.replace(/-/g, ' ');
    label = label.split(' ').map(word => {
      const lower = word.toLowerCase();
      if (['llm', 'llms', 'vram', 'api', 'cpu', 'gpu', 'os', 'yml', 'docker', 'ai'].includes(lower)) {
        return lower === 'llms' ? 'LLMs' : lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    
    return {
      label,
      path: '/' + arr.slice(0, i + 1).join('/')
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2">
      {paths.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <ChevronRight size={14} className="flex-shrink-0" />}
          {index === paths.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
