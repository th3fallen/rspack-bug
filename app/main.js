import 'styles/app.scss';
import { Slide, ToastContainer } from 'react-toastify';



import { createRoot } from 'react-dom/client';

import Root from './root';


import 'styles/app.scss';


const container = document.getElementById('wheniwork-app');
const root = createRoot(container);
root.render(<Root />);
