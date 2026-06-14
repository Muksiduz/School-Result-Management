import { User, Lock } from "lucide-react";

function LoginForm() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Welcome Back</h2>

          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        {/* Username */}

        <div className="mb-5">
          <label className="block mb-2 font-medium">Username</label>

          <div className="relative">
            <User
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Enter username"
              className="
                w-full
                border
                rounded-xl
                py-3
                pl-11
                pr-4
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>
        </div>

        {/* Password */}

        <div className="mb-5">
          <label className="block mb-2 font-medium">Password</label>

          <div className="relative">
            <Lock
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="password"
              placeholder="Enter password"
              className="
                w-full
                border
                rounded-xl
                py-3
                pl-11
                pr-4
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>
        </div>

        {/* Remember Me */}

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            Remember Me
          </label>

          <button className="text-blue-600 text-sm">Forgot Password?</button>
        </div>

        {/* Login */}

        <button
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            hover:bg-blue-700
            transition
          ">
          Login
        </button>

        {/* Demo Accounts */}

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-500 mb-2">Demo Accounts</p>

          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">Admin / admin123</div>

            <div className="bg-gray-50 rounded-lg p-3">
              Operator / operator123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
