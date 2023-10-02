import { component$, type Signal, $, useSignal, type PropFunction } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { AppConfig } from "~/domain/app.config";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { useRegisterProduct } from "~/routes/(alice)/product/(list)";


export interface FormProductProps {
    typeActionSignal: Signal<string>
    paginationOffsetSignal: Signal<string>
    postUseRegisterProduct$: PropFunction<(dataRefresh: IListProductDto | null) => void>
    // fields Form
    idSignal: Signal<string>
    nameSignal: Signal<string>
    descriptionSignal: Signal<string>
    currencySignal: Signal<string>
    priceSignal: Signal<string>
}

export const FormProduct = component$<FormProductProps>(({
    typeActionSignal,
    paginationOffsetSignal,
    postUseRegisterProduct$,
    // fields form
    idSignal,
    nameSignal,
    descriptionSignal,
    currencySignal,
    priceSignal,
}) => {
    const submitAction = useRegisterProduct();
    const msgFormSignal = useSignal('')

    const clearInputs = $(() => {
        idSignal.value = '';
        nameSignal.value = '';
        currencySignal.value = 'PEN';
        priceSignal.value = '';
    })

    const postUseRegisterProduct = $(async () => {
        if (!submitAction.value?.dataResponse?.success) {
            msgFormSignal.value = (typeActionSignal.value == AppConfig.ACTION.insert)
                ? `${CustomMessages.msgInsertError()}: ${submitAction.value?.dataResponse?.message}`
                : `${CustomMessages.msgUpdateError()}: ${submitAction.value?.dataResponse?.message}`
            return;
        }
        clearInputs()
        postUseRegisterProduct$(submitAction.value.dataRefresh ?? null)
        msgFormSignal.value = (typeActionSignal.value == AppConfig.ACTION.insert)
            ? CustomMessages.msgInsertOk()
            : CustomMessages.msgUpdateOk()
    });


    return (
        <div class="w-full">
            <h1 class='text-center'>{(typeActionSignal.value == AppConfig.ACTION.insert)
                ? 'Nuevo Producto'
                : 'Modificar Producto'
            }</h1>
            <Form
                action={submitAction}
                class='flex flex-col space-y-2 w-full'
                onSubmitCompleted$={() => postUseRegisterProduct()}
            >
                <input name="typeAction" bind: value={typeActionSignal} hidden />
                <input name="paginationOffset" bind: value={paginationOffsetSignal} hidden />

                <div class='flex w-full'>
                    <label for="id" class=''>Id:</label>
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
                    (typeActionSignal.value == AppConfig.ACTION.insert)
                        ? 'Agregar Producto'
                        : 'Modificar Producto'
                }</button>

                <div>{msgFormSignal.value}</div>
            </Form>

            <div class='mt-3'>
                {
                    submitAction.isRunning ? <div>{
                        (typeActionSignal.value == AppConfig.ACTION.insert)
                            ? CustomMessages.msgInsert()
                            : CustomMessages.msgUpdate()
                    }</div> : <div></div>
                }
                {
                    submitAction.value?.failed
                    && submitAction.value.fieldErrors?.name
                    && <p>Name: {submitAction.value.fieldErrors.name}</p>
                }
                {
                    submitAction.value?.failed
                    && submitAction.value.fieldErrors?.description
                    && <p>Description: {submitAction.value.fieldErrors.description}</p>
                }
                {
                    submitAction.value?.failed
                    && submitAction.value.fieldErrors?.currency
                    && <p>Currency: {submitAction.value.fieldErrors.currency}</p>

                }
                {
                    submitAction.value?.failed
                    && submitAction.value.fieldErrors?.price
                    && <p>Price: {submitAction.value.fieldErrors.price}</p>

                }
            </div>
        </div>
    );
});