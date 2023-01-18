import React, { FunctionComponent } from 'react'
import { useCoreState } from 'hooks/state/useCoreState'

interface LoginShieldProps {
  children: JSX.Element
}

export const LoginShield: FunctionComponent<LoginShieldProps> = ({ children }) => {
  const { loggedInUser } = useCoreState()

  if (!loggedInUser) {
    return <div>login form</div>
  }

  return children
}
