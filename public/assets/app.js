const { useContext, useState, useEffect, useRef, createContext } = React;
const { createRoot } = ReactDOM;

// API

const fetchData = async (email) => {
  try {
    const response = await fetch(`http://localhost:3000/flags?email=${email}`);
    const data = await response.json();
    return data;
  } catch (error) {
      console.error('Error:', error);
  }
};

// Context Provider

const FlagContext = createContext();

const FlagProvider = ({children}) => {
  const [flags, setFlags] = useState({});
  const updateFlags = (data) => {
    setFlags(data);
  }
  const isFlagOn = (flagName)=>{
    return !!flags[flagName];
  }

  const getFlag = (flagName)=>{
    return flags[flagName];
  }
  return (
    <FlagContext.Provider value={{ flags, updateFlags, isFlagOn, getFlag }}>
      {children}
    </FlagContext.Provider>
  );
}

const useFlagContext = () => {
  return useContext(FlagContext);
}

// Main Components

const Login = ({onLogin}) =>{
  const [email, setEmail] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleLogin = () => {
    if (email) {
      onLogin(email);
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <input
        type="email"
        className="border p-2 mb-4 w-64"
        placeholder="Enter your email"
        value={email}
        onKeyDown={handleKeyPress}
        onChange={(e) => setEmail(e.target.value)}
        ref={inputRef}
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

const Dashboard = ({email, onLogout}) =>{
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header email={email} onLogout={onLogout} />
          <div className="flex-1 p-8">
            <Widgets />
            <LastAccessList />
          </div>
        <Footer />
      </div>
    </div>
  );
}

const App = () => {
  const { updateFlags } = useFlagContext();
  const [ email, setEmail ] = useState('');
  const [ loggedIn, setLoggedIn ] = useState(false);

  const handleLogin = async (email) => {
    try {
      const data = await fetchData(email);
      setEmail(email);
      setLoggedIn(true);
      updateFlags(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail('');
  };

  return (
    <div className="App">
      {!loggedIn ? <Login onLogin={handleLogin} /> : <Dashboard email={email} onLogout={handleLogout} />}
    </div>
  );
};

// Init App

const id = 'app';
const domRoot = document.getElementById(id);
const root = createRoot(domRoot);

root.render(<FlagProvider><App/></FlagProvider>);