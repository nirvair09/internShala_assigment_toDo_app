"use client";
// import {ReactNode, createContext, useContext, useState} from "react";

// export type Todo = {
// 	id: string;
// 	task: string;
// 	completed: boolean;
// 	createdAt: Date;
// };

// export type TodoContext = {
// 	todos: Todo[];
// 	handleAddTodo: (task: string) => void;
// 	toggleTodoCompleted: (id: string) => void;
// 	handleTodoDelete: (id: string) => void;
// 	handleSelectAll: () => void;
// 	handleDeleteAll: () => void;
// 	isLoading: boolean;
// 	setIsLoading: (value: boolean) => void;
// };

// export const todosContext = createContext<TodoContext | null>(null);

// export const TodoProvider = ({children}: {children: ReactNode}) => {
// 	const [todos, setTodos] = useState<Todo[]>(() => {
// 		const newTodos =
// 			typeof localStorage !== "undefined"
// 				? localStorage.getItem("todos") || "[]"
// 				: "[]";
// 		return JSON.parse(newTodos) as Todo[];
// 	});

// 	const [isLoading, setIsLoading] = useState(false);

// 	const handleSelectAll = () => {
// 		setTodos((prev) => {
// 			const reversedTodos = prev.every((task) => task.completed);
// 			const updatedTodos = prev.map((task) => ({
// 				...task,
// 				completed: !reversedTodos,
// 			}));
// 			localStorage.setItem("todos", JSON.stringify(updatedTodos));
// 			return updatedTodos;
// 		});
// 	};

// 	const handleDeleteAll = () => {
// 		setTodos((prev) => {
// 			const deleteTodo = prev.filter((task) => !task.completed);
// 			localStorage.setItem("todos", JSON.stringify(deleteTodo));
// 			return deleteTodo;
// 		});
// 	};

// 	//task add, update, delete methods are defined here

// 	const handleAddTodo = (task: string) => {
// 		setTodos((prev) => {
// 			const newTodos: Todo[] = [
// 				{
// 					id: Math.random().toString(),
// 					task,
// 					completed: false,
// 					createdAt: new Date(),
// 				},
// 				...prev,
// 			];
// 			localStorage.setItem("todos", JSON.stringify(newTodos));
// 			return newTodos;
// 		});
// 	};
// 	const toggleTodoCompleted = (id: string) => {
// 		setTodos((prev) => {
// 			const newTodos = prev.map((task) => {
// 				if (task.id === id) return {...task, completed: !task.completed};
// 				return task;
// 			});
// 			localStorage.setItem("todos", JSON.stringify(newTodos));
// 			return newTodos;
// 		});
// 	};

// 	const handleTodoDelete = (id: string) => {
// 		setTodos((prev) => {
// 			const deleteTodo = prev.filter((task) => task.id !== id);
// 			localStorage.setItem("todos", JSON.stringify(deleteTodo));
// 			return deleteTodo;
// 		});
// 	};

// 	return (
// 		<todosContext.Provider
// 			value={{
// 				todos,
// 				handleAddTodo,
// 				toggleTodoCompleted,
// 				handleTodoDelete,
// 				handleSelectAll,
// 				handleDeleteAll,
// 				isLoading,
// 				setIsLoading,
// 			}}
// 		>
// 			{children}
// 		</todosContext.Provider>
// 	);
// };

// export function useTodos() {
// 	const todosContextValue = useContext(todosContext);
// 	if (!todosContextValue) {
// 		throw new Error("useTodos used outside of provider");
// 	}
// 	return todosContextValue;
// }

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export type Todo = {
    id: string;
    task: string;
    completed: boolean;
    createdAt: Date;
};

export type TodoContext = {
    todos: Todo[];
    handleAddTodo: (task: string) => void;
    toggleTodoCompleted: (id: string) => void;
    handleTodoDelete: (id: string) => void;
    handleSelectAll: () => void;
    handleDeleteAll: () => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
};

export const todosContext = createContext<TodoContext | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/api/usertasks"); // Adjust endpoint
                if (response.data) {
                    setTodos(response.data);
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const handleSelectAll = () => {
        // Implement select all logic if needed
    };

    const handleDeleteAll = () => {
        // Implement delete all logic if needed
    };

    const handleAddTodo = async (task: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/usertasks", { task }); // Adjust endpoint and payload
            if (response.data) {
                setTodos((prev) => [...prev, response.data]);
            }
        } catch (error) {
            console.error("Error adding todo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTodoCompleted = async (id: string) => {
        try {
            setIsLoading(true);
            const updatedTodos = todos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            });
            setTodos(updatedTodos);
            await axios.put(`/api/usertasks/${id}/complete`); // Adjust endpoint
        } catch (error) {
            console.error("Error toggling todo completion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTodoDelete = async (id: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/usertasks/${id}`); // Adjust endpoint
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <todosContext.Provider
            value={{
                todos,
                handleAddTodo,
                toggleTodoCompleted,
                handleTodoDelete,
                handleSelectAll,
                handleDeleteAll,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </todosContext.Provider>
    );
};

export function useTodos() {
    const todosContextValue = useContext(todosContext);
    if (!todosContextValue) {
        throw new Error("useTodos used outside of provider");
    }
    return todosContextValue;
}
