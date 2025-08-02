import LoginForm from "../components/LoginForm";

export default function AuthPage() {
  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h1>Autentificare</h1>
      <LoginForm />
    </div>
  );
}
