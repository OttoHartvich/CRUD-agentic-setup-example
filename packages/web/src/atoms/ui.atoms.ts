import { atom } from 'jotai'

export const selectedPostIdAtom = atom<string | null>(null)
export const filterPublishedAtom = atom<boolean | undefined>(true)
export const isCreateModalOpenAtom = atom(false)
export const activeTagFilterAtom = atom<string>('')
