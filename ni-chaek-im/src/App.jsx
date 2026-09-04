import './App.css'
import OracleBook from './components/OracleBook'
import Disclaimer from './components/Disclaimer'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="app-quote">
          인생은 B<span className="app-quote-en">(Birth)</span>와 D<span className="app-quote-en">(Death)</span>
          <br />
          사이의 C<span className="app-quote-en">(Choice)</span>다
        </p>
        <p className="app-quote-sub">하지만 그 결과는 니 책임!</p>
      </header>

      <main className="app-main">
        <OracleBook />
      </main>

      <Disclaimer />
    </div>
  )
}
