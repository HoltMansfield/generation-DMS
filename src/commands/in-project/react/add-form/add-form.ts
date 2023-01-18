import messages from '../../../../logic/console-messages'
import fileSystem from '../../../../logic/file-system'
import strings from '../../../../logic/strings'

let nextForm: any

export interface TemplateDataBag {
  formName: string
  formNamePascalCase: string
  formNameSnakeCase: string
}

// Holt can't recall what this does :)
const doStringMagic = (name: string): string => {
  let label: string = strings.capitalizeFirstLetter(name)

  if (label) {
    const match = label.match(/[A-Z][a-z]+|[0-9]+/g)
    if (match) {
      label = match.join(' ')
    }
  }

  return label
}

const checkForJsonDefinition = (root: string): void => {
  const path = `${root}/cli/forms/next-form.js`
  try {
    nextForm = require(path)
  } catch (e) {
    messages.error(`Missing JSON form definition at: ${path}`)
    messages.info(`Please see instructions here: ${root}/cli/forms/readMe.md`)
  }
}

const getTemplateData = (formName: string, formSuffix: string): TemplateDataBag => {
  formName = `${formName}${formSuffix}`

  return {
    formName,
    formNamePascalCase: strings.capitalizeFirstLetter(formName),
    formNameSnakeCase: strings.mapToSnakeCase(formName)
  }
}

const createFolders = async (templateData: TemplateDataBag, root: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(`${root}/src/components/${templateData.formNameSnakeCase}`)
  } catch (e) {
    messages.handleError(e, 'createFolders')
  }
}

const getHashOfTypes = (): string => {
  const types: any = {}

  Object.keys(nextForm).forEach(function(key) {
    types[nextForm[key].type] = nextForm[key].type
  })

  return types
}

const getImportForType = (type: string): string => {
  switch (type) {
    case 'string':
      return 'FormikTextField'
    case 'boolean':
      return 'FormikCheckbox'
    case 'checkboxes':
      return 'FormikCheckboxArray'
    case 'currency':
      return 'FormikCurrencyField'
    case 'phoneNumber':
      return 'FormikPhoneNumber'
    case 'postalCode':
      return 'FormikPostalCode'
    case 'time':
      return 'FormikTimePicker'
    case 'password':
      return 'FormikPasswordField'
    case 'height':
      return 'FormikHeightInput'
    case 'weight':
      return 'FormikWeightInput'
    case 'yesNo':
      return 'FormikYesNo'
    case 'select':
      return 'FormikSelect'
    case 'date':
      return 'FormikDatePicker'
    case 'radioButtons':
      return 'FormikRadioButtons'
    default:
      throw new Error(`${type} not found in getImportForType`)
  }
}

const getImports = (): string => {
  const types: any = getHashOfTypes()
  // default imports included with all forms
  const imports = ['SubmitButton', 'useFormState']

  Object.keys(types).forEach(function(key) {
    // types is a hash with types as keys
    imports.push(getImportForType(types[key]))
  })

  return `import { ${imports.join(', ')} } from '@finaeo/forms'`
}

const getOptions = (): string => {
  const options: string[] = []

  Object.keys(nextForm).forEach(function(key) {
    if (nextForm[key].options) {
      const optionsText = `\tconst ${key}Options = ${JSON.stringify(nextForm[key].options, null, 2)}`
      // drop the quotes around property names
      options.push(optionsText.replace(/\"([^(\")"]+)\":/g,"$1:"))
    }
  })

  return options.join('\n')
}

const updateFormName = (lines: any[], templateData: TemplateDataBag): any => {
  return lines.map(line => {
    const text = line.text.replace(/<%= formNamePascalCase %>/g, templateData.formNamePascalCase)

    return {
      ...line,
      text
    }
  })
}

const getField = (name: string, fieldDefinition: any): string => {
  // map name to a useable label
  const inferredLabel = doStringMagic(name)
  // allow the user to provide their own label in the text property
  const label = fieldDefinition.text ? fieldDefinition.text : inferredLabel

  switch (fieldDefinition.type) {
    case 'string':
      return `        <Flex>
          <FormikTextField
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'boolean':
      return `        <Flex>
          <FormikCheckbox
            id="${name}"
            label="${label}"
            formikProps={props} 
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'currency':
      return `        <Flex>
          <FormikCurrencyField
            id="${name}"
            text="${label}"
            formikProps={props} 
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'phoneNumber':
      return `        <Flex>
          <FormikPhoneNumber
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'postalCode':
      return `        <Flex>
          <FormikPostalCode
            id="${name}"
            text="${label}"
            formikProps={props}
            isAmerican={}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'date':
      return `        <Flex>
          <FormikDatePicker
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'time':
      return `        <Flex>
          <FormikTimePicker
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'password':
      return `        <Flex>
          <FormikPasswordField
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'height':
      return `        <Flex>
          <FormikHeightInput
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'weight':
      return `        <Flex>
          <FormikWeightInput
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'yesNo':
      return `        <Flex>
          <FormikYesNo
            id="${name}"
            text="${label}"
            formikProps={props}
            userClickedSubmit={userClickedSubmit}
          />
        </Flex>`
    case 'select':
      return `        <Flex>
        <FormikSelect
          id="${name}"
          text="${label}"
          formikProps={props}
          items={${name}Options}
          userClickedSubmit={userClickedSubmit}
        />
      </Flex>`
    case 'radioButtons':
      return `        <Flex>
        <FormikRadioButtons
          id="${name}"
          label="${label}"
          formikProps={props}
          options={${name}Options}
          userClickedSubmit={userClickedSubmit}
        />
      </Flex>`

    case 'checkboxes':
      return `        <Flex>
        <FormikCheckboxArray
          id="${name}"
          label="${label}"
          checkboxes={${name}Options}
          formikProps={props}
          userClickedSubmit={userClickedSubmit}
        />
      </Flex>`

    default:
      throw new Error(`${fieldDefinition.type} not found in getField`)
  }
}

