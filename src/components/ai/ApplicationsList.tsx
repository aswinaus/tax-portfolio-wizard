
import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from '@/lib/utils';

// Define application types
interface Application {
  id: string;
  productName: string;
  contactName: string;
  productOwner: string;
  requestStatus: 'Pending' | 'Approved' | 'Rejected';
  productStatus: 'Live' | 'In development' | 'Not live';
}

export const ApplicationsList = () => {
  const [applications, setApplications] = useState<Application[]>([
    { id: '1', productName: 'QTP', contactName: 'Column data', productOwner: 'Jeff Szpak', requestStatus: 'Pending', productStatus: 'Live' },
    { id: '2', productName: 'EYMP', contactName: 'Column data', productOwner: 'Nam Hua', requestStatus: 'Pending', productStatus: 'Live' },
    { id: '3', productName: 'Cassandra', contactName: 'Column data', productOwner: 'Tomas Vecchi', requestStatus: 'Pending', productStatus: 'Live' },
    { id: '4', productName: 'EYI', contactName: 'Column data', productOwner: 'Cordell Haneyh', requestStatus: 'Pending', productStatus: 'Live' },
    { id: '5', productName: 'Canvas', contactName: 'Column data', productOwner: 'Brad Pixley', requestStatus: 'Approved', productStatus: 'Live' },
    { id: '6', productName: 'Helix', contactName: 'Column data', productOwner: 'Vanessa Sanchez', requestStatus: 'Approved', productStatus: 'Live' },
    { id: '7', productName: 'Empowerment', contactName: 'Column data', productOwner: 'Randy Avery', requestStatus: 'Rejected', productStatus: 'In development' },
    { id: '8', productName: 'Unsubmitted', contactName: 'Column data', productOwner: 'Preston French', requestStatus: 'Approved', productStatus: 'Live' },
    { id: '9', productName: 'Unsubmitted', contactName: 'Column data', productOwner: 'Michal Mlodzwieniez', requestStatus: 'Approved', productStatus: 'Live' },
    { id: '10', productName: 'Unsubmitted', contactName: 'Column data', productOwner: 'Kendall Staholfer', requestStatus: 'Approved', productStatus: 'In development' },
    { id: '11', productName: 'Unsubmitted', contactName: 'Column data', productOwner: 'Emil Jacsinski', requestStatus: 'Pending', productStatus: 'Live' },
    { id: '12', productName: 'Unsubmitted', contactName: 'Column data', productOwner: 'Mariela Aria', requestStatus: 'Rejected', productStatus: 'Not live' },
    { id: '13', productName: 'Unsubmitted', contactName: 'Column data', productOwner: 'Steven Eubanks', requestStatus: 'Approved', productStatus: 'Live' },
  ]);

  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Application | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => app.id));
    }
  };

  // Handle individual checkbox
  const handleSelect = (id: string) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id));
    } else {
      setSelectedApplications([...selectedApplications, id]);
    }
  };

  // Handle sorting
  const handleSort = (column: keyof Application) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort applications
  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Render status badge
  const renderStatusBadge = (status: Application['requestStatus']) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-orange-400 hover:bg-orange-500">{status}</Badge>;
      case 'Approved':
        return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-600 hover:bg-red-700">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Render product status badge
  const renderProductStatusBadge = (status: Application['productStatus']) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>;
      case 'In development':
        return <Badge variant="outline">{status}</Badge>;
      case 'Not live':
        return <Badge className="bg-orange-400 hover:bg-orange-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] pr-0">
              <Checkbox 
                checked={selectedApplications.length === applications.length}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead 
              onClick={() => handleSort('productName')}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Product Name
                {sortColumn === 'productName' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('contactName')}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Contact Name
                {sortColumn === 'contactName' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('productOwner')}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Product Owner
                {sortColumn === 'productOwner' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('requestStatus')}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Request status
                {sortColumn === 'requestStatus' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => handleSort('productStatus')}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                Product status
                {sortColumn === 'productStatus' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.map((application) => (
            <TableRow 
              key={application.id}
              className={cn(
                "hover:bg-muted/50",
                selectedApplications.includes(application.id) && "bg-muted/30"
              )}
            >
              <TableCell className="pr-0">
                <Checkbox 
                  checked={selectedApplications.includes(application.id)}
                  onCheckedChange={() => handleSelect(application.id)}
                  aria-label={`Select ${application.productName}`}
                />
              </TableCell>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </TableCell>
              <TableCell className="font-medium">
                {application.productName === 'Unsubmitted' && application.id === '13' ? (
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
                    {application.productName}
                  </div>
                ) : (
                  application.productName
                )}
              </TableCell>
              <TableCell>{application.contactName}</TableCell>
              <TableCell>{application.productOwner}</TableCell>
              <TableCell>{renderStatusBadge(application.requestStatus)}</TableCell>
              <TableCell>{renderProductStatusBadge(application.productStatus)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
