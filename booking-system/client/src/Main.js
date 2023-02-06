import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <main>
      <label>EE2026</label>
      <Link to={`/Artix7`}>
        <button>Artix7</button>
      <br />
      </Link>
      <label>EE4218</label>
      <Link to={`/ZedBoard`}>
        <button>ZedBoard</button>
      </Link>
      <br />
      <label>EE2028</label>
      <Link to={`/STM32`}>
        <button>STM32</button>
      </Link>
    </main>
  )
}

export default Main
