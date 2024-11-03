import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export const Tooltip = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const triggerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      //   tooltipRef.current.style.maxWidth = maxWidth;

      switch (position) {
        case 'top':
          top = -tooltipRect.height - 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.height + 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = -tooltipRect.width - 8;
          break;
        case 'right':
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.width + 8;
          break;
      }

      tooltipRef.current.style.top = `${top}px`;
      tooltipRef.current.style.left = `${left}px`;
    }
  }, [isVisible, position]);

  return (
    <div
      ref={containerRef}
      className="inline-flex relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-2 py-1 text-[12px] font-normal text-white
             bg-gray-800 border rounded-md shadow-lg  whitespace-nowrap
            before:content-[''] before:absolute before:w-0 before:h-0
            before:border-4 before:border-transparent
            ${
              position === 'top' &&
              `
              before:border-t-gray-900
              before:left-1/2 before:-translate-x-1/2 before:top-full
            `
            }
            ${
              position === 'bottom' &&
              `
              before:border-b-gray-900 before:border-t-transparent
              before:left-1/2 before:-translate-x-1/2 before:bottom-full
            `
            }
            ${
              position === 'left' &&
              `
              before:border-l-gray-900 before:border-t-transparent
              before:top-1/2 before:-translate-y-1/2 before:left-full
            `
            }
            ${
              position === 'right' &&
              `
              before:border-r-gray-900 before:border-t-transparent
              before:top-1/2 before:-translate-y-1/2 before:right-full
            `
            }
          `}
        >
          {text}
        </div>
      )}
    </div>
  );
};

// Example usage component
const TooltipExample = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Tooltip Examples</h2>

      {/* Different positions */}
      <div className="space-y-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span>Username</span>
            <Tooltip
              text="Enter your username (minimum 3 characters)"
              position="top"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <span>Password</span>
            <Tooltip
              text="Password must be at least 8 characters long"
              position="right"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <span>Email</span>
            <Tooltip text="We'll never share your email" position="bottom">
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <span>API Key</span>
            <Tooltip text="Your unique API authentication key" position="left">
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Long text example */}
      <div className="flex items-center gap-2">
        <span>Advanced Settings</span>
        <Tooltip
          text="Configure advanced settings including rate limiting, IP whitelisting, and custom domain configuration"
          position="top"
        >
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
        </Tooltip>
      </div>
    </div>
  );
};

export default TooltipExample;
