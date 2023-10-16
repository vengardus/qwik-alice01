import { component$, Slot, useStyles$} from '@builder.io/qwik';
import styles from './styles.css?inline';


export default component$(() => {
  
  useStyles$(styles);

  return (
    <div class='flex flex-col '>
      <Slot />
    </div>
  );
});

