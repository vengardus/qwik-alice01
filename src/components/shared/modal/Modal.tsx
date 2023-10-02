import { type PropFunction, Slot, component$, useStylesScoped$ } from '@builder.io/qwik';
import ModalStyles from './modal.css?inline';
import { AppConfig } from '~/domain/app.config';

interface IProps {
  showModal: boolean,
  closeModal: PropFunction<() => void>,
  size?: string
  labelButtonCloseModal?: string
}

export const Modal = component$(({
  showModal,
  closeModal,
  size = 'w-6/12',
  labelButtonCloseModal = AppConfig.LABELS.buttonCloseModalForm
}: IProps) => {
  useStylesScoped$(ModalStyles);

  return (
    // hidden https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/
    <div
      id='modal'
      class={showModal ? "modal-background" : 'hidden'}
      onClick$={(event) => {
        const targetId = (event.target as HTMLElement).id
        if (targetId === 'modal' || targetId === 'modal_close') closeModal()
      }}
    >
      <div id='modal_content' class={`modal-content ${size}`}>
        <div class="mt-3 text-center w-full ">
          <h3 class="modal-title "><Slot name='title' /></h3>

          <div class="mt-2 px-7 py-3 w-full">
            <div class="modal-content-text2 w-full">
              <Slot name='content' />
            </div>
          </div>

          {/* Botton */}
          <div class="items-center px-4 py-3">
            <button
              id="modal_close"
              class="modal-button"
            >
              {labelButtonCloseModal}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
});