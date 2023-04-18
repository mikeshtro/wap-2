import './styles/main.css';
import './styles/button.css'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './pages/MainPage';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <div>
            <MainPage/>
            <ToastContainer/>
        </div>
    );

}

export default App;
