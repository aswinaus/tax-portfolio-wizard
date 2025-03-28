
import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

// Define product types
interface Product {
  id: string;
  productName: string;
  contactName: string;
  productOwner: string;
  requestStatus: string;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', productName: 'GTP', contactName: 'Sara Hamilton, Sachit kahra...', productOwner: 'Jack Harry', requestStatus: 'UAT' },
    { id: '2', productName: 'GTP Intract', contactName: 'Sara Hamilton, Sachit kahra...', productOwner: 'Grace', requestStatus: 'In Production' },
    { id: '3', productName: 'Airbus Space Systems', contactName: 'Sara Hamilton, Sachit kahra...', productOwner: 'Jack Harry', requestStatus: 'Dev' },
    { id: '4', productName: 'EYMP Integration', contactName: 'Sara Hamilton, Sachit kahra...', productOwner: 'Jack Harry', requestStatus: 'In Production' },
    { id: '5', productName: 'EYMP Integration', contactName: 'Sara Hamilton, Sachit kahra...', productOwner: 'Jack Harry', requestStatus: 'Dev' },
  ]);

  const [sortColumn, setSortColumn] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Render status colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Dev':
        return 'text-blue-600';
      case 'UAT':
        return 'text-orange-500';
      case 'In Production':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-slate-800">
          <TableRow>
            <TableHead 
              onClick={() => handleSort('productName')}
              className="cursor-pointer text-white font-medium"
            >
              <div className="flex items-center">
                Product Name
                {sortColumn === 'productName' && (
                  sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('contactName')}
              className="cursor-pointer text-white font-medium"
            >
              <div className="flex items-center">
                Contact Name
                {sortColumn === 'contactName' && (
                  sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('productOwner')}
              className="cursor-pointer text-white font-medium"
            >
              <div className="flex items-center">
                Product Owner
                {sortColumn === 'productOwner' && (
                  sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('requestStatus')}
              className="cursor-pointer text-white font-medium"
            >
              <div className="flex items-center">
                Request Status
                {sortColumn === 'requestStatus' && (
                  sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow 
              key={product.id}
              className="hover:bg-gray-50 border-t border-gray-200"
            >
              <TableCell className="font-medium">{product.productName}</TableCell>
              <TableCell>{product.contactName}</TableCell>
              <TableCell>{product.productOwner}</TableCell>
              <TableCell className={getStatusColor(product.requestStatus)}>{product.requestStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
