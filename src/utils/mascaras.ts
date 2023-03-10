export const phoneMaskVisual = (value:string) => {
  if (!value) return ""
  value = value.replace(/(\d{2})(\d)/,"($1) $2")
  value = value.replace(/(\d)(\d{4})$/,"$1-$2")
  return value
}

export const phoneMask = (value:string) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    return value
  }

export const maxPhoneNumber = (value:string)=>{
    if(value.length < 3) return 15
    if(value[2] === "9") return 15
    return 14 
}