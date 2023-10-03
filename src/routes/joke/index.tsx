import { component$, useContext, useSignal, useStore, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, server$ } from '@builder.io/qwik-city';
import styles from "./index.css?inline";
import { Joke } from '~/components/joke/Joke';
import { jokeContext } from './layout';

export interface IJoke {
  id: string;
  status: number;
  joke: string;
}

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });
  return await response.json() as IJoke
});

export const useJokeVoteAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log('VOTE', props);
});

export default component$(() => {
  useStylesScoped$(styles);

  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false);
  const userStore = useStore({
    id: 1020,
    name: 'ed'
  });
  const userData = useContext(jokeContext);


  useTask$(({track})=> {
    track(() => isFavoriteSignal.value);
    console.log('useTask', isFavoriteSignal.value);

    server$(() => {
      console.log('useTask (server)', isFavoriteSignal.value);
    })();

    userStore.name = (isFavoriteSignal.value? 'Gardus':'ed' );
  })


  return (
    <section class="section bright">
      <h2>{userData.username}</h2>

      <p>{dadJokeSignal.value.joke}</p>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">👍</button>
        <button name="vote" value="down">👎</button>
      </Form>

      <button
        onClick$={() => {
          isFavoriteSignal.value = !isFavoriteSignal.value;
        }}>
        {isFavoriteSignal.value ? '❤️' : '🤍'}
      </button>

      <div>
        { userStore.name }
      </div>

      <div>
        <Joke name='Vengardus' />
      </div>
    </section>
  );
});