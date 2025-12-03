export default function TestPage() {
  return (
    <div style={{ padding: "50px", fontSize: "24px" }}>
      <h1>TEST PAGE - If you see this, cache is cleared!</h1>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
