export default function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>TEST PAGE - THIS SHOULD BE VISIBLE</h1>
      <p style={{ color: 'black', fontSize: '24px' }}>If you can see this, React routing is working!</p>
      <p style={{ color: 'green', fontSize: '18px' }}>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}