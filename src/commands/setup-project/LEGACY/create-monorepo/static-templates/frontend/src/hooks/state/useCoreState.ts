import { atom, useAtom } from 'jotai'
import { User } from '@uno/data-model'

const userAtom = atom<User | null>(null)

export const useCoreState = () => {
  const [loggedInUser, setLoggedInUser] = useAtom(userAtom)

  return {
    loggedInUser, setLoggedInUser
  } as const
}
