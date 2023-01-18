import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from '@reach/router'
import Grid from '@material-ui/core/Grid'
// import { SomeComponent } from './styled'

const <%= urlPascalCase %>: FunctionComponent<RouteComponentProps> = () => {
  return (
    <Grid container spacing={2}>
      <Grid item>Route generated for: <%= urlPascalCase %></Grid>
    </Grid>
  )
}

export default <%= urlPascalCase %>
