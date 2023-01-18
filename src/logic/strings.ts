// zeebraMuffin becomes ZeebraMuffin
export const capitalizeFirstLetter = (string: string): string => {
  if (!string || !string.length) {
    return string
  }

  return string.charAt(0).toUpperCase() + string.slice(1)
}

// zeebraMuffin becomes zeebra-muffin
export const mapToSnakeCase = (string: string): string => {
  if (!string || !string.length) {
    return string
  }

  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// zeebraMuffin becomes ZEEBRA_MUFFIN
export const mapToUnderbarsAllCaps = (string: string): string => {
  if (!string || !string.length) {
    return string
  }

  return string.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()
}

// zeebraMuffin becomes Zeebra Muffin
export const mapToLabel = (string: string): string => {
  const processedString = capitalizeFirstLetter(string).match(/[A-Z][a-z]+|[0-9]+/g)
  if (!processedString) {
    return string
  }
  return processedString.join(' ')
}

// zeebraMuffin, branMuffin, becomes zeebraMuffin, branMuffin
export const removeTrailingComma = (string: string): string => {
  return string.substr(0, string.length - 1)
}

export default {
  capitalizeFirstLetter,
  mapToSnakeCase,
  mapToUnderbarsAllCaps,
  mapToLabel,
  removeTrailingComma
}
