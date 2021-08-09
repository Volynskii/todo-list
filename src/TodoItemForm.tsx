import {useEffect} from "react";
import { useTodoItems } from './TodoItemsContext';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useInputStyles = makeStyles(() => ({
    root: {
        marginBottom: 24,
    },
}));

export default function TodoItemForm({currentId, setCurrentId}: {currentId: string,setCurrentId: any}) {
    const classes = useInputStyles();
    const { todoItems,dispatch } = useTodoItems();
    const { control, handleSubmit, reset, watch,setValue } = useForm();
    const foundItemData = todoItems.find((todo) => todo.id === currentId);
    useEffect(()=>{
        if(currentId) {
            setValue("title", foundItemData?.title);
            setValue("details", foundItemData?.details);
            setValue("tags", foundItemData?.tags);
        }
    },[currentId,foundItemData,setValue]);
    return (
        <form
            onSubmit={handleSubmit((formData) => {
                if (!!foundItemData) {
                    foundItemData.title =  formData.title;
                    foundItemData.details = formData.details;
                    foundItemData.tags = formData.tags;
                    dispatch({ type: 'edit', data: { todoItem: foundItemData } });
                    setCurrentId('');
                    reset({ title: '', details: '',tags: '' });
                }
                else
                    dispatch({ type: 'add', data: { todoItem: formData } });
                reset({ title: '', details: '',tags: '' });
            })}
        >
            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="TODO"
                        fullWidth={true}
                        className={classes.root}
                    />
                )}
            />
            <Controller
                name="details"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Details"
                        fullWidth={true}
                        multiline={true}
                        className={classes.root}
                    />
                )}
            />
            <Controller
                name="tags"
                control={control}
                defaultValue={''}
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Tags"
                        fullWidth={true}
                        multiline={true}
                        className={classes.root}
                    />
                )}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!watch('title') || !watch('tags')}
            >
                {currentId ? 'Edit': 'Add'}
            </Button>
        </form>
    );
}
