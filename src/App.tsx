import React,{useState} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TodoItemsList } from './TodoItems';
import { TodoItemsContextProvider } from './TodoItemsContext';
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
