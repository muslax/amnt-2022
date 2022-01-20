export function generatePOSTData(data) {
    return {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data)
    }
  }
  
  export function pick(obj, ...keys) {
    const ret = {}
    keys.forEach((key) => {
      ret[key] = obj[key]
    })
  
    return ret
  }
  
  export function getNextEnv() {
    return process.env.NODE_ENV;
  }