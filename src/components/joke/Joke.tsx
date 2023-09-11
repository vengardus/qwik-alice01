import { component$, useContext } from '@builder.io/qwik';
import { jokeContext } from '~/routes/joke/layout';

export interface IJokeProps {
  name: string,
  age?: number,
  active?: boolean
}

export const Joke = component$<IJokeProps>(({name, age, active=false}) => {
  const userData = useContext(jokeContext);


  return (
    <div>
      Joke component works! 
      <div>Name: {name}</div>
      <div>Age: { (age)?? '?' }</div>
      <div>Active: { (active)? 'Si' : 'No' }</div>

      <button onClick$={() => userData.username='Gardus'}>Update</button>

    </div>
  );
});
