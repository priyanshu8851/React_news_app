import './loader.css'


const Loader = () => {
  return (
    <div className="loading-state" role="status" aria-label="Loading news">
      <span className="loading-bar" />
      <p>Gathering the latest stories…</p>
    </div>
  )
}

export default Loader
