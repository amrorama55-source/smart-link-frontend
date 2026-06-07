import { useRef, useEffect } from 'react';

export default function TrustBox() {
  const ref = useRef(null);

  useEffect(() => {
    const loadWidget = () => {
      if (window.Trustpilot) {
        window.Trustpilot.loadFromElement(ref.current, true);
      }
    };

    loadWidget();
    const timeout = setTimeout(loadWidget, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-sm mx-auto flex items-center justify-center min-h-[120px] transition-all hover:shadow-2xl"
      data-locale="en-US"
      data-template-id="53aa8807dec7e10d38f59f32"
      data-businessunit-id="69f7390bebbd3c000d06bf18"
      data-style-height="150px"
      data-style-width="100%"
      data-theme="light"
      data-token="b67fd1c8-4724-4922-ae25-038862ea786a"
    >
      <a href="https://www.trustpilot.com/review/by-smartlink.com" target="_blank" rel="noopener noreferrer">Trustpilot</a>
    </div>
  );
}