const getFields = (): string => {
  const fields: any = []

  Object.keys(nextForm).forEach(function(key) {
    fields.push(getField(key, nextForm[key]))
  })

  return fields.join('\r\n')
}

const getValidationRule = (name: string, fieldDefinition: any): string => {
  const label = doStringMagic(name)

  switch (fieldDefinition.type) {
    case 'string':
    case 'phoneNumber':
    case 'postalCode':
    case 'password':
      return `  ${name}: Yup.string().required('${label} is required'),`
    case 'boolean':
      return `  ${name}: Yup.boolean().required('${label} is required'),`
    case 'currency':
      return `  ${name}: Yup.number().required('${label} is required'),`
    case 'date':
    case 'time':
    case 'height':
    case 'weight':
    case 'yesNo':
    case 'select':
    case 'radioButtons':
      return `  ${name}: Yup.mixed().required('${label} is required'),`

    case 'checkboxes':
      return `  ${name}: Yup.array().required('${label} is required'),`
    case 'toggle':
      return `  ${name}: Yup.boolean().required('${label} is required'),`
    default:
      throw new Error(`${fieldDefinition.type} not found in getValidationRule`)
  }
}

const getValidation = (): string => {
  const rules: string[] = []

  Object.keys(nextForm).forEach(function(key) {
    rules.push(getValidationRule(key, nextForm[key]))
  })

  const arrayAsString = rules.join('\r\n')
  return strings.removeTrailingComma(arrayAsString)
}

const getInitialValue = (name: string, type: string): string => {
  switch (type) {
    case 'string':
    case 'phoneNumber':
    case 'postalCode':
    case 'password':
      return `      ${name}: initialValues.${name} || '',`
    case 'boolean':
      return `      ${name}: initialValues.${name} || false,`
    case 'currency':
      return `      ${name}: initialValues.${name} || '',`
    case 'date':
    case 'time':
      return `      ${name}: initialValues.${name} ? initialValues.${name}.toDate() : null,`
    case 'checkboxes':
      return `      ${name}: initialValues.${name} || [],`
    case 'radioButtons':
    case 'height':
    case 'weight':
    case 'yesNo':
    case 'select':
      return `      ${name}: initialValues.${name} || null,`
    case 'toggle':
      return `      ${name}: initialValues.${name} || '',`
    default:
      throw new Error(`${type} not found in getInitialValue`)
  }
}

const getInitialization = (): string => {
  const initializers: string[] = []

  Object.keys(nextForm).forEach(function(key) {
    initializers.push(getInitialValue(key, nextForm[key].type))
  })

  const arrayAsString = initializers.join('\r\n')
  return strings.removeTrailingComma(arrayAsString)
}

const getDestinationPath = (templateData: TemplateDataBag, root: string): string => {
  const { formNamePascalCase, formNameSnakeCase } = templateData

  return `${root}/src/components/${formNameSnakeCase}/${formNamePascalCase}.tsx`
}

const buildForm = async (templateData: TemplateDataBag, root: string): Promise<void> => {
  const sourcePath = __dirname.replace('/dist', '/src')
  const path = `${sourcePath}/templates/new-component.tsx`
  let lines = await fileSystem.getLines(path)
  const destinationPath = getDestinationPath(templateData, root)
  lines = updateFormName(lines, templateData)

  const importText = getImports()
  fileSystem.insertAtGeneratorTag(lines, '//GeneratorToken: <next-import>', importText)

  const optionsText = getOptions()
  fileSystem.insertAtGeneratorTag(lines, '//GeneratorToken: <next-options>', optionsText)

  const fields = getFields()
  fileSystem.insertAtGeneratorTag(lines, '//GeneratorToken: <fields>', fields)

  const validation = getValidation()
  fileSystem.insertAtGeneratorTag(lines, '//GeneratorToken: <validationSchema>', validation)

  const initialization = getInitialization()
  fileSystem.insertAtGeneratorTag(lines, '//GeneratorToken: <mapPropsToValues>', initialization)

  const text = lines.map(line => line.text)
  const data = text.join('\r\n') + '\r\n'

  await fileSystem.writeFile(destinationPath, data)
  messages.success(`added form: ${destinationPath}`)
}

export const addForm = async (formName: string): Promise<void> => {
  try {
    const root = `${process.cwd()}`
    checkForJsonDefinition(root)
    const templateData = getTemplateData(formName, 'Form')
    await createFolders(templateData, root)
    await buildForm(templateData, root)
  } catch (e) {
    messages.handleError(e, 'addForm')
  }
}
