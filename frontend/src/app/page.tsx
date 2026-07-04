export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">SpecVault</h1>
      <p className="text-xl text-gray-600 mb-8">
        Track and compare product specifications
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="/signup"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Login
        </a>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Create Products</h3>
          <p className="text-gray-600">Add products with detailed specs and pricing.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Search & Filter</h3>
          <p className="text-gray-600">Find products by name, brand, or category.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
          <p className="text-gray-600">Your data is protected with JWT authentication.</p>
        </div>
      </div>
    </div>
  );
}
