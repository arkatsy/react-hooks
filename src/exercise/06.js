// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

import { ErrorBoundary } from 'react-error-boundary'

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }
//     return this.props.children
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(pokemonName ? 'pending' : 'idle')

  React.useEffect(() => {
    if (!pokemonName) return

    setStatus('pending')
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        setStatus('resolved')
      })
      .catch(error => {
        setError(error)
        setStatus('rejected')
      })
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  if (status === 'idle') return 'Submit a pokemon'
  if (status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  if (status === 'rejected') {
    throw error
  }
  if (status === 'resolved') return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback} onReset={handleReset}> */}
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
  