import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import * as ca from './ui/card';

type listType = {
    title: string,
    subtitle: string,
    list: JSX.Element,
    emptyList: JSX.Element,
    data: any[],
    className?: string,
    loading?: boolean
}

const List = ({ title, subtitle, list, emptyList, data, className, loading }: listType) => {
    
    return (
        <ca.Card>
            <ca.CardHeader>
                <ca.CardTitle>
                    {title}
                </ca.CardTitle>
                <ca.CardDescription>
                    {subtitle}
                </ca.CardDescription>
            </ca.CardHeader>
            <ca.CardContent className={cn('h-auto overflow-y-hidden', className)}>
                {loading ? (
                    <div className='w-full h-full flex-center'>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    </div>
                ) : data.length ? list : emptyList}
            </ca.CardContent>
        </ca.Card>
    )
}

export default List
