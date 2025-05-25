import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-poppins font-bold text-primary/20">404</h1>
      <h2 className="text-3xl font-poppins font-semibold text-gray-900 mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="btn btn-primary mt-8"
      >
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;
