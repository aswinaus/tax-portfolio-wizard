
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BlogLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="overflow-hidden border-border/60">
          <div className="md:flex">
            <div className="md:w-1/3">
              <Skeleton className="h-48 md:h-full" />
            </div>
            <div className="md:w-2/3">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-5 w-16" />
                  ))}
                </div>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogLoadingSkeleton;
