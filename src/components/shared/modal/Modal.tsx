import { type PropFunction, Slot, component$, useStylesScoped$ } from '@builder.io/qwik';
import ModalStyles from './modal.css?inline';

interface IProps {
  showModal : boolean,
  closeModal: PropFunction<() => void>,
  size?     : string
}

export const Modal = component$(({ 
    showModal, 
    closeModal,
    size='w-6/12'
  }: IProps) => {
  useStylesScoped$(ModalStyles);

  return (
    // hidden https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/
    <div 
      id='modal' 
      class={showModal ? "modal-background" : 'hidden'}
      onClick$={(event) => {
        const targetId = (event.target as HTMLElement).id
        if ( targetId === 'modal' || targetId === 'modal_close')
          closeModal()
      }}
    >
      <div id='modal_content' class={`modal-content ${size}`}>

        <div class="mt-3 text-center">

          <h3 class="modal-title "><Slot name='title' /></h3>

          <div class="mt-2 px-7 py-3">
            <div class="modal-content-text">
              <Slot name='content' />
            </div>
          </div>


          {/* Botton */}
          <div class="items-center px-4 py-3">
            <button
              id="modal_close"
              class="modal-button"
            >
              Cerrar
            </button>
          </div>


        </div>
      </div>
    </div>
  )
});