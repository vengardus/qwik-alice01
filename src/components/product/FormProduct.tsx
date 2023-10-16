import { component$, type Signal, $, useSignal, type PropFunction } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { AppConfig } from "~/domain/app.config";
import { CustomMessages } from "~/domain/messages/customMessages";
import { useRegisterProduct } from "~/routes/(alice)/product/(list)";


export interface FormProductProps {
    typeAction: string
    initInputs$: PropFunction<() => void>
    // fields form
    idSignal: Signal<string>
    nameSignal: Signal<string>
    descriptionSignal: Signal<string>
    currencySignal: Signal<string>
    priceSignal: Signal<string>
}

export const FormProduct = component$<FormProductProps>(({
    typeAction,
    initInputs$,
    // fields form
    idSignal,
    nameSignal,
    descriptionSignal,
    currencySignal,
    priceSignal,
}) => {
    const submitAction = useRegisterProduct();
    const msgFormSignal = useSignal('')

    const postRegisterProduct = $(async () => {
        console.log('postLoginUser')
        msgFormSignal.value = ''
        if (submitAction.value?.failed) {
            if (submitAction.value.fieldErrors?.name)
                msgFormSignal.value = `Name: ${submitAction.value.fieldErrors.name}`
            else if (submitAction.value.fieldErrors?.description)
                msgFormSignal.value = `Description: ${submitAction.value.fieldErrors.description}`
            else if (submitAction.value.fieldErrors?.currency)
                msgFormSignal.value = `Currency: ${submitAction.value.fieldErrors.currency}`
            else if (submitAction.value.fieldErrors?.price)
                msgFormSignal.value = `Price: ${submitAction.value.fieldErrors.price}`
            return
        }

        if (!submitAction.value?.success) {
            msgFormSignal.value = (typeAction == AppConfig.ACTION.insert)
                ? `${CustomMessages.msgInsertError()}: ${submitAction.value?.message}`
                : `${CustomMessages.msgUpdateError()}: ${submitAction.value?.message}`
            return;
        }
        initInputs$()
        msgFormSignal.value = (typeAction == AppConfig.ACTION.insert)
            ? CustomMessages.msgInsertOk()
            : CustomMessages.msgUpdateOk()

    });

    return (
        <div class="w-full">
            <h1 class='text-center'>{(typeAction == AppConfig.ACTION.insert)
                ? 'Nuevo Registro'
                : 'Modificar Registro'
            }</h1>
            <Form
                action={submitAction}
                class='flex flex-col space-y-2 w-full'
                onSubmitCompleted$={() => postRegisterProduct()}
            >
                <input name="typeAction" value={typeAction} hidden />

                <div class='flex w-full'>
                    <label for="id" class='w-3/12'>Id:</label>
                    <input name="id" readOnly bind: value={idSignal} />
                </div>
                <div class='flex'>
                    <label for="name" class='w-3/12'>Name:</label>
                    <input name="name" bind: value={nameSignal} />
                </div>
                <div class='flex'>
                    <label for="description" class='w-3/12'>Descripción:</label>
                    <input name="description" bind: value={descriptionSignal} />
                </div>
                <div class='flex'>
                    <label for="currency" class='w-3/12'>Moneda:</label>
                    <input name="currency" bind: value={currencySignal} />
                </div>
                <div class='flex'>
                    <label for="price" class='w-3/12'>Precio:</label>
                    <input name="price" bind: value={priceSignal} />
                </div>

                <button type="submit" class='button'>{
                    (typeAction == AppConfig.ACTION.insert)
                        ? 'Agregar'
                        : 'Actualizar'
                }</button>

                <div>{msgFormSignal.value}</div>
            </Form>

            <>
                {
                    submitAction.isRunning
                        ? (typeAction == AppConfig.ACTION.insert)
                            ? CustomMessages.msgInsert()
                            : CustomMessages.msgUpdate()
                        : ''
                }
            </>

        </div>
    );
});