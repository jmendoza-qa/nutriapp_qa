export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Welcome to NutriApp!</h1>
        <p className="mb-4 text-gray-700">You can log in with the test user:</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-4 text-left">
          <p><span className="font-semibold">Email:</span> <span className="font-mono">test@nutriapp.com</span></p>
          <p><span className="font-semibold">Password:</span> <span className="font-mono">nutriapp123</span></p>
        </div>
        <a href="/login" className="inline-block bg-green-500 text-white py-2 px-6 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow focus:outline-none focus:ring-2 focus:ring-green-300">Go to Login</a>
      </div>
    </main>
  );
}
