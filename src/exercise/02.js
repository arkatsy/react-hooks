// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(initialValue, storageKey) {
  const [state, set] = React.useState(() => {
    const storageValue = localStorage.getItem(storageKey)
    if (storageValue) {
      return JSON.parse(storageValue)
    } else {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
  })

  const prevKeyRef = React.useRef(storageKey)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== storageKey) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = storageKey
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  return [state, set]
}

function Greeting({initialName = ''}) {
  // const [name, setName] = React.useState(
  //   () => window.localStorage.getItem('name') ?? initialName,
  // )
  const [name, setName] = useLocalStorageState(initialName, 'name')

  function handleChange(event) {
    const newName = event.target.value
    setName(newName)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
