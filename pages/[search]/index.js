import { useRouter } from 'next/router';
import Link from 'next/link';

import useVSTrick from 'components/hooks/useVSTrick';

const DEV = process.env.NODE_ENV !== 'production';

// http://localhost:3000/pacfic?prod
// Force prod behavior (`isDebug === false`) with `localhost:3000?prod`
function Search() {
  const router = useRouter();
  const isDebug = router.query.prod === undefined && DEV;

  console.debug('Search', router.query);

  const { search } = router.query;
  const data = useVSTrick(search, 1, isDebug);

  return (
    <>
      <h1>grep v1</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      {!isDebug ? null : <Debug />}
    </>
  );
}

function Debug() {
  const router = useRouter();
  const [state, setState] = React.useState();

  return (
    <>
      <h1>DEBUG</h1>
      Search: {router.query.search}
      State: {state}
      <button onClick={() => setState(Date.now())}>setState now</button>
      <button onClick={() => router.replace('/[search]', '/blah2')}>push blah2</button>
      <Link href="[search]" as="blah" replace>
        <a>blah (replace)</a>
      </Link>
      <Link href="[search]" as="blah">
        <a>blah</a>
      </Link>
    </>
  );
}

export default Search;
