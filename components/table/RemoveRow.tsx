import { fetcher } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import * as Di from '../ui/dialog';
import { useToast } from '../ui/use-toast';

interface RemoveRowUI { onDelete: () => void, rowName: string, rowId: string, entity: string, warningMessage?: string }

function RemoveRow({ onDelete, rowName, rowId, entity, warningMessage }: RemoveRowUI) {
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const closeButton = () => document.getElementById('closeButton')?.click();

    const remove = async () => {
        setloading(true);
        try {
            await fetcher(`/api/${entity}/delete/`, { id: rowId });
            onDelete();
            setloading(false);
            closeButton();
            toast({
                description: `Success to delete '${rowName}'`
            })
        } catch (error) {
            toast({
                description: `Failed to delete '${rowName}'`
            })
        }
    }

    return (
        <Di.DialogContent>
            <Di.DialogDescription className='flex flex-col gap-2'>
                <span>This operation cannot be revert back.</span>
                { warningMessage && (
                    <span className='text-xs text-red-300'>{`* ${warningMessage}`}</span>
                )}
            </Di.DialogDescription>
            <Di.DialogHeader className='flex flex-row'>
                {`Are you absolutely sure want to delete`}<span className='capitalize ml-2'>{`'${rowName}' ?`}</span>
            </Di.DialogHeader>
            <Di.DialogFooter className='mt-4'>
                <div className='flex justify-end gap-4'>
                    <Button variant="ghost" onClick={closeButton}>
                        Close
                    </Button>
                    <Button onClick={remove} loading={loading}>
                        Delete
                    </Button>
                </div>
            </Di.DialogFooter>
        </Di.DialogContent>
    )
}

export default RemoveRow