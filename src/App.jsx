import Header from "./components/header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        <footer>
          <p>Made by priyanshu</p>
        </footer>
      </Router>
    </>
  );
}

export default App;
