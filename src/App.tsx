import { useState } from "react";

function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");

  function createTodo() {
    const content = newTodo.trim();
    if (content) {
      setTodos([...todos, content]);
      setNewTodo("");
    }
  }

  function removeTodo(index: number) {
    setTodos(todos.filter((_, i) => i !== index));
  }

  return (
    <main>
      <h1>My todos</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter todo content"
          onKeyPress={(e) => e.key === 'Enter' && createTodo()}
        />
        <button onClick={createTodo}>+ new</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)} style={{ marginLeft: '10px' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted! This is a frontend-only version.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
