import React, { FunctionComponent } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserProfile } from 'components/core/routed/UserProfile'
import { LoginShield } from 'components/core/login-shield/LoginShield'
import { CreateAccount } from 'components/core/routed/CreateAccount'

export const RouteTable: FunctionComponent = () => {
  return (
    <Routes>
      <Route path="/user-profile" element={<LoginShield><UserProfile /></LoginShield>} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  )
}
