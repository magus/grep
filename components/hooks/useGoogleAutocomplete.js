import * as React from 'react';

const getCallbackFunctionName = (key) => `__grep_googleCallback_${key}`;
const getGoogleAutocompleteUrl = (search, callback) => {
  const query = encodeURIComponent(search);
  return `https://google.com/complete/search?&client=firefox&gl=us&hl=en&jsonp=${callback}&q=${query}`;
};

export default function useGoogleAutocomplete({ transformResults, transformSearch }) {
  const instance = React.useRef({ queryCount: 0 });

  // returns promise<results>
  const query = (search) => {
    const data = { results: [], originalResults: [] };

    if (typeof search !== 'string' || !process.browser) return Promise.resolve(data);

    let script;

    return new Promise((resolve) => {
      instance.current.queryCount++;
      const key = `${instance.current.queryCount}__${Date.now()}`;
      const callbackFunctionName = getCallbackFunctionName(key);

      window[callbackFunctionName] = (res) => {
        const [, originalResults] = res;
        const results =
          typeof transformResults === 'function' ? transformResults(search, originalResults) : originalResults;

        // cleanup script and window callback
        document.body.removeChild(script);
        delete window[callbackFunctionName];

        resolve({ results, originalResults });
      };

      const transformedSearch = typeof transformSearch === 'function' ? transformSearch(search) : search;
      const url = getGoogleAutocompleteUrl(transformedSearch, callbackFunctionName);

      // create script element to be stored and added to dom
      script = document.createElement('script');
      script.src = url;
      script.async = true;

      // insert script element into dom to trigger load
      document.body.appendChild(script);
    });
  };

  return query;
}
