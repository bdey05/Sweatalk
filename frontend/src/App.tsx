import React from 'react'
import { useState, useEffect } from 'react'

const App = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('/login').then(res => res.json()).then(item => {
      setData(item.name); 
    })
  }, [])

  return (
    <div>
      <h2>{ data }</h2>
    </div>
  )
}

export default App