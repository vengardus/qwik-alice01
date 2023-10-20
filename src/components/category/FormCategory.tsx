import { component$, type Signal, $, useSignal } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { AppConfig } from "~/domain/app.config";
// import type { IListCategoryDto } from "~/domain/dtos/category.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { useRegisterCategory } from "~/routes/(alice)/category/(list)";


export interface FormCategoryProps {
    typeActionSignal: Signal<string>
    // fields form
    idSignal: Signal<string>
    nameSignal: Signal<string>
}

export const FormCategory = component$<FormCategoryProps>(({
    typeActionSignal,
    // fields form
    idSignal,
    nameSignal,
}) => {
    const submitAction = useRegisterCategory();
    const msgFormSignal = useSignal('')
    //const nav = useNavigate()

    const clearInputs = $(() => {
        idSignal.value = '';
        nameSignal.value = '';
    })

    const postRegisterCategory = $(async () => {
        msgFormSignal.value = ''
        if (submitAction.value?.failed) {
            if (submitAction.value.fieldErrors?.name)
                msgFormSignal.value = `Name: ${submitAction.value.fieldErrors.name}`
            return
        }

        if (!submitAction.value?.success) {
            msgFormSignal.value = (typeActionSignal.value == AppConfig.ACTION.insert)
                ? `${CustomMessages.msgInsertError()}: ${submitAction.value?.message}`
                : `${CustomMessages.msgUpdateError()}: ${submitAction.value?.message}`
            return;
        }
        clearInputs()
        msgFormSignal.value = (typeActionSignal.value == AppConfig.ACTION.insert)
            ? CustomMessages.msgInsertOk()
            : CustomMessages.msgUpdateOk()
        
    });


    return (
        <div class="w-full">
            <h1 class='text-center'>{(typeActionSignal.value == AppConfig.ACTION.insert)
                ? 'Nuevo Registro'
                : 'Modificar Registro'
            }</h1>
            <Form
                action={submitAction}
                class='flex flex-col space-y-2 w-full'
                onSubmitCompleted$={() => postRegisterCategory()}
            >
                <input name="typeAction" bind: value={typeActionSignal} hidden />

                <div class='flex w-full'>
                    <label for="id" class='w-3/12'>Id:</label>
                    <input name="id" readOnly bind: value={idSignal} />
                </div>
                <div class='flex'>
                    <label for="name" class='w-3/12'>Name:</label>
                    <input name="name" bind: value={nameSignal} />
                </div>

                <button type="submit" class={`button`}>{
                    (typeActionSignal.value == AppConfig.ACTION.insert)
                        ? 'Agregar'
                        : 'Actualizar'
                }</button>

                <div>{msgFormSignal.value}</div>
            </Form>

            <>
            { 
                submitAction.isRunning
                    ? (typeActionSignal.value == AppConfig.ACTION.insert)
                        ? CustomMessages.msgInsert() 
                        : CustomMessages.msgUpdate()
                    : '' 
            } 
            </>

        </div>
    );
});