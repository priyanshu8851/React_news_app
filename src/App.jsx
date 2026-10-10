import Header from "./components/header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Article from "./pages/Article";
import "./App.css";
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:articleId" element={<Article />} />
          <Route path="*" element={<Home />} />
        </Routes>

        <footer>
          <p>Made by <span>Priyanshu</span></p>
        </footer>
      </Router>
    </>
  );
}

export default App;
