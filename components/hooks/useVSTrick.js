import * as React from 'react';

import useGoogleAutocomplete from 'components/hooks/useGoogleAutocomplete';

export default function useVSTrick(search, maxDepth = 2, isDebug = false) {
  const [data, set_data] = React.useState({});

  const instance = React.useRef({
    cache: {},
    results: {},
    pendingQueries: new Set(),
  });

  // Expose instance on window when isDebug
  React.useEffect(() => {
    if (isDebug) {
      window.__grep_useVSTrick = instance.current;
    }
  }, []);

  const query = useGoogleAutocomplete({
    transformSearch: (_) => `${_} vs`,
    transformResults: (search, res) => {
      return res
        .filter((_) => _ !== `${search} vs`)
        .map((_) => _.replace(new RegExp(`^${search}\\s+vs\\s+`), ''))
        .map((_) => _.replace(new RegExp(`^${search}\\s+and\\s+`), ''))
        .filter((_) => _ !== '')
        .map((_) => _.replace(new RegExp(`^${search}`), ''))
        .filter((_) => _ !== '')
        .map((_) => _.trim());
    },
  });

  const handleSearch = () => {
    async function getQuery(q) {
      const { cache } = instance.current;
      if (cache[q]) return Promise.resolve(cache[q]);

      return query(q).then((data) => {
        cache[q] = data;
        return data;
      });
    }

    async function executePendingQuery(q, maxDepth, depth) {
      const { pendingQueries, results } = instance.current;
      const data = await getQuery(q);

      // store results for query
      results[q] = data;

      // remove pending query
      pendingQueries.delete(q);

      // add to pendingQueries any results which are not already expanded in results
      if (depth < maxDepth) {
        data.results.forEach((result) => {
          if (!results[result]) {
            pendingQueries.add(result);
          }
        });
      }
    }

    async function executePendingQueries(maxDepth, depth = 0) {
      // if current depth is at or exceeds maxDepth end recursion
      if (depth >= maxDepth) {
        console.warn('executePendingQueries', 'end', `${depth}/${maxDepth}`);
        return Promise.resolve();
      }

      console.warn('executePendingQueries', `${depth}/${maxDepth}`);

      const { pendingQueries } = instance.current;
      const depthPendingQueries = [];
      pendingQueries.forEach((query) => {
        depthPendingQueries.push(executePendingQuery(query, maxDepth, depth));
      });

      return Promise.all(depthPendingQueries).then(() => {
        return executePendingQueries(maxDepth, depth + 1);
      });
    }

    if (search) {
      console.warn('useVSTrick', 'resetting search', search);
      instance.current.results = {};
      instance.current.pendingQueries = new Set([search]);

      executePendingQueries(maxDepth).then(() => {
        set_data(instance.current.results);
      });
    }
  };

  // Run handleSearch on every search change
  React.useEffect(() => {
    if (process.browser) {
      handleSearch();
    }
  }, [search]);

  // transform data.results into tree
  const scores = {};

  function walkResults(results, onLeaf, maxDepth, depth = 0) {
    if (depth >= maxDepth) return;

    results.forEach((result) => {
      onLeaf(result);
      const moreResults = data[result] && data[result].results;
      if (moreResults) {
        walkResults(moreResults, onLeaf, maxDepth, depth + 1);
      }
    });
  }

  if (data[search]) {
    walkResults(
      data[search].results,
      (result) => {
        if (!scores[result]) {
          scores[result] = 0;
        }
        scores[result]++;
      },
      maxDepth,
    );
  }

  // sort results by score
  const sortedScoreKeys = Object.keys(scores).sort(function (a, b) {
    if (scores[a] < scores[b]) return +1;
    if (scores[a] > scores[b]) return -1;
    return 0;
  });

  return sortedScoreKeys.map((_) => [_, scores[_]]);
}
