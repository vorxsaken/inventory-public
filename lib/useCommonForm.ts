import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useImperativeHandle } from 'react';

export default function useCommonForm(
    formSchema: any,
    ref?: React.MutableRefObject<any> | null,
    defaultValue?: any,
    option: { useImperative?: boolean, autoResetForm?: boolean } = { useImperative: true, autoResetForm: true }
) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValue || {}
    })

    const resetForm = () => {
        form.reset();
        form.reset();
        form.clearErrors();
    }

    useEffect(() => {
        if (form.formState.isSubmitSuccessful) {
            if(option.autoResetForm) resetForm();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.formState, form.reset])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    option?.useImperative && useImperativeHandle(ref, () => ({ resetForm })) 

    return { form, resetForm }
}