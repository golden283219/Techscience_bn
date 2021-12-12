export const parseJson = str => {
  let obj = {}

  if(!str)
    return obj

  try {
    obj = JSON.parse(str)
  } catch (error) {
    obj = {}
  }
  return obj
}