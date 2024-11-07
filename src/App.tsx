/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visiblTodos, setVisiblTodos] = useState<Todo[]>([]);
  const [errorLoad, setErrorLoad] = useState(false);
  const [selectedAll, setSelectedAll] = useState(true);
  const [selectedActive, setSelectedActive] = useState(false);
  const [selectedCompleted, setSelectedCompleted] = useState(false);

  const ItemLeft: number = todos.filter(
    todo => todo.completed === false,
  ).length;

  function getAllTodos() {
    getTodos()
      .then(resultTodos => {
        setTodos(resultTodos);
        setVisiblTodos(resultTodos);
      })
      .catch(() => {
        setErrorLoad(true);
        setInterval(() => {
          setErrorLoad(false);
        }, 3000);
      });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visiblTodos.map(todo => (
              <div
                data-cy="Todo"
                className={classNames('todo', { completed: todo.completed })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  {todo.completed ? (
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked
                    />
                  ) : (
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  )}
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  x
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {ItemLeft} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedAll,
                })}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setSelectedAll(true);
                  setSelectedActive(false);
                  setSelectedCompleted(false);
                  setVisiblTodos(todos);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedActive,
                })}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setSelectedAll(false);
                  setSelectedActive(true);
                  setSelectedCompleted(false);
                  setVisiblTodos(() => {
                    return todos.filter(todo => todo.completed === false);
                  });
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedCompleted,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setSelectedAll(false);
                  setSelectedActive(false);
                  setSelectedCompleted(true);
                  setVisiblTodos(() => {
                    return todos.filter(todo => todo.completed === true);
                  });
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorLoad },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorLoad && 'Unable to load todos'}
        {false && (
          <>
            <br />
            Title should not be empty
            <br />
            Unable to add a todo
            <br />
            Unable to delete a todo
            <br />
            Unable to update a todo
          </>
        )}
      </div>
    </div>
  );
};
