import React, { FunctionComponent } from 'react'
import Flex from '@g07cha/flexbox-react'
import { withFormik } from 'formik'
import * as Yup from 'yup'
//GeneratorToken: <next-import>
import { ResponsiveMargins } from 'components'

interface <%= formNamePascalCase %>RawProps {
  values: string[]
  onSubmit: Function
  resetForm: Function
}

const <%= formNamePascalCase %>Raw: FunctionComponent<<%= formNamePascalCase %>RawProps> = (props: <%= formNamePascalCase %>RawProps) => {
  const { userClickedSubmit, onUserClickedSubmit } = useFormState()
  //GeneratorToken: <next-options>
  return (
    <ResponsiveMargins>
      <Flex flexDirection="column" flexGrow={1}>
        //GeneratorToken: <fields>
        <Flex>
          {/*
          //@ts-ignore*/}
          <SubmitButton
            formikProps={props}
            onSubmit={props.onSubmit}
            validationSchema={validationSchema}
            userClickedSubmit={userClickedSubmit}
            onUserClickedSubmit={onUserClickedSubmit}
          >
            Save
          </SubmitButton>
        </Flex>
      </Flex>
    </ResponsiveMargins>
  )
}
const validationSchema = Yup.object().shape({
  //GeneratorToken: <validationSchema>
})
const formikConfig = {
  validationSchema,
  validateOnChange: true,
  enableReinitialize: true,
  mapPropsToValues: props => {
    const initialValues = props.initialValues || {}
    return {
      //GeneratorToken: <mapPropsToValues>
    }
  }
}
//@ts-ignore
export const <%= formNamePascalCase %> = withFormik(formikConfig)(<%= formNamePascalCase %>Raw)
