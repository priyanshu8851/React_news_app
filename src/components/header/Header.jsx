import "./Header.css";
import { FaGithub } from "react-icons/fa";
const Header = () => {
  return (
    <>
      <header className="site-header">
        <div className="innerHeader container">
          <a className="logo" href="/" aria-label="New-z home">
            <span className="logo-mark">N</span> New-z
          </a>
          <a
            className="github_icon"
            href="https://github.com/priyanshu8851/React_news_app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit the New-z GitHub repository"
          >
            <FaGithub />
            <span>GitHub</span>
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
