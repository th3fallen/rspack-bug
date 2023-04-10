import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import crc32 from 'crc/lib/es6/crc32';
import { useEffect } from "react";
import ReactDOMServer from 'react-dom/server';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ScheduleCell from './Cell';
export default function Root(props) {
    return (
        <DragDropContextProvider backend={HTML5Backend}>

            <ScheduleCell />
        </DragDropContextProvider>
    )
}
