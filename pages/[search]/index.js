import { useRouter } from 'next/router';
import Link from 'next/link';

const DEV = process.env.NODE_ENV !== 'production';

// Force prod behavior (`isDebug === false`) with `localhost:3000?prod`

function Search() {
  const router = useRouter();
  const isDebug = router.query.prod === undefined && DEV;

  console.debug('Search', router.query);

  return (
    <>
      <h1>grep</h1>

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
        <a>blah</a>
      </Link>
    </>
  );
}

export default Search;
