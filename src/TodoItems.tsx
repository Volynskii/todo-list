import { useCallback,useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { TodoItem, useTodoItems } from './TodoItemsContext';
import {debounce} from "./debounce";

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
});

const useTodoSearch = makeStyles({
    root: {
        fontSize: '20px',
        padding: 0,
        margin: 0,
        marginTop: '20px',
        width: '100%',
        height: '30px'
    },
});
export const TodoItemsList = function ({currentId,setCurrentId}: {currentId: any,setCurrentId: any}) {
    const { todoItems } = useTodoItems();

    const classes = useTodoItemListStyles();

    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1;
        }

        if (!a.done && b.done) {
            return -1;
        }

        return 0;
    });
    const [searchValue,setSearchValue] = useState('');
    const handleChange = debounce((e: { target: { value: string; }; }) => {
        const {value} = e.target;
        setSearchValue(value)
    },500);
    const classesSearch = useTodoSearch();
    return (
        <>
            <input placeholder={"Search by tag"} className={classesSearch.root} type="text"  onChange={handleChange}/>
            <ul className={classes.root}>
                {sortedItems.filter((val) =>{
                    if(searchValue === '') {
                        return val
                    }
                    else if(val.tags.toLowerCase().includes(searchValue.toLowerCase())) {
                        return val
                    }
                }).map((item) => (
                    <motion.li key={item.id} transition={spring} layout={true}>
                        <TodoItemCard item={item} currentId={currentId}  setCurrentId={setCurrentId}  />
                    </motion.li>
                ))}
            </ul>
        </>
    );
};

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
});

export const TodoItemCard = function ({ item,currentId, setCurrentId }:
                                          { item: TodoItem,currentId: any,setCurrentId: any }) {
    const classes = useTodoItemCardStyles();
    const { dispatch } = useTodoItems();

    const handleDelete = useCallback(
        () => dispatch({ type: 'delete', data: { id: item.id } }),
        [item.id, dispatch],
    );

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: { id: item.id },
            }),
        [item.id, dispatch],
    );
    return (
        <>
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            <CardHeader
                action={
                    <>
                        <IconButton aria-label="delete" onClick={()=>setCurrentId(item.id)}>
                            <EditIcon style={item.id === currentId ? {color: 'red'}: {}}/>
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                }
                title={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={item.done}
                                onChange={handleToggleDone}
                                name={`checked-${item.id}`}
                                color="primary"
                            />
                        }
                        label={item.title}
                    />
                }
            />
            {item.details ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.details}
                    </Typography>
                </CardContent>
            ) : null}
            {item.tags ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.tags.split(',').map((tag: any) => `#${tag}`)}
                    </Typography>
                </CardContent>
            ) : null}
        </Card>
        </>
    );
};
