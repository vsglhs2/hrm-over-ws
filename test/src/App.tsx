import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import timer1 from './views/Timer1/Timer1Store';
import Timer1Component from './views/Timer1/Timer1';
import timer2 from './views/Timer2/Timer2Store';
import Timer2Component from './views/Timer2/Timer2';
import timer3 from './views/Timer3/Timer3Store';
import Timer3Component from './views/Timer3/Timer3';
import timer4 from './views/Timer4/Timer4Store';
import Timer4Component from './views/Timer4/Timer4';
import timer5 from './views/Timer5/Timer5Store';
import Timer5Component from './views/Timer5/Timer5';
import timer6 from './views/Timer6/Timer6Store';
import Timer6Component from './views/Timer6/Timer6';
import timer7 from './views/Timer7/Timer7Store';
import Timer7Component from './views/Timer7/Timer7';
import timer8 from './views/Timer8/Timer8Store';
import Timer8Component from './views/Timer8/Timer8';
import timer9 from './views/Timer9/Timer9Store';
import Timer9Component from './views/Timer9/Timer9';





import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Timer1 from './views/Timer1/Timer1';
import Timer2 from './views/Timer2/Timer2';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Timer1Component timer={timer1}/>} />
                  <Route path="t1" element={<Timer2Component timer={timer2}/>} />
                  <Route path="t3" element={<Timer3Component timer={timer3}/>} />
                  <Route path="t3" element={<Timer4Component timer={timer4}/>} />
                  <Route path="t3" element={<Timer5Component timer={timer5}/>} />
                  <Route path="t3" element={<Timer6Component timer={timer6}/>} />
                  <Route path="t3" element={<Timer7Component timer={timer7}/>} />
                  <Route path="t3" element={<Timer8Component timer={timer8}/>} />
                  <Route path="t3" element={<Timer9Component timer={timer9}/>} />
              </Routes>
          </BrowserRouter>,
      </header>
    </div>
  )
}

export default App
