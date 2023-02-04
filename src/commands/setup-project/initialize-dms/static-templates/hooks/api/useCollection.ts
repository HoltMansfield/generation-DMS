const base = import.meta.env.VITE_API_URL

export const useCollection = (collectionName: string) => {
  const insertOne = () => {

  }

  const findOne = async (query: object): Promise<any> => {
    try {
      const result = await fetch(`${base}/data-api`, {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: "findOne",
          collection: collectionName,
          filter: query // { "_id": { "$oid": "63c738e7e13e90c76e22536a" } }
        })
      })
      return result.json()
    } catch (e) {
      debugger
    }
  }

  return {
    insertOne,
    findOne
  } as const
}
