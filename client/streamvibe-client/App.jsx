import { useState } from 'react'
import MovieCard from './src/components/Movie'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <MovieCard />
    </>
  )
}

export default App
