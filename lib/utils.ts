import { type ClassValue, clsx } from "clsx"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge"
import { storage } from "./firebase";
import Compressor from 'compressorjs';

export const useChartThemes = (cb: (chartTheme: string, chartBackground: string) => void, dep: any[]) => {
  const { theme, systemTheme } = useTheme();
  let chartTheme, chartBackgroud = theme;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    chartTheme = theme === 'system' ? systemTheme : theme;
    const systemThemeBackground = systemTheme === 'light' ? '#fff' : '#020817'
    const themeBackground = theme === 'light' ? '#fff' : '#020817';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    chartBackgroud = theme === 'system' ? systemThemeBackground : themeBackground;

    cb(chartTheme as string, chartBackgroud as string)

  }, [theme, systemTheme, ...dep])
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fetcher(url: string, body?: any) {
  return new Promise(async (resolve, reject) => {
    let req;
    try {
      req = body ? await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      }) : await fetch(url);

      const res = await req.json();

      resolve(res);
    } catch (error) {
      reject(error);
    }
  })
}

export const uploadImage = async (productImage: any) => {
  const body = new FormData();
  body.append('file', productImage);

  const uploadImage = await fetch('/api/upload', { method: 'POST', body })

  const { filename } = await uploadImage.json();

  return filename;
}

export const extractWord = (text: string, role: boolean) => {
  let rolePattern = /(OrderDetail|product|category|user|stock|supplier|order)/;
  let permissionPattern = /^(create|edit|read|delete)/;
  let pattern = new RegExp(role ? rolePattern : permissionPattern, 'i');
  let sanitize = text.match(pattern);
  return sanitize ? sanitize[1] : ''
}

export const parseCurrency = (number: number) => new Intl.NumberFormat('de-DE').format(number);
export const parseNumber = (text: string | undefined) => parseInt((text || '').replace(/\W/gi, ''));
export const cutLongString = (text: string, threshold: number) => text.length > threshold ? text.substring(0, threshold) + ' ...' : text
export const parseDate = (text: string) => {
  const date = new Date(text);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
export const getMonthString = (month: number) => {
  const monthStrings = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'Mei',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'December'
  }
  const monthKey = month as keyof typeof monthStrings
  return monthStrings[monthKey];
}

export const standartDate = (date: string) => {
  const dateString = parseDate(date);
  const dateArray = dateString.split('/');
  dateArray[1] = getMonthString(parseInt(dateArray[1]));
  return dateArray.join(' ');
}

export function formatLongNumberToString(num: number, threshold: number = 2) {
  var stringNum = '';
  const abbreviations = {
    K: 1000,
    M: 1000000,
    B: 1000000000
  } as any;

  for (const key in abbreviations) {
    if (num >= abbreviations[key]) {
      stringNum = (num / abbreviations[key]).toFixed(threshold) + key;
    }
  }

  return stringNum
}

export const uploadImagesToFirebase = (image: any) => {
  return new Promise((resolve) => {
    const imageRef = ref(storage, `images/${Date.now()}-inventory`);
    uploadBytes(imageRef, image).then(async () => {
      const imageUrl = await getDownloadURL(imageRef);
      resolve(imageUrl)
    })
  })
}

export const compressImage = (uncompressImage: any): Promise<{ smallImage: any, bigImage: any }> => {
  return new Promise((resolve) => {
    let compressedImage = {};
    // small image for thumbnail and etc
    new Compressor(uncompressImage, {
      quality: 0.8,
      width: 300,
      success(res) {
        compressedImage = {
          smallImage: res
        }
        // big Image for real pic
        new Compressor(uncompressImage, {
          quality: 0.8,
          width: 600,
          success(res) {
            compressedImage = {
              ...compressedImage,
              bigImage: res
            }

            resolve(compressedImage as any)
          }
        })
      }
    })
  })
}