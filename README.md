# Supaquery

Easily integrate Supabase &amp; React Query to boost performance of your app and provide a more snappy UI/UX.

# Install

```bash
npm install @kaelan/supaquery
```

# Core Concepts

> [!NOTE]
> If you're unfamiliar with React Query, start by reading [their core concepts/overview](https://tanstack.com/query/latest/docs/react/overview).

Supaquery uses [Supastruct](https://github.com/kaelansmith/supastruct) under-the-hood (another package I authored), which essentially means you get to write your Supabase queries as usual while allowing magic to happen behind-the-scenes. The problem Supastruct solves is this: in order to generate unique [query keys](https://tanstack.com/query/v4/docs/react/guides/query-keys), we need to be able to parse a `supabase-js` query into an object representation of that query; this also plays an important role in enabling "Coupled Mutations" with automatic optimistic updates (more on that later). This is all abstracted for you, but there's one thing you must do differently: your `supabase-js` client instances must be wrapped by the `supastructClientFactory` function exported from `supastruct` -- for example:

```js
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const db = supastructClientFactory(supabaseClient);

const { data, error } = useQuery(db().from("todos").select().eq("id", 1));
```

**Note**: you can substitute `createClient` with any of the alternative options from the [Supabase Auth Helpers packages](https://github.com/supabase/auth-helpers), if you're using those.

# Queries

As you can see in the above example, Supaquery exports a `useQuery` hook, which is an abstraction over [React Query's built-in `useQuery` hook](https://tanstack.com/query/v4/docs/react/guides/queries), and expects to receive a `supabase-js` query (using a Supastruct client instead of a regular Supabase client). It auto-generates consistent Query Keys for you (based on the parameters of the query you supplied), executes the query, and returns all the typical things you receive from React Query's built-in `useQuery` hook, such as `isLoading`, `isFetching`, etc.. React Query proceeds to do its thing re:caching, stale-times, refetching, etc.. Nothing too special, except for the following concept...

# Coupled Mutations

Supaquery approaches mutations slightly differently than React Query, adopting an approach we call **"Coupled"** Mutations. Here's the thing: queries are connected to mutations; meaning, you query some data, render it in a form, which your users modify, and you persist that modified/mutated data back to your database, and the cycle continues...

But React Query does nothing to couple your queries and mutations out-of-the-box (understandably so -- they don't want to be too opinionated); long story short, this means you'll not only end up writing extra code, but also duplicate code that is prone to human error because certain things must remain in sync between connected queries & mutations.

**The solution**: Supaquery's `useQuery` hook is an abstraction around both of React Query's `useQuery` and `useMutation` hooks; so it also returns what `useMutation` would typically return, most importantly a `mutate` function; but this `mutate` function is special, in that it enforces any mutations you specify with it to be tied to the initial query; it essentially re-uses the same Supabase query you passed to `useQuery`, but injects an `update`, `insert`, `upsert`, or `delete` method into the mix (this "injection" is made possible by Supastruct) -- for example:

```jsx
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const db = supastructClientFactory(supabaseClient);

export function TodoForm({ todoId }) {
  const { data, mutate } = useQuery(
    db().from("todos").select().eq("id", todoId).single()
  );

  return (
    <Form
      data={data}
      onSubmit={(data) => {
        mutate().update(data); // ==> re-uses the same Supabase query methods used above (so you don't have to repeat them or worry about human error mismatches), and injects the "update" method into the mix
      }}
    >
      ...
    </Form>
  );
}
```

The `mutate` function returned by `useQuery` (note: it also returns `mutateAsync` -- but you should [almost always just use `mutate`](https://tkdodo.eu/blog/mastering-mutations-in-react-query#mutate-or-mutateasync)) optionally accepts an object containing React Query mutation callbacks (`onSuccess`, `onError`, and `onSettled`), followed by the requirement to append one of these mutation methods: `update()`, `insert()`, `upsert()`, `delete()`, or `custom()`. For the purposes of explanation, I'll label the first four methods as "_Option #1_", and the `custom` method as "_Option #2_". Here's a comprehensive example to illustrate the differences:

```jsx
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const db = supastructClientFactory(supabaseClient);

export function TodoList() {
  // Get all todos:
  const { data: todos, mutate } = useQuery(db().from("todos").select(), {
    primaryKey: "id", // defaults to "id", so no need to specify it in this case -- just showing how you can customize it
  });

  return (
    <div>
      {todos?.map((todo) => (
        <TodoForm todo={todo} mutateTodos={mutate} />
      ))}

      <Button
        onClick={() => {
          // Option #1
          mutate().insert({...});

          // Option #2
          mutate().custom(db => db.insert({...}));
        }}
      >
        Create Todo
      </Button>
    </div>
  );
}

export function TodoForm({ todo, mutateTodos }) {
  return (
    <>
      <Form
        data={todo}
        onSubmit={(fields) => {
          /**
           * Option #1 (shortcut) -- simpler, but more opinionated (won't work for all cases, but most).
           * Works as long as "id" (primaryKey field) is present in `data`. Bulk updates work
           * by providing an array of rows/objects.
           */
          mutateTodos({
            onSuccess: (data) =>
              console.log("Successfully updated todo: ", data),
            onError: (error) => console.error("Failed to update todo: ", error),
          }).update({ ...fields, id: todo.id });
          // or: `mutateTodos().upsert(data)` if you want to conditionally insert if primaryKey field is missing, and update otherwise

          /**
           * Option #2 (more control) -- more verbose, but less opinionated (can make it work for all cases).
           * Bulk updates don't require passing an array of objects -- can instead provide a single object
           * and use broad filter methods to apply the single update to many rows.
           */
          mutateTodos({
            onSuccess: (data) =>
              console.log("Successfully updated todo: ", data),
            onError: (error) => console.error("Failed to update todo: ", error),
          }).custom(db => db.update(fields).eq("id", todo.id));
        }}
      >
        ...
      </Form>

      <Button
        onClick={() => {
          // Option #1
          mutateTodos().delete(todo.id);

          // Option #2
          mutateTodos().custom(db => db.delete().eq("id", todo.id));
        }}
      >
        Delete Todo
      </Button>
    </>
  );
}
```

> [!NOTE]
> Option #2 currently doesn't support automatic optimistic updates (more on that below), because Supaquery is in its infancy; the intention is to support this soon. For this reason, option #1 is currently the recommended approach.

Besides the note above, when to use option #1 vs option #2 is subtle -- I'd suggest starting by trying option #1, and using option #2 if you hit limitations. That said, option #2 is clearly better in these scenarios:

- applying a shared/single update to multiple records (you can do this w/ option #1, but you need to manually loop over & modify the array of data you're passing to `mutate().update([...])`),
- when you need to set custom filters for non-primary-key columns, for example:
  - deleting multiple records based on a shared set of traits rather than based on their IDs
  - upserting data with additional filters to narrow your condition for when a row should be inserted vs. updated
- or you simply prefer using raw Supabase-js syntax vs. a magic abstraction

When using `mutate` option #2, any filters you specify will be applied in addition to any filters you applied to the initial query -- in other words, with a coupled mutation, you can't mutate a record that is outside of the initial query, but you can mutate a subset of records from the initial query.

## Optimistic Updates

This mutation coupling doesn't only make your code cleaner, more DRY, and easier/faster to write & understand -- it also enables automatic optimistic UI updates. Meaning, when you run a coupled mutation, before it even runs, it will optimistically apply the mutation to the local React Query cache, in the hopes that our mutation succeeds -- i.e. we don't wait for the mutation success response from the database before re-rendering our UI; this results in a really snappy, fast UI/UX without lags/flickers, elevating the quality "feel" of your app, for free. TkDodo (React Query maintainer/expert) said it best:

> "There is nothing worse than having a toggle button that performs a request, and it doesn't react at all until the request has completed. Users will double or even triple click that button, and it will just feel "laggy" all over the place."

In the event that a mutation ends up failing, the cache/UI will be automatically rolled back to the previous state. Lastly, any related queries (i.e. that pull from the same table but use different filters/modifiers) will be forced to refetch their data (if they're in "active" use, otherwise they're set to "stale" and will be refetched when they become active), ensuring that any bits of UI that rely on the same data you just mutated get re-rendered automatically.

Again, all this means that your app will feel very high-quality & fast, and you barely have to lift a finger to enable this; you get to outsource the complexity/maintenance of this feature-set to Supaquery, so you can focus on your app's core value/business logic.

# Server-Side Prefetching

TBD.

# Limitations

Supaquery is only useful for simple queries that require a single request to the database. If you need a single query to make multiple requests to various unrelated tables, and format/merge that data into a final result for your UI, then you should use React Query's built-in `useQuery` and `useMutation` hooks -- you'll have to build your own uptimistic update solution, if desired... or consider breaking that "merged" approach into separate queries for each table so you can use Supaquery, and do the merging in a `useEffect` hook or similar -- this approach is more optimistic-update friendly, and therefore more conducive to building snappier UIs.

**Note**: Supaquery still works with `supabase-js`'s ability to query foreign tables through a join table:

```js
const { data } = useQuery(
  db().from("todos").select(`id, status, project( name )`)
);
```

This example will query the "todos" table and related "projects" table in a single query (notice the parentheses in the `select` statement), so don't let the above confuse you into thinking you can't fetch from multiple tables in one query.

# Roadmap

- Add optimistic update support for `mutate().custom(...)`
- Upgrade from React Query v3 to v5 (now called TanStack Query)
  - Re-architect package structure to support more than just React (Supabase-js is already isomorphic, and TanStack Query also supports vanilla TS/JS, Solid, Vue, and Svelte); this will require extracting things into a vanilla shared core, with framework-specific wrapper packages (i.e. `@supaquery/react`, `@supaquery/vue`, etc.); ideally there would be community contributions for building the Solid/Vue/Svelte wrappers.
- Provide support/abstractions for paginated queries, inifinite queries, and any other less-common/advanced TanStack Query patterns/hooks

# Feedback

This package is still very young, not well tested, and is likely to have breaking changes in the coming versions. That said, it is successfully being used in production environments, and will only get better with usage & feedback -- please don't hesitate to post GitHub issues, email me at kaelancsmith@gmail.com, or DM me on Twitter [@kaelancsmith](https://twitter.com/kaelancsmith)

---

Made by Kaelan Smith

[kaelansmith.com](https://kaelansmith.com)
