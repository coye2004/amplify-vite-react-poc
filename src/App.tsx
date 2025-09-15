import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser, signIn, signUp, signOut } from "aws-amplify/auth";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (user) {
      // Only subscribe to todos when user is authenticated
      const subscription = client.models.Todo.observeQuery().subscribe({
        next: (data) => setTodos([...data.items]),
      });
      return () => subscription.unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]);

  async function checkAuthState() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAuth() {
    try {
      if (isSignUp) {
        await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              email: email,
            },
          },
        });
        alert("Check your email for verification code!");
      } else {
        await signIn({
          username: email,
          password: password,
        });
        await checkAuthState();
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(`Auth error: ${error}`);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <main style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <h1>Todo App</h1>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button
            onClick={handleAuth}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ width: "100%", padding: "10px" }}
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>My todos</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <button onClick={createTodo} style={{ padding: "10px 20px", marginBottom: "20px" }}>
        + new todo
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px", borderRadius: "5px" }}>
            {todo.content}
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <div style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
          No todos yet. Create your first todo!
        </div>
      )}
    </main>
  );
}

export default App;
