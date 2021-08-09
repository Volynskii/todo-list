import React,{useState,useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TodoItemsList } from './TodoItems';
import { TodoItemsContextProvider, useTodoItems } from './TodoItemsContext';
import TodoItemForm from './TodoItemForm';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#9012fe',
        },
        secondary: {
            main: '#b2aabf',
        },
    },
});

function App() {
    return (
        <TodoItemsContextProvider>
            <ThemeProvider theme={theme}>
                <Content />
            </ThemeProvider>
        </TodoItemsContextProvider>
    );
}

function Content() {
    const [currentId,setCurrentId] = useState("");
    const {dispatch} = useTodoItems();

    useEffect(()=> {
        const onStorage = (e: any) => {
            if (e.storageArea !== localStorage) return;
            if (e.key === 'todoListState') {
                dispatch({ type: 'loadState', data: null });
            }
        };
        window.addEventListener('storage', onStorage);
        return () => document.removeEventListener('storage', onStorage);
    });
    return (
        <Container maxWidth="sm">
            <header>
                <Typography variant="h2" component="h1">
                    Todo List
                </Typography>
            </header>
            <main>
                <TodoItemForm currentId={currentId} setCurrentId={setCurrentId} />
                <TodoItemsList currentId={currentId} setCurrentId={setCurrentId} />
            </main>
        </Container>
    );
}

export default App;
