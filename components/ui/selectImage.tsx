import { BsImageFill } from 'react-icons/bs'
import Image from 'next/image'
import { useState, useRef } from 'react';
import Compressor from 'compressorjs';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface SelectImageUI extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange: (e: any) => void,
    value?: string,
    sm?: boolean,
    circleRounded?: boolean
}

export default function SelectImage({ onChange, value, sm, circleRounded, className, ...props }: SelectImageUI) {
    const [imageUrl, setImageUrl] = useState(value ? value : '')
    const ref = useRef(null)

    const compressImage = (uncompressImage: any) => {
        return new Promise((resolve) => {
            new Compressor(uncompressImage, {
                quality: 0.5,
                width: 800,
                success(res) {
                    resolve(res)
                }
            })
        })
    }

    const chooseImage = () => {
        const inputFile = ref.current as any;
        inputFile.click()
    }

    const inputChange = async (e: any) => {
        const compressedImage = await compressImage(e.target.files[0]) as any;
        const url = URL.createObjectURL(compressedImage)
        setImageUrl(url);
        onChange(compressedImage)
    }

    const borderRadius = circleRounded ? 'rounded-full' : 'rounded-xl';

    React.useEffect(() => {
        if (!value && imageUrl) {
            setImageUrl('');
        }
    }, [value])

    return (
        <>
            <input {...props} onChange={(e) => inputChange(e)} ref={ref} type="file" className='hidden' />
            {
                imageUrl ? (
                    <div onClick={chooseImage} className={cn(className, `${borderRadius} w-full h-60 overflow-hidden cursor-pointer relative`)}>
                        <Image id='selectImageCoverImage' src={imageUrl} alt='recipe image preview' fill className='object-cover' />
                    </div>
                ) : (
                    <div
                        onClick={chooseImage}
                        className={cn(className, `${borderRadius} w-full h-60 bg-zinc-100 flex justify-center items-center cursor-pointer overflow-hidden
                        dark:bg-slate-900 dark:text-white`)}
                    >
                        <div className='flex flex-col justify-center items-center gap-4 text-zinc-400 dark:text-white'>
                            <BsImageFill className={`${sm ? 'text-4xl' : 'text-6xl'}`} />
                            <p className={`text-xs`}>
                                Click this field to select image
                            </p>
                        </div>
                    </div>
                )
            }
        </>
    )
}