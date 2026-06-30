import { Button } from '@/components/ui/button';

export default function index() {
  return (
    <div className="h-body flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="text-lg text-gray-600">The page you are looking for does not exist.</p>
      {/* Go Back Button */}
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );
}
